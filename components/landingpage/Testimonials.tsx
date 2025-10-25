
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, User } from "lucide-react";

const testimonials = [
  {
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Sarah Lee",
    title: "Software Engineer",
    quote: "Prepkitty helped me land my dream job! The practice interviews felt real and the feedback was spot on.",
  },
  {
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Michael Chen",
    title: "Marketing Specialist",
    quote: "I felt so much more confident after using Prepkitty. The voice chat feature is a game changer!",
  },
  {
    image: "https://randomuser.me/api/portraits/men/65.jpg",
    name: "James Patel",
    title: "Data Analyst",
    quote: "The AI interviewer asked tough questions and gave me honest feedback. Highly recommend Prepkitty!",
  },
  {
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Emily Carter",
    title: "Accountant",
    quote: "Prepkitty made interview prep easy and effective. I got the job I wanted thanks to their platform.",
  },
  {
    image: "https://randomuser.me/api/portraits/women/55.jpg",
    name: "Jessica Miller",
    title: "UX Designer",
    quote: "The user interface is so intuitive and the AI is surprisingly smart. It's like having a personal interview coach.",
  },
  {
    image: "https://randomuser.me/api/portraits/men/20.jpg",
    name: "David Rodriguez",
    title: "Product Manager",
    quote: "A must-have for any professional looking to sharpen their interview skills. The progress tracking is a great feature.",
  }
];

export const Testimonials = () => {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isLg, setIsLg] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    setIsLg(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsLg(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, []);

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

  return (
    <section id="testimonials" className="px-6 py-20 bg-white max-w-7xl mx-auto overflow-hidden" data-aos="fade-up">
      <h2 className="text-5xl text-center font-extrabold text-gray-900 mb-4">Testimonials</h2>
      <p className="text-2xl text-center text-gray-500 font-normal mb-16">
        Here is what some users who have hopped on the <span className="text-blue-400 font-semibold">Prepkitty</span> train have to say.
      </p>

      <div className="relative flex items-center">
        <button 
          onClick={prevTestimonial}
          aria-label="Previous testimonial"
          className="z-10 p-2 text-gray-700 bg-white rounded-full shadow-md hover:bg-gray-100 absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 sm:translate-x-0 sm:static sm:mr-4"
        >
          <ChevronLeft size={24} />
        </button>

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
                <div className="p-6 h-full bg-white rounded-xl border border-gray-200">
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

        <button 
          onClick={nextTestimonial}
          aria-label="Next testimonial"
          className="z-10 p-2 text-gray-700 bg-white rounded-full shadow-md hover:bg-gray-100 absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 sm:translate-x-0 sm:static sm:ml-4"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};
