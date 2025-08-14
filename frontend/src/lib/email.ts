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
  body,
  buttonText,
  buttonLink,
}: BrandedEmailProps): string => {
  const primaryColor = "#00fb7f";
  const primaryContentColor = "#161616";
  const bodyBg = "#1a1a1a";
  const containerBg = "#161616";
  const borderColor = "#262626";
  const textColor = "#e6e6e6";
  const mutedTextColor = "#808080";

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
                background-color: ${bodyBg}; 
                color: ${textColor}; 
                margin: 0; 
                padding: 20px; 
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background-color: ${containerBg}; 
                border: 1px solid ${borderColor}; 
                border-radius: 12px; 
                overflow: hidden; 
            }
            .header { 
                padding: 20px; 
                text-align: center; 
                border-bottom: 1px solid ${borderColor}; 
            }
            .header h1 { 
                margin: 0; 
                color: ${primaryColor}; 
                font-weight: bold; 
                font-size: 24px;
            }
            .content { 
                padding: 30px; 
            }
            .content p { 
                color: ${textColor}; 
                line-height: 1.6; 
                margin: 0 0 15px;
                font-size: 16px;
            }
            .button-container { 
                text-align: center; 
                margin: 30px 0; 
            }
            .button { 
                background-color: ${primaryColor}; 
                color: ${primaryContentColor}; 
                padding: 12px 25px; 
                text-decoration: none; 
                border-radius: 8px; 
                font-weight: bold; 
                display: inline-block;
            }
            .footer { 
                padding: 20px; 
                text-align: center; 
                font-size: 12px; 
                color: ${mutedTextColor}; 
                border-top: 1px solid ${borderColor}; 
            }
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
                <p style="font-size: 14px; color: ${mutedTextColor};">If you did not request this action, you can safely ignore this email.</p>
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
  secure: config.email.port === 465,
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
