import { WrongAnswer } from '../types';
import { useSpeech } from '../hooks/useSpeech';

interface ResultScreenProps {
  correctCount: number;
  wrongAnswers: WrongAnswer[];
  onRestart: () => void;
}

function ResultScreen({ correctCount, wrongAnswers, onRestart }: ResultScreenProps) {
  const TOTAL_QUESTIONS = 10;
  const accuracy = Math.round((correctCount / TOTAL_QUESTIONS) * 100);
  const { speak } = useSpeech();

  return (
    <div className="result-screen">
      <h2>ゲーム終了</h2>

      <div className="score-container">
        <h3>結果</h3>
        <p className="score">
          正解数: <strong>{correctCount}</strong> / {TOTAL_QUESTIONS}
        </p>
        <p className="accuracy">正答率: {accuracy}%</p>
      </div>

      {wrongAnswers.length > 0 && (
        <div className="wrong-answers-container">
          <h3>間違えた問題</h3>
          <ul className="wrong-answers-list">
            {wrongAnswers.map((wrong, index) => (
              <li key={index} className="wrong-answer-item">
                <p className="question-text">問題: {wrong.question}</p>
                <p className="user-answer">あなたの回答: {wrong.userAnswer}</p>
                <div className="correct-info">
                  <p>日本語: {wrong.japanese}</p>
                  <p>
                    ロシア語: {wrong.russian}
                    <button
                      className="speaker-button speaker-button-inline"
                      onClick={() => speak(wrong.russian)}
                      title="音声を再生"
                    >
                      🔊
                    </button>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {wrongAnswers.length === 0 && (
        <div className="perfect-score">
          <p>全問正解おめでとうございます！</p>
        </div>
      )}

      <button onClick={onRestart} className="restart-button">
        もう一度プレイ
      </button>
    </div>
  );
}

export default ResultScreen;
