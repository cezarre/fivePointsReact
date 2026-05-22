import React from 'react';
import { Circle, Group } from 'react-konva';
import configData from './../config.json';

const Point = ({ x, y, listening, status, onClick }) => {
  const color = status === 'filled'
    ? configData.POINT.STROKE_COLOR_FILLED
    : status === 'origin'
      ? configData.POINT.STROKE_COLOR_ORIGIN
      : configData.POINT.STROKE_COLOR_UNFILLED;

  const handleClick = () => {
    if (onClick) {
      onClick(x, y);
    }
  };

  return (
    <Group>
      <Circle
        x={x}
        y={y}
        radius={configData.POINT.RADIUS}
        fill={null}
        stroke={color}
      />
      <Circle
        x={x}
        y={y}
        radius={configData.POINT.MOUSE_LISTENER_RADIUS}
        fill={null}
        listening={listening}
        onClick={handleClick}
      />
    </Group>
  );
};

export default React.memo(Point);

