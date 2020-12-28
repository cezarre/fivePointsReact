import React, { useState } from 'react';
import { Stage, Layer } from 'react-konva';
import Point from './point';
import BlackLine from './blackLine';
import configData from '../config.json';
import { Col, Button, Badge, Row } from 'react-bootstrap';
import useForceUpdate from 'use-force-update';


const Canvas = () => {
  const [shouldShowLine, setShouldShowLine] = useState(false); // show dynamic line
  const [line, setLine] = useState([0, 0, 0, 0]); //[x1, y1, x2, y2]
  const [points] = useState(generatePoints());
  const [lines] = useState([]);
  const [filledPoints] = useState([]);
  const forceUpdate = useForceUpdate();
  const [score, setScore] = useState(0);
  const [directionFulfillment] = useState([]);

  const handleUndo = () => {
    if (score <= 0) return;

    lines.pop();
    const [x, y] = filledPoints.pop();
    unFillPoint(x, y);
    setScore(score - 1);
    undoDirection();
    forceUpdate();
  }

  const handleClickOnPoint = (x, y) => {
    if (!shouldShowLine) { // first click
      setLine([x, y ,x, y]);
      setShouldShowLine(true);
      return false;
    }
    else { // second click
      let [x1, y1, x2, y2] = [line[0], line[1], x, y];
      if (x1 > x2) { // swapping variables that every first point is on the top left
        [x1, x2] = [x2, x1];
        [y1, y2] = [y2, y1];
      } else if ( x1 === x2) {
          if (y1 > y2) {
            [x1, x2] = [x2, x1];
            [y1, y2] = [y2, y1];
          }
      }
      const validation = validateMove(x1, y1, x2, y2);
      if (!validation) {
        setShouldShowLine(false);
        return false;
      }
      const [x_toFill, y_toFill, x_orig, y1_orig, direction] = validation;

      //finilize move and make changes to game state
      lines.push([x1, y1, x2, y2]); // create connetion between points
      setShouldShowLine(false);
      fillPoint(x_toFill, y_toFill)
      filledPoints.push([x_toFill, y_toFill]);
      fillDirection(x_orig, y1_orig, direction);
      setScore(score + 1);

      return true;
    }
  };

  const handleMouseMove = e => {
    const mouseX = e.evt.offsetX;
    const mouseY = e.evt.offsetY;
    setLine([line[0], line[1], mouseX, mouseY]);
  }

  const fillDirection = (x_orig, y1_orig, direction) => {
    for (let i=0; i < 4 ; i++) {
      if (direction === 'down') {
        const point = points[convertPointIndexWithSeparator(x_orig, y1_orig + i*configData.POINT_SEPARATOR)];
        point.down = true;
        directionFulfillment.push([point, 'down']);
      }
      if (direction === 'down-right') {
        const point = points[convertPointIndexWithSeparator(x_orig + i*configData.POINT_SEPARATOR, y1_orig + i*configData.POINT_SEPARATOR)];
        point.down_right = true;
        directionFulfillment.push([point, 'down-right']);
      }
      if (direction === 'right') {
        const point = points[convertPointIndexWithSeparator(x_orig + i*configData.POINT_SEPARATOR, y1_orig)];
        point.right = true;
        directionFulfillment.push([point, 'right']);
      }
      if (direction === 'up-right') {
        const point = points[convertPointIndexWithSeparator(x_orig + i*configData.POINT_SEPARATOR, y1_orig - i*configData.POINT_SEPARATOR)];
        point.up_right = true;
        directionFulfillment.push([point, 'up-right']);
      }
    }
  }

  const undoDirection = () => {
    for (let i=0 ; i < 4 ; i++) {
      const [point, direction] = directionFulfillment.pop();
      if (direction === 'down') {
        point.down = false;
      }
      if (direction === 'down-right') {
        point.down_right = false;
      }
      if (direction === 'right') {
        point.right = false;
      }
      if (direction === 'up-right') {
        point.up_right = false;
      }
    }
  }

  const fillPoint = (x, y) => {
    let index = convertPointIndex(x/configData.POINT_SEPARATOR - 1,
                                  y/configData.POINT_SEPARATOR - 1,
                                  0);
    points[index].status = 'filled';
  }

  const unFillPoint = (x, y) => {
    let index = convertPointIndex(x/configData.POINT_SEPARATOR - 1,
                                  y/configData.POINT_SEPARATOR - 1,
                                  0);
    points[index].status = 'unfilled';
  }

  const validateMove = (x1, y1, x2, y2) => {
    let direction = '';

    if (x1 === x2) {
      direction = 'down';
    } else {
      if (y2 > y1) {
        direction = 'down-right';
      } else if (y2 === y1) {
        direction = 'right';
      } else {
        direction = 'up-right';
      }
    }
    const separator = configData.POINT_SEPARATOR;

    // checking for the length
    if (!((x2/separator - x1/separator + 1 === 5 && y2 - y1 === 0) ||                                   // horizontal lines
        (y2/separator - y1/separator + 1 === 5 && x2 - x1 === 0) ||                                     // vertical lines
        (x2/separator - x1/separator + 1 === 5 && Math.abs(y2/separator - y1/separator) + 1 === 5 ))) { // slanted lines
          return false;
    }


    // checking whether there are 4 unfilled points
    let pointsCounter = 0;
    let x_unfilled = x1;
    let y_unfilled = y1;

    for (let i=0; i < 5 ; i++) {
      // Direction RIGHT
      if (direction === 'down') {
        if (points[convertPointIndexWithSeparator(x1, y1 + i*configData.POINT_SEPARATOR)].status !== 'unfilled') {
          pointsCounter++;
        } else {
          y_unfilled = y1 + i*configData.POINT_SEPARATOR;
        }
      }
      if (direction === 'down-right') {
        if (points[convertPointIndexWithSeparator(x1 + i*configData.POINT_SEPARATOR, y1 + i*configData.POINT_SEPARATOR)].status !== 'unfilled') {
          pointsCounter++;
        } else {
          x_unfilled = x1 + i*configData.POINT_SEPARATOR;
          y_unfilled = y1 + i*configData.POINT_SEPARATOR;
        }
      }
      if (direction === 'right') {
        if (points[convertPointIndexWithSeparator(x1 + i*configData.POINT_SEPARATOR, y1)].status !== 'unfilled') {
          pointsCounter++;
        } else {
          x_unfilled = x1 + i*configData.POINT_SEPARATOR;
        }
      }
      if (direction === 'up-right') {
        if (points[convertPointIndexWithSeparator(x1 + i*configData.POINT_SEPARATOR, y1 - i*configData.POINT_SEPARATOR)].status !== 'unfilled') {
          pointsCounter++;
        } else {
          x_unfilled = x1 + i*configData.POINT_SEPARATOR;
          y_unfilled = y1 - i*configData.POINT_SEPARATOR;
        }
      }
    }
    if (pointsCounter !== 4) return false;

    // CHECKING IF LINE IS NOT COVERING ANY EXISTING LINE
    for (let i=0; i < 4 ; i++) {
      if (direction === 'down') {
        if (points[convertPointIndexWithSeparator(x1, y1 + i*configData.POINT_SEPARATOR)].down) {
          return false;
        }
      }
      if (direction === 'down-right') {
        if (points[convertPointIndexWithSeparator(x1 + i*configData.POINT_SEPARATOR, y1 + i*configData.POINT_SEPARATOR)].down_right) {
          return false;
        }
      }
      if (direction === 'right') {
        if (points[convertPointIndexWithSeparator(x1 + i*configData.POINT_SEPARATOR, y1)].right) {
          return false;
        }
      }
      if (direction === 'up-right') {
        if (points[convertPointIndexWithSeparator(x1 + i*configData.POINT_SEPARATOR, y1 - i*configData.POINT_SEPARATOR)].up_right) {
          return false;
        }
      }
    }

    return [x_unfilled, y_unfilled, x1, y1, direction];
  }

  return (
    <React.Fragment>
      <Col xs>
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
      </Col>
      <Col xs className="rightpanel__col">
        <div className="conteiner rightpanel__conteiner">
          <Row>
            <div className="score">
              Score <Badge variant="info">{score}</Badge>
            </div>
          </Row>
          <Row>
            <Button variant="outline-dark" onClick={handleUndo} className="undo_button">Undo</Button>
          </Row>
        </div>
      </Col>
    </React.Fragment>
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

  points.forEach(point => {
    point.status = 'unfilled';
    point.lineCovering = "";
  });

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

const convertPointIndexWithSeparator = (x, y) => {
  return convertPointIndex(x/configData.POINT_SEPARATOR - 1,
         y/configData.POINT_SEPARATOR - 1,
         0);
}

const convertPointIndex = (x, y, leftOfset) => { // converting from 2d to 1d array
  const numberOfPoints = configData.NUMBER_OF_POINTS;
  return (leftOfset + x) * numberOfPoints + (leftOfset + y)
}