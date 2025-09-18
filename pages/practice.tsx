// TypeScript definitions for SpeechRecognition API (for browsers that support it)

// Minimal SpeechRecognition type for browser compatibility
interface SpeechRecognition extends EventTarget {
  start(): void;
  stop(): void;
  abort(): void;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventType) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
}
declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

type SpeechRecognitionEventType = Event & {
  results: SpeechRecognitionResultList;
};
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Settings, Plus, UserCircle, MessageSquare, HelpCircle, ArrowLeft, Loader2, ArrowUp } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface QuizData {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
}


interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  practiceProfile: {
    id: string;
    userId: string;
    jobTitle: string | null;
    jobDescription: string | null;
    employmentHistory: string | null;
    skills: string | null;
    additionalDetails: string | null;
  } | null;
}

const Sidebar = ({ setShowSidebar, user, onShowPricingModal }: { setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>, user: User, onShowPricingModal: () => void }) => {
  const [jobTitle, setJobTitle] = useState(user.practiceProfile?.jobTitle || "");
  const [jobDescription, setJobDescription] = useState(user.practiceProfile?.jobDescription || "");
  const [name, setName] = useState(user.name || "");
  const [employmentHistory, setEmploymentHistory] = useState(user.practiceProfile?.employmentHistory || "");
  const [skills, setSkills] = useState(user.practiceProfile?.skills || "");
  const [additionalDetails, setAdditionalDetails] = useState(user.practiceProfile?.additionalDetails || "");

  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateDetails = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          name,
          jobTitle,
          jobDescription,
          employmentHistory,
          skills,
          additionalDetails,
        }),
      });
      if (response.ok) {
        toast.success('Details updated successfully!');
      } else {
        toast.error('Failed to update details.');
      }
    } catch {
      toast.error('Network error.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-md p-6 rounded-2xl flex-shrink-0 w-full lg:w-96 space-y-8 h-full overflow-y-auto border border-gray-800 sidebar-scrollbar">
      <div className="lg:hidden flex justify-end mb-4">
        <button onClick={() => setShowSidebar(false)} className="p-2 rounded-full hover:bg-gray-800 transition-colors duration-200">
          <ArrowLeft size={24} />
        </button>
      </div>
      {/* Job Details Section */}
      <div className="space-y-4">
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Job title</label>
          <input
            type="text"
            className="w-full py-2 px-3 bg-gray-800 rounded-lg text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Job description</label>
          <textarea
            className="w-full py-2 px-3 bg-gray-800 rounded-lg text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent h-24"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          ></textarea>
        </div>
      </div>
      {/* Personal Details Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Personal details</h2>
          {/* Resume import button removed as unused */}
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Name</label>
            <input
              type="text"
              className="w-full py-2 px-3 bg-gray-800 rounded-lg text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Input your name here"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Employment history</label>
            <input
              type="text"
              className="w-full py-2 px-3 bg-gray-800 rounded-lg text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Input your name here"
              value={employmentHistory}
              onChange={(e) => setEmploymentHistory(e.target.value)}
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Skills</label>
            <input
              type="text"
              className="w-full py-2 px-3 bg-gray-800 rounded-lg text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Input your name here"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Additional candidate details</label>
            <input
              type="text"
              className="w-full py-2 px-3 bg-gray-800 rounded-lg text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Input your name here"
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
            />
          </div>
          <button
            className={`w-full mt-2 p-2 rounded-full bg-blue-600 hover:bg-blue-500 font-semibold text-white transition-colors duration-200 cursor-pointer flex items-center justify-center`}
            onClick={handleUpdateDetails}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <Loader2 className="animate-spin" size={20} />
            ) : 'Update Details'}
          </button>
        </div>
      </div>
      {/* Interview Settings Section */}
      <div className="pt-4">
        <h2 className="text-xl font-semibold mb-4">Interview settings</h2>
        <button
          className="w-full p-3 rounded-full bg-blue-600 hover:bg-blue-500 font-semibold text-white transition-colors duration-200"
          onClick={onShowPricingModal}
        >
          <span className="flex justify-center items-center">
            <Plus size={20} className="mr-2" /> Get unlimited interviews
          </span>
        </button>
      </div>
      {/* Pricing Modal removed from Sidebar, now handled at Practice page level */}
    </div>
  );
};

