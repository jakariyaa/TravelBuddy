import nodemailer from 'nodemailer';

const smtpPort = parseInt(process.env.SMTP_PORT || '587');
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: process.env.NODE_ENV === 'production'
    }
});

export const sendEmail = async ({ to, subject, text, html }: { to: string; subject: string; text: string; html?: string }) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Travner" <no-reply@example.com>',
            to,
            subject,
            text,
            html,
        });
        return info;
    } catch (error) {
        throw error;
    }
};
