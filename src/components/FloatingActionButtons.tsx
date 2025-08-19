
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Phone } from 'lucide-react';

const FloatingActionButtons = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/919911182678', '_blank');
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4">
      {/* WhatsApp Button */}
      <Button
        onClick={handleWhatsAppClick}
        className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl group animate-pulse hover:animate-none"
        size="icon"
      >
        <Phone className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
      </Button>

      {/* Chatbot Interface */}
      {isChatOpen && (
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-80 h-96 flex flex-col animate-fade-in">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">MinuteHire Assistant</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              className="text-white hover:bg-blue-700 w-8 h-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-3">
              <div className="bg-gray-100 rounded-lg p-3 text-sm">
                👋 Hi! I'm here to help you with:
              </div>
              <div className="bg-gray-100 rounded-lg p-3 text-sm">
                • Finding jobs & freelance projects<br/>
                • Creating your profile<br/>
                • Understanding our hiring process<br/>
                • Campus placement queries
              </div>
              <div className="bg-gray-100 rounded-lg p-3 text-sm">
                What would you like to know?
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Send
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Chatbot Toggle Button */}
      <Button
        onClick={toggleChat}
        className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
        size="icon"
      >
        {isChatOpen ? (
          <X className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
        )}
      </Button>
    </div>
  );
};

export default FloatingActionButtons;
