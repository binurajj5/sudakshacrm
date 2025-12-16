import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // For now, create a test account using ethereal email (development)
    // In production, you would use real SMTP credentials
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    try {
      // Check if real SMTP credentials are provided
      const smtpHost = this.configService.get('SMTP_HOST');
      const smtpUser = this.configService.get('SMTP_USER');
      
      if (smtpHost && smtpUser) {
        // Use real SMTP
        this.transporter = nodemailer.createTransporter({
          host: smtpHost,
          port: this.configService.get('SMTP_PORT', 587),
          secure: this.configService.get('SMTP_SECURE', false),
          auth: {
            user: smtpUser,
            pass: this.configService.get('SMTP_PASS'),
          },
        });
      } else {
        // Use ethereal email for testing
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransporter({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        console.log('📧 Email service using Ethereal test account');
      }
    } catch (error) {
      console.error('Failed to initialize email transporter:', error);
    }
  }

  async sendWelcomeEmail(
    email: string,
    firstName: string,
    password: string,
  ): Promise<{ success: boolean; previewUrl?: string }> {
    try {
      const info = await this.transporter.sendMail({
        from: '"Sudaksha CRM" <noreply@sudaksha.com>',
        to: email,
        subject: 'Welcome to Sudaksha CRM - Your Account Credentials',
        html: this.getWelcomeEmailTemplate(firstName, email, password),
      });

      const previewUrl = nodemailer.getTestMessageUrl(info);
      
      if (previewUrl) {
        console.log('📧 Preview email:', previewUrl);
      }

      return {
        success: true,
        previewUrl: previewUrl || undefined,
      };
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return { success: false };
    }
  }

  private getWelcomeEmailTemplate(
    firstName: string,
    email: string,
    password: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #4F46E5;
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .credentials {
              background-color: #f3f4f6;
              padding: 20px;
              border-left: 4px solid #4F46E5;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #4F46E5;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Sudaksha CRM</h1>
            </div>
            <div class="content">
              <p>Dear ${firstName},</p>
              
              <p>Your account has been created successfully. You now have access to the Sudaksha CRM system.</p>
              
              <div class="credentials">
                <h3>Your Login Credentials:</h3>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Temporary Password:</strong> ${password}</p>
              </div>
              
              <p><strong>Important:</strong> For security reasons, please change your password after your first login.</p>
              
              <a href="${this.configService.get('FRONTEND_URL', 'http://localhost:3001')}/auth/login" class="button">
                Login to CRM
              </a>
              
              <p style="margin-top: 30px;">If you have any questions or need assistance, please contact your system administrator.</p>
              
              <p>Best regards,<br>Sudaksha CRM Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
              <p>&copy; ${new Date().getFullYear()} Sudaksha CRM. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  async sendPasswordResetEmail(
    email: string,
    firstName: string,
    resetToken: string,
  ): Promise<{ success: boolean; previewUrl?: string }> {
    try {
      const resetUrl = `${this.configService.get('FRONTEND_URL', 'http://localhost:3001')}/auth/reset-password?token=${resetToken}`;
      
      const info = await this.transporter.sendMail({
        from: '"Sudaksha CRM" <noreply@sudaksha.com>',
        to: email,
        subject: 'Password Reset Request - Sudaksha CRM',
        html: `
          <!DOCTYPE html>
          <html>
            <body style="font-family: Arial, sans-serif;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2>Password Reset Request</h2>
                <p>Dear ${firstName},</p>
                <p>We received a request to reset your password. Click the button below to reset it:</p>
                <a href="${resetUrl}" style="display: inline-block; padding: 12px 30px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">
                  Reset Password
                </a>
                <p style="margin-top: 20px;">If you didn't request this, please ignore this email.</p>
                <p>This link will expire in 1 hour.</p>
              </div>
            </body>
          </html>
        `,
      });

      const previewUrl = nodemailer.getTestMessageUrl(info);
      return {
        success: true,
        previewUrl: previewUrl || undefined,
      };
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return { success: false };
    }
  }
}
