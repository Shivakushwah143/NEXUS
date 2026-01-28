
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendOTPEmail = async (email: string, otp: string) => {
  // HTML Template with improved compatibility
  const emailHtml = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Verification Code</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <!--[if mso]>
    <style type="text/css">
      .otp-box { font-family: Arial, sans-serif !important; }
    </style>
    <![endif]-->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f5f5f5">
      <tr>
        <td align="center" style="padding: 40px 15px;">
          <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="border-radius: 8px; overflow: hidden;">
            <!-- Header -->
            <tr>
              <td style="padding: 25px; background: #4f46e5; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Your Verification Code</h1>
              </td>
            </tr>
            
            <!-- Content -->
            <tr>
              <td style="padding: 30px 25px; text-align: center;">
                <p style="font-size: 16px; color: #4b5563; margin: 0 0 20px 0;">
                  Use this code to complete your registration:
                </p>
                
                <!-- OTP Box -->
                <div style="background: #f3f4f6; border-radius: 6px; padding: 15px 20px; display: inline-block;">
                  <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4f46e5;" class="otp-box">${otp}</span>
                </div>
                
                <p style="font-size: 14px; color: #6b7280; margin: 25px 0 0 0;">
                  This code expires in 5 minutes
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  const mailOptions = {
    from: `"Elegant Era" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: ' Your Verification Code',
    text: `Your verification code is: ${otp}\nThis code expires in 5 minutes.`,
    html: emailHtml,
    alternatives: [
      {
        contentType: 'text/html',
        content: emailHtml
      }
    ]
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
};