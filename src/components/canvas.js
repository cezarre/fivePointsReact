import Konva from 'konva';
import React, { useState, useEffect} from 'react';
import { Stage, Layer, Text } from 'react-konva';
import Point from './point';
import BlackLine from './blackLine'


const Canvas = () => {
  const [shouldShowLine, setShouldShowLine] = useState(false); // show dynamic line
  const [line, setLine] = useState([0, 0, 0, 0]); //[x1, y1, x2, y2]
  const [points, setPoints] = useState(generatePoints());
  const [lines, setLines] = useState([]);

  const handleClickOnStage = () => {
  }

  const handleClickOnPoint = (x, y) => {
    if (!shouldShowLine) { // first click
      setLine([x, y ,line[2], line[3]]);
      setShouldShowLine(true);
    }
    else { // second click
      lines.push([line[0], line[1], x, y]); // create connetion between points
      setShouldShowLine(false);
    }
  };

  const handleMouseMove = e => {
    const mouseX = e.evt.offsetX;
    const mouseY = e.evt.offsetY;
    setLine([line[0], line[1], mouseX, mouseY]);
  }


  return (
    <Stage className='stage' width={600} height={600} onMouseMove={handleMouseMove} onClick={handleClickOnStage}>
      <Layer>
        {shouldShowLine && <BlackLine x1={line[0]} y1={line[1]} x2={line[2]} y2={line[3]} />}
        {lines && lines.map(line => (
          <BlackLine
          key={"" + line[0] + line[1] + line[2] + line[3]}
          x1={line[0]}
          y1={line[1]}
          x2={line[2]}
          y2={line[3]}
          />
        ))}
        {points.map(item => (
          <Point
            key={"" + item.x + item.y}
            x={item.x}
            y={item.y}
            onClick={handleClickOnPoint}
          />
        ))}
      </Layer>
    </Stage>
  );
}

export default Canvas;

const generatePoints = () => {
  const multiplicator = 20;
  const numberOfPoints = 30;
  const points = [];
  for (let i=1; i<numberOfPoints; i++) {
    for (let j=1; j<numberOfPoints; j++) {
      points.push({
        x: i*multiplicator,
        y: j*multiplicator,
      });
    }
  }
  return points;
}
