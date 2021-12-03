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

const Test1Children: React.FC<{ count: number; index: number }> = ({
  count,
  index,
}) => {
  console.log("====render====", index);
  // !1
  const obj = createBigArray();
  return <div>{count}</div>;
};

const Test1: React.FC = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button
        onClick={(): void => {
          setCount((p) => p + 1);
        }}
      >
        {count}+1
      </button>
      {Array(10)
        .fill(null)
        .map((item, index) => (
          <Test1Children
            key={index}
            count={count}
            index={index}
          ></Test1Children>
        ))}
    </div>
  );
};

const shouldShowWorld = (name: string): boolean => {
  complexCalc();
  return name === "hello";
};
const Test2: React.FC = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("hello");
  const [password, setPassword] = useState("password");
  const showWorld = shouldShowWorld(name);
  // const showWorld = useMemo(() => shouldShowWorld(name), [name]);
  return (
    <div>
      <button
        onClick={(): void => {
          setCount((p) => p + 1);
        }}
      >
        {count}+1
      </button>
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
      {showWorld && <div>world - {count}</div>}
    </div>
  );
};

// 如果你的组件在相同 props 的情况下渲染相同的结果，那么你可以通过将其包装在 React.memo 中调用，以此通过记忆组件渲染结果的方式来提高组件的性能表现。这意味着在这种情况下，React 将跳过渲染组件的操作并直接复用最近一次渲染的结果。
// React.memo 仅检查 props 变更。如果函数组件被 React.memo 包裹，且其实现中拥有 useState，useReducer 或 useContext 的 Hook，当 state 或 context 发生变化时，它仍会重新渲染。
// 默认情况下其只会对复杂对象做浅层对比，如果你想要控制对比过程，那么请将自定义的比较函数通过第二个参数传入来实现。
// const Test3Children: React.FC<{ onClick: () => void }> = React.memo(({ onClick }) => {
//   console.log("====render test2x====");
//   complexCalc();
//   return <button onClick={onClick}>test - complex child component</button>;
// });
const Test3Children: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  console.log("====render test2x====");
  complexCalc();
  return <button onClick={onClick}>test - complex child component</button>;
};

const Test3: React.FC = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("hello");
  const [password, setPassword] = useState("password");

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
  const testCallback2 = (): void => {
    console.log("====name====", name);
  };
  // const testCallback2 = useCallback((): void => {
  //   console.log("====name====", name);
  // }, [name]);

  return (
    <div>
      <button
        onClick={(): void => {
          setCount((p) => p + 1);
        }}
      >
        {count}+1
      </button>
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

      <div>
        <button
          onClick={(): void => {
            testCallback();
          }}
        >
          call function
        </button>
      </div>
      <Test3Children onClick={testCallback2}></Test3Children>
    </div>
  );
};

const Chapter05: React.FC = () => {
  return (
    <div>
      <Test3 />
    </div>
  );
};

export default Chapter05;
