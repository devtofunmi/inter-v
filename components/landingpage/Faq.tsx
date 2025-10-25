
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How does the AI interviewer work?",
    answer: "The AI uses advanced natural language processing to understand your responses and provide relevant follow-up questions, creating a realistic interview simulation."
  },
  {
    question: "Is my data private?",
    answer: "Yes, all your practice sessions and personal data are kept completely private and secure."
  },
  {
    question: "Can I get feedback on specific skills?",
    answer: "Absolutely. Our feedback system analyzes your communication, clarity, and confidence, and provides tailored suggestions for improvement."
  },
  {
    question: "What kind of roles can I practice for?",
    answer: "You can practice for a wide range of roles."
  }
];

export const Faq = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="faq" className="px-6 py-20 bg-gray-50" data-aos="fade-up">
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-5xl font-extrabold mb-4 text-gray-900">Frequently Asked Questions</h2>
        <p className="max-w-2xl mx-auto text-gray-600 mb-12 text-lg font-normal">
          Find answers to the most common questions about Prepkitty.
        </p>
      </div>
      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-xl  border border-gray-200">
            <button 
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              className="flex justify-between items-center w-full text-left p-6 focus:outline-none"
            >
              <h3 className="text-xl font-bold text-gray-900">{faq.question}</h3>
              <ChevronDown 
                className={`transform transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-emerald-600' : 'text-gray-500'}`}
                size={24}
              />
            </button>
            <div 
              className={`grid transition-all duration-300 ease-in-out ${openFaq === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
              <div className="overflow-hidden px-6 pb-6">
                <p className="text-gray-700 text-base font-normal">{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
