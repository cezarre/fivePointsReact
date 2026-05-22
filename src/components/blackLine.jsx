import React from 'react';
import {Line} from 'react-konva';
import configData from "./../config.json";

const BlackLine = props => {
  return (
    <Line
      points={[props.x1, props.y1, props.x2, props.y2]}
      stroke={configData.BLACK_LINE.STROKE}
      strokeWidth={configData.BLACK_LINE.STROKE_WIDTH}
    />
   );
};

export default BlackLine;