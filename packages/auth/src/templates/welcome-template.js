"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.welcomeTemplate = void 0;
const base_template_1 = require("./base-template");
const welcomeTemplate = (name, shopUrl) => {
    const content = `
    <h2 style="font-size: 24px; color: #1A1A2E; margin-bottom: 24px;">Welcome to the family, ${name}!</h2>
    <p style="color: #64748B; margin-bottom: 16px;">We're thrilled to have you join <span class="brand-accent">Ekenesports</span>. Your journey to peak performance starts here.</p>
    <p style="color: #64748B; margin-bottom: 24px;">Discover our curated collection of elite sports gear designed to help you push your limits.</p>
    
    <div style="text-align: center;">
      <a href="${shopUrl}" class="button">Explore Collection</a>
    </div>
    
    <hr class="divider">
    <p style="color: #64748B; font-size: 14px;">Need help? Just reply to this email our support team is always here to assist you.</p>
  `;
    return (0, base_template_1.baseTemplate)(content, 'Welcome to Ekenesports');
};
exports.welcomeTemplate = welcomeTemplate;
