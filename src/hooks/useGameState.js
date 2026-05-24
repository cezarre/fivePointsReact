import { useState } from 'react';
import { generatePoints, applyLine, recomputePoints } from '../utils/gameBoard';

/**
 * Custom hook managing the five-points game state.
 * Tracks lines played and point statuses, providing methods to apply moves and undo.
 */
export const useGameState = () => {
  const [lines, setLines] = useState([]);
  const [points, setPoints] = useState(() => generatePoints());

  const addLine = (line) => {
    setLines(prevLines => [...prevLines, line]);
    setPoints(prevPoints => applyLine(prevPoints, line));
  };

  const undo = () => {
    if (lines.length === 0) return false;

    const updatedLines = lines.slice(0, -1);
    setLines(updatedLines);
    setPoints(recomputePoints(updatedLines));
    return true;
  };

  const reset = () => {
    if (lines.length === 0) return false;

    const updatedLines = [];
    setLines(updatedLines);
    setPoints(recomputePoints(updatedLines));
    return true;
  };

  return {
    lines,
    points,
    addLine,
    undo,
    score: lines.length,
    reset,
  };
};
