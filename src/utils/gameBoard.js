import configData from '../config.json';
import { getLinePoints, convertPointIndexWithSeparator, convertPointIndex } from './gameRules';

/**
 * Generate the initial game board with all points.
 */
export const generatePoints = () => {
  const separator = configData.POINT_SEPARATOR;
  const numberOfPoints = configData.NUMBER_OF_POINTS;
  const points = [];

  for (let i = 1; i <= numberOfPoints; i += 1) {
    for (let j = 1; j <= numberOfPoints; j += 1) {
      points.push({
        x: i * separator,
        y: j * separator,
        status: 'unfilled',
        down: false,
        down_right: false,
        right: false,
        up_right: false,
      });
    }
  }

  initialFill(points, numberOfPoints);
  return points;
};

/**
 * Apply a single line to an existing board state (immutably).
 */
export const applyLine = (points, line) => {
  const separator = configData.POINT_SEPARATOR;
  const LINE_LENGTH = 5;

  let nextPoints = setPointProperties(points, line.emptyPoint.x, line.emptyPoint.y, {
    status: 'filled',
  });

  const segmentPoints = getLinePoints(line.x1, line.y1, line.direction, LINE_LENGTH - 1, separator);
  segmentPoints.forEach(point => {
    nextPoints = setPointProperties(nextPoints, point.x, point.y, {
      [line.direction]: true,
    });
  });

  return nextPoints;
};

/**
 * Recompute the entire board state from scratch given a list of played lines.
 */
export const recomputePoints = lines => {
  return lines.reduce((currentPoints, line) => applyLine(currentPoints, line), generatePoints());
};

/**
 * Immutably set properties on a single point at (x, y).
 */
const setPointProperties = (points, x, y, patch) => {
  const index = convertPointIndexWithSeparator(x, y, configData.POINT_SEPARATOR);
  if (index < 0 || index >= points.length) return points;

  const existing = points[index];
  if (!existing) return points;

  const updatedPoint = { ...existing, ...patch };
  return [...points.slice(0, index), updatedPoint, ...points.slice(index + 1)];
};

/**
 * Fill the board's initial pattern (the "5" shape).
 */
const initialFill = (points, numberOfPoints) => {
  const leftOffset = Math.floor(numberOfPoints / 2 - 5);
  const originCoordinates = [
    [0, 4], [0, 5], [0, 6],
    [1, 6], [2, 6], [3, 6],
    [3, 7], [3, 8], [3, 9],
    [4, 9], [5, 9], [6, 9],
    [6, 8], [6, 7], [6, 6],
    [7, 6], [8, 6], [9, 6],
    [9, 5], [9, 4], [9, 3],
    [8, 3], [7, 3], [6, 3],
    [6, 2], [6, 1], [6, 0],
    [5, 0], [4, 0], [3, 0],
    [3, 1], [3, 2], [3, 3],
    [2, 3], [1, 3], [0, 3],
  ];

  originCoordinates.forEach(([x, y]) => {
    const index = convertPointIndex(x, y, leftOffset);
    if (index >= 0 && index < points.length) {
      points[index].status = 'origin';
    }
  });
};
