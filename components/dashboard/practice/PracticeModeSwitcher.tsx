import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, HelpCircle } from 'lucide-react';

interface PracticeModeSwitcherProps {
  practiceMode: string;
  setPracticeMode: (mode: string) => void;
}

const PracticeModeSwitcher: React.FC<PracticeModeSwitcherProps> = ({ practiceMode, setPracticeMode }) => {
  const [activeTab, setActiveTab] = useState(practiceMode);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    setActiveTab(practiceMode);
  }, [practiceMode]);

  const tabs = useMemo(
    () => [
      { id: 'chat', name: 'Chat Mode', icon: MessageSquare },
      { id: 'quiz', name: 'Quiz Mode', icon: HelpCircle },
    ],
    []
  );

  return (
    <div className="flex justify-center mb-8">
      <div className="relative flex rounded-full border border-gray-200 p-1">
        {/* Sliding highlight */}
        {tabRefs.current[activeTab] && (
          <motion.div
            layout
            className="absolute bg-blue-400 rounded-full top-1 bottom-1 z-0"
            initial={false}
            animate={{
              left: tabRefs.current[activeTab]?.offsetLeft,
              width: tabRefs.current[activeTab]?.offsetWidth,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}

        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[tab.id] = el ?? null;
            }}
            className={`relative z-10 px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors duration-200 ${
              activeTab === tab.id ? 'text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setPracticeMode(tab.id)}
          >
            <tab.icon size={16} /> {tab.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PracticeModeSwitcher;