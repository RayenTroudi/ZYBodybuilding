/**
 * Email HTML Templates
 * Beautiful branded email templates matching ZY Bodybuilding website
 */

const BRAND_COLORS = {
  primary: '#CC1303',
  primaryDark: '#B80C02',
  accent: '#C30B02',
  black: '#000000',
  gray: '#1a1a1a',
  lightGray: '#2a2a2a',
  textGray: '#9ca3af',
  white: '#ffffff',
};

/**
 * Base email template with header and footer
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
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #000000;
      color: #ffffff;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #000000;
    }
    .header {
      background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.primaryDark} 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .logo {
      font-size: 48px;
      font-weight: 900;
      letter-spacing: 2px;
      margin: 0;
      color: #ffffff;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    .logo-accent {
      color: #ffffff;
      font-weight: 900;
    }
    .tagline {
      font-size: 14px;
      color: rgba(255,255,255,0.9);
      margin: 10px 0 0 0;
      letter-spacing: 3px;
      text-transform: uppercase;
    }
    .content {
      background-color: ${BRAND_COLORS.gray};
      padding: 40px 30px;
    }
    .content h1 {
      color: ${BRAND_COLORS.primary};
      font-size: 32px;
      margin: 0 0 20px 0;
      font-weight: 700;
    }
    .content h2 {
      color: #ffffff;
      font-size: 24px;
      margin: 30px 0 15px 0;
      font-weight: 600;
    }
    .content p {
      color: ${BRAND_COLORS.textGray};
      font-size: 16px;
      line-height: 1.6;
      margin: 0 0 15px 0;
    }
    .content ul {
      color: ${BRAND_COLORS.textGray};
      font-size: 16px;
      line-height: 1.8;
      padding-left: 20px;
      margin: 15px 0;
    }
    .content li {
      margin: 8px 0;
    }
    .highlight-box {
      background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.accent} 100%);
      border-radius: 12px;
      padding: 30px;
      margin: 30px 0;
      text-align: center;
      box-shadow: 0 4px 20px rgba(204, 19, 3, 0.3);
    }
    .highlight-box h2 {
      color: #ffffff;
      font-size: 48px;
      margin: 0 0 10px 0;
      font-weight: 900;
    }
    .highlight-box p {
      color: rgba(255,255,255,0.95);
      font-size: 18px;
      margin: 0;
    }
    .info-box {
      background-color: ${BRAND_COLORS.lightGray};
      border-left: 4px solid ${BRAND_COLORS.primary};
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .info-box p {
      margin: 5px 0;
      color: #ffffff;
    }
    .info-box strong {
      color: ${BRAND_COLORS.primary};
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.accent} 100%);
      color: #ffffff;
      text-decoration: none;
      padding: 16px 40px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      box-shadow: 0 4px 15px rgba(204, 19, 3, 0.4);
      transition: transform 0.2s;
    }
    .footer {
      background-color: #000000;
      padding: 30px 20px;
      text-align: center;
      border-top: 1px solid ${BRAND_COLORS.lightGray};
    }
    .footer p {
      color: ${BRAND_COLORS.textGray};
      font-size: 14px;
      margin: 5px 0;
    }
    .footer a {
      color: ${BRAND_COLORS.primary};
      text-decoration: none;
    }
    .social-links {
      margin: 20px 0;
    }
    .social-links a {
      display: inline-block;
      margin: 0 10px;
      color: ${BRAND_COLORS.textGray};
      text-decoration: none;
      font-size: 24px;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 30px 20px;
      }
      .logo {
        font-size: 36px;
      }
      .content h1 {
        font-size: 28px;
      }
      .highlight-box h2 {
        font-size: 36px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header with Logo -->
    <div class="header">
      <h1 class="logo"><span class="logo-accent">ZY</span> BODYBUILDING</h1>
      <p class="tagline">Transform Your Body</p>
    </div>

    <!-- Content -->
    <div class="content">
      ${content}
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong style="color: #ffffff;">ZY Bodybuilding</strong></p>
      <p>Tunisia</p>
      <p>📞 +216 123 456 78 | 📧 contact@zybodybuilding.tn</p>
      <p style="margin-top: 20px; font-size: 12px;">
        © ${new Date().getFullYear()} ZY Bodybuilding. Tous droits réservés.
      </p>
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
    <h1>Bienvenue ${memberName}! 💪</h1>
    <p>Nous sommes ravis de vous accueillir dans la famille <strong style="color: ${BRAND_COLORS.primary};">ZY Bodybuilding</strong>!</p>
    
    <p>Votre parcours vers un corps plus fort et plus sain commence maintenant. Voici ce qui vous attend:</p>
    
    <ul>
      <li><strong>Équipements de pointe</strong> - Machines et poids de qualité professionnelle</li>
      <li><strong>Entraîneurs experts</strong> - Accompagnement personnalisé pour atteindre vos objectifs</li>
      <li><strong>Cours variés</strong> - Planning flexible adapté à votre emploi du temps</li>
      <li><strong>Communauté motivante</strong> - Entourez-vous de passionnés de fitness</li>
    </ul>

    <p style="margin-top: 30px;">Prêt à commencer? Consultez notre planning de cours et réservez votre première séance!</p>

    <p style="margin-top: 40px; color: #ffffff;"><strong>L'équipe ZY Bodybuilding</strong><br>
    <span style="color: ${BRAND_COLORS.primary};">Votre Partenaire Fitness</span></p>
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
      <h2 style="margin: 0 0 15px 0; font-size: 24px;">${className}</h2>
      <p><strong>📅 Date:</strong> ${date}</p>
      <p><strong>🕐 Heure:</strong> ${time}</p>
    </div>

    <p>Nous avons hâte de vous voir! 💪</p>

    <p style="margin-top: 30px; font-size: 14px; color: ${BRAND_COLORS.textGray};">
      <em>Conseil: Arrivez 10 minutes en avance pour vous échauffer</em>
    </p>

    <p style="margin-top: 30px; color: #ffffff;"><strong>L'équipe ZY Bodybuilding</strong></p>
  `;
  
  return getEmailTemplate(content);
}

/**
 * Payment Reminder Email Template
 */
