export interface PhysicsTerm {
  japanese: string;
  russian: string;
}

export type QuizMode = 'ja-to-ru' | 'ru-to-ja';

export type GameState = 'start' | 'quiz' | 'result';

export interface QuizQuestion {
  term: PhysicsTerm;
  questionText: string;
  correctAnswer: string;
}

export interface WrongAnswer {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  japanese: string;
  russian: string;
}
