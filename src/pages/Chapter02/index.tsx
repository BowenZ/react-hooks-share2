import React, { useState, useEffect } from 'react';

type StateType = {
  value: number;
  delay: number;
};

class Test1 extends React.Component<{}, StateType> {
  timer: number;

  constructor(props: {}) {
    super(props);
    this.timer = 0;
    this.state = {
      value: 1,
      delay: 1000,
    };
  }

  componentDidMount() {
    this.timer = window.setInterval(() => {
      this.setState({
        value: this.state.value + 1,
      });
    }, this.state.delay);
  }

  componentDidUpdate(prevProps: StateType, curProps: StateType) {
    if (prevProps.delay !== curProps.delay) {
      clearInterval(this.timer);
      this.timer = window.setInterval(() => {
        this.setState({
          value: this.state.value + 1,
        });
      }, this.state.delay);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <div>
        <h3>{this.state.value}</h3>
        <button
          onClick={(): void => {
            this.setState({
              delay: Math.max(this.state.delay - 200, 200),
            });
          }}
        >
          -
        </button>
        <button
          onClick={(): void => {
            this.setState({
              delay: this.state.delay + 200,
            });
          }}
        >
          +
        </button>
        {this.state.delay}
      </div>
    );
  }
}

const Test2: React.FC = () => {
  const [value, setValue] = useState(1);
  const [delay, setDelay] = useState(1000);

  useEffect(() => {
    const timer = setInterval(() => {
      setValue((p) => p + 1);
    }, delay);
    return (): void => {
      clearInterval(timer);
    };
  }, [delay]);

  return (
    <div>
      <h3>{value}</h3>
      <button
        onClick={(): void => {
          setDelay(Math.max(delay - 200, 200));
        }}
      >
        -
      </button>
      <button
        onClick={(): void => {
          setDelay(delay + 200);
        }}
      >
        +
      </button>
      {delay}
    </div>
  );
};

const Chapter02: React.FC = () => {
  return (
    <div>
      <h1>类组件对比函数组件的优势</h1>
      <Test1></Test1>
      <Test2></Test2>
    </div>
  );
};

export default Chapter02;
