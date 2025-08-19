import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Eye,
  Lock,
  Users,
  FileText,
  Calendar,
} from "lucide-react";

const Privacy = () => {
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-blue-100">
            Your privacy is important to us. Learn how we protect and handle your data.
          </p>
          <div className="mt-6 text-sm text-blue-200">
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
              <Eye className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">1. Information We Collect</h2>
            </div>
            <div className="space-y-4 text-slate-700">
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Personal Information:</h3>
                <p className="leading-relaxed">
                  We collect personal details such as your name, email address, shipping address,
                  phone number, and payment information when you make a purchase, create an account, or contact us.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Non-Personal Information:</h3>
                <p className="leading-relaxed">
                  We may collect non-personal data such as browser type, operating system,
                  and browsing behavior to improve our website and services.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="border-l-4 border-purple-500 pl-6">
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">2. How We Use Your Information</h2>
            </div>
            <div className="space-y-4 text-slate-700">
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">To Process Orders:</h3>
                <p className="leading-relaxed">
                  We use your personal information to process and fulfill your orders.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">To Communicate:</h3>
                <p className="leading-relaxed">
                  We use your contact information to send you updates about your order, respond to inquiries,
                  and send promotional materials if you have opted in.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">To Improve Our Services:</h3>
                <p className="leading-relaxed">
                  We analyze non-personal information to understand user behavior and enhance our website's performance.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="border-l-4 border-green-500 pl-6">
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">3. Information Sharing</h2>
            </div>
            <div className="space-y-4 text-slate-700">
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Third-Party Service Providers:</h3>
                <p className="leading-relaxed">
                  We may share your information with third-party service providers who assist us in operating
                  our website, processing payments, and delivering orders.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Legal Requirements:</h3>
                <p className="leading-relaxed">
                  We may disclose your information if required by law or to protect our rights.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="border-l-4 border-red-500 pl-6">
            <div className="flex items-center mb-4">
              <Lock className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">4. Data Security</h2>
            </div>
            <p className="text-slate-700 leading-relaxed">
              We implement appropriate security measures to protect your personal information from
              unauthorized access, alteration, disclosure, or destruction.
            </p>
          </div>

          {/* Section 5 */}
          <div className="border-l-4 border-yellow-500 pl-6">
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-yellow-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">5. Your Rights</h2>
            </div>
            <div className="space-y-4 text-slate-700">
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Access and Correction:</h3>
                <p className="leading-relaxed">
                  You have the right to access and correct your personal information.
                  You can update your account details through our website.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Opt-Out:</h3>
                <p className="leading-relaxed">
                  You can opt-out of receiving promotional emails by following the unsubscribe instructions in the emails.
                </p>
              </div>
            </div>
          </div>

          {/* Section 6 */}
          <div className="border-l-4 border-indigo-500 pl-6">
            <div className="flex items-center mb-4">
              <Calendar className="w-6 h-6 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">6. Changes to This Policy</h2>
            </div>
            <p className="text-slate-700 leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page,
              and the revised date will be indicated at the top of the policy.
            </p>
          </div>

          {/* Contact Section */}
          <div className="pt-8 border-t border-slate-200">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Questions About This Policy?</h3>
              <p className="text-slate-600 mb-4">
                If you have any questions about this Privacy Policy, please contact us.
              </p>
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
