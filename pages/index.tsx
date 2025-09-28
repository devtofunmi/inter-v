import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
// Fixed: Added missing Lucide icons for Testimonials
import { Mic, Brain, PenLine, TrendingUp, CheckCircle, Menu, X, ChevronLeft, ChevronRight, User } from "lucide-react"; 

const features = [
  {
    icon: Mic,
    title: "Voice chat",
    description: "Our realistic voice chat feels just like a real interview.",
    linkText: "Realistic voice chat",
  },
  {
    icon: Brain,
    title: "Powerful interviewer",
    description: "Our AI interviewer will question you on everything from job-specific technicalities to items on your résumé.",
    linkText: "Find holes in your CV",
  },
  {
    icon: PenLine,
    title: "Constructive feedback",
    description: "Get honest constructive feedback from our intelligent interview model.",
    linkText: "Improve your technique",
  },
  {
    icon: TrendingUp,
    title: "Get better",
    description: "Work your way up from easy to hard mode mastering your interview technique.",
    linkText: "Master each difficulty level",
  },
];

const testimonials = [
  {
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Sarah Lee",
    title: "Software Engineer",
    quote: "Inter-V helped me land my dream job! The practice interviews felt real and the feedback was spot on.",
  },
  {
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Michael Chen",
    title: "Marketing Specialist",
    quote: "I felt so much more confident after using Inter-V. The voice chat feature is a game changer!",
  },
  {
    image: "https://randomuser.me/api/portraits/men/65.jpg",
    name: "James Patel",
    title: "Data Analyst",
    quote: "The AI interviewer asked tough questions and gave me honest feedback. Highly recommend Inter-V!",
  },
  {
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Emily Carter",
    title: "Accountant",
    quote: "Inter-V made interview prep easy and effective. I got the job I wanted thanks to their platform.",
  },
  {
    image: "https://randomuser.me/api/portraits/women/55.jpg",
    name: "Jessica Miller",
    title: "UX Designer",
    quote: "The user interface is so intuitive and the AI is surprisingly smart. It's like having a personal interview coach.",
  },
  {
    image: "https://randomuser.me/api/portraits/men/78.jpg",
    name: "David Rodriguez",
    title: "Product Manager",
    quote: "A must-have for any professional looking to sharpen their interview skills. The progress tracking is a great feature.",
  }
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
    answer: "You can practice for a wide range of roles."
  }
];

