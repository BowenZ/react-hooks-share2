import React, { useEffect } from "react";
import ReactDOM from "react-dom";



function render(): void {
  ReactDOM.render(<Test />, document.getElementById("chapter04"));
}

let state: any;

function useState<T>(initialState: T) {
  state = state || initialState;

  function setState(newState: T) {
    state = newState;
    render();
  }

  return [state, setState];
}

const Test: React.FC = () => {
  const [count, setCount] = useState<number>(1);
  return (
    <div>
      <div>test - {count}</div>
      <div>
        <button
          onClick={(): void => {
            setCount(count + 1);
          }}
        >
          +1
        </button>
      </div>
    </div>
  );
};

const Chapter04: React.FC = () => {
  useEffect(() => {
    render();
  }, []);
  return <div>
    <h1>实现简单的useState</h1>
    <div id="chapter04"></div>
  </div>;
};

export default Chapter04;
