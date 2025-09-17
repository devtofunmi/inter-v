import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const features = [
  {
    icon: "https://placehold.co/40x40/00FF7F/000?text=🎤",
    title: "Voice chat",
    description: "Our realistic voice chat feels just like a real interview.",
    linkText: "Realistic voice chat",
  },
  {
    icon: "https://placehold.co/40x40/6633FF/000?text=🧠",
    title: "Powerful interviewer",
    description: "Our AI interviewer will question you on everything from job-specific technicalities to items on your résumé.",
    linkText: "Find holes in your CV",
  },
  {
    icon: "https://placehold.co/40x40/FFD700/000?text=✍️",
    title: "Constructive feedback",
    description: "Get honest constructive feedback from our intelligent interview model.",
    linkText: "Improve your technique",
  },
  {
    icon: "https://placehold.co/40x40/FF6347/000?text=📈",
    title: "Get better",
    description: "Work your way up from easy to hard mode mastering your interview technique.",
    linkText: "Master each difficulty level",
  },
];

const testimonials = [
  {
    image: "https://placehold.co/60x60/8B0000/FFF?text=KS",
    name: "Katya Samson",
    title: "Dentist",
    quote: "Bossed really put me through my paces. It helped me get a job in a practice I love!",
  },
  {
    image: "https://placehold.co/60x60/4B0082/FFF?text=A",
    name: "Anonymous",
    title: "Analyst",
    quote: "I was super nervous for my interview but practicing really helped!",
  },
  {
    image: "https://placehold.co/60-60/00008B/FFF?text=JP",
    name: "Jim Paros",
    title: "Analyst",
    quote: "Using bossed was great. It allowed me to improve my skills!",
  },
  {
    image: "https://placehold.co/60x60/191970/FFF?text=A",
    name: "Alison",
    title: "Accountant",
    quote: "It was so good, the questions it asked were so clever! It really helped me.",
  },
];

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
    answer: "You can practice for a wide range of roles. Choose from our pre-defined list or enter a custom job description for a highly personalized experience."
  }
];

