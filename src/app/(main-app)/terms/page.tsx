// src/app/(main-app)/terms/page.tsx
import React from 'react';

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-6">Terms and Conditions</h1>
        
        <div className="prose prose-indigo mx-auto mt-6">
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
            <p className="font-bold">Disclaimer:</p>
            <p className="text-sm">This is a template for Terms and Conditions and not legal advice. You should consult with a legal professional to ensure this policy is complete and compliant with all applicable laws for your jurisdiction and business.</p>
          </div>

          <h2>1. Introduction</h2>
          <p>
            Welcome to Digital Invitations ("we", "our", "us"). These Terms and Conditions govern your use of our website located at tap2invite.com (the "Service") and form a binding contractual agreement between you, the user of the Service, and us.
          </p>

          <h2>2. Your Responsibilities</h2>
          <p>
            You agree to use the Service only for lawful purposes. You are responsible for all content you create, upload, or share on the Service. You must not create content that is defamatory, obscene, pornographic, or otherwise illegal.
          </p>

          <h2>3. Intellectual Property</h2>
          <p>
            All intellectual property rights in the templates, designs, and content available on the Service are owned by us or our licensors. We grant you a limited, non-exclusive license to use our templates for the purpose of creating and sharing digital invitations for personal use.
          </p>

          <h2>4. User-Generated Content</h2>
          <p>
            You retain ownership of the content you upload to the Service. By uploading content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content solely for the purpose of operating and providing the Service.
          </p>

          <h2>5. Termination</h2>
          <p>
            We may terminate or suspend your access to the Service at any time, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms and Conditions.
          </p>

          <h2>6. Disclaimer of Warranties</h2>
          <p>
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, regarding the operation or availability of the Service.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            In no event shall we be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>

          <h2>8. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which our company is established, without regard to its conflict of law provisions.
          </p>

          <h2>9. Changes to These Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms and Conditions on this page.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us.
          </p>
        </div>
      </div>
    </div>
  );
}