const MainContent = ({ setShowSidebar, user }: { setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>, user: User }) => {
  const [practiceMode, setPracticeMode] = useState('chat'); // 'chat' or 'quiz'
  const [difficulty] = useState('medium'); // 'easy', 'medium', 'hard'
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; parts: string }>>([]);
  // Clear history when switching modes
  useEffect(() => {
    setConversationHistory([]);
    setScore(0);
    setChatCompleted(false);
    setQuizCompleted(false);
    setCurrentQuestionNumber(0);
    setQuizData(null);
    setSelectedOption(null);
    stopSpeaking(); // Stop TTS when switching mode
  }, [practiceMode]);
  const [userResponse, setUserResponse] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [score, setScore] = useState(0);
  const [chatCompleted, setChatCompleted] = useState(false);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const parseQuizResponse = (responseText: string): QuizData | null => {
    const questionMatch = responseText.match(/Question: (.*)/);
    const optionAMatch = responseText.match(/A\) (.*)/);
    const optionBMatch = responseText.match(/B\) (.*)/);
    const optionCMatch = responseText.match(/C\) (.*)/);
    const optionDMatch = responseText.match(/D\) (.*)/);
    const answerMatch = responseText.match(/Answer: ([A-D])/);

    if (questionMatch && optionAMatch && optionBMatch && optionCMatch && optionDMatch && answerMatch) {
      return {
        question: questionMatch[1].trim(),
        options: {
          A: optionAMatch[1].trim(),
          B: optionBMatch[1].trim(),
          C: optionCMatch[1].trim(),
          D: optionDMatch[1].trim(),
        },
        correctAnswer: answerMatch[1].trim(),
      };
    }
    return null;
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [dropdownRef]);

  // Auto-scroll chat to bottom when new message is added in chat mode
  useEffect(() => {
    if (practiceMode === 'chat' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationHistory, practiceMode]);

  const handleLogout = () => {
    signOut();
  };

  const savePracticeResult = async (finalScore: number) => {
    try {
      const payload = {
        userId: user.id,
        mode: practiceMode,
        difficulty: difficulty,
        score: finalScore,
        totalQuestions: 10,
        jobTitle: user.practiceProfile?.jobTitle || '',
        jobDescription: user.practiceProfile?.jobDescription || '',
      };
  // Removed unused console.log
      const response = await fetch('/api/save-practice-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success('Practice result saved!');
  // Removed unused console.log
      } else {
        const errorData = await response.json();
        toast.error('Failed to save practice result.');
        console.error('Failed to save practice result:', errorData);
      }
    } catch (error) {
      toast.error('Error saving practice result.');
      console.error('Error saving practice result:', error);
    }
  };

  const startInterview = async () => {
    setIsGenerating(true);
    setConversationHistory([]); // Clear previous conversation
    setQuizData(null); // Clear previous quiz data
    setSelectedOption(null); // Clear previous selection
    setScore(0); // Reset score
    setCurrentQuestionNumber(0); // Reset question number
    setQuizCompleted(false); // Reset quiz completed status
    if (practiceMode === 'chat') {
      setChatCompleted(false); // Reset chat completed status
    }

    const payload = {
      jobTitle: user.practiceProfile?.jobTitle || '',
      jobDescription: user.practiceProfile?.jobDescription || '',
      skills: user.practiceProfile?.skills || '',
      employmentHistory: user.practiceProfile?.employmentHistory || '',
      additionalDetails: user.practiceProfile?.additionalDetails || '',
      mode: practiceMode,
      difficulty: difficulty,
      numberOfQuestions: 10,
      conversationHistory: [], // Start with empty history
    };

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        if (practiceMode === 'chat') {
          setConversationHistory([{ role: 'AI', parts: data.response }]);
        } else if (practiceMode === 'quiz') {
          const parsedQuiz = parseQuizResponse(data.response);
          if (parsedQuiz) {
            setQuizData(parsedQuiz);
          } else {
            console.error('Failed to parse quiz response:', data.response);
            // Handle error, maybe display a message to the user
          }
        }
      } else {
        const errorData = await response.json();
        console.error('Error from Gemini API:', errorData);
        // Display error to user
      }
    } catch (error) {
      console.error('Network error:', error);
      // Display error to user
    } finally {
      setIsGenerating(false);
    }
  };

  // Text-to-Speech for AI response
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const speak = (text: string) => {
    stopSpeaking();
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utter);
    }
  };

  // Speech-to-Text
  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.error('Speech recognition not supported in this browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (event: SpeechRecognitionEventType) => {
        const transcript = event.results[0][0].transcript;
        setUserResponse(transcript);
        setIsRecording(false);
      };
      recognitionRef.current.onerror = () => {
        setIsRecording(false);
      };
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
    setIsRecording(true);
    recognitionRef.current.start();
  };

  const sendUserResponse = async () => {
    if (!userResponse.trim() && practiceMode === 'chat') return;
    if (!selectedOption && practiceMode === 'quiz') return;

    setIsGenerating(true);
    let updatedHistory = [...conversationHistory];
    let currentResponse = '';

    if (practiceMode === 'chat') {
      updatedHistory = [...conversationHistory, { role: 'User', parts: userResponse }];
      currentResponse = userResponse;
      setUserResponse(''); // Clear input
      if (updatedHistory.filter(msg => msg.role === 'User').length >= 10) {
        setChatCompleted(true);
        savePracticeResult(score); // Save chat result to DB
        setIsGenerating(false);
        return;
      }

    } else if (practiceMode === 'quiz' && quizData && selectedOption) {
      if (selectedOption === quizData.correctAnswer) {
        setScore(prevScore => prevScore + 1);
      }

      updatedHistory = [
        ...conversationHistory,
        { role: 'AI', parts: quizData.question },
        { role: 'User', parts: `My answer: ${selectedOption}) ${quizData.options[selectedOption as keyof typeof quizData.options]}` },
      ];
      currentResponse = `My answer: ${selectedOption}) ${quizData.options[selectedOption as keyof typeof quizData.options]}`;
      setSelectedOption(null); // Clear selection
      // Do NOT clear quizData or increment question number here; wait for new data from API

      if (currentQuestionNumber + 1 >= 10) {
        setQuizCompleted(true);
        // Call savePracticeResult here or after the API response
      }
    }

    setConversationHistory(updatedHistory);

    const payload = {
      jobTitle: user.practiceProfile?.jobTitle || '',
      jobDescription: user.practiceProfile?.jobDescription || '',
      skills: user.practiceProfile?.skills || '',
      employmentHistory: user.practiceProfile?.employmentHistory || '',
      additionalDetails: user.practiceProfile?.additionalDetails || '',
      mode: practiceMode,
      difficulty: difficulty,
      numberOfQuestions: 10,
      conversationHistory: updatedHistory,
      userResponse: currentResponse, // Send user's current response/selection
    };

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        if (practiceMode === 'chat') {
          setConversationHistory(prev => {
            // Speak the AI response
            speak(data.response);
            return [...prev, { role: 'AI', parts: data.response }];
          });
          // Simple scoring: increment score if AI feedback is positive
          if (/\b(correct|good job|well done|excellent|right answer)\b/i.test(data.response)) {
            setScore(prevScore => prevScore + 1);
          }
          // Detect interview termination and end chat early
          if (/Next Question:\s*This interview is terminated due to the candidate's consistent lack of engagement and unprofessional responses\./i.test(data.response)
            || /The interview should be terminated\./i.test(data.response)) {
            setChatCompleted(true);
            savePracticeResult(score);
            setIsGenerating(false);
            return;
          }
        } else if (practiceMode === 'quiz') {
          if (currentQuestionNumber + 1 >= 10) { // Quiz is completed after this response
            setQuizCompleted(true);
            savePracticeResult(score); // Save the final score
          } else {
            const parsedQuiz = parseQuizResponse(data.response);
            if (parsedQuiz) {
              setQuizData(null); // Force re-render for next question
              setTimeout(() => {
                setQuizData(parsedQuiz);
                setCurrentQuestionNumber(prev => prev + 1);
              }, 0);
            } else {
              console.error('Failed to parse quiz response:', data.response);
              // Handle error
            }
          }
        }
      } else {
        const errorData = await response.json();
        console.error('Error from Gemini API:', errorData);
        // Display error to user
      }
    } catch (error) {
      console.error('Network error:', error);
      // Display error to user
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-950/50 backdrop-blur-md rounded-2xl p-8 flex flex-col h-full border border-gray-800 min-h-0">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="lg:hidden">
          <button onClick={() => setShowSidebar(true)} className="p-2 rounded-full hover:bg-gray-800 transition-colors duration-200">
            <Settings size={24} />
          </button>
        </div>
        <div className="relative flex items-center space-x-4 text-gray-400">
          <button 
            className="p-2 rounded-full cursor-pointer hover:bg-gray-800 transition-colors duration-200"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <UserCircle size={24} />
          </button>
          {isDropdownOpen && (
            <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10">
              <button 
                onClick={handleLogout}
                className="block px-4 py-2 cursor-pointer text-sm text-red-300 hover:bg-gray-700 w-full text-left"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mode Selection - moved up for more chat space */}
      <div className="flex justify-center mb-8">
        <button
          className={`px-6 py-2 rounded-l-full font-medium transition-colors duration-200 ${
            practiceMode === 'chat' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          onClick={() => setPracticeMode('chat')}
        >
          <MessageSquare size={18} className="inline-block mr-2" /> Chat Mode
        </button>
        <button
          className={`px-6 py-2 rounded-r-full font-medium transition-colors duration-200 ${
            practiceMode === 'quiz' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          onClick={() => setPracticeMode('quiz')}
        >
          <HelpCircle size={18} className="inline-block mr-2" /> Quiz Mode
        </button>
      </div>

  {/* Main Interview Area */}
  <div className="flex-1 flex flex-col text-center p-4 overflow-y-auto custom-scrollbar min-h-0 max-h-[calc(100vh-180px)] sm:max-h-[calc(100vh-120px)]">
        {practiceMode === 'chat' ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            {conversationHistory.length === 0 ? (
              <div className="p-6 bg-gray-800 rounded-xl max-w-sm text-gray-300 border border-gray-700">
                <p className="mb-2">The interview works best with headphones and a microphone.</p>
                <button
                  onClick={startInterview}
                  disabled={isGenerating}
                  className="mt-4 w-full p-3 rounded-full bg-blue-600 hover:bg-blue-500 font-semibold text-white transition-colors duration-200 flex items-center justify-center"
                >
                    {isGenerating ? <Loader2 className="animate-spin mr-2" size={20} /> : 'Begin Interview'}
                </button>
              </div>
            ) : chatCompleted ? (
              <div className="p-6 bg-gray-800 rounded-xl w-[300px] max-w-lg text-gray-300 border border-gray-700">
                <h3 className="text-xl font-semibold mb-4">Chat Completed!</h3>
                <p className="mb-2">You have completed 10 questions.</p>
                <p className="mb-2">Your score: {score} / 10</p>
                <button
                  onClick={startInterview}
                  className="mt-4 w-full p-3 rounded-full bg-blue-600 hover:bg-blue-500 cursor-pointer text-white transition-colors duration-200 flex items-center justify-center"
                >
                  Start New Chat
                </button>
              </div>
            ) : (
              <div className="w-full max-w-2xl p-4 space-y-4 text-left">
                {conversationHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={
                      msg.role === 'AI'
                        ? 'text-left text-orange-500 font-semibold mb-1'
                        : 'text-left text-purple-500 font-semibold mb-1'
                    }
                    style={{ background: 'none', marginLeft: 0, marginRight: 0 }}
                  >
                    <span>
                      {msg.role === 'AI' ? 'AI' : (user?.name || 'User')}
                    </span>
                    <span className="text-white font-normal ml-2">
                      {typeof msg.parts === 'string' ? (
                        (() => {
                          const text = msg.parts.replace(/\*/g, '');
                          // Blockify and color key feedback labels
                          const feedbackLabels = ['Feedback:', 'Evaluation:', 'Relevance:', 'Correctness:', 'Depth:', 'Next Question:'];
                          const blocks = [];
                          let remaining = text;
                          while (true) {
                            let minIdx = -1;
                            let label = '';
                            for (const l of feedbackLabels) {
                              const idx = remaining.indexOf(l);
                              if (idx !== -1 && (minIdx === -1 || idx < minIdx)) {
                                minIdx = idx;
                                label = l;
                              }
                            }
                            if (minIdx === -1) {
                              if (remaining.trim()) blocks.push(remaining);
                              break;
                            }
                            if (minIdx > 0) {
                              blocks.push(remaining.slice(0, minIdx));
                            }
                            // Find end of label block (next label or end)
                            let nextIdx = remaining.length;
                            for (const l of feedbackLabels) {
                              const idx = remaining.indexOf(l, minIdx + label.length);
                              if (idx !== -1 && idx < nextIdx) nextIdx = idx;
                            }
                            // Split label and feedback
                            const labelBlock = remaining.slice(minIdx, minIdx + label.length);
                            const feedbackBlock = remaining.slice(minIdx + label.length, nextIdx);
                            blocks.push(
                              <p className="my-1">
                                <span className="text-orange-500 font-semibold">{labelBlock.trim()}</span>
                                <span className="text-white font-normal">{feedbackBlock}</span>
                              </p>
                            );
                            remaining = remaining.slice(nextIdx);
                          }
                          return blocks;
                        })()
                      ) : msg.parts}
                    </span>
                  </div>
                ))}
                <div ref={chatEndRef} />
                {/* End Interview button removed: interview ends automatically after 10 questions */}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            {quizCompleted ? (
              <div className="p-6 bg-gray-800 rounded-xl w-[300px] max-w-lg text-gray-300 border border-gray-700">
                <h3 className="text-xl font-semibold mb-4">Quiz Completed!</h3>
                <p className="mb-2">Your score: {score} / 10</p>
                <button
                  onClick={startInterview}
                  className="mt-4 w-full p-3 rounded-full bg-blue-600 hover:bg-blue-500 cursor-pointer text-white transition-colors duration-200 flex items-center justify-center"
                >
                  Start New Quiz
                </button>
              </div>
            ) : quizData ? (
              <div className="relative w-full max-w-lg mx-auto overflow-y-auto custom-scrollbar">
                <div className="pt-6 pb-6 text-gray-300 text-left overflow-y-auto custom-scrollbar" >
                  <div className="mb-2">
                    <span className="block text-base font-semibold text-blue-400 bg-gray-800 rounded-md px-3 py-1 w-fit mb-2 shadow">Question {currentQuestionNumber + 1}/10:</span>
                    <span className="block text-lg text-white font-medium mb-4">{quizData.question}</span>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(quizData.options).map(([key, value]) => (
                      <label key={key} className={`flex items-center space-x-3 cursor-pointer rounded-lg p-3 transition border-2 ${selectedOption === key ? 'border-blue-500 bg-blue-950/60' : 'border-gray-700 bg-gray-800 hover:border-blue-400'}`}>
                        <input
                          type="radio"
                          name="quizOption"
                          value={key}
                          checked={selectedOption === key}
                          onChange={(e) => setSelectedOption(e.target.value)}
                          className="form-radio h-5 w-5 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500 accent-blue-600 transition"
                        />
                        <span className="text-lg font-medium text-white">{key}) {value}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Fixed send button for quiz mode */}
                <div className="fixed bottom-0 left-0 w-full flex justify-center z-30 pointer-events-none">
                  <div className="w-full max-w-2xl flex justify-end p-4 pointer-events-auto">
                    <button
                      onClick={sendUserResponse}
                      disabled={isGenerating || !selectedOption}
                      className="absolute right-10 bottom-2 px-3 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-white transition-colors duration-200 flex items-center justify-center shadow-lg"
                    >
                      {isGenerating ? <Loader2 className="animate-spin" size={22} /> : <ArrowUp size={22} />}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-gray-800 rounded-xl max-w-sm text-gray-300 border border-gray-700">
                <p className="mb-2">You are in Quiz Mode.</p>
                <p className="font-semibold">Prepare for a series of questions.</p>
                <button
                  onClick={startInterview}
                  disabled={isGenerating}
                  className="mt-4 w-full p-3 rounded-full bg-blue-600 hover:bg-blue-500 font-semibold text-white transition-colors duration-200 flex items-center justify-center"
                >
                   {isGenerating ? <Loader2 className="animate-spin" size={22} /> : 
                  "Start Quiz"
                    }
                </button>
              </div>
            )}
          </div>
        )}

        {/* Action Bar */}
            {(practiceMode === 'chat' && conversationHistory.length > 0 && !quizCompleted && !chatCompleted) && (
              <div className="mt-6 w-full flex justify-center">
                <div className="w-full max-w-2xl flex items-end gap-2 bg-transparent p-0" style={{ position: 'relative' }}>
                  <textarea
                    className="flex-1 p-3 bg-gray-800 rounded-lg text-white border border-gray-700 focus:outline-none  focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none h-28 pr-10 sidebar-scrollbar"
                    placeholder="Type your answer here..."
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    disabled={isGenerating}
                    style={{ minHeight: '4rem' }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (!isGenerating) sendUserResponse();
                      }
                    }}
                  ></textarea>
                  {/* Microphone Button */}
                  <button
                    onClick={handleMicClick}
                    disabled={isRecording || isGenerating}
                    className="absolute cursor-pointer right-12 bottom-2 px-2 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 font-semibold text-white transition-colors duration-200 flex items-center justify-center"
                    title={isRecording ? 'Recording...' : 'Record voice'}
                  >
                    {/* Record icon SVG, red when recording */}
                    <svg width="20" height="20" viewBox="0 0 20 20" fill={isRecording ? '#ef4444' : 'currentColor'} xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10" cy="10" r="7" fill={isRecording ? '#ef4444' : 'currentColor'} />
                    </svg>
                  </button>
                  {/* Send Button */}
                  <button
                    onClick={sendUserResponse}
                    disabled={isGenerating}
                    className="absolute cursor-pointer right-2 bottom-2 px-2.5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-white transition-colors duration-200 flex items-center justify-center"
                  >
                    {isGenerating ? <Loader2 className="animate-spin" size={15} /> : <ArrowUp size={15} />}
                  </button>
                </div>
              </div>
            )}
      </div>
    </div>
  );
};

