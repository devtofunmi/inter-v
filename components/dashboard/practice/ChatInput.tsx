import React, { useState, useEffect } from 'react';
import { Loader2, ArrowUp } from 'lucide-react';

interface ChatInputProps {
  userResponse: string;
  setUserResponse: (response: string) => void;
  isGenerating: boolean;
  isRecording: boolean;
  handleMicClick: () => void;
  sendUserResponse: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ userResponse, setUserResponse, isGenerating, isRecording, handleMicClick, sendUserResponse }) => {
  const [micPermission, setMicPermission] = useState<PermissionState | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    navigator.permissions.query({ name: 'microphone' as PermissionName }).then((permissionStatus) => {
      setMicPermission(permissionStatus.state);
      permissionStatus.onchange = () => {
        setMicPermission(permissionStatus.state);
      };
    });
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const handleMicWithPermissionCheck = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicError("Microphone not detected in this browser.");
      return;
    }

    if (micPermission === 'denied') {
      setMicError("Microphone access denied. Please enable it in your browser settings.");
      return;
    }

    if (micPermission === 'prompt') {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch {
        setMicError("Microphone access denied. Please enable it in your browser settings.");
        return;
      }
    }
    
    handleMicClick();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full flex justify-center px-4 lg:left-64 lg:w-[calc(100%-16rem)]">
      <div className="w-full max-w-2xl mx-auto flex items-center gap-2 relative bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
        {micError && <div className="absolute -top-12 text-red-500 text-sm">{micError}</div>}
        <textarea
          className="flex-1 p-2 bg-transparent rounded-lg text-gray-800 focus:outline-none resize-none custom-scrollbar"
          placeholder="Type your answer here... or use the microphone to speak."
          value={userResponse}
          onChange={(e) => setUserResponse(e.target.value)}
          disabled={isGenerating}
          rows={2}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (!isGenerating) sendUserResponse();
            }
          }}
        />
        <div className="flex items-center">
          {isRecording && <div className="text-sm text-red-500 w-20">{`${Math.floor(recordingTime / 60).toString().padStart(2, '0')}:${(recordingTime % 60).toString().padStart(2, '0')}`}</div>}
          <button
            onClick={handleMicWithPermissionCheck}
            disabled={isRecording || isGenerating}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200 disabled:opacity-50"
            title={isRecording ? 'Recording...' : 'Record voice'}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={isRecording ? 'text-red-500' : ''}>
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="currentColor"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2h2v2a5 5 0 0 0 10 0v-2h2z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        <button
          onClick={sendUserResponse}
          disabled={isGenerating || !userResponse.trim()}
          className="p-3 rounded-full bg-blue-400 hover:bg-blue-500 text-white transition-colors duration-200 flex items-center justify-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-100"
        >
          {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <ArrowUp size={20} />}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;