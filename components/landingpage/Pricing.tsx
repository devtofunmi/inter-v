import { useState } from "react";
import Link from "next/link";

export const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState(0);

  return (
    <section id="pricing" className="px-6 py-20 bg-gray-50" data-aos="fade-up">
      <h2 className="text-5xl font-extrabold text-center mb-12 text-gray-900">Pricing</h2>
      <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div 
          onClick={() => setSelectedPlan(0)}
          className={`p-8 bg-white rounded-xl  flex flex-col items-center cursor-pointer transition-all duration-300 ${selectedPlan === 0 ? 'border-2 border-blue-400 shadow-xl' : 'border border-gray-200'}`}
        >
          <h3 className="text-2xl font-bold mb-2 text-gray-900">Free Plan</h3>
          <p className="text-gray-600 mb-4 text-lg font-normal">Ideal for introductory practice sessions.</p>
          <p className="text-5xl font-extrabold mb-6 text-gray-900">$0</p>
          <Link href="/signup">
            <button className="px-6 py-3 bg-blue-400 cursor-pointer rounded-full hover:bg-blue-500 text-white font-semibold shadow-md transition-colors text-lg">
              Get Started
            </button>
          </Link>
        </div>
        <div 
          onClick={() => setSelectedPlan(1)}
          className={`p-8 bg-white rounded-xl flex flex-col items-center cursor-pointer transition-all duration-300 ${selectedPlan === 1 ? 'border-2 border-blue-400 shadow-xl' : 'border border-gray-200'}`}
        >
          <h3 className="text-2xl font-bold mb-2 text-gray-900">Pro Plan</h3>
          <p className="text-gray-600 mb-4 text-lg font-normal">Unlock full platform capabilities and unlimited interviews.</p>
          <p className="text-5xl font-extrabold mb-6 text-gray-900">$8/mo</p>
          <button className="px-6 py-3 cursor-not-allowed opacity-60 bg-blue-400 rounded-full text-white font-semibold shadow-md text-lg">
            Upgrade Now
          </button>
        </div>
      </div>
    </section>
  );
};