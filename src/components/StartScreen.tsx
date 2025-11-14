import { useState } from 'react';
import { QuizMode } from '../types';

interface StartScreenProps {
  onStart: (mode: QuizMode) => void;
}

function StartScreen({ onStart }: StartScreenProps) {
  const [selectedMode, setSelectedMode] = useState<QuizMode>('ja-to-ru');

  return (
    <div className="start-screen">
      <p>物理用語のロシア語クイズです。10問出題されます。</p>
      <div className="mode-selector">
        <label htmlFor="quiz-mode">出題モード:</label>
        <select
          id="quiz-mode"
          value={selectedMode}
          onChange={(e) => setSelectedMode(e.target.value as QuizMode)}
        >
          <option value="ja-to-ru">日本語 → ロシア語</option>
          <option value="ru-to-ja">ロシア語 → 日本語</option>
        </select>
      </div>
      <button onClick={() => onStart(selectedMode)} className="start-button">
        スタート
      </button>
    </div>
  );
}

export default StartScreen;
