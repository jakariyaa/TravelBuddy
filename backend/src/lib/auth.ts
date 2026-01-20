import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";
import { sendEmail } from "../utils/email.js";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "USER",
            }
        }
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        }
    },
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google", "github", "email-password"],
        }
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                try {
                    let subject = "Your Verification Code - Travner";
                    let htmlContent = `
                        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                            <h2 style="color: #0f766e;">Verify Your Email</h2>
                            <p>Thank you for signing up with Travner. Please use the following code to verify your email address:</p>
                            <div style="background-color: #f0fdfa; border: 1px solid #ccfbf1; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                                <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #0f766e;">${otp}</span>
                            </div>
                            <p>This code will expire shortly.</p>
                            <p>If you didn't request this code, you can safely ignore this email.</p>
                        </div>
                    `;

                    if (type === "forget-password") {
                        const user = await prisma.user.findUnique({
                            where: { email },
                        });

                        if (!user) {
                            return;
                        }

                        subject = "Reset Your Password - Travner";
                        htmlContent = `
                            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                                <h2 style="color: #0f766e;">Reset Your Password</h2>
                                <p>We received a request to reset your password. Use the code below to complete the process:</p>
                                <div style="background-color: #f0fdfa; border: 1px solid #ccfbf1; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                                    <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #0f766e;">${otp}</span>
                                </div>
                                <p>This code will expire shortly.</p>
                                <p>If you didn't request a password reset, your account is safe and you can ignore this email.</p>
                            </div>
                        `;
                    }

                    await sendEmail({
                        to: email,
                        subject,
                        text: `Your code is: ${otp}`,
                        html: htmlContent
                    });
                } catch (error) {
                    console.error("Failed to send OTP email:", error);
                }
            },
            sendVerificationOnSignUp: true,
        })
    ]
});