export default function Practice() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const { status } = useSession();
  const { data, error } = useSWR(status === 'authenticated' ? '/api/user' : null, fetcher);
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth');
    } else if (status === 'authenticated' && data && !data.user?.practiceProfile) {
      router.replace('/auth');
    }
  }, [status, router, data]);

  if (status === 'loading' || !data || !data.user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  const { user } = data;

  return (
    <>
      <ToastContainer />
      <div className="font-sans bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6 h-screen flex flex-col lg:flex-row gap-6 relative">
        <div className={`lg:flex ${showSidebar ? 'flex' : 'hidden'} w-full lg:w-auto`}>
          <Sidebar setShowSidebar={setShowSidebar} user={user} onShowPricingModal={() => setShowPricingModal(true)} />
        </div>
        <div className={`lg:flex ${showSidebar ? 'hidden' : 'flex'} flex-1`}>
          <MainContent setShowSidebar={setShowSidebar} user={user} />
        </div>
        {showPricingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
            <div className="bg-gray-900 rounded-2xl shadow-lg p-8 max-w-md w-full relative mx-auto">
              <button
                className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-white text-2xl"
                onClick={() => setShowPricingModal(false)}
              >
                &times;
              </button>
              <h3 className="text-2xl font-semibold mb-2 text-center">Pro Plan</h3>
              <p className="text-gray-400 mb-4 text-center">Unlock full platform capabilities and unlimited interviews.</p>
              <p className="text-3xl font-bold mb-6 text-center">$19/mo</p>
              <button className="w-full px-6 py-3 bg-blue-600 rounded-full font-semibold text-lg mb-2 opacity-60 cursor-not-allowed" disabled>Upgrade Now</button>
              <div className="text-gray-400 text-sm text-center mt-2">Cancel anytime. 7-day money-back guarantee.</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}