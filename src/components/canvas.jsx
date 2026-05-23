import React, { useState } from 'react';
import { Stage, Layer } from 'react-konva';
import Point from './point';
import BlackLine from './blackLine';
import configData from '../config.json';
import { Col, Button, Badge, Row, Card, Stack } from 'react-bootstrap';
import { useGameState } from '../hooks/useGameState';
import { normalizeLine, validateMove } from '../utils/gameRules';

const Canvas = () => {
  const [shouldShowLine, setShouldShowLine] = useState(false);
  const [line, setLine] = useState([0, 0, 0, 0]);
  const { lines, points, addLine, undo, score } = useGameState();

  const handleUndo = () => {
    if (!undo()) return;
    setShouldShowLine(false);
  };

  const handleClickOnPoint = (x, y) => {
    if (!shouldShowLine) {
      setLine([x, y, x, y]);
      setShouldShowLine(true);
      return false;
    }

    const [x1, y1, x2, y2] = normalizeLine(line[0], line[1], x, y);
    const validation = validateMove(x1, y1, x2, y2, points, configData.POINT_SEPARATOR);

    if (!validation) {
      setShouldShowLine(false);
      return false;
    }

    const newLine = {
      x1,
      y1,
      x2,
      y2,
      emptyPoint: validation.emptyPoint,
      direction: validation.direction,
    };

    addLine(newLine);
    setShouldShowLine(false);

    return true;
  };

  const handleMouseMove = e => {
    if (!shouldShowLine) return;

    const mouseX = e.evt.offsetX;
    const mouseY = e.evt.offsetY;
    setLine([line[0], line[1], mouseX, mouseY]);
  };

  return (
    <>
      <Col xs>
        <Stage
          className='stage'
          width={configData.STAGE.WIDTH}
          height={configData.STAGE.HEIGHT}
          onMouseMove={handleMouseMove}
        >
          <Layer>
            {shouldShowLine && (
              <BlackLine x1={line[0]} y1={line[1]} x2={line[2]} y2={line[3]} />
            )}
            {lines.map((savedLine, index) => (
              <BlackLine
                key={`${savedLine.x1}-${savedLine.y1}-${savedLine.x2}-${savedLine.y2}-${index}`}
                x1={savedLine.x1}
                y1={savedLine.y1}
                x2={savedLine.x2}
                y2={savedLine.y2}
              />
            ))}
          </Layer>
          <Layer>
            {points.map(item => (
              <Point
                key={`${item.x}-${item.y}`}
                x={item.x}
                y={item.y}
                status={item.status}
                listening={true}
                onClick={handleClickOnPoint}
              />
            ))}
          </Layer>
        </Stage>
      </Col>
      <Col xs={12} md={3} className='rightpanel__col mt-3 mt-md-0'>
        <Card className="score-card shadow-sm border-0 rounded-4 overflow-hidden">
          <Card.Body className="p-4">
            <Stack gap={4}>
              <div className="text-center">
                <div className="small text-light-gray text-uppercase fw-bold mb-1">Current Score</div>
                <div className="display-4 fw-bold text-indigo">{score}</div>
              </div>
              <Button variant='dark' size="lg" onClick={handleUndo} className='rounded-pill py-2 shadow-sm'>
                Undo Move
              </Button>
            </Stack>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

export default Canvas;