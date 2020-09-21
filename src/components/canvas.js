import Konva from 'konva';
import React, { useState, useEffect} from 'react';
import { Stage, Layer, Text } from 'react-konva';
import Point from './point';
import BlackLine from './blackLine'


const Canvas = () => {
  const [shouldShowLine, setShouldShowLine] = useState(false);
  const [line, setLine] = useState([0, 0, 0, 0]); //[x1, y1, x2, y2]
  const [points, setPoints] = useState(generatePoints());
  const [lines, setLines] = useState([]);


  const handleClickOnStage = () => {
  }

  const createConnetion = () => {
    lines.push(line);
  }

  const handleClickOnPoint = (x, y) => {
    if (shouldShowLine) {
      createConnetion();
      setShouldShowLine(false);
    }
    else {
      setLine([x, y ,line[2], line[3]]);
      setShouldShowLine(true);
    }
  };

  const handleMouseMove = e => {
    const mouseX = e.evt.offsetX;
    const mouseY = e.evt.offsetY;
    setLine([line[0], line[1], mouseX, mouseY]);
  }


  return (
    <Stage className='stage' width={500} height={window.innerHeight/2} onMouseMove={handleMouseMove} onClick={handleClickOnStage}>
      <Layer>
        {shouldShowLine && <BlackLine x1={line[0]} y1={line[1]} x2={line[2]} y2={line[3]} />}
        {lines && lines.map(line => (
          <BlackLine x1={line[0]} y1={line[1]} x2={line[2]} y2={line[3]} />
        ))}
        {points.map(item => (
          <Point
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
  const points = [];
  for (let i=1; i<10; i++) {
    for (let j=1; j<10; j++) {
      points.push({
        x: i*20,
        y: j*20
      });
    }
  }
  return points;
}