export function getPaymentReminderEmailHtml(memberName, amount, dueDate) {
  const content = `
    <h1>Rappel de Paiement 💳</h1>
    <p>Bonjour ${memberName},</p>
    
    <p>Ceci est un rappel amical concernant votre paiement d'adhésion.</p>

    <div class="info-box">
      <p><strong>💰 Montant dû:</strong> ${amount}</p>
      <p><strong>📅 Date d'échéance:</strong> ${dueDate}</p>
    </div>

    <p>Veuillez renouveler votre adhésion pour continuer à profiter de nos services sans interruption.</p>

    <p>Visitez notre salle ou contactez-nous si vous avez des questions.</p>

    <p style="margin-top: 30px; color: #ffffff;"><strong>L'équipe ZY Bodybuilding</strong></p>
  `;
  
  return getEmailTemplate(content);
}

/**
 * Membership Expiring Email Template
 */
export function getMembershipExpiringEmailHtml(memberName, daysRemaining) {
  const content = `
    <h1>Votre Adhésion Expire Bientôt ⏰</h1>
    <p>Bonjour ${memberName},</p>

    <div class="highlight-box">
      <h2>${daysRemaining}</h2>
      <p>Jour${daysRemaining !== 1 ? 's' : ''} restant${daysRemaining !== 1 ? 's' : ''}</p>
    </div>

    <p>Ne laissez pas votre parcours fitness s'arrêter! Renouvelez dès aujourd'hui pour continuer à accéder à:</p>

    <ul>
      <li><strong>Toutes les installations de la salle</strong></li>
      <li><strong>Cours collectifs</strong></li>
      <li><strong>Séances de coaching personnalisé</strong></li>
      <li><strong>Événements exclusifs membres</strong></li>
    </ul>

    <p style="margin-top: 30px;">Visitez-nous ou contactez notre équipe pour renouveler votre adhésion.</p>

    <p style="margin-top: 30px; color: #ffffff;"><strong>L'équipe ZY Bodybuilding</strong></p>
  `;
  
  return getEmailTemplate(content);
}

/**
 * Promotional Email Template
 */
export function getPromoEmailHtml(promoTitle, promoDescription, discount, validUntil) {
  const content = `
    <h1>🎉 ${promoTitle}</h1>
    <p>${promoDescription}</p>

    <div class="highlight-box">
      <h2>${discount}% OFF</h2>
      <p style="font-size: 20px; font-weight: 600;">Offre à Durée Limitée</p>
    </div>

    <div class="info-box">
      <p><strong>⏰ Valable jusqu'au:</strong> ${validUntil}</p>
    </div>

    <p style="font-size: 18px; margin-top: 30px;">Ne manquez pas cette opportunité exceptionnelle! Visitez-nous dès aujourd'hui pour profiter de cette offre spéciale.</p>

    <p style="margin-top: 40px; color: #ffffff;"><strong>L'équipe ZY Bodybuilding</strong></p>
  `;
  
  return getEmailTemplate(content);
}

/**
 * Generic Email Template
 */
export function getGenericEmailHtml(subject, bodyHtml) {
  const content = `
    <h1>${subject}</h1>
    ${bodyHtml}
    <p style="margin-top: 40px; color: #ffffff;"><strong>L'équipe ZY Bodybuilding</strong></p>
  `;
  
  return getEmailTemplate(content);
}
