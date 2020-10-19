import React, { useState } from 'react';
import { Stage, Layer } from 'react-konva';
import Point from './point';
import BlackLine from './blackLine';
import configData from '../config.json';


const Canvas = () => {
  const [shouldShowLine, setShouldShowLine] = useState(false); // show dynamic line
  const [line, setLine] = useState([0, 0, 0, 0]); //[x1, y1, x2, y2]
  const [points] = useState(generatePoints());
  const [lines] = useState([]);


  const handleClickOnPoint = (x, y) => {
    if (!shouldShowLine) { // first click
      setLine([x, y ,x, y]);
      setShouldShowLine(true);
      return false;
    }
    else { // second click
      if (!validateMove(line[0], line[1], x, y)) {
        setShouldShowLine(false);
        return false;
      }
      lines.push([line[0], line[1], x, y]); // create connetion between points
      setShouldShowLine(false);

      //line has the cordinates for the first click
      fillPoint(line[0], line[1]); // THIS IS FOR 1st CLICK
      fillPoint(x, y); // THIS IS FOR 2nd CLICK

      return true;
    }
  };

  const handleMouseMove = e => {
    const mouseX = e.evt.offsetX;
    const mouseY = e.evt.offsetY;
    setLine([line[0], line[1], mouseX, mouseY]);
  }

  const fillPoint = (x, y) => {
    let index = convertPointIndex(x/configData.POINT_SEPARATOR - 1,
                                  y/configData.POINT_SEPARATOR - 1,
                                  0);
    points[index].status = 'filled';
  }

  const validateMove = (x1, y1, x2, y2) => {
    [x1, x2] = x1 > x2 ? [x2, x1] : [x1, x2];
    [y1, y2] = y1 > y2 ? [y2, y1] : [y1, y2];
    console.log(x1 + ' ' + y1 + ' ' + x2 + ' ' + y2);
    const separator = configData.POINT_SEPARATOR;
    const point1 = points[convertPointIndex(x1/configData.POINT_SEPARATOR - 1,
                          y1/configData.POINT_SEPARATOR - 1,
                          0)];

    console.log(point1)
    // checking for the length
    if (!((x2/separator - x1/separator + 1 === 5 && y2 - y1 === 0) ||
        (y2/separator - y1/separator + 1 === 5 && x2 - x1 === 0) ||
        (x2/separator - x1/separator + 1 === 5 && y2/separator - y1/separator + 1 === 5 ))) {
          return false;
        }

    // checking for starting points
    // ...
    return true;
  }

  return (
    <Stage className='stage' width={configData.STAGE.WIDTH} height={configData.STAGE.HEIGHT}
    onMouseMove={handleMouseMove}>
      <Layer>
        {shouldShowLine &&
        <BlackLine
        x1={line[0]}
        y1={line[1]}
        x2={line[2]}
        y2={line[3]}
        />}
        {lines && lines.map(line => (
          <BlackLine
          key={"" + line[0] + line[1] + line[2] + line[3]}
          x1={line[0]}
          y1={line[1]}
          x2={line[2]}
          y2={line[3]}
          />
        ))}
      </Layer>
      <Layer>
        {points.map(item => (
          <Point
            key={"" + item.x + item.y}
            x={item.x}
            y={item.y}
            status={item.status}
            listening={true} // TODO: for optimization -- set to true only when point is possible to click [POSSIBLY NOT WORKING]
            onClick={handleClickOnPoint}
        ></Point>
        ))}
      </Layer>
    </Stage>
  );
};

export default Canvas;


const generatePoints = () => {
  const multiplicator = configData.POINT_SEPARATOR;
  const numberOfPoints = configData.NUMBER_OF_POINTS;
  const points = [];

  for (let i=1; i<numberOfPoints+1; i++) {
    for (let j=1; j<numberOfPoints+1 ; j++) {
      points.push({
        x: i*multiplicator,
        y: j*multiplicator,
      });
    }
  }
  initialFill(points, numberOfPoints);
  return points;
}


const initialFill = (points, numberOfPoints) => {
  const leftOfset = Math.floor(numberOfPoints / 2 - 5);

  points[convertPointIndex(0, 4, leftOfset)].status = 'origin';
  points[convertPointIndex(0, 5, leftOfset)].status = 'origin';
  points[convertPointIndex(0, 6, leftOfset)].status = 'origin';

  points[convertPointIndex(1, 6, leftOfset)].status = 'origin';
  points[convertPointIndex(2, 6, leftOfset)].status = 'origin';
  points[convertPointIndex(3, 6, leftOfset)].status = 'origin';

  points[convertPointIndex(3, 7, leftOfset)].status = 'origin';
  points[convertPointIndex(3, 8, leftOfset)].status = 'origin';
  points[convertPointIndex(3, 9, leftOfset)].status = 'origin';

  points[convertPointIndex(4, 9, leftOfset)].status = 'origin';
  points[convertPointIndex(5, 9, leftOfset)].status = 'origin';
  points[convertPointIndex(6, 9, leftOfset)].status = 'origin';

  points[convertPointIndex(6, 8, leftOfset)].status = 'origin';
  points[convertPointIndex(6, 7, leftOfset)].status = 'origin';
  points[convertPointIndex(6, 6, leftOfset)].status = 'origin';

  points[convertPointIndex(7, 6, leftOfset)].status = 'origin';
  points[convertPointIndex(8, 6, leftOfset)].status = 'origin';
  points[convertPointIndex(9, 6, leftOfset)].status = 'origin';

  points[convertPointIndex(9, 5, leftOfset)].status = 'origin';
  points[convertPointIndex(9, 4, leftOfset)].status = 'origin';
  points[convertPointIndex(9, 3, leftOfset)].status = 'origin';

  points[convertPointIndex(8, 3, leftOfset)].status = 'origin';
  points[convertPointIndex(7, 3, leftOfset)].status = 'origin';
  points[convertPointIndex(6, 3, leftOfset)].status = 'origin';

  points[convertPointIndex(6, 2, leftOfset)].status = 'origin';
  points[convertPointIndex(6, 1, leftOfset)].status = 'origin';
  points[convertPointIndex(6, 0, leftOfset)].status = 'origin';

  points[convertPointIndex(5, 0, leftOfset)].status = 'origin';
  points[convertPointIndex(4, 0, leftOfset)].status = 'origin';
  points[convertPointIndex(3, 0, leftOfset)].status = 'origin';

  points[convertPointIndex(3, 1, leftOfset)].status = 'origin';
  points[convertPointIndex(3, 2, leftOfset)].status = 'origin';
  points[convertPointIndex(3, 3, leftOfset)].status = 'origin';

  points[convertPointIndex(2, 3, leftOfset)].status = 'origin';
  points[convertPointIndex(1, 3, leftOfset)].status = 'origin';
  points[convertPointIndex(0, 3, leftOfset)].status = 'origin';
}


const convertPointIndex = (x, y, leftOfset) => { // converting from 2d to 1d array
  const numberOfPoints = configData.NUMBER_OF_POINTS;
  return (leftOfset + x) * numberOfPoints + (leftOfset + y)
}