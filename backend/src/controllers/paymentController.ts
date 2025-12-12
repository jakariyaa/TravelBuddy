import { type Request, type Response, type NextFunction } from 'express';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    // @ts-ignore
    apiVersion: '2025-11-17.clover',
});

const PLANS = {
    monthly: {
        name: 'Travel Buddy Premium (Monthly)',
        amount: 999, // $9.99
    },
    yearly: {
        name: 'Travel Buddy Premium (Yearly)',
        amount: 9900, // $99.00
    }
};

export const createCheckoutSession = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
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

export const handleWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
        if (!endpointSecret || !sig) {
            event = req.body;
        } else {
            // @ts-ignore
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
