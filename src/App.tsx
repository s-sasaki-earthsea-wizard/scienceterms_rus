import { useState } from 'react';
import './App.css';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import { GameState, QuizMode, WrongAnswer } from './types';

function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [quizMode, setQuizMode] = useState<QuizMode>('ja-to-ru');
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);

  const handleStartGame = (mode: QuizMode) => {
    setQuizMode(mode);
    setCorrectCount(0);
    setWrongAnswers([]);
    setGameState('quiz');
  };

  const handleGameEnd = (correct: number, wrong: WrongAnswer[]) => {
    setCorrectCount(correct);
    setWrongAnswers(wrong);
    setGameState('result');
  };

  const handleRestart = () => {
    setGameState('start');
  };

  return (
    <div className="App">
      <h1>物理用語 ロシア語クイズ</h1>
      {gameState === 'start' && <StartScreen onStart={handleStartGame} />}
      {gameState === 'quiz' && (
        <QuizScreen mode={quizMode} onGameEnd={handleGameEnd} />
      )}
      {gameState === 'result' && (
        <ResultScreen
          correctCount={correctCount}
          wrongAnswers={wrongAnswers}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;
