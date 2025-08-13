import "server-only";
import nodemailer from "nodemailer";
import config from "@/config/config";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

interface BrandedEmailProps {
  name: string;
  title: string;
  body: string;
  buttonText: string;
  buttonLink: string;
}

export const createBrandedEmail = ({
  name,
  title,
  body,
  buttonText,
  buttonLink,
}: BrandedEmailProps): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; color: #111827; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
            .header { padding: 20px; text-align: center; border-bottom: 1px solid #e5e7eb; background-color: #f3f4f6; }
            .header h1 { margin: 0; color: #0070f3; font-weight: bold; } /* Using a generic blue */
            .content { padding: 30px; }
            .content p { line-height: 1.6; margin: 0 0 15px; }
            .button-container { text-align: center; margin: 30px 0; }
            .button { background-color: #0070f3; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header"><h1>SkillSync</h1></div>
            <div class="content">
                <p>Hi ${name},</p>
                <p>${body}</p>
                <div class="button-container">
                    <a href="${buttonLink}" target="_blank" class="button">${buttonText}</a>
                </div>
                <p>If you did not request this, please ignore this email.</p>
            </div>
            <div class="footer">
                © ${new Date().getFullYear()} SkillSync. All rights reserved.
            </div>
        </div>
    </body>
    </html>
  `;
};

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465, // true for 465, false for other ports
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export const sendEmail = async (options: EmailOptions) => {
  const mailOptions = {
    from: config.email.from,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Could not send the email.");
  }
};
