
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { faqApi, FaqItem } from '@/lib/api/faq';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

const FaqPage = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    try {
      const data = await faqApi.getAllFaqs();
      const faqData = data.map(item => ({
        id: item.id,
        question: item.question,
        answer: item.answer,
        category: 'General'
      }));
      setFaqs(faqData);
      setFilteredFaqs(faqData);
    } catch (error) {
      console.error('Error loading FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFaqs(filtered);
    } else {
      setFilteredFaqs(faqs);
    }
  }, [searchTerm, faqs]);

  const toggleFaq = (faqId: string) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <HelpCircle className="h-12 w-12 text-blue-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">
                Frequently Asked Questions
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our platform and services.
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full text-lg"
              />
            </div>
          </div>

          {/* FAQs */}
          <div className="space-y-4">
            {filteredFaqs.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500 text-lg">No FAQs found matching your search.</p>
              </Card>
            ) : (
              filteredFaqs.map((faq) => (
                <Card key={faq.id} className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto text-left"
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <CardTitle className="text-lg font-semibold text-gray-900 flex-1">
                        {faq.question}
                      </CardTitle>
                      {expandedFaq === faq.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      )}
                    </Button>
                  </CardHeader>
                  {expandedFaq === faq.id && (
                    <CardContent className="pt-0">
                      <div className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>

          {/* Contact Section */}
          <Card className="mt-12 bg-blue-50 border-blue-200">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Still have questions?
              </h3>
              <p className="text-gray-600 mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
