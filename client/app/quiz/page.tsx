'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { QUESTIONS, calculateArchetype } from '@/lib/scoring';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function QuizPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;
  const currentQuestion = QUESTIONS[currentStep];

  useEffect(() => {
    // Start quiz attempt on load
    const startQuiz = async () => {
      try {
        const res = await axios.post(`${API_URL}/quiz/start`);
        setAttemptId(res.data.id);
      } catch (error) {
        console.error('Failed to start quiz', error);
      }
    };
    startQuiz();
  }, []);

  const handleResponse = (value: number) => {
    setResponses({ ...responses, [currentQuestion.id]: value });
    
    // Auto-advance after a short delay
    setTimeout(() => {
      if (currentStep < QUESTIONS.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }, 300);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(responses).length < QUESTIONS.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Save all responses first (in a real app, we might save one by one)
      for (const [qId, val] of Object.entries(responses)) {
        await axios.post(`${API_URL}/quiz/response`, {
          attemptId,
          questionId: parseInt(qId),
          value: val,
        });
      }

      const res = await axios.post(`${API_URL}/quiz/complete`, { attemptId });
      const { result } = res.data;
      
      // Store result in local storage or state for results page
      localStorage.setItem('lastQuizResult', JSON.stringify(result));
      router.push('/results');
    } catch (error) {
      console.error('Failed to submit quiz', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Progress Bar */}
        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
          <motion.div 
            className="bg-white h-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between text-sm text-zinc-400">
          <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 py-12"
          >
            <h2 className="text-3xl font-bold text-center leading-tight">
              {currentQuestion.text}
            </h2>

            {/* Likert Scale */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
              <span className="text-sm text-zinc-500 hidden md:block">Strongly Disagree</span>
              <div className="flex justify-between w-full max-w-md gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleResponse(val)}
                    className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center text-lg font-bold
                      ${responses[currentQuestion.id] === val 
                        ? 'bg-white text-black border-white scale-110' 
                        : 'border-zinc-700 hover:border-zinc-400'}`}
                  >
                    {val}
                  </button>
                ))}
              </div>
              <span className="text-sm text-zinc-500 hidden md:block">Strongly Agree</span>
            </div>
            
            <div className="flex justify-between md:hidden text-xs text-zinc-500 px-4">
              <span>Strongly Disagree</span>
              <span>Strongly Agree</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between pt-8 border-t border-zinc-800">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2 text-zinc-400 hover:text-white disabled:opacity-0 transition-opacity"
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          {currentStep === QUESTIONS.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || Object.keys(responses).length < QUESTIONS.length}
              className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="animate-spin" size={20} />}
              See Results
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!responses[currentQuestion.id]}
              className="flex items-center gap-2 text-zinc-400 hover:text-white disabled:opacity-30 transition-opacity"
            >
              Next
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

