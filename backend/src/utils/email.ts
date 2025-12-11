import nodemailer from 'nodemailer';

const smtpPort = parseInt(process.env.SMTP_PORT || '587');
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: smtpPort,
    secure: smtpPort === 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    // Useful for development with self-signed certs, though use with caution in prod
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: process.env.NODE_ENV === 'production'
    }
});

export const sendEmail = async ({ to, subject, text, html }: { to: string; subject: string; text: string; html?: string }) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Travel Buddy" <no-reply@example.com>',
            to,
            subject,
            text,
            html,
        });
        console.log(`Email sent: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
