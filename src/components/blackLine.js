import React, { useState, useEffect } from 'react';
import {Line} from 'react-konva';

const BlackLine = React.memo((props) => {
  return (
    <Line
      points={[props.x1, props.y1, props.x2, props.y2]}
      stroke="black"
      strokeWidth={2}
    />
   );
});

export default BlackLine;