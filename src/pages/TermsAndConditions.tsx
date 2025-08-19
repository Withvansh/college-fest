import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Scale,
  BookText,
  Copyright,
  ShieldCheck,
  ExternalLink,
  UserCheck,
  Gavel,
  CloudLightning,
} from "lucide-react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <Scale className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-xl text-green-100">
            Please read these terms carefully before using our services.
          </p>
          <div className="mt-6 text-sm text-green-200">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">

          {/* Section 1 */}
          <div className="border-l-4 border-blue-500 pl-6">
            <div className="flex items-center mb-4">
              <BookText className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">1. General Use</h2>
            </div>
            <ul className="list-disc pl-4 text-slate-700 space-y-2">
              <li>
                You agree to provide accurate and complete information during registration and to keep it updated. You are responsible for all actions carried out under your account.
              </li>
              <li>
                The Platform and services are provided “as is” without warranty of any kind. We do not guarantee accuracy, timeliness, or performance of content or services.
              </li>
              <li>
                Unauthorized use of the Platform may result in a claim for damages and/or be a criminal offense.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="border-l-4 border-purple-500 pl-6">
            <div className="flex items-center mb-4">
              <Copyright className="w-6 h-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">2. Intellectual Property</h2>
            </div>
            <p className="text-slate-700 leading-relaxed">
              All content on the Platform, including design, layout, text, graphics, and logos, is owned or licensed to us. You agree not to reproduce or distribute any material without our written permission.
            </p>
          </div>

          {/* Section 3 */}
          <div className="border-l-4 border-green-500 pl-6">
            <div className="flex items-center mb-4">
              <ShieldCheck className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">3. Limitation of Liability</h2>
            </div>
            <p className="text-slate-700 leading-relaxed">
              In no event shall the Platform Owner be liable for indirect, incidental, special or consequential damages, including loss of profits or data. Maximum liability shall not exceed INR 100 or the amount paid by you for the services, whichever is less.
            </p>
          </div>

          {/* Section 4 */}
          <div className="border-l-4 border-pink-500 pl-6">
            <div className="flex items-center mb-4">
              <ExternalLink className="w-6 h-6 text-pink-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">4. Third-Party Links</h2>
            </div>
            <p className="text-slate-700 leading-relaxed">
              The Platform may contain links to third-party websites. We are not responsible for the content or privacy practices of such sites.
            </p>
          </div>

          {/* Section 5 */}
          <div className="border-l-4 border-yellow-500 pl-6">
            <div className="flex items-center mb-4">
              <UserCheck className="w-6 h-6 text-yellow-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">5. Indemnification</h2>
            </div>
            <p className="text-slate-700 leading-relaxed">
              You agree to indemnify and hold harmless the Platform Owner and its affiliates from any claims arising out of your use of the Platform, breach of these Terms, or violation of applicable law.
            </p>
          </div>

          {/* Section 6 */}
          <div className="border-l-4 border-indigo-500 pl-6">
            <div className="flex items-center mb-4">
              <Gavel className="w-6 h-6 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">6. Governing Law</h2>
            </div>
            <p className="text-slate-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of India. All disputes shall be subject to the exclusive jurisdiction of the courts at Ghaziabad, Uttar Pradesh.
            </p>
          </div>

          {/* Section 7 */}
          <div className="border-l-4 border-red-500 pl-6">
            <div className="flex items-center mb-4">
              <CloudLightning className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">7. Force Majeure</h2>
            </div>
            <p className="text-slate-700 leading-relaxed">
              The Platform Owner shall not be liable for failure to perform its obligations under these Terms due to events beyond its control, including acts of God, war, and labor disputes.
            </p>
          </div>

          {/* Section 8 */}
          <div className="border-l-4 border-gray-500 pl-6">
            <div className="flex items-center mb-4">
              <Scale className="w-6 h-6 text-gray-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">8. Contact</h2>
            </div>
            <p className="text-slate-700 leading-relaxed">
              For any questions or concerns about these Terms & Conditions, please contact us at{" "}
              <strong>support@minutehire.com</strong> or visit our Contact page.
            </p>
          </div>

          {/* Company Info (Optional) */}
          <div className="pt-6 text-slate-500 text-sm">
            This agreement is published in accordance with the Information Technology Act, 2000 and other applicable laws, and is an electronic record.
            This website is operated by Campaigning Source Pvt. Ltd.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
