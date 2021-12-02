import React, { useState } from 'react';

const Test1: React.FC = () => {
  const [value, setValue] = useState('');
  return (
    <div>
      <h1>函数式组件 - {value}</h1>
      <input
        type="text"
        onChange={(e): void => {
          setValue(e.target.value);
        }}
      />
      <button
        type="button"
        onClick={(): void => {
          setTimeout(() => {
            alert(value);
          }, 2000);
        }}
      >
        click
      </button>
    </div>
  );
};

class Test2 extends React.Component<{}, { value: string }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      value: '',
    };
  }

  handleClick = (): void => {
    setTimeout(() => {
      alert(this.state.value);
    }, 2000);
  };

  render() {
    return (
      <div>
        <h1>类组件 - {this.state.value}</h1>
        <input
          type="text"
          onChange={(e): void => {
            this.setState({
              value: e.target.value,
            });
          }}
        />
        <button type="button" onClick={this.handleClick}>
          click
        </button>
      </div>
    );
  }
}

const Chapter01: React.FC = () => {
  return (
    <div>
      <Test1></Test1>
      <Test2></Test2>
    </div>
  );
};

export default Chapter01;
