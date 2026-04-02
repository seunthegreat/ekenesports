"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseTemplate = void 0;
const baseTemplate = (content, title) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F8F9FA;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1A1A2E;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      border: 1px solid #E2E8F0;
    }
    .header {
      padding: 40px 20px;
      text-align: center;
      background: linear-gradient(135deg, #0A6847 0%, #14B87A 100%);
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    .content {
      padding: 40px;
      line-height: 1.6;
    }
    .footer {
      padding: 30px;
      text-align: center;
      font-size: 13px;
      color: #94A3B8;
      background-color: #F8F9FA;
      border-top: 1px solid #E2E8F0;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background-color: #0A6847;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      margin: 24px 0;
      transition: background-color 0.2s;
    }
    .button:hover {
      background-color: #08563a;
    }
    .divider {
      border: 0;
      border-top: 1px solid #E2E8F0;
      margin: 32px 0;
    }
    .brand-accent {
      color: #0A6847;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Ekenesports</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Ekenesports. All rights reserved.</p>
      <p>Performance gear for the modern athlete.</p>
    </div>
  </div>
</body>
</html>
`;
exports.baseTemplate = baseTemplate;
