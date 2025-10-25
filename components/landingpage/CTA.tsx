
import Link from "next/link";

export const CTA = () => {
  return (
    <section id="cta" className="px-6 py-20 bg-gray-100 text-center" data-aos="fade-up">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl font-extrabold mb-4 text-gray-900">Ready to Master Your Next Interview?</h2>
        <p className="text-xl text-gray-600 mb-8 font-normal">
          Join thousands of professionals who have aced their interviews with Prepkitty.
        </p>
        <Link href="/auth">
          <button className="px-8 py-4 rounded-full bg-blue-400 hover:bg-blue-500 text-white text-xl font-bold shadow-xl transition-all duration-300 transform hover:scale-105">
            Start Your Free Session →
          </button>
        </Link>
      </div>
    </section>
  );
};
