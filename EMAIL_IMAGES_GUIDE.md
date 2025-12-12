# Adding Images to Emails - Guide

## ✅ Method 1: Use Hosted Images (Recommended)

Images must be hosted online (not attached). Use images from your website:

### **Available Images on Your Site:**
- `https://zybodybuilding.space/images/logoNobg.png` - Logo (transparent)
- `https://zybodybuilding.space/images/logo.PNG` - Logo
- `https://zybodybuilding.space/images/fitness1.jpg` - Gym photo 1
- `https://zybodybuilding.space/images/fitness2.jpg` - Gym photo 2
- `https://zybodybuilding.space/images/fitness3.jpg` - Gym photo 3
- `https://zybodybuilding.space/images/fitness4.jpg` - Gym photo 4

### **Example: Add Image in Email Template**

Edit `src/lib/resend/templates.js`:

```javascript
export function getPaymentReminderEmailHtml(memberName, amount, dueDate) {
  const content = `
    <p class="greeting">Bonjour ${memberName || '{memberName}'},</p>
    
    <h1>Rappel de Paiement 💳</h1>
    
    <!-- Add your image here -->
    <div style="text-align: center; margin: 20px 0;">
      <img src="https://zybodybuilding.space/images/fitness1.jpg" 
           alt="ZY Bodybuilding" 
           style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    </div>
    
    <p>Ceci est un rappel amical...</p>
    
    <!-- Rest of content -->
  `;
}
```

---

## 📋 Method 2: Add Image from Admin Panel

When composing an email in `/admin/email`, use HTML:

```html
Bonjour {memberName},

Voici notre nouvelle salle:

<div style="text-align: center; margin: 20px 0;">
  <img src="https://zybodybuilding.space/images/fitness1.jpg" 
       alt="Notre salle" 
       style="max-width: 100%; height: auto; border-radius: 12px;">
</div>

Venez nous rendre visite!
```

---

## 🎨 Image Styling Best Practices

### **Responsive Image (Always Use This):**
```html
<img src="YOUR_IMAGE_URL" 
     alt="Description" 
     style="max-width: 100%; height: auto; display: block;">
```

### **Centered Image with Shadow:**
```html
<div style="text-align: center; margin: 25px 0;">
  <img src="YOUR_IMAGE_URL" 
       alt="Description" 
       style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
</div>
```

### **Two Images Side by Side:**
```html
<div style="display: flex; gap: 10px; margin: 20px 0;">
  <img src="IMAGE_1_URL" alt="Image 1" style="width: 48%; height: auto; border-radius: 8px;">
  <img src="IMAGE_2_URL" alt="Image 2" style="width: 48%; height: auto; border-radius: 8px;">
</div>
```

### **Image with Caption:**
```html
<div style="text-align: center; margin: 25px 0;">
  <img src="YOUR_IMAGE_URL" 
       alt="Description" 
       style="max-width: 100%; height: auto; border-radius: 12px;">
  <p style="font-size: 13px; color: #666; margin-top: 10px; font-style: italic;">
    Notre salle de sport équipée
  </p>
</div>
```

---

## ⚠️ Important Rules

### **1. Always Use Hosted URLs**
❌ **DON'T:** Attach image files directly
```javascript
// This won't work
attachments: [{ filename: 'gym.jpg', content: buffer }]
```

✅ **DO:** Use hosted image URLs
```html
<img src="https://zybodybuilding.space/images/fitness1.jpg">
```

### **2. Always Set max-width: 100%**
Prevents images from breaking email layout on mobile:
```css
style="max-width: 100%; height: auto;"
```

### **3. Always Add alt Text**
Required for accessibility and spam filters:
```html
<img src="..." alt="ZY Bodybuilding Gym">
```

### **4. Use Proper Image Sizes**
- **Email width:** 600-650px max
- **Recommended:** Optimize images to ~800px width max
- **File size:** Keep under 200KB per image

### **5. Avoid Too Many Images**
- ❌ All images (spam risk)
- ✅ 1-2 images per email (good balance)
- ✅ More text than images (better deliverability)

---

## 🖼️ Adding New Images

### **Step 1: Add Image to Your Website**
1. Upload image to `public/images/` folder
2. Name it descriptively (e.g., `new-equipment.jpg`)

### **Step 2: Use in Email**
```html
<img src="https://zybodybuilding.space/images/new-equipment.jpg" 
     alt="New Equipment" 
     style="max-width: 100%; height: auto; border-radius: 12px;">
```

---

## 📧 Example: Complete Email with Image

```javascript
export function getPromoEmailHtml(promoTitle, promoDescription, discount, validUntil) {
  const content = `
    <h1>🎉 ${promoTitle || '{promoTitle}'}</h1>
    
    <!-- Promo Image -->
    <div style="text-align: center; margin: 25px 0;">
      <img src="https://zybodybuilding.space/images/fitness2.jpg" 
           alt="Promotion ZY Bodybuilding" 
           style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    </div>
    
    <p style="font-size: 16px;">${promoDescription || '{promoDescription}'}</p>

    <div class="highlight-box">
      <h2>${discount || '{discount}'}% OFF</h2>
      <p style="font-size: 18px; font-weight: 600;">Offre à Durée Limitée</p>
    </div>

    <!-- Rest of content -->
  `;
  
  return getEmailTemplate(content);
}
```

---

## 🎯 Which Template to Edit?

| Email Type | File Location | Function Name |
|------------|--------------|---------------|
| Welcome | `src/lib/resend/templates.js` | `getWelcomeEmailHtml()` |
| Class Reminder | `src/lib/resend/templates.js` | `getClassReminderEmailHtml()` |
| Payment Reminder | `src/lib/resend/templates.js` | `getPaymentReminderEmailHtml()` |
| Membership Expiring | `src/lib/resend/templates.js` | `getMembershipExpiringEmailHtml()` |
| Promotional | `src/lib/resend/templates.js` | `getPromoEmailHtml()` |
| Custom | Admin Panel | Type HTML directly |

---

## ✅ After Adding Images

1. **Test the email:**
   - Send from `/admin/email` to your own email
   - Check it looks good on desktop and mobile

2. **Check spam score:**
   - Send to mail-tester.com
   - Make sure images don't increase spam score
   - Keep image-to-text ratio balanced

3. **Deploy changes:**
   ```bash
   git add .
   git commit -m "Add images to email templates"
   git push origin main
   ```

---

## 🆘 Troubleshooting

### **Image Not Showing:**
- ✅ Check URL is accessible: Open in browser
- ✅ Make sure image is in `public/images/` folder
- ✅ Deploy to Vercel if image is new
- ✅ Check for typos in URL

### **Image Too Large:**
- Optimize image before uploading
- Use online tools: tinypng.com, squoosh.app
- Target: Under 200KB per image

### **Email Going to Spam:**
- Too many images can trigger spam filters
- Keep 60%+ text content
- Don't make email all images
