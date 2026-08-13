// src/app/(main-app)/privacy/page.tsx
import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-6">Privacy Policy</h1>
        
        <div className="prose prose-indigo mx-auto mt-6">
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
            <p className="font-bold">Disclaimer:</p>
            <p className="text-sm">This is a template for a Privacy Policy and not legal advice. You should consult with a legal professional to ensure this policy is complete and compliant with all applicable laws (like GDPR, CCPA, etc.) for your jurisdiction and business.</p>
          </div>

          <h2>1. Introduction</h2>
          <p>
            Digital Invitations ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website tap2invite.com (the "Service").
          </p>

          <h2>2. Information We Collect</h2>
          <p>
            We may collect personal information from you in a variety of ways, including, but not limited to, when you register on the site, create an invitation, or otherwise interact with the Service. The information we may collect includes:
          </p>
          <ul>
            <li><strong>Personal Data:</strong> Name, email address, and other contact details you provide.</li>
            <li><strong>Invitation Data:</strong> Information you provide for your invitations, such as event details, photos, and guest lists.</li>
            <li><strong>Usage Data:</strong> Information your browser sends whenever you visit our Service, such as your computer's IP address, browser type, and the pages you visit.</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Provide, operate, and maintain our Service.</li>
            <li>Improve, personalize, and expand our Service.</li>
            <li>Communicate with you, either directly or through one of our partners, including for customer service.</li>
            <li>Process your transactions and manage your orders.</li>
            <li>Send you emails and other communications.</li>
          </ul>

          <h2>4. Information Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
          </p>

          <h2>5. Data Security</h2>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
          </p>

          <h2>6. Your Rights</h2>
          <p>
            Depending on your jurisdiction, you may have certain rights regarding your personal data, such as the right to access, correct, or delete your data.
          </p>

          <h2>7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us.
          </p>
        </div>
      </div>
    </div>
  );
}
