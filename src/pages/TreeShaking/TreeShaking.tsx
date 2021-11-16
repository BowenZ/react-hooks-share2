import React from 'react';
import T1 from './T1';
import T2 from './T2';
import T3 from './T3';

const TreeShaking: React.FC = () => {
  return (
    <div>
      <T1></T1>
      {/* <T3></T3> */}
    </div>
  );
};

export default TreeShaking;
