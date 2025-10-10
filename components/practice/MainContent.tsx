
import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import PracticeModeSwitcher from './PracticeModeSwitcher';
import ChatView from './ChatView';
import QuizView from './QuizView';
import ChatInput from './ChatInput';
import ActionResult from './ActionResult';

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

interface WrongAnswer {
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}


interface User {
  id: string;
  name: string | null;
  practiceProfile: {
    jobTitle: string | null;
    jobDescription: string | null;
    employmentHistory: string | null;
    skills: string | null;
    additionalDetails: string | null;
  } | null;
}

interface MainContentProps {
  user: User;
}

const MainContent: React.FC<MainContentProps> = ({ user }) => {
  const [practiceMode, setPracticeMode] = useState('chat'); // 'chat' or 'quiz'
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; parts: string }>>([]);
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
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);


  useEffect(() => {
    setConversationHistory([]);
    setScore(0);
    setChatCompleted(false);
    setQuizCompleted(false);
    setCurrentQuestionNumber(0);
    setQuizData(null);
    setSelectedOption(null);
    setWrongAnswers([]);
    stopSpeaking(); // Stop TTS when switching mode
  }, [practiceMode]);

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

  const savePracticeResult = async (finalScore: number) => {
    try {
      const payload = {
        userId: user.id,
        mode: practiceMode,
        score: finalScore,
        totalQuestions: 10,
        jobTitle: user.practiceProfile?.jobTitle || '',
        jobDescription: user.practiceProfile?.jobDescription || '',
      };
      const response = await fetch('/api/save-practice-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success('Practice result saved!');
      } else {
        toast.error('Failed to save practice result.');
      }
    } catch {
      toast.error('Error saving practice result.');
    }
  };

  const startInterview = async () => {
    setIsGenerating(true);
    setConversationHistory([]);
    setQuizData(null);
    setSelectedOption(null);
    setScore(0);
    setCurrentQuestionNumber(0);
    setQuizCompleted(false);
    setWrongAnswers([]);
    if (practiceMode === 'chat') {
      setChatCompleted(false);
    }

    const payload = {
      jobTitle: user.practiceProfile?.jobTitle || '',
      jobDescription: user.practiceProfile?.jobDescription || '',
      skills: user.practiceProfile?.skills || '',
      employmentHistory: user.practiceProfile?.employmentHistory || '',
      additionalDetails: user.practiceProfile?.additionalDetails || '',
      mode: practiceMode,
      numberOfQuestions: 10,
      conversationHistory: [],
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
          speak(data.response);
        } else if (practiceMode === 'quiz') {
          const parsedQuiz = parseQuizResponse(data.response);
          if (parsedQuiz) {
            setQuizData(parsedQuiz);
          } else {
            console.error('Failed to parse quiz response:', data.response);
          }
        }
      } else {
        const errorData = await response.json();
        console.error('Error from Gemini API:', errorData);
      }
    } catch (err) {
      console.error('Network error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

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
      setUserResponse('');
      if (updatedHistory.filter(msg => msg.role === 'User').length === 10) {
        setConversationHistory(updatedHistory);
        setChatCompleted(true);
        setIsGenerating(false);
        setTimeout(() => {
          savePracticeResult(score);
        }, 500);
        return;
      }
    } else if (practiceMode === 'quiz' && quizData && selectedOption) {
      if (selectedOption !== quizData.correctAnswer) {
        setWrongAnswers(prev => [...prev, {
          question: quizData.question,
          yourAnswer: quizData.options[selectedOption as keyof typeof quizData.options],
          correctAnswer: quizData.options[quizData.correctAnswer as keyof typeof quizData.options],
          options: quizData.options,
        }]);
      }
      updatedHistory = [
        ...conversationHistory,
        { role: 'AI', parts: quizData.question },
        { role: 'User', parts: `My answer: ${selectedOption}) ${quizData.options[selectedOption as keyof typeof quizData.options]}` },
      ];
      currentResponse = `My answer: ${selectedOption}) ${quizData.options[selectedOption as keyof typeof quizData.options]}`;
      setSelectedOption(null);
      setConversationHistory(updatedHistory);
      if (currentQuestionNumber + 1 === 10) {
        setQuizCompleted(true);
        setIsGenerating(false);
        setTimeout(() => {
          savePracticeResult(selectedOption === quizData.correctAnswer ? score + 1 : score);
        }, 500);
        return;
      }
      if (selectedOption === quizData.correctAnswer) {
        setScore(prevScore => prevScore + 1);
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
      numberOfQuestions: 10,
      conversationHistory: updatedHistory,
      userResponse: currentResponse,
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
            speak(data.response);
            return [...prev, { role: 'AI', parts: data.response }];
          });
          if (/\b(correct|good job|well done|excellent|right answer)\b/i.test(data.response)) {
            setScore(prevScore => prevScore + 1);
          }
          if (/Next Question:\s*This interview is terminated due to the candidate's consistent lack of engagement and unprofessional responses\./i.test(data.response)
            || /The interview should be terminated\./i.test(data.response)) {
            setChatCompleted(true);
            savePracticeResult(score);
            setIsGenerating(false);
            return;
          }
        } else if (practiceMode === 'quiz') {
          if (currentQuestionNumber + 1 >= 10) {
            setQuizCompleted(true);
            savePracticeResult(score);
          } else {
            const parsedQuiz = parseQuizResponse(data.response);
            if (parsedQuiz) {
              setQuizData(null);
              setTimeout(() => {
                setQuizData(parsedQuiz);
                setCurrentQuestionNumber(prev => prev + 1);
              }, 0);
            } else {
              console.error('Failed to parse quiz response:', data.response);
            }
          }
        }
      } else {
        const errorData = await response.json();
        console.error('Error from Gemini API:', errorData);
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full  min-h-0 relative">
      

      <PracticeModeSwitcher practiceMode={practiceMode} setPracticeMode={setPracticeMode} />

      <div className="flex-1 flex flex-col items-center text-center p-4 overflow-y-auto custom-scrollbar pb-40 ">
        {practiceMode === 'chat' ? (
          <div className="flex-1 flex flex-col items-center w-full  pt-8">
            {conversationHistory.length === 0 ? (
              <div className="p-8 bg-white rounded-xl max-w-md text-gray-800 border border-gray-200 shadow-md">
                <h2 className="text-2xl font-bold mb-2">Chat Mode</h2>
                <p className="text-gray-600 mb-6">The interview works best with headphones and a microphone.</p>
                <button
                  onClick={startInterview}
                  disabled={isGenerating}
                  className="w-full p-3 rounded-full bg-emerald-600 hover:bg-emerald-700 font-semibold text-white transition-colors duration-200 flex items-center justify-center shadow-lg transform hover:scale-105 active:scale-100 disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="animate-spin mr-2" size={20} /> : 'Begin Interview'}
                </button>
              </div>
            ) : chatCompleted ? (
              <ActionResult
                title="Chat Completed!"
                score={score}
                total={10}
                onStartNew={startInterview}
                buttonText="Start New Chat"
              />
            ) : (
              <ChatView conversationHistory={conversationHistory} />
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center w-full pt-8">
            {quizCompleted ? (
              <ActionResult
                title="Quiz Completed!"
                score={score}
                total={10}
                onStartNew={startInterview}
                buttonText="Start New Quiz"
                wrongAnswers={wrongAnswers}
                isModal={false}
              />
            ) : quizData ? (
              <QuizView
                quizData={quizData}
                currentQuestionNumber={currentQuestionNumber}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                sendUserResponse={sendUserResponse}
                isGenerating={isGenerating}
              />
            ) : (
              <div className="p-8 bg-white rounded-xl max-w-md text-gray-800 border border-gray-200 shadow-md">
                <h2 className="text-2xl font-bold mb-2">Quiz Mode</h2>
                <p className="text-gray-600 mb-6">Prepare for a series of multiple-choice questions.</p>
                <button
                  onClick={startInterview}
                  disabled={isGenerating}
                  className="w-full p-3 rounded-full bg-emerald-600 hover:bg-emerald-700 font-semibold text-white transition-colors duration-200 flex items-center justify-center shadow-lg transform hover:scale-105 active:scale-100 disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={22} /> : 'Start Quiz'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {(practiceMode === 'chat' && conversationHistory.length > 0 && !quizCompleted && !chatCompleted) && (
        <ChatInput
          userResponse={userResponse}
          setUserResponse={setUserResponse}
          isGenerating={isGenerating}
          isRecording={isRecording}
          handleMicClick={handleMicClick}
          sendUserResponse={sendUserResponse}
        />
      )}
    </div>
  );
};

export default MainContent;