export default function Home() {
  const [isSticky, setSticky] = useState(false);
  // Fixed: Initial state set to null so no FAQ is open by default
  const [openFaq, setOpenFaq] = useState(null); 
  const [selectedPlan, setSelectedPlan] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  // Fixed: Added state for testimonial carousel
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isLg, setIsLg] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    setIsLg(mediaQuery.matches);
    const handler = (e) => setIsLg(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      mediaQuery.removeEventListener('change', handler);
    };
  }, []);

  // Fixed: Added testimonial navigation logic
  const nextTestimonial = () => {
    const itemsInView = isLg ? 3 : 1;
    const maxIndex = testimonials.length - itemsInView;
    setCurrentTestimonialIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
  };

  const prevTestimonial = () => {
    const itemsInView = isLg ? 3 : 1;
    const maxIndex = testimonials.length - itemsInView;
    setCurrentTestimonialIndex((prevIndex) => (prevIndex === 0 ? maxIndex : prevIndex - 1));
  };
  // End Fix

  const navLinks = [
    { href: "#features", text: "Features" },
    { href: "#testimonials", text: "Testimonials" },
    { href: "#pricing", text: "Pricing" },
    { href: "#faq", text: "FAQ" },
  ];

  return (
    <div className="font-sans bg-white text-gray-900">
      
      {/* Sticky Header */}
      <header className={`z-50 flex justify-between items-center px-8 py-4 ${isSticky ? 'fixed top-0 w-full backdrop-blur-md bg-white/90 border-b border-gray-200 shadow-md' : ''}`}>
        <div className="text-xl font-bold text-emerald-600">🚀 Inter-V</div>
        
        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-emerald-600">{link.text}</a>
          ))}
        </nav>
        
        <Link href="/auth" className="hidden md:block px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-lg transition-colors">
          Log In
        </Link>
        
        {/* Mobile Navigation Toggle */}
        <button 
          className="md:hidden p-2 text-gray-600 hover:text-emerald-600 z-[60]"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Toggle navigation"
        >
          {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Fixed Menu */}
        <div className={`fixed top-0 left-0 h-full w-full bg-white transition-transform duration-300 ease-in-out z-40 md:hidden ${mobileNavOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="pt-20 px-8 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a 
                key={link.href} 
                href={link.href} 
                className="text-2xl font-semibold py-2 border-b border-gray-200 hover:text-emerald-600"
                onClick={() => setMobileNavOpen(false)}
              >
                {link.text}
              </a>
            ))}
            <Link href="/auth" className="mt-6 px-5 py-3 text-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-lg transition-colors text-lg">
              Log In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-12 px-6 pt-24 pb-10 bg-white max-w-7xl mx-auto" data-aos="fade-up">
        
        <div className="text-center md:text-left md:w-1/2">
          <span className="inline-flex items-center px-4 py-1 mb-6 text-sm rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800 font-semibold">
            AI-Powered Interview Preparation
          </span>
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 text-gray-900">
            Elevate Your <span className="text-emerald-600">Interview</span> Performance
          </h1>
          <p className="max-w-xl text-gray-600 mb-8 text-lg mx-auto md:mx-0">
            Engage with our AI-driven interview coach in a real-time, personalized practice environment. Receive actionable feedback to enhance your professional delivery.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center md:justify-start mb-10">
            <Link href="/auth">
              <button className="px-8 py-4 w-full sm:w-auto cursor-pointer rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold shadow-xl transition-all duration-300 transform hover:scale-105">
                Begin Your Session →
              </button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 text-gray-500 text-sm justify-center md:justify-start">
            <span className="flex items-center justify-center md:justify-start">
              <CheckCircle size={16} className="text-emerald-500 mr-2"/> Trusted by 10,000+ Users
            </span>
            <span className="flex items-center justify-center md:justify-start">
              <CheckCircle size={16} className="text-emerald-500 mr-2"/> Advanced Model
            </span>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 mt-12 md:mt-0 flex justify-center">
          <Image 
            src={"/hero.jpg"} 
            alt="AI Interview Practice App Interface" 
            width={500} 
            height={500} 
            className="rounded-xl shadow-md border border-gray-100"
            // Next.js Image component requires absolute or relative local path, or optimization domain setup for external URLs
            unoptimized 
          />
        </div>
      </section>

      {/* --- */}

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-white max-w-7xl mx-auto" data-aos="fade-up">
          <div className="text-center">
            <span className=" py-1 px-2 text-sm rounded-full mt-10 border border-gray-300 inline-block text-gray-700">
              Get the job you deserve!
            </span>
            <h2 className="text-4xl font-extrabold  text-gray-900">Practice makes perfect</h2>
            <p className="max-w-2xl mx-auto text-gray-600 ">
              Inter-V is designed to be as simple and effective as possible. Here’s how it works:
            </p>
          </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {/* Feature 1 & 2 Card (Voice Chat + Powerful Interviewer) */}
          <div className="p-8 rounded-xl bg-emerald-600 text-white flex flex-col justify-between min-h-[450px]">
            <p className="text-xl font-semibold mb-6">For your realistic practice and in-depth analysis of your performance, anytime.</p>
            
            <div className="flex flex-col gap-6">
                <div className="bg-white/10 p-4 rounded-lg flex items-start">
                    <Mic size={24} className="text-white mt-1 mr-4 shrink-0" />
                    <div>
                        <h3 className="text-xl font-bold mb-1">{features[0].title}</h3>
                        <p className="text-sm text-gray-200">{features[0].description}</p>
                        <p className="text-sm font-medium underline hover:no-underline">{features[0].linkText}</p>
                    </div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg flex items-start">
                    <Brain size={24} className="text-white mt-1 mr-4 shrink-0" />
                    <div>
                        <h3 className="text-xl font-bold mb-1">{features[1].title}</h3>
                        <p className="text-sm text-gray-200">{features[1].description}</p>
                        <p className="text-sm font-medium underline hover:no-underline">{features[1].linkText}</p>
                    </div>
                </div>
            </div>
          </div>
          
          {/* Feature 3 & 4 Card (Constructive Feedback + Get Better) */}
          <div className="p-8 bg-gray-50 rounded-xl border border-gray-200 flex flex-col justify-between min-h-[450px]">
            <div className="p-2 rounded-full bg-gray-200 w-fit">
              <CheckCircle size={20} className="text-gray-700" />
            </div>
            <div className="space-y-6">
                <div className="flex items-start">
                    <PenLine size={24} className="text-emerald-600 mr-4 mt-1 shrink-0" />
                    <div>
                        <h3 className="text-xl font-semibold mb-1">{features[2].title}</h3>
                        <p className="text-gray-600 text-base">{features[2].description}</p>
                        <a href="#features" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">{features[2].linkText}</a>
                    </div>
                </div>
                <div className="flex items-start">
                    <TrendingUp size={24} className="text-emerald-600 mr-4 mt-1 shrink-0" />
                    <div>
                        <h3 className="text-xl font-semibold mb-1">{features[3].title}</h3>
                        <p className="text-gray-600 text-base">{features[3].description}</p>
                        <a href="#features" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">{features[3].linkText}</a>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* --- */}

      {/* Testimonials Section */}
       <section id="testimonials" className="px-6 py-20 bg-white max-w-7xl mx-auto overflow-hidden" data-aos="fade-up">
        <h2 className="text-5xl text-center font-extrabold text-gray-900 mb-4">Testimonials</h2>
        <p className="text-2xl text-center text-gray-500 font-light mb-16">
          Here's what some users who have hopped on the <span className="text-emerald-600 font-medium">Inter-V</span> train have to say.
        </p>

        <div className="relative flex items-center">
          {/* Left Arrow Button */}
          <button 
            onClick={prevTestimonial}
            aria-label="Previous testimonial"
            className="z-10 p-2 text-gray-700 bg-white rounded-full shadow-lg hover:bg-gray-100 absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 sm:translate-x-0 sm:static sm:mr-4"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Testimonial Cards Container (for smooth sliding effect) */}
          <div className="flex-1 overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentTestimonialIndex * 100 / (isLg ? 3 : 1)}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="w-full lg:w-1/3 shrink-0 p-2"
                >
                  <div className="p-6 h-full bg-white rounded-xl border border-gray-200 shadow-md">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                        {testimonial.image ? (
                            <Image
                                src={testimonial.image}
                                alt={testimonial.name}
                                width={40}
                                height={40}
                                className="object-cover"
                                unoptimized
                            />
                        ) : (
                            <User size={20} className="text-gray-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900">{testimonial.name}</h3>
                        <p className="text-sm text-gray-500">{testimonial.title}</p>
                      </div>
                    </div>
                    <p className="text-lg text-gray-700">
                      {testimonial.quote}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow Button */}
          <button 
            onClick={nextTestimonial}
            aria-label="Next testimonial"
            className="z-10 p-2 text-gray-700 bg-white rounded-full shadow-lg hover:bg-gray-100 absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 sm:translate-x-0 sm:static sm:ml-4"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </section>

      {/* --- */}

      {/* Pricing Section */}
      <section id="pricing" className="px-6 py-20 bg-gray-50" data-aos="fade-up">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-900">Pricing</h2>
        <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div 
            onClick={() => setSelectedPlan(0)}
            className={`p-8 bg-white rounded-xl shadow-lg flex flex-col items-center cursor-pointer transition-all duration-300 ${selectedPlan === 0 ? 'border-2 border-emerald-600 shadow-xl' : 'border border-gray-200'}`}
          >
            <h3 className="text-2xl font-semibold mb-2 text-gray-900">Free Plan</h3>
            <p className="text-gray-600 mb-4">Ideal for introductory practice sessions.</p>
            <p className="text-5xl font-extrabold mb-6 text-gray-900">$0</p>
            <Link href="/auth">
            <button className="px-6 py-3 bg-emerald-600 cursor-pointer rounded-full hover:bg-emerald-700 text-white font-medium shadow-md transition-colors">
              Get Started
            </button>
            </Link>
          </div>
          <div 
            onClick={() => setSelectedPlan(1)}
            className={`p-8 bg-white rounded-xl shadow-lg flex flex-col items-center cursor-pointer transition-all duration-300 ${selectedPlan === 1 ? 'border-2 border-emerald-600 shadow-xl' : 'border border-gray-200'}`}
          >
            <h3 className="text-2xl font-semibold mb-2 text-gray-900">Pro Plan</h3>
            <p className="text-gray-600 mb-4">Unlock full platform capabilities and unlimited interviews.</p>
            <p className="text-5xl font-extrabold mb-6 text-gray-900">$19/mo</p>
            <button className="px-6 py-3 cursor-not-allowed opacity-60 bg-emerald-600 rounded-full text-white font-medium shadow-md">
              Upgrade Now
            </button>
          </div>
        </div>
      </section>

      {/* --- */}

      {/* FAQ Section */}
      <section id="faq" className="px-6 py-20 bg-white" data-aos="fade-up">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold mb-4 text-gray-900">Frequently Asked Questions</h2>
          <p className="max-w-2xl mx-auto text-gray-600 mb-12">
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
                <h3 className="text-xl font-semibold text-gray-900">{faq.question}</h3>
                <span className={`text-2xl transform transition-transform duration-300 ${openFaq === index ? 'rotate-45 text-emerald-600' : 'rotate-0 text-gray-500'}`}>
                  +
                </span>
              </button>
              <div 
                className={`grid transition-all duration-300 ease-in-out ${
                  openFaq === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-gray-600 mt-1">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* --- */}

      {/* Call to Action Section */}
      <section id="cta" className="px-6 py-20 bg-gray-100 text-center" data-aos="fade-up">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-extrabold mb-4 text-gray-900">Ready to Master Your Next Interview?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of professionals who have aced their interviews with Inter-V.
          </p>
          <Link href="/auth">
            <button className="px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold shadow-xl transition-all duration-300 transform hover:scale-105">
              Start Your Free Session →
            </button>
          </Link>
        </div>
      </section>

      {/* --- */}

      {/* Footer */}
      <footer className="px-6 py-10 bg-gray-900 text-center text-gray-400">
        <p className="text-sm">© {new Date().getFullYear()} Inter-V. All rights reserved.</p>
        <p className="text-xs mt-2">Practice sessions are confidential and securely stored.</p>
      </footer>
    </div>
  );
}