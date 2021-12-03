import React, { useState, useEffect } from "react";
import "./App.css";
import Chapter01 from "./pages/Chapter01";
import Chapter02 from "./pages/Chapter02";
import Chapter03 from "./pages/Chapter03";
import Chapter04 from "./pages/Chapter04";
import Chapter05 from "./pages/Chapter05";

const chapters = [Chapter01, Chapter02, Chapter03, Chapter04, Chapter05];

function App() {
  console.log("====render====");
  const [currentChapter, setCurrentChapter] = useState(
    Number(sessionStorage.getItem("index")) || 0
  );
  const Chapter = chapters[currentChapter];

  useEffect(() => {
    sessionStorage.setItem("index", String(currentChapter));
  }, [currentChapter]);

  return (
    <div className="App">
      <aside>
        <ol>
          {chapters.map((item, index) => (
            <li
              key={item.name}
              className={`nav-item ${index === currentChapter ? "active" : ""}`}
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

const App2: React.FC = () => {
  console.log('====render App2====');
  const [name1, setName1] = useState('hello')
  const [name2, setName2] = useState('world')
  return (
    <div>
      <input type="text" value={name1} onChange={(e):void => {
        setName1(e.target.value)
      }} />
      <input type="text" value={name2} onChange={(e):void => {
        setName2(e.target.value)
      }} />
    </div>
  );
};

export default App;
