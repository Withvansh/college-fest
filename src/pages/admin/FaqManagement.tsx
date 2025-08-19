import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const FaqManagement = () => {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    const { data, error } = await supabase.from("faqs").select("*").order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to fetch FAQs");
    } else {
      setFaqs(data);
    }
  };

  const handleAddFaq = async () => {
    if (!question || !answer) {
      toast.warning("Please enter both question and answer.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("faqs").insert([{ question, answer }]);
    setLoading(false);
    if (error) {
      toast.error("Failed to add FAQ");
    } else {
      toast.success("FAQ added");
      setQuestion("");
      setAnswer("");
      fetchFaqs();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete FAQ");
    } else {
      toast.success("FAQ deleted");
      fetchFaqs();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">FAQ Management</h2>

      <div className="mb-6 bg-white rounded-xl shadow p-4 space-y-4">
        <Input placeholder="FAQ Question" value={question} onChange={(e) => setQuestion(e.target.value)} />
        <Textarea placeholder="Answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
        <Button onClick={handleAddFaq} disabled={loading}>
          {loading ? "Adding..." : "Add FAQ"}
        </Button>
      </div>

      <div className="space-y-4">
        {faqs.map((faq: any) => (
          <div key={faq.id} className="bg-white rounded-xl shadow p-4">
            <h4 className="text-lg font-semibold">{faq.question}</h4>
            <p className="text-gray-600 mt-2">{faq.answer}</p>
            <Button variant="destructive" size="sm" className="mt-2" onClick={() => handleDelete(faq.id)}>
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqManagement;