export default function Home() {
  const [isSticky, setSticky] = useState(false);
  // State to track the active FAQ item, defaulting to the first one open.
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  // State to track the selected pricing plan, defaulting to the free plan.
  const [selectedPlan, setSelectedPlan] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="font-sans bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white">
      {/* Navbar */}
      <header className={`z-50 flex justify-between items-center px-8 py-4 ${isSticky ? 'fixed top-0 w-full backdrop-blur-md bg-black/50 border-b border-gray-800' : ''}`}>
        <div className="text-xl font-bold">🚀 Inter-V</div>
        <nav className="hidden md:flex gap-8">
          <a href="#features" className="hover:text-gray-300">Features</a>
          <a href="#testimonials" className="hover:text-gray-300">Testimonials</a>
          <a href="#pricing" className="hover:text-gray-300">Pricing</a>
          <a href="#faq" className="hover:text-gray-300">FAQ</a>
        </nav>
        <Link href="/auth" className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 font-medium">
          Log In / Sign Up
        </Link>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-6 py-24 sm:py-32">
        <span className="px-4 py-1 mb-6 text-sm rounded-full border border-gray-700">
          🎤 AI-Powered Interview Preparation
        </span>
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-6">
          Elevate Your <span className="text-blue-500">Interview</span> Performance
        </h1>
        <p className="max-w-2xl text-gray-300 mb-8">
          Engage with our AI-driven interview coach in a real-time, personalized practice environment. Receive actionable feedback to enhance your professional delivery.
        </p>
        <Link href="/auth">
        <button className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-lg font-semibold">
          Begin Your Session →
        </button>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-black">
        <div className="text-center">
          <span className="px-4 py-1 text-sm rounded-full border border-gray-700 inline-block mb-4">
            Get the job you deserve!
          </span>
          <h2 className="text-4xl font-extrabold mb-4">Practice makes perfect</h2>
          <p className="max-w-2xl mx-auto text-gray-400 mb-12">
            Inter-V is designed to be as simple and effective as possible. Here’s how it works:
          </p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-gray-900 rounded-2xl shadow-lg flex flex-col items-center text-center">
              <div className="p-3 mb-4 rounded-full bg-gray-800">
                <Image src={feature.icon} alt={feature.title} width={40} height={40} className="w-10 h-10 rounded-full" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 mb-4">{feature.description}</p>
              <a href="#" className="text-blue-500 hover:underline">{feature.linkText}</a>
            </div>
          ))}
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="px-6 py-20 bg-gradient-to-b from-gray-950 to-black">
        <div className="text-center">
          <span className="px-4 py-1 text-sm rounded-full border border-gray-700 inline-block mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl font-extrabold mb-12">
            Do you want to be the only<br />candidate that didn&apos;t prepare?
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-8 bg-gray-900 rounded-2xl shadow-lg flex flex-col items-center text-center">
              <Image src={testimonial.image} alt={testimonial.name} width={60} height={60} className="w-16 h-16 rounded-full mb-4 object-cover" />
              <p className="text-gray-400 italic mb-4">&quot;{testimonial.quote}&quot;</p>
              <h3 className="text-lg font-semibold">{testimonial.name}</h3>
              <p className="text-sm text-gray-500">{testimonial.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-6 py-20 bg-gradient-to-b from-gray-950 to-black">
        <h2 className="text-3xl font-bold text-center mb-12">Pricing</h2>
        <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div 
            onClick={() => setSelectedPlan(0)}
            className={`p-8 bg-gray-900 rounded-2xl shadow-lg flex flex-col items-center cursor-pointer transition-all duration-300 ${selectedPlan === 0 ? 'border-2 border-blue-600' : 'border border-transparent'}`}
          >
            <h3 className="text-2xl font-semibold mb-2">Free Plan</h3>
            <p className="text-gray-400 mb-4">Ideal for introductory practice sessions.</p>
            <p className="text-3xl font-bold mb-6">$0</p>
            <Link href="/auth">
            <button className="px-6 py-3 bg-blue-600 cursot-pointer rounded-full hover:bg-blue-500">
              Get Started
            </button>
            </Link>
          </div>
          <div 
            onClick={() => setSelectedPlan(1)}
            className={`p-8 bg-gray-900 rounded-2xl shadow-lg flex flex-col items-center cursor-pointer transition-all duration-300 ${selectedPlan === 1 ? 'border-2 border-blue-600' : 'border border-transparent'}`}
          >
            <h3 className="text-2xl font-semibold mb-2">Pro Plan</h3>
            <p className="text-gray-400 mb-4">Unlock full platform capabilities and unlimited interviews.</p>
            <p className="text-3xl font-bold mb-6">$19/mo</p>
            <button className="px-6 py-3 cursor-not-allowed  bg-blue-600 rounded-full hover:bg-blue-500">
              Upgrade Now
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="px-6 py-20 bg-black">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold mb-4">Frequently Asked Questions</h2>
          <p className="max-w-2xl mx-auto text-gray-400 mb-12">
            Find answers to the most common questions about Inter-V.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-8 pb-4 border-b border-gray-700">
              <button 
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="flex justify-between items-center w-full text-left focus:outline-none"
              >
                <h3 className="text-xl font-semibold">{faq.question}</h3>
                <span className="text-2xl transform transition-transform duration-300">
                  {openFaq === index ? '−' : '+'}
                </span>
              </button>
              <div 
                className={`grid transition-all duration-300 ease-in-out ${
                  openFaq === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-gray-400 mt-2">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section id="cta" className="px-6 py-20 bg-gradient-to-b from-gray-950 to-black text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-extrabold mb-4">Ready to Master Your Next Interview?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Join thousands of professionals who have aced their interviews with Inter-V.
          </p>
          <button className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-lg font-semibold">
            Start Your Free Session →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 bg-black text-center text-gray-400">
        <p>© {new Date().getFullYear()} Inter-V. All rights reserved.</p>
      </footer>
    </div>
  );
}

