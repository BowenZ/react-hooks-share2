import React, { useState } from 'react';
import './App.css';
import Chapter01 from './pages/Chapter01';
import Chapter02 from './pages/Chapter02';

const chapters = [Chapter01, Chapter02];

function App() {
  console.log('====render====');
  const [currentChapter, setCurrentChapter] = useState(0);
  const Chapter = chapters[currentChapter];
  return (
    <div className="App">
      <aside>
        <ol>
          {chapters.map((item, index) => (
            <li
              key={item.name}
              className={`nav-item ${index === currentChapter ? 'active' : ''}`}
              onClick={(): void => {
                setCurrentChapter(index);
              }}
            >
              Chapter0{index + 1}
            </li>
          ))}
        </ol>
      </aside>
      <main>
        <Chapter></Chapter>
      </main>
    </div>
  );
}

export default App;
