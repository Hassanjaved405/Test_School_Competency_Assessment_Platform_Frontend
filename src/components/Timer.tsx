import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { decrementTime, setTimerRunning } from '../store/slices/assessmentSlice';
import { FiClock } from 'react-icons/fi';

interface TimerProps {
  totalTime: number;
  onTimeUp: () => void;
  isRunning: boolean;
}

const Timer: React.FC<TimerProps> = ({ totalTime, onTimeUp, isRunning }) => {
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeLeft(totalTime);
  }, [totalTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          dispatch(decrementTime());
          
          if (newTime <= 0) {
            dispatch(setTimerRunning(false));
            onTimeUp();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      onTimeUp();
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft, dispatch, onTimeUp]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (): string => {
    const percentage = (timeLeft / totalTime) * 100;
    if (percentage <= 10) return 'text-red-600';
    if (percentage <= 25) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProgressColor = (): string => {
    const percentage = (timeLeft / totalTime) * 100;
    if (percentage <= 10) return 'bg-red-500';
    if (percentage <= 25) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <FiClock className={getTimerColor()} size={20} />
          <span className="text-sm font-medium text-gray-600">Time Remaining</span>
        </div>
        <div className={`text-2xl font-bold ${getTimerColor()}`}>
          {formatTime(timeLeft)}
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-1000 ${getProgressColor()}`}
          style={{ width: `${(timeLeft / totalTime) * 100}%` }}
        />
      </div>
      
      {timeLeft <= 60 && timeLeft > 0 && (
        <div className="mt-2 text-center text-red-600 text-sm font-medium animate-pulse">
          Warning: Less than 1 minute remaining!
        </div>
      )}
    </div>
  );
};

export default Timer;