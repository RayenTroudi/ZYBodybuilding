/**
 * Email HTML Templates
 * Beautiful branded email templates matching ZY Bodybuilding receipt design
 */

const BRAND_COLORS = {
  primary: '#CC1303',
  primaryDark: '#B80C02',
  accent: '#C30B02',
  black: '#000000',
  darkGray: '#1a1a1a',
  mediumGray: '#4a4a4a',
  lightGray: '#e5e5e5',
  veryLightGray: '#f5f5f5',
  white: '#ffffff',
  text: '#333333',
  textLight: '#666666',
};

/**
 * Base email template with header and footer - matching receipt design
 */
function getEmailTemplate(content) {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ZY Bodybuilding</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
      color: #333333;
    }
    .email-wrapper {
      background-color: #f5f5f5;
      padding: 40px 20px;
    }
    .email-container {
      max-width: 650px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.primaryDark} 100%);
      padding: 40px 30px;
      border-bottom: 3px solid ${BRAND_COLORS.primaryDark};
    }
    .logo-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
    }
    .logo-img {
      width: 60px;
      height: 60px;
      object-fit: contain;
      background-color: #ffffff;
      border-radius: 50%;
      padding: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    .logo-text {
      text-align: center;
    }
    .brand-name {
      font-size: 36px;
      font-weight: 900;
      letter-spacing: 1px;
      color: #ffffff;
      margin: 0;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }
    .brand-name-accent {
      color: #ffffff;
      font-weight: 900;
    }
    .tagline {
      font-size: 12px;
      color: rgba(255,255,255,0.95);
      margin: 8px 0 0 0;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .content {
      padding: 40px 30px;
      background-color: #ffffff;
    }
    .content h1 {
      color: ${BRAND_COLORS.primary};
      font-size: 28px;
      margin: 0 0 20px 0;
      font-weight: 700;
      border-bottom: 2px solid ${BRAND_COLORS.lightGray};
      padding-bottom: 15px;
    }
    .content h2 {
      color: ${BRAND_COLORS.text};
      font-size: 20px;
      margin: 25px 0 12px 0;
      font-weight: 600;
    }
    .content p {
      color: ${BRAND_COLORS.textLight};
      font-size: 15px;
      line-height: 1.7;
      margin: 0 0 12px 0;
    }
    .content ul {
      color: ${BRAND_COLORS.textLight};
      font-size: 15px;
      line-height: 1.8;
      padding-left: 25px;
      margin: 15px 0;
    }
    .content li {
      margin: 10px 0;
    }
    .content li strong {
      color: ${BRAND_COLORS.text};
    }
    .highlight-box {
      background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.primaryDark} 100%);
      border-radius: 10px;
      padding: 30px;
      margin: 25px 0;
      text-align: center;
      box-shadow: 0 4px 15px rgba(204, 19, 3, 0.2);
    }
    .highlight-box h2 {
      color: #ffffff;
      font-size: 42px;
      margin: 0 0 8px 0;
      font-weight: 900;
    }
    .highlight-box p {
      color: rgba(255,255,255,0.95);
      font-size: 16px;
      margin: 0;
      font-weight: 500;
    }
    .info-box {
      background-color: ${BRAND_COLORS.veryLightGray};
      border-left: 4px solid ${BRAND_COLORS.primary};
      border-radius: 8px;
      padding: 20px 25px;
      margin: 20px 0;
    }
    .info-box p {
      margin: 8px 0;
      color: ${BRAND_COLORS.text};
      font-size: 15px;
      line-height: 1.6;
    }
    .info-box strong {
      color: ${BRAND_COLORS.primary};
      font-weight: 600;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid ${BRAND_COLORS.lightGray};
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      color: ${BRAND_COLORS.textLight};
      font-weight: 500;
    }
    .info-value {
      color: ${BRAND_COLORS.text};
      font-weight: 600;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.primaryDark} 100%);
      color: #ffffff;
      text-decoration: none;
      padding: 14px 35px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 15px;
      margin: 20px 0;
      box-shadow: 0 4px 12px rgba(204, 19, 3, 0.3);
      transition: transform 0.2s;
    }
    .footer {
      background-color: ${BRAND_COLORS.darkGray};
      padding: 30px 30px 25px;
      border-top: 3px solid ${BRAND_COLORS.primary};
    }
    .footer-content {
      text-align: center;
    }
    .footer h3 {
      color: #ffffff;
      font-size: 18px;
      margin: 0 0 15px 0;
      font-weight: 700;
    }
    .contact-info {
      margin: 15px 0;
    }
    .contact-item {
      color: ${BRAND_COLORS.textLight};
      font-size: 13px;
      margin: 6px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .contact-item::before {
      content: '';
      width: 6px;
      height: 6px;
      background-color: ${BRAND_COLORS.primary};
      border-radius: 50%;
      display: inline-block;
    }
    .footer p {
      color: ${BRAND_COLORS.textLight};
      font-size: 12px;
      margin: 8px 0;
    }
    .footer a {
      color: ${BRAND_COLORS.primary};
      text-decoration: none;
    }
    .copyright {
      margin-top: 20px;
      padding-top: 15px;
      border-top: 1px solid ${BRAND_COLORS.mediumGray};
      color: ${BRAND_COLORS.textLight};
      font-size: 11px;
    }
    .greeting {
      color: ${BRAND_COLORS.text};
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 15px;
    }
    .signature {
      margin-top: 35px;
      padding-top: 20px;
      border-top: 1px solid ${BRAND_COLORS.lightGray};
    }
    .signature p {
      color: ${BRAND_COLORS.text};
      font-weight: 600;
      margin: 5px 0;
    }
    .signature .team {
      color: ${BRAND_COLORS.primary};
      font-weight: 700;
    }
    @media only screen and (max-width: 600px) {
      .email-wrapper {
        padding: 20px 10px;
      }
      .content {
        padding: 30px 20px;
      }
      .brand-name {
        font-size: 28px;
      }
      .content h1 {
        font-size: 24px;
      }
      .highlight-box h2 {
        font-size: 32px;
      }
      .info-row {
        flex-direction: column;
        gap: 5px;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <!-- Header with Logo - Matching Receipt Design -->
      <div class="header">
        <div class="logo-section">
          <img src="https://zybodybuilding.space/images/logoNobg.png" alt="ZY Bodybuilding Logo" class="logo-img">
        </div>
        <div class="logo-text">
          <h1 class="brand-name"><span class="brand-name-accent">ZY</span> BODYBUILDING</h1>
          <p class="tagline">Transform Your Body</p>
        </div>
      </div>

      <!-- Content -->
      <div class="content">
        ${content}
        
        <!-- Signature -->
        <div class="signature">
          <p>Cordialement,</p>
          <p class="team">L'équipe ZY Bodybuilding</p>
          <p style="font-size: 13px; color: ${BRAND_COLORS.textLight}; margin-top: 5px;">Votre Partenaire Fitness</p>
        </div>
      </div>

      <!-- Footer - Matching Receipt Design -->
      <div class="footer">
        <div class="footer-content">
          <h3>ZY BODYBUILDING</h3>
          <div class="contact-info">
            <div class="contact-item">Tunisia</div>
            <div class="contact-item">📞 +216 123 456 78</div>
            <div class="contact-item">📧 contact@zybodybuilding.space</div>
          </div>
          <div class="copyright">
            © ${new Date().getFullYear()} ZY Bodybuilding. Tous droits réservés.<br>
            <a href="https://zybodybuilding.space/contact" style="color: #CC1303; text-decoration: none; font-size: 11px;">Nous contacter</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Welcome Email Template
 */
export function getWelcomeEmailHtml(memberName) {
  const content = `
    <p class="greeting">Bonjour ${memberName || '{memberName}'},</p>
    
    <h1>Bienvenue chez ZY Bodybuilding! 💪</h1>
    
    <p>Nous sommes ravis de vous accueillir dans notre famille. Votre parcours vers un corps plus fort et plus sain commence maintenant!</p>
    
    <div class="info-box">
      <h2 style="margin-top: 0; font-size: 18px; color: ${BRAND_COLORS.primary};">Ce qui vous attend:</h2>
      <ul style="margin: 15px 0; padding-left: 20px;">
        <li><strong>Équipements de pointe</strong> - Machines et poids de qualité professionnelle</li>
        <li><strong>Entraîneurs experts</strong> - Accompagnement personnalisé pour vos objectifs</li>
        <li><strong>Cours variés</strong> - Planning flexible adapté à votre emploi du temps</li>
        <li><strong>Communauté motivante</strong> - Entourez-vous de passionnés de fitness</li>
      </ul>
    </div>

    <p>Nous avons hâte de vous voir et de vous accompagner dans votre transformation!</p>
    
    <p style="margin-top: 25px;"><strong>Prochaines étapes:</strong></p>
    <p>• Consultez notre planning de cours<br>
    • Rencontrez nos entraîneurs<br>
    • Commencez votre première séance</p>
  `;
  
  return getEmailTemplate(content);
}

/**
 * Class Reminder Email Template
 */
export function getClassReminderEmailHtml(className, date, time) {
  const content = `
    <h1>Rappel de Cours 📅</h1>
    <p>N'oubliez pas votre cours à venir!</p>

    <div class="info-box">
      <h2 style="margin: 0 0 20px 0; font-size: 22px; color: ${BRAND_COLORS.primary};">${className || '{className}'}</h2>
      <div class="info-row">
        <span class="info-label">📅 Date:</span>
        <span class="info-value">${date || '{date}'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">🕐 Heure:</span>
        <span class="info-value">${time || '{time}'}</span>
      </div>
    </div>

    <p>Nous avons hâte de vous voir! 💪</p>

    <div style="background-color: ${BRAND_COLORS.veryLightGray}; padding: 15px; border-radius: 8px; margin-top: 25px;">
      <p style="margin: 0; font-size: 14px; color: ${BRAND_COLORS.textLight};">
        💡 <strong>Conseil:</strong> Arrivez 10 minutes en avance pour vous échauffer et préparer votre équipement.
      </p>
    </div>
  `;
  
  return getEmailTemplate(content);
}

/**
 * Payment Reminder Email Template
 */
export function getPaymentReminderEmailHtml(memberName, amount, dueDate) {
  const content = `
    <p class="greeting">Bonjour ${memberName || '{memberName}'},</p>
    
    <h1>Rappel de Paiement 💳</h1>
    
    <p>Ceci est un rappel amical concernant votre paiement d'adhésion.</p>

    <div class="info-box">
      <div class="info-row">
        <span class="info-label">💰 Montant dû:</span>
        <span class="info-value">${amount || '{amount}'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">📅 Date d'échéance:</span>
        <span class="info-value">${dueDate || '{dueDate}'}</span>
      </div>
    </div>

    <p>Pour continuer à profiter de nos services sans interruption, veuillez effectuer votre paiement avant la date d'échéance.</p>

    <h2>Moyens de paiement acceptés:</h2>
    <p>• En salle (espèces ou carte bancaire)<br>
    • Virement bancaire<br>
    • Paiement mobile</p>

    <p style="margin-top: 25px;">Pour toute question concernant votre paiement, n'hésitez pas à nous contacter.</p>
  `;
  
  return getEmailTemplate(content);
}

/**
 * Membership Expiring Email Template
 */
export function getMembershipExpiringEmailHtml(memberName, daysRemaining) {
  const days = daysRemaining || '{daysRemaining}';
  const content = `
    <p class="greeting">Bonjour ${memberName || '{memberName}'},</p>
    
    <h1>Votre Adhésion Expire Bientôt ⏰</h1>

    <div class="highlight-box">
      <h2>${days}</h2>
      <p>Jour${days !== 1 && days !== '1' ? 's' : ''} restant${days !== 1 && days !== '1' ? 's' : ''}</p>
    </div>

    <p>Ne laissez pas votre parcours fitness s'arrêter! Renouvelez dès aujourd'hui pour continuer à profiter de tous nos services.</p>

    <div class="info-box">
      <h2 style="margin-top: 0; font-size: 18px; color: ${BRAND_COLORS.primary};">Ce que vous conservez en renouvelant:</h2>
      <ul style="margin: 15px 0; padding-left: 20px;">
        <li><strong>Accès illimité</strong> à toutes les installations</li>
        <li><strong>Tous les cours collectifs</strong> inclus</li>
        <li><strong>Coaching personnalisé</strong> sur demande</li>
        <li><strong>Événements exclusifs</strong> réservés aux membres</li>
      </ul>
    </div>

    <p style="margin-top: 25px;">Pour renouveler votre adhésion, passez nous voir à la salle ou contactez-nous directement.</p>
  `;
  
  return getEmailTemplate(content);
}

/**
 * Promotional Email Template
 */
export function getPromoEmailHtml(promoTitle, promoDescription, discount, validUntil) {
  const content = `
    <h1>🎉 ${promoTitle || '{promoTitle}'}</h1>
    <p style="font-size: 16px;">${promoDescription || '{promoDescription}'}</p>

    <div class="highlight-box">
      <h2>${discount || '{discount}'}% OFF</h2>
      <p style="font-size: 18px; font-weight: 600;">Offre à Durée Limitée</p>
    </div>

    <div class="info-box">
      <div class="info-row">
        <span class="info-label">⏰ Valable jusqu'au:</span>
        <span class="info-value">${validUntil || '{validUntil}'}</span>
      </div>
    </div>

    <p style="margin-top: 25px;">Ne manquez pas cette opportunité exceptionnelle! Cette offre est valable pour:</p>
    
    <p>• Nouvelles adhésions<br>
    • Renouvellements anticipés<br>
    • Abonnements longue durée</p>

    <p style="margin-top: 25px; font-weight: 600;">Visitez-nous dès aujourd'hui pour profiter de cette promotion!</p>
  `;
  
  return getEmailTemplate(content);
}

/**
 * Generic Email Template
 */
export function getGenericEmailHtml(subject, bodyHtml) {
  const content = `
    <h1>${subject}</h1>
    <div style="margin: 20px 0;">
      ${bodyHtml}
    </div>
  `;
  
  return getEmailTemplate(content);
}
