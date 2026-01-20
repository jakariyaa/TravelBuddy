import { type Request, type Response, type NextFunction } from 'express';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2025-12-15.clover', // Updated to match expected type
});

const PLANS = {
    monthly: {
        name: 'Travner Premium (Monthly)',
        amount: 999, // $9.99
    },
    yearly: {
        name: 'Travner Premium (Yearly)',
        amount: 9900, // $99.00
    }
};

export const createCheckoutSession = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const { plan } = req.body; // 'monthly' or 'yearly'

    if (!userId) {
        return next(new AppError('Unauthorized', 401));
    }

    if (!plan || !PLANS[plan as keyof typeof PLANS]) {
        return next(new AppError('Invalid plan selected', 400));
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    let customerId = user.stripeCustomerId;

    if (!customerId) {
        const customerParams: Stripe.CustomerCreateParams = {
            metadata: {
                userId: user.id
            }
        };
        if (user.email) customerParams.email = user.email;
        if (user.name) customerParams.name = user.name;

        const customer = await stripe.customers.create(customerParams);
        customerId = customer.id;
        await prisma.user.update({
            where: { id: userId },
            data: { stripeCustomerId: customerId }
        });
    }

    const selectedPlan = PLANS[plan as keyof typeof PLANS];

    const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: selectedPlan.name,
                        description: 'Unlock Verified Badge and Premium Features',
                    },
                    unit_amount: selectedPlan.amount,
                    recurring: {
                        interval: plan === 'monthly' ? 'month' : 'year',
                    },
                },
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/cancelled`,
        metadata: {
            userId: userId,
            planType: plan
        }
    });

    res.json({ url: session.url });
});

export const verifyCheckoutSession = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const { sessionId } = req.body;

    if (!sessionId) {
        return next(new AppError('Session ID required', 400));
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
        const metadataUserId = session.metadata?.userId;

        // SECURITY CHECK: Verify the session belongs to the requesting user
        // This prevents "Session Replay" attacks where a user verifies using someone else's session
        if (metadataUserId && metadataUserId === userId) {

            // IDEMPOTENCY CHECK: Check if already processed to avoid unnecessary DB writes
            // This handles race conditions between the Webhook and this Client-side verification
            const currentUser = await prisma.user.findUnique({
                where: { id: userId },
                select: { isVerified: true, subscriptionStatus: true }
            });

            if (currentUser?.isVerified && currentUser?.subscriptionStatus === 'ACTIVE') {
                return res.json({ status: 'success', verified: true, message: 'Already verified' });
            }

            await prisma.user.update({
                where: { id: userId },
                data: {
                    subscriptionStatus: 'ACTIVE',
                    isVerified: true
                }
            });
            res.json({ status: 'success', verified: true });
        } else {
            return next(new AppError('Unauthorized session. Session does not belong to user.', 403));
        }
    } else {
        res.json({ status: 'pending', verified: false });
    }
});

export const handleWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
        if (!endpointSecret || !sig) {
            event = req.body;
        } else {
            const rawBody = req.rawBody;
            if (!rawBody) {
                res.status(400).send("Webhook Error: No raw body");
                return;
            }
            event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
        }
    } catch (err: any) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.metadata?.userId;

                if (userId) {
                    await prisma.user.update({
                        where: { id: userId },
                        data: {
                            subscriptionStatus: 'ACTIVE',
                            isVerified: true
                        }
                    });
                }

                break;

            case 'customer.subscription.updated':
            case 'customer.subscription.deleted':
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;
                const status = subscription.status; // active, past_due, canceled, etc.

                let dbStatus: 'ACTIVE' | 'INACTIVE' | 'PAST_DUE' | 'CANCELED' = 'INACTIVE';

                if (status === 'active' || status === 'trialing') dbStatus = 'ACTIVE';
                else if (status === 'past_due') dbStatus = 'PAST_DUE';
                else if (status === 'canceled' || status === 'unpaid') dbStatus = 'CANCELED';

                await prisma.user.updateMany({
                    where: { stripeCustomerId: customerId },
                    data: {
                        subscriptionStatus: dbStatus,
                        isVerified: dbStatus === 'ACTIVE'
                    }
                });
                break;

            default:
        }

        res.json({ received: true });
    } catch (err) {
        res.status(500).json({ message: "Webhook processing failed" });
    }
};
