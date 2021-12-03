import React, { useState } from "react";

const Chapter03: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <div>
        <button
          onClick={(): void => {
            setCount((p) => p + 1);
          }}
        >
          +1
        </button>
      </div>
      <div>{count}</div>
    </div>
  );
};

export default Chapter03;
