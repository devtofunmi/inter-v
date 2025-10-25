
import { Mic, Brain, PenLine, TrendingUp, CheckCircle } from "lucide-react";

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

export const Features = () => {
  return (
    <section id="features" className="px-6 py-20 bg-white max-w-7xl mx-auto" data-aos="fade-up">
      <div className="text-center">
        <span className=" py-1 px-2 text-sm rounded-full mt-10 border border-gray-300 inline-block text-gray-700">
          Get the job you deserve!
        </span>
        <h2 className="text-4xl font-extrabold  text-gray-900">Practice makes perfect</h2>
        <p className="max-w-2xl mx-auto text-gray-600 ">
          Prepkitty is designed to be as simple and effective as possible. Here’s how it works:
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-12">
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
  );
};
