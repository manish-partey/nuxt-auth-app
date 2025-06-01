import nodemailer from 'nodemailer';
import { useRuntimeConfig } from '#imports';

// Create a transporter using environment variables
const createTransporter = () => {
    const config = useRuntimeConfig();
    if (!config.emailHost || !config.emailUser || !config.emailPass) {
        console.error('Email service not fully configured in .env. Cannot send emails.');
        return null;
    }

    return nodemailer.createTransport({
        host: config.emailHost,
        port: config.emailPort,
        secure: config.emailPort === 465, // Use SSL if port is 465
        auth: {
            user: config.emailUser,
            pass: config.emailPass,
        },
        tls: {
            rejectUnauthorized: false // For self-signed certs or local dev, remove in production
        }
    });
};

export async function sendEmail(to: string, subject: string, html: string) {
    const transporter = createTransporter();
    if (!transporter) {
        throw new Error('Email transporter not initialized.');
    }

    try {
        await transporter.sendMail({
            from: `"Nuxt Auth App" <${useRuntimeConfig().emailUser}>`,
            to,
            subject,
            html,
        });
        console.log(`Email sent to ${to} with subject: ${subject}`);
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        throw error;
    }
}
