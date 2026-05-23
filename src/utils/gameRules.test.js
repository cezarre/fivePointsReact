import { describe, it, expect } from 'vitest';
import {
  normalizeLine,
  getDirection,
  getLinePoints,
  validateMove,
} from './gameRules';
import { generatePoints, applyLine } from './gameBoard';

const POINT_SEPARATOR = 20;

describe('gameRules', () => {
  describe('normalizeLine', () => {
    it('swaps coordinates if x1 > x2', () => {
      const [x1, y1, x2, y2] = normalizeLine(100, 20, 40, 20);
      expect([x1, y1, x2, y2]).toEqual([40, 20, 100, 20]);
    });

    it('swaps coordinates if x1 === x2 and y1 > y2', () => {
      const [x1, y1, x2, y2] = normalizeLine(40, 100, 40, 20);
      expect([x1, y1, x2, y2]).toEqual([40, 20, 40, 100]);
    });

    it('keeps coordinates if already normalized', () => {
      const [x1, y1, x2, y2] = normalizeLine(20, 20, 100, 20);
      expect([x1, y1, x2, y2]).toEqual([20, 20, 100, 20]);
    });
  });

  describe('getDirection', () => {
    it('returns "down" for vertical lines', () => {
      expect(getDirection(40, 20, 40, 100)).toBe('down');
    });

    it('returns "right" for horizontal lines', () => {
      expect(getDirection(20, 40, 100, 40)).toBe('right');
    });

    it('returns "down-right" for diagonal lines going down', () => {
      expect(getDirection(20, 20, 100, 100)).toBe('down-right');
    });

    it('returns "up-right" for diagonal lines going up', () => {
      expect(getDirection(20, 100, 100, 20)).toBe('up-right');
    });
  });

  describe('getLinePoints', () => {
    it('generates points along a horizontal line', () => {
      const points = getLinePoints(0, 0, 'right', 3, POINT_SEPARATOR);
      expect(points).toEqual([
        { x: 0, y: 0 },
        { x: POINT_SEPARATOR, y: 0 },
        { x: POINT_SEPARATOR * 2, y: 0 },
      ]);
    });

    it('generates points along a vertical line', () => {
      const points = getLinePoints(0, 0, 'down', 3, POINT_SEPARATOR);
      expect(points).toEqual([
        { x: 0, y: 0 },
        { x: 0, y: POINT_SEPARATOR },
        { x: 0, y: POINT_SEPARATOR * 2 },
      ]);
    });

    it('generates points along a diagonal line (down-right)', () => {
      const points = getLinePoints(0, 0, 'down-right', 3, POINT_SEPARATOR);
      expect(points).toEqual([
        { x: 0, y: 0 },
        { x: POINT_SEPARATOR, y: POINT_SEPARATOR },
        { x: POINT_SEPARATOR * 2, y: POINT_SEPARATOR * 2 },
      ]);
    });
  });

  describe('validateMove', () => {
    let initialPoints;

    beforeEach(() => {
      initialPoints = generatePoints();
    });

    it('rejects moves where the endpoint does not match the line', () => {
      const result = validateMove(20, 20, 80, 40, initialPoints, POINT_SEPARATOR);
      expect(result).toBeNull();
    });

    it('validates and returns move data for valid moves', () => {
      const points = generatePoints().map(point => ({ ...point }));
      const fillPoint = (x, y) => {
        const index = points.findIndex(p => p.x === x && p.y === y);
        if (index >= 0) points[index] = { ...points[index], status: 'filled' };
      };

      fillPoint(20, 20);
      fillPoint(40, 20);
      fillPoint(60, 20);
      fillPoint(80, 20);

      const result = validateMove(20, 20, 100, 20, points, POINT_SEPARATOR);
      expect(result).toBeTruthy();
      if (result) {
        expect(result.direction).toBe('right');
        expect(result.emptyPoint).toEqual({ x: 100, y: 20 });
      }
    });
  });
});

describe('gameBoard', () => {
  describe('generatePoints', () => {
    it('generates an initial board with origin points', () => {
      const points = generatePoints();
      expect(points.length).toBeGreaterThan(0);
      const originPoints = points.filter(p => p.status === 'origin');
      expect(originPoints.length).toBe(36);
    });

    it('initializes all points with false direction flags', () => {
      const points = generatePoints();
      points.forEach(point => {
        expect(point.down).toBe(false);
        expect(point.right).toBe(false);
        expect(point.down_right).toBe(false);
        expect(point.up_right).toBe(false);
      });
    });
  });

  describe('applyLine', () => {
    it('marks the empty point as filled after applying a line', () => {
      const points = generatePoints();
      const line = {
        x1: 20,
        y1: 80,
        x2: 100,
        y2: 80,
        emptyPoint: { x: 60, y: 80 },
        direction: 'right',
      };
      const updatedPoints = applyLine(points, line);
      const emptyPointUpdated = updatedPoints.find(p => p.x === 60 && p.y === 80);
      expect(emptyPointUpdated?.status).toBe('filled');
    });

    it('marks the line direction as true for affected points', () => {
      const points = generatePoints();
      const line = {
        x1: 20,
        y1: 80,
        x2: 100,
        y2: 80,
        emptyPoint: { x: 60, y: 80 },
        direction: 'right',
      };
      const updatedPoints = applyLine(points, line);
      const pointOnLine = updatedPoints.find(p => p.x === 20 && p.y === 80);
      expect(pointOnLine?.right).toBe(true);
    });
  });
});
