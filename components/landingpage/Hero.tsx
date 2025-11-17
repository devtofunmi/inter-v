
import Link from "next/link";
import Image from "next/image";
import { CheckCircle } from "lucide-react";

export const Hero = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between gap-12 px-6 pt-24 pb-10 bg-white max-w-7xl mx-auto" data-aos="fade-up">
      <div className="text-center md:text-left md:w-1/2">
        <span className="inline-flex items-center px-4 py-1 mb-6 md:text-base text-sm rounded-full border border-blue-200 bg-blue-50 text-blue-400 font-semibold">
          Career management & job readiness
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-gray-900">
          Get job-ready with realistic <span className="text-blue-400">AI mock interviews.</span>
        </h1>
        <p className="max-w-xl text-gray-600 mb-8 md:text-xl text-lg mx-auto md:mx-0 font-normal">
          PrepKitty helps you practice for your next job interview with an AI-powered mock interview platform. Get instant feedback and improve your skills.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center md:justify-start mb-10">
          <Link href="/signup">
            <button className="px-8 py-4 w-full sm:w-auto cursor-pointer rounded-full bg-blue-400 hover:bg-blue-500 text-white text-xl font-bold shadow-xl transition-all duration-300 transform hover:scale-105">
              Begin Your Session →
            </button>
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 text-gray-500 text-base justify-center md:justify-start">
          {/* <span className="flex items-center justify-center md:justify-start font-medium">
            <CheckCircle size={16} className="text-blue-400 mr-2"/> Trusted by 10,000+ Users
          </span> */}
          <span className="flex items-center justify-center md:justify-start font-medium">
            <CheckCircle size={16} className="text-blue-400 mr-2"/> Advanced Model
          </span>
        </div>
      </div>
      <div className="w-full md:w-1/2 mt-12 md:mt-0 flex justify-center">
        <Image 
          src={"/hero.jpg"} 
          alt="AI Interview Practice App Interface" 
          width={500} 
          height={500} 
          className="rounded-xl  border border-gray-100"
          unoptimized 
        />
      </div>
    </section>
  );
};
