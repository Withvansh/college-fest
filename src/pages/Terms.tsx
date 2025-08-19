
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, FileText, Users, Lock } from "lucide-react";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/0f6e5659-1efd-46cc-a890-d5abc0f69f2b.png" 
                alt="MinuteHire Logo" 
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold text-gray-800">MinuteHire</span>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <FileText className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Terms & Conditions
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Please read these terms and conditions carefully before using MinuteHire platform
            </p>
            <div className="mt-8 text-blue-200">
              <p>Last updated: December 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Terms Content */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            
            {/* Quick Navigation */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200/50 mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Quick Navigation</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "Acceptance of Terms", href: "#acceptance" },
                  { title: "User Accounts", href: "#accounts" },
                  { title: "Platform Usage", href: "#usage" },
                  { title: "Payment Terms", href: "#payment" },
                  { title: "Privacy & Data", href: "#privacy" },
                  { title: "Limitation of Liability", href: "#liability" },
                  { title: "Termination", href: "#termination" },
                  { title: "Contact Information", href: "#contact" }
                ].map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700 hover:text-blue-600">{item.title}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Terms Sections */}
            <div className="space-y-12">
              
              {/* Acceptance of Terms */}
              <section id="acceptance" className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200/50">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    By accessing and using the MinuteHire platform, you accept and agree to be bound by the terms and provision of this agreement.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    If you do not agree to abide by the above, please do not use this service.
                  </p>
                </div>
              </section>

              {/* User Accounts */}
              <section id="accounts" className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200/50">
                <div className="flex items-center space-x-3 mb-6">
                  <Users className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">2. User Accounts</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    When you create an account with us, you must provide information that is accurate, complete, and current at all times.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>You are responsible for safeguarding the password and for all activities under your account</li>
                    <li>You must notify us immediately of any unauthorized use of your account</li>
                    <li>We reserve the right to terminate accounts that violate our terms</li>
                    <li>One person or entity may not maintain multiple accounts</li>
                  </ul>
                </div>
              </section>

              {/* Platform Usage */}
              <section id="usage" className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200/50">
                <div className="flex items-center space-x-3 mb-6">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">3. Platform Usage</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    MinuteHire grants you a limited, non-exclusive, non-transferable license to use our platform for its intended purposes.
                  </p>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Permitted Uses:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Job searching and application submission</li>
                      <li>Recruitment and candidate management</li>
                      <li>Skills testing and assessment</li>
                      <li>HRMS and employee management</li>
                      <li>Freelance project management</li>
                      <li>College placement coordination</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Prohibited Uses:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Uploading malicious content or spam</li>
                      <li>Attempting to breach security measures</li>
                      <li>Scraping or automated data collection</li>
                      <li>Impersonating other users or entities</li>
                      <li>Posting discriminatory or offensive content</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Payment Terms */}
              <section id="payment" className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200/50">
                <div className="flex items-center space-x-3 mb-6">
                  <Lock className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">4. Payment Terms</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Some features of MinuteHire require payment. By purchasing a subscription or service, you agree to pay all fees associated with your selected plan.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>All fees are non-refundable unless otherwise stated</li>
                    <li>Subscription fees are billed in advance</li>
                    <li>We reserve the right to change pricing with 30 days notice</li>
                    <li>Failed payments may result in service suspension</li>
                  </ul>
                </div>
              </section>

              {/* Privacy & Data */}
              <section id="privacy" className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200/50">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">5. Privacy & Data Protection</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    By using MinuteHire, you consent to the collection and use of your information as outlined in our Privacy Policy.
                  </p>
                </div>
              </section>

              {/* Limitation of Liability */}
              <section id="liability" className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200/50">
                <div className="flex items-center space-x-3 mb-6">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">6. Limitation of Liability</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    In no event shall MinuteHire be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Our total liability to you for any claim shall not exceed the amount paid by you to MinuteHire in the 12 months preceding the claim.
                  </p>
                </div>
              </section>

              {/* Termination */}
              <section id="termination" className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200/50">
                <div className="flex items-center space-x-3 mb-6">
                  <Users className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">7. Termination</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Upon termination, your right to use the service will cease immediately. All provisions which by their nature should survive termination shall survive.
                  </p>
                </div>
              </section>

              {/* Contact */}
              <section id="contact" className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <div className="flex items-center space-x-3 mb-6">
                  <FileText className="h-6 w-6 text-white" />
                  <h2 className="text-2xl font-bold text-white">8. Contact Information</h2>
                </div>
                <div className="prose prose-blue max-w-none">
                  <p className="text-blue-100 leading-relaxed mb-4">
                    If you have any questions about these Terms and Conditions, please contact us:
                  </p>
                  <div className="space-y-2 text-blue-100">
                    <p>Email: legal@minutehire.com</p>
                    <p>Phone: +1 (800) 123-4567</p>
                    <p>Address: San Francisco, CA 94102</p>
                  </div>
                </div>
              </section>

            </div>

            {/* Agreement Footer */}
            <div className="mt-16 text-center">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200/50">
                <p className="text-gray-600 mb-6">
                  By continuing to use MinuteHire, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                </p>
                <Link to="/">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    I Agree - Return to MinuteHire
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;
