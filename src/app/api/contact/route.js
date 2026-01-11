import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/resend/email';
import { EMAIL_TYPES } from '@/lib/resend/config';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nom, email et message sont requis' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Create email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
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
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .field {
              margin-bottom: 20px;
            }
            .label {
              font-weight: bold;
              color: #667eea;
              margin-bottom: 5px;
            }
            .value {
              padding: 10px;
              background-color: #f5f5f5;
              border-left: 3px solid #667eea;
              margin-top: 5px;
            }
            .message-box {
              background-color: #f5f5f5;
              padding: 15px;
              border-left: 3px solid #667eea;
              margin-top: 10px;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">📧 Nouveau Message de Contact</h1>
              <p style="margin: 10px 0 0 0;">ZY Bodybuilding Studio</p>
            </div>
            <div class="content">
              <p style="font-size: 16px; color: #666;">Vous avez reçu un nouveau message via le formulaire de contact de votre site web.</p>
              
              <div class="field">
                <div class="label">👤 Nom:</div>
                <div class="value">${name}</div>
              </div>
              
              <div class="field">
                <div class="label">📧 Email:</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              
              ${phone ? `
              <div class="field">
                <div class="label">📱 Téléphone:</div>
                <div class="value"><a href="tel:${phone}">${phone}</a></div>
              </div>
              ` : ''}
              
              <div class="field">
                <div class="label">💬 Message:</div>
                <div class="message-box">${message}</div>
              </div>
              
              <div class="footer">
                <p>Ce message a été envoyé depuis le formulaire de contact de ZY Bodybuilding.</p>
                <p>Date: ${new Date().toLocaleString('fr-FR', { 
                  timeZone: 'Africa/Tunis',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const plainText = `
Nouveau Message de Contact - ZY Bodybuilding Studio

Nom: ${name}
Email: ${email}
${phone ? `Téléphone: ${phone}` : ''}

Message:
${message}

---
Date: ${new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Tunis' })}
    `.trim();

    // Send email to gym
    await sendEmail({
      to: 'zybodybuildingstudio@gmail.com',
      subject: `📧 Nouveau message de ${name}`,
      html: htmlContent,
      text: plainText,
      type: EMAIL_TYPES.notification,
      metadata: {
        source: 'contact_form',
        senderEmail: email,
        senderName: name,
      },
    });

    return NextResponse.json(
      { 
        success: true,
        message: 'Message envoyé avec succès! Nous vous répondrons bientôt.' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    
    return NextResponse.json(
      { 
        error: 'Une erreur s\'est produite lors de l\'envoi du message. Veuillez réessayer.' 
      },
      { status: 500 }
    );
  }
}
