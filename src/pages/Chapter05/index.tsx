import React, { useCallback, useMemo, useState } from "react";

const bigString = Array(1000000)
  .fill(null)
  .map((item, index) => String(index))
  .join("");
const createBigArray = (): Record<string, any> =>
  Array(10000000).fill(bigString);

function complexCalc(): boolean {
  const start = Date.now();
  console.log("====run complexCalc====");
  while (Date.now() - start < 300) {
    // xxx
  }
  return true;
}

const Test: React.FC<{ count: number; index: number }> = ({ count, index }) => {
  // console.log("====render====", index);
  // !1
  // const obj = createBigArray();
  return <div>{count}</div>;
};

const Test2: React.FC<{ onClick: () => void }> = React.memo(({ onClick }) => {
  console.log('====render test2====');
  complexCalc();
  return <button onClick={onClick}>test - complex child component</button>;
});

const shouldShowWorld = (name: string): boolean => {
  complexCalc();
  return name === "hello";
};

const Chapter05: React.FC = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("hello");
  const [password, setPassword] = useState("password");
  // !2
  // const showWorld = shouldShowWorld(name);

  // !3
  const testCallback = useCallback(
    (() => {
      // console.log("====create function====");
      return (): void => {
        console.log("====real function====");
      };
    })(),
    []
  );

  // !3-2
  const testCallback2 = useCallback((): void => {
    console.log("====name====", name);
  }, [name]);

  return (
    <div>
      <button
        onClick={(): void => {
          setCount((p) => p + 1);
        }}
      >
        +1
      </button>
      <div>
        {Array(10)
          .fill(null)
          .map((item, index) => (
            <Test key={index} count={count} index={index}></Test>
          ))}
      </div>
      <div>
        name:
        <input
          type="text"
          value={name}
          onChange={(e): void => {
            setName(e.target.value);
          }}
        />
      </div>
      <div>
        password:
        <input
          type="text"
          value={password}
          onChange={(e): void => {
            setPassword(e.target.value);
          }}
        />
      </div>
      {/* {showWorld && <div>world - {count}</div>} */}
      
      <div>
        <button
          onClick={(): void => {
            testCallback();
          }}
        >
          call function
        </button>
      </div>
      <Test2 onClick={testCallback2}></Test2>
    </div>
  );
};

export default Chapter05;
