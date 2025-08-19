import { Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Clock, CheckCircle, AlertCircle, DollarSign, Calendar } from "lucide-react";

const RefundPolicy = () => {
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
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <CreditCard className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Refund Policy</h1>
          <p className="text-xl text-orange-100">
            Clear and transparent refund process for your peace of mind.
          </p>
          <div className="mt-6 text-sm text-orange-200">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Main Policy */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full mb-6">
              <Clock className="w-10 h-10 text-orange-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Refund Processing Time</h2>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-8 border border-orange-200">
              <p className="text-xl text-slate-700 leading-relaxed">
                Once the refund is approved, it will take <strong className="text-orange-600">7 business days</strong> to credit to your bank account.
              </p>
            </div>
          </div>

          {/* Process Steps */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-slate-900 text-center mb-8">Refund Process</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                    1
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900">Request Submitted</h4>
                </div>
                <p className="text-slate-600">
                  You submit a refund request through our platform or contact support.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                    2
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900">Review & Approval</h4>
                </div>
                <p className="text-slate-600">
                  Our team reviews your request and processes the approval within 1-2 business days.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                    3
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900">Refund Processed</h4>
                </div>
                <p className="text-slate-600">
                  Once approved, the refund is processed and credited to your account within 7 business days.
                </p>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="mt-12 space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Important Information</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Processing Time */}
              <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
                <div className="flex items-center mb-3">
                  <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                  <h4 className="text-lg font-semibold text-slate-900">Processing Timeline</h4>
                </div>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Review: 1-2 business days
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Bank transfer: 7 business days
                  </li>
                </ul>
              </div>

              {/* Refund Method */}
              <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
                <div className="flex items-center mb-3">
                  <DollarSign className="w-6 h-6 text-green-600 mr-3" />
                  <h4 className="text-lg font-semibold text-slate-900">Refund Method</h4>
                </div>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Same payment method used
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Full amount refunded
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Alert Box */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">Please Note</h4>
                <p className="text-slate-700">
                  The exact timing may vary depending on your bank's processing time. 
                  Weekends and holidays may extend the processing period. If you don't see the refund 
                  after 7 business days, please contact our support team.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Need Help with Your Refund?</h3>
              <p className="text-slate-600 mb-4">
                Our customer support team is here to assist you with any refund-related questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  to="/" 
                  className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Contact Support
                </Link>
                <Link 
                  to="/" 
                  className="inline-flex items-center px-6 py-3 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-600 hover:text-white transition-colors"
                >
                  Email: support@minutehire.com
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;