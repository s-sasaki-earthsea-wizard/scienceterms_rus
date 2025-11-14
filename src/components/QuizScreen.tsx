import { useState, useEffect } from 'react';
import { QuizMode, PhysicsTerm, WrongAnswer } from '../types';
import physicsTermsData from '../physicsTerms.json';
import { useSpeech } from '../hooks/useSpeech';

interface QuizScreenProps {
  mode: QuizMode;
  onGameEnd: (correctCount: number, wrongAnswers: WrongAnswer[]) => void;
}

type AnswerState = 'unanswered' | 'correct' | 'incorrect';

function QuizScreen({ mode, onGameEnd }: QuizScreenProps) {
  const [questionNumber, setQuestionNumber] = useState(0);
  const [currentTerm, setCurrentTerm] = useState<PhysicsTerm | null>(null);
  const [usedTerms, setUsedTerms] = useState<Set<number>>(new Set());
  const [userAnswer, setUserAnswer] = useState('');
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const { speak } = useSpeech();

  const TOTAL_QUESTIONS = 10;

  // 新しい問題を選択する関数
  const selectNewTerm = () => {
    const availableIndices = physicsTermsData
      .map((_, index) => index)
      .filter((index) => !usedTerms.has(index));

    if (availableIndices.length === 0) {
      return null;
    }

    const randomIndex =
      availableIndices[Math.floor(Math.random() * availableIndices.length)];
    return { term: physicsTermsData[randomIndex], index: randomIndex };
  };

  // ゲーム開始時に最初の問題を選択
  useEffect(() => {
    const result = selectNewTerm();
    if (result) {
      setCurrentTerm(result.term);
      setUsedTerms(new Set([result.index]));
    }
  }, []);

  // 回答をチェックする関数
  const checkAnswer = () => {
    if (!currentTerm || userAnswer.trim() === '') return;

    const correctAnswer =
      mode === 'ja-to-ru' ? currentTerm.russian : currentTerm.japanese;

    // 大文字小文字を区別せずに比較
    const isCorrect =
      userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();

    setAnswerState(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      setCorrectCount(correctCount + 1);
    } else {
      setWrongAnswers([
        ...wrongAnswers,
        {
          question: mode === 'ja-to-ru' ? currentTerm.japanese : currentTerm.russian,
          userAnswer: userAnswer.trim(),
          correctAnswer,
          japanese: currentTerm.japanese,
          russian: currentTerm.russian,
        },
      ]);
    }
  };

  // 次の問題へ進む関数
  const handleNext = () => {
    const nextQuestionNumber = questionNumber + 1;

    if (nextQuestionNumber >= TOTAL_QUESTIONS) {
      // ゲーム終了
      const finalCorrectCount = answerState === 'correct' ? correctCount : correctCount;
      onGameEnd(finalCorrectCount, wrongAnswers);
      return;
    }

    // 次の問題を選択
    const result = selectNewTerm();
    if (result) {
      setCurrentTerm(result.term);
      setUsedTerms(new Set([...usedTerms, result.index]));
      setQuestionNumber(nextQuestionNumber);
      setUserAnswer('');
      setAnswerState('unanswered');
    }
  };

  if (!currentTerm) {
    return <div>問題を読み込んでいます...</div>;
  }

  const questionText =
    mode === 'ja-to-ru' ? currentTerm.japanese : currentTerm.russian;

  return (
    <div className="quiz-screen">
      <div className="quiz-header">
        <p>問題 {questionNumber + 1} / {TOTAL_QUESTIONS}</p>
        <p>正解数: {correctCount}</p>
      </div>

      <div className="question-container">
        <h2>{questionText}</h2>
        {mode === 'ru-to-ja' && (
          <button
            className="speaker-button"
            onClick={() => speak(currentTerm.russian)}
            title="音声を再生"
          >
            🔊
          </button>
        )}
      </div>

      {answerState === 'unanswered' ? (
        <div className="answer-input">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                checkAnswer();
              }
            }}
            placeholder="答えを入力してください"
            autoFocus
          />
          <button onClick={checkAnswer} disabled={userAnswer.trim() === ''}>
            回答
          </button>
        </div>
      ) : (
        <div className={`answer-result ${answerState}`}>
          {answerState === 'correct' ? (
            <div className="correct-effect">
              <h3>正解！</h3>
            </div>
          ) : (
            <div className="incorrect-effect">
              <h3>不正解</h3>
              <p>あなたの回答: {userAnswer}</p>
            </div>
          )}
          <div className="term-display">
            <p>日本語: {currentTerm.japanese}</p>
            <p>
              ロシア語: {currentTerm.russian}
              <button
                className="speaker-button speaker-button-inline"
                onClick={() => speak(currentTerm.russian)}
                title="音声を再生"
              >
                🔊
              </button>
            </p>
          </div>
          <button onClick={handleNext} className="next-button">
            {questionNumber + 1 >= TOTAL_QUESTIONS ? '結果を見る' : '次へ'}
          </button>
        </div>
      )}
    </div>
  );
}

export default QuizScreen;
