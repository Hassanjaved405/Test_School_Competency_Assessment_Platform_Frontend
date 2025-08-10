import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Assessment, Question, Answer, AssessmentStep } from '../../types';

interface AssessmentState {
  currentAssessment: Assessment | null;
  currentQuestions: Question[];
  currentAnswers: Answer[];
  timeRemaining: number;
  isTimerRunning: boolean;
  currentStep: AssessmentStep | null;
}

const initialState: AssessmentState = {
  currentAssessment: null,
  currentQuestions: [],
  currentAnswers: [],
  timeRemaining: 0,
  isTimerRunning: false,
  currentStep: null,
};

const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    setCurrentAssessment: (state, action: PayloadAction<Assessment>) => {
      state.currentAssessment = action.payload;
      state.currentStep = action.payload.currentStep;
    },
    setCurrentQuestions: (state, action: PayloadAction<Question[]>) => {
      state.currentQuestions = action.payload;
      state.currentAnswers = action.payload.map(q => ({
        questionId: q._id,
        answer: '',
        timeSpent: 0,
      }));
      state.timeRemaining = action.payload.length * 60;
    },
    updateAnswer: (
      state,
      action: PayloadAction<{ questionId: string; answer: 'a' | 'b' | 'c' | 'd' }>
    ) => {
      const index = state.currentAnswers.findIndex(
        a => a.questionId === action.payload.questionId
      );
      if (index !== -1) {
        state.currentAnswers[index].answer = action.payload.answer;
      }
    },
    updateTimeSpent: (
      state,
      action: PayloadAction<{ questionId: string; timeSpent: number }>
    ) => {
      const index = state.currentAnswers.findIndex(
        a => a.questionId === action.payload.questionId
      );
      if (index !== -1) {
        state.currentAnswers[index].timeSpent = action.payload.timeSpent;
      }
    },
    setTimeRemaining: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload;
    },
    decrementTime: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1;
      }
    },
    setTimerRunning: (state, action: PayloadAction<boolean>) => {
      state.isTimerRunning = action.payload;
    },
    resetAssessment: (state) => {
      state.currentAssessment = null;
      state.currentQuestions = [];
      state.currentAnswers = [];
      state.timeRemaining = 0;
      state.isTimerRunning = false;
      state.currentStep = null;
    },
  },
});

export const {
  setCurrentAssessment,
  setCurrentQuestions,
  updateAnswer,
  updateTimeSpent,
  setTimeRemaining,
  decrementTime,
  setTimerRunning,
  resetAssessment,
} = assessmentSlice.actions;

export default assessmentSlice.reducer;