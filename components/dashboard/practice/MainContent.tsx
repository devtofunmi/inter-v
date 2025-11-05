import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import PracticeModeSwitcher from './PracticeModeSwitcher';
import ChatView from './ChatView';
import QuizView from './QuizView';
import ChatInput from './ChatInput';
import ActionResult from './ActionResult';
import ChatActionResult from './ChatActionResult';


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
  enableTTS?: boolean;
}

const MainContent: React.FC<MainContentProps> = ({ user, enableTTS = true }) => {
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
  const [chatSummary, setChatSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  // Local state for toggling AI voice inside the chat modal. Initialized from prop.
  const [enableTTSState, setEnableTTSState] = useState<boolean>(enableTTS);


  useEffect(() => {
    setConversationHistory([]);
    setScore(0);
    setChatCompleted(false);
    setQuizCompleted(false);
    setCurrentQuestionNumber(0);
    setQuizData(null);
    setSelectedOption(null);
    setWrongAnswers([]);
    setChatSummary('');
    if (enableTTSState) stopSpeaking(); // Stop TTS when switching mode (only if TTS enabled)
  }, [practiceMode, enableTTSState]);

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

  const getChatSummary = async (history: Array<{ role: string; parts: string }>) => {
    setIsSummarizing(true);
    try {
      const payload = {
        jobTitle: user.practiceProfile?.jobTitle || '',
        jobDescription: user.practiceProfile?.jobDescription || '',
        skills: user.practiceProfile?.skills || '',
        employmentHistory: user.practiceProfile?.employmentHistory || '',
        additionalDetails: user.practiceProfile?.additionalDetails || '',
        mode: 'summarize_chat',
        conversationHistory: history,
      };
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setChatSummary(data.response);
      } else {
        const errorData = await response.json();
        console.error('Failed to get chat summary:', errorData);
        toast.error('Failed to get chat summary.');
      }
    } catch {
      toast.error('Error getting chat summary.');
    } finally {
      setIsSummarizing(false);
      setChatCompleted(true);
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
    setChatSummary('');
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
          if (enableTTSState) speak(data.response);
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

  const speak = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      stopSpeaking();
      if ('speechSynthesis' in window && enableTTSState) {
        const utter = new window.SpeechSynthesisUtterance(text);
        utter.onend = () => resolve();
        utter.onerror = () => resolve(); // Resolve even on error
        window.speechSynthesis.speak(utter);
      } else {
        resolve(); // Resolve immediately if TTS is disabled or not available
      }
    });
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
      if (updatedHistory.filter(msg => msg.role === 'User').length >= 10) {
        const finalHistory = [...updatedHistory, { role: 'AI', parts: "The interview has now concluded. Thank you for your time." }];
        setConversationHistory(finalHistory);
        await speak("The interview has now concluded. Thank you for your time.");
        getChatSummary(finalHistory);
        setIsGenerating(false);
        savePracticeResult(score);
        return;
      }
    } else if (practiceMode === 'quiz' && quizData && selectedOption) {
      const isCorrect = selectedOption === quizData.correctAnswer;
      let finalScore = score;

      if (isCorrect) {
        finalScore = score + 1;
        setScore(finalScore);
      } else {
        setWrongAnswers(prev => [...prev, {
          question: quizData.question,
          yourAnswer: quizData.options[selectedOption as keyof typeof quizData.options],
          correctAnswer: quizData.options[quizData.correctAnswer as keyof typeof quizData.options],
          options: quizData.options,
        }]);
      }

      if (currentQuestionNumber + 1 === 10) {
        setQuizCompleted(true);
        setIsGenerating(false);
        savePracticeResult(finalScore);
        return;
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
          const finalHistory = [...updatedHistory, { role: 'AI', parts: data.response }];
          setConversationHistory(finalHistory);
          
          const endInterviewPhrases = [
            "interview has now concluded",
            "not interested in continuing",
            "end the interview"
          ];

          if (endInterviewPhrases.some(phrase => data.response.toLowerCase().includes(phrase))) {
            await speak(data.response);
            getChatSummary(finalHistory);
            savePracticeResult(score);
            setIsGenerating(false);
            return;
          } else {
            speak(data.response);
          }

          if (/\b(correct|good job|well done|excellent|right answer)\b/i.test(data.response)) {
            setScore(prevScore => prevScore + 1);
          }

        } else if (practiceMode === 'quiz') {
          if (currentQuestionNumber + 1 >= 10) {
            setQuizCompleted(true);
            savePracticeResult(score);
          } else {
            const parsedQuiz = parseQuizResponse(data.response);
            if (parsedQuiz) {
              setQuizData(null);
              setSelectedOption(null);
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
              <div className="p-8 bg-white rounded-xl max-w-md text-gray-800 border border-gray-200">
                <h2 className="text-2xl font-bold mb-2">Chat Mode</h2>
                  <p className="text-gray-600 mb-6">The interview works best with headphones and a microphone.</p>
                  <div className="flex items-center justify-center mb-4">
                    <label className="flex items-center cursor-pointer select-none">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={enableTTSState}
                          onChange={(e) => setEnableTTSState(e.target.checked)}
                          aria-label="Enable AI Voice"
                        />
                        <div className={`w-11 h-6 rounded-full shadow-inner transition-colors ${enableTTSState ? 'bg-blue-400' : 'bg-gray-300'}`} />
                        <div
                          className={`dot absolute left-0 top-0 bg-white w-6 h-6 rounded-full shadow transform transition-transform ${enableTTSState ? 'translate-x-5' : 'translate-x-0'}`}
                        />
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-700">Enable AI Voice</span>
                    </label>
                  </div>
                <div className="flex justify-center items-center">
                <button
                  onClick={startInterview}
                  disabled={isGenerating}
                  className="w-full max-w-[200px] p-3 rounded-full bg-blue-400 hover:bg-blue-500 font-semibold text-white transition-colors duration-200 flex items-center justify-center shadow-lg transform hover:scale-105 active:scale-100 disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="animate-spin mr-2" size={20} /> : 'Begin Interview'}
                </button>
                </div>
              </div>
            ) : chatCompleted ? (
              isSummarizing ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="animate-spin h-12 w-12 text-blue-400" />
                  <p className="mt-4 text-lg text-gray-600">Generating your performance review...</p>
                </div>
              ) : (
                <ChatActionResult
                  title="Interview Performance Review"
                  summary={chatSummary}
                  onStartNew={startInterview}
                  buttonText="Start New Chat"
                  isModal={false}
                />
              )
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
              <div className="p-8 bg-white rounded-xl max-w-md text-gray-800 border border-gray-200">
                <h2 className="text-2xl font-bold mb-2">Quiz Mode</h2>
                <p className="text-gray-600 mb-6">Prepare for a series of multiple-choice questions.</p>
                <div className="flex justify-center items-center">
                <button
                  onClick={startInterview}
                  disabled={isGenerating}
                  className="w-full max-w-[200px] p-3 rounded-full bg-blue-400 hover:bg-blue-500 font-semibold text-white transition-colors duration-200 flex items-center justify-center shadow-lg transform hover:scale-105 active:scale-100 disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={22} /> : 'Start Quiz'}
                </button>
                </div>
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