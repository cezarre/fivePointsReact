/**
 * Game rules and validation logic for the Five Points game.
 */

const LINE_LENGTH = 5;
const DIRECTION_STEPS = {
  down: { dx: 0, dy: 1 },
  right: { dx: 1, dy: 0 },
  'down-right': { dx: 1, dy: 1 },
  'up-right': { dx: 1, dy: -1 },
};

/**
 * Normalize line coordinates so (x1, y1) is always top-left.
 */
export const normalizeLine = (x1, y1, x2, y2) => {
  if (x1 > x2 || (x1 === x2 && y1 > y2)) {
    return [x2, y2, x1, y1];
  }
  return [x1, y1, x2, y2];
};

/**
 * Determine the direction of a line based on start and end coordinates.
 */
export const getDirection = (x1, y1, x2, y2) => {
  if (x1 === x2) return 'down';
  if (y1 === y2) return 'right';
  return y2 > y1 ? 'down-right' : 'up-right';
};

/**
 * Get all points along a line in a given direction.
 */
export const getLinePoints = (x1, y1, direction, count, pointSeparator) => {
  const step = DIRECTION_STEPS[direction];
  return Array.from({ length: count }, (_, index) => ({
    x: x1 + step.dx * index * pointSeparator,
    y: y1 + step.dy * index * pointSeparator,
  }));
};

/**
 * Validate a move by checking:
 * 1. The line has correct length (5 points).
 * 2. Exactly 4 of the 5 points are filled, 1 is empty.
 * 3. The line does not overlap with existing lines in that direction.
 *
 * Returns { emptyPoint, direction } if valid, null otherwise.
 */
export const validateMove = (x1, y1, x2, y2, points, pointSeparator) => {
  const direction = getDirection(x1, y1, x2, y2);
  const linePoints = getLinePoints(x1, y1, direction, LINE_LENGTH, pointSeparator);
  const endPoint = linePoints[linePoints.length - 1];

  // Check that the end point matches (x2, y2)
  if (endPoint.x !== x2 || endPoint.y !== y2) {
    return null;
  }

  // Map each line point to its board index
  const currentLinePoints = linePoints.map(point => ({
    ...point,
    index: convertPointIndexWithSeparator(point.x, point.y, pointSeparator),
  }));

  let emptyPoint = null;
  let filledCount = 0;

  // Check that exactly 1 point is empty and 4 are filled
  for (const { index, x, y } of currentLinePoints) {
    const point = points[index];
    if (!point) return null;

    if (point.status === 'unfilled') {
      if (emptyPoint) return null; // More than one empty point
      emptyPoint = { x, y };
    } else {
      filledCount += 1;
    }
  }

  if (filledCount !== LINE_LENGTH - 1 || !emptyPoint) {
    return null;
  }

  // Check for overlapping lines in this direction
  const segmentPoints = getLinePoints(x1, y1, direction, LINE_LENGTH - 1, pointSeparator);
  if (
    segmentPoints.some(point => {
      const idx = convertPointIndexWithSeparator(point.x, point.y, pointSeparator);
      return points[idx] && points[idx][direction];
    })
  ) {
    return null;
  }

  return { emptyPoint, direction };
};

/**
 * Helper: Convert (x, y) coordinates to a 1D board index.
 */
export const convertPointIndexWithSeparator = (x, y, pointSeparator) => {
  return convertPointIndex(
    x / pointSeparator - 1,
    y / pointSeparator - 1,
    0,
  );
};

/**
 * Helper: Convert 2D grid coordinates to 1D array index.
 */
export const convertPointIndex = (x, y, leftOffset) => {
  const numberOfPoints = 26; // Hard-coded default; could be parameterized
  return (leftOffset + x) * numberOfPoints + (leftOffset + y);
};
