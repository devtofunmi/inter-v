
import { useState } from "react";

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
    <section id="faq" className="px-6 py-20 bg-white" data-aos="fade-up">
      <div className="text-center">
        <h2 className="text-5xl font-extrabold mb-4 text-gray-900">Frequently Asked Questions</h2>
        <p className="max-w-2xl mx-auto text-gray-600 mb-12 text-lg font-normal">
          Find answers to the most common questions about Inter-V.
        </p>
      </div>
      <div className="max-w-4xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className="mb-4 pb-4 border-b border-gray-300 last:border-b-0">
            <button 
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              className="flex justify-between items-center w-full text-left focus:outline-none py-2"
            >
              <h3 className="text-xl font-bold text-gray-900">{faq.question}</h3>
              <span className={`text-2xl transform transition-transform duration-300 ${openFaq === index ? 'rotate-45 text-emerald-600' : 'rotate-0 text-gray-500'}`}>+
              </span>
            </button>
            <div 
              className={`grid transition-all duration-300 ease-in-out ${openFaq === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
              <div className="overflow-hidden">
                <p className="text-gray-600 mt-1 text-base font-normal">{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
