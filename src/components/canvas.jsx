import React, { useState, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { createClient } from '@supabase/supabase-js';
import Point from './point';
import BlackLine from './blackLine';
import configData from '../config.json';
import { Col, Button, Badge, Row, Card, Stack, Table, Modal, Form } from 'react-bootstrap';
import { useGameState } from '../hooks/useGameState';
import { normalizeLine, validateMove } from '../utils/gameRules';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Canvas = () => {
  const [shouldShowLine, setShouldShowLine] = useState(false);
  const [line, setLine] = useState([0, 0, 0, 0]);
  const [hint, setHint] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalHints, setShowModalHints] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [modalEligible, setModalEligible] = useState(true);

  const [isLeaderboardable, setIsLeaderboardable] = useState(true);
  const [isHintUsed, setIsHintUsed] = useState(false);

  const { lines, points, addLine, undo, score, reset } = useGameState();

  // Logic to calculate valid moves for Hint and Game Over check
  const getValidMoves = () => {
    const moves = [];
    const directions = [
      { dx: 1, dy: 0 }, { dx: 0, dy: 1 },
      { dx: 1, dy: 1 }, { dx: 1, dy: -1 }
    ];
    const sep = configData.POINT_SEPARATOR;

    points.forEach(p => {
      directions.forEach(d => {
        const x1 = p.x;
        const y1 = p.y;
        const x2 = x1 + 4 * d.dx * sep;
        const y2 = y1 + 4 * d.dy * sep;

        const validation = validateMove(x1, y1, x2, y2, points, sep);
        if (validation) {
          moves.push({ x1, y1, x2, y2 });
        }
      });
    });
    return moves;
  };

  const fetchScores = async () => {
    const { data, error } = await supabase
      .from('five_points_game_scores')
      .select('name, score')
      .order('score', { ascending: false })
      .limit(6);

    if (error) {
      console.error('Supabase Fetch Error:', error.message, '| Hint:', error.hint);
    } else {
      setLeaderboard(data || []);
    }
  };

  // Fetch scores only on mount
  useEffect(() => {
    fetchScores();
  }, []);

  // Check for game over whenever the board state changes
  useEffect(() => {
    if (points.length > 0 && getValidMoves().length === 0) {
      setIsGameOver(true);
    }
  }, [points]);

  const handleUndo = () => {
    if (!undo()) return;
    setShouldShowLine(false);
    setHint(null);
    setIsGameOver(false);
  };

  const handleRestart = () => {
    if (reset) reset();
    setShouldShowLine(false);
    setHint(null);
    setIsGameOver(false);
    setIsLeaderboardable(true);
    setIsHintUsed(false);
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
    setHint(null);

    return true;
  };

    const handleHint = () => {
    if (isGameOver) return;

    if (isLeaderboardable) {
      setShowModalHints(true);
      return;
    }

    const moves = getValidMoves();
    if (moves.length > 0) {
      setIsHintUsed(true);
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      setHint(randomMove);
    }
  };

  const handleFinish = () => {
    setModalEligible(isLeaderboardable);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleCloseHints = () => setShowModalHints(false);
  const handleContinueHints = () => {
    setIsLeaderboardable(false);
    setIsHintUsed(true);
    setShowModalHints(false);

    const moves = getValidMoves();
    if (moves.length > 0) {
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      setHint(randomMove);
    }
  };

  const handleSaveScore = async () => {
    if (!isLeaderboardable) {
      setShowModal(false);
      handleRestart();
      return;
    }

    if (!playerName.trim()) return;

    const { error } = await supabase
      .from('five_points_game_scores')
      .insert([{ name: playerName, score: score }]);

    if (error) {
      console.error('Supabase Save Error:', error.message, '| Details:', error.details);
    } else {
      setShowModal(false);
      fetchScores(); // Refresh the leaderboard after saving
      
      // Restart the game
      handleRestart();
    }
  };

  const hendleRestartWithoutSaving = () => {
    setShowModal(false);
    handleRestart();
  }

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
            {hint && (
              <Line
                points={[hint.x1, hint.y1, hint.x2, hint.y2]}
                stroke="#00ff6a"
                strokeWidth={configData.BLACK_LINE.STROKE_WIDTH + 2}
                shadowColor="#A5B4FC"
                shadowBlur={10}
                opacity={0.8}
                lineCap="round"
              />
            )}
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
                <div className="medium text-light-gray text-uppercase fw-bold mb-1">Current Score</div>
                <div className="display-4 fw-bold text-indigo">{score}</div>
                {isGameOver && (
                  <Badge bg="danger" className="mt-2">Game Over - No Moves Left</Badge>
                )}
              </div>
              <Button variant='outline-light' onClick={handleUndo} className='rounded-pill py-2 shadow-sm'>
                Undo Move
              </Button>
              <Button 
                variant='indigo' 
                onClick={handleHint} 
                className='rounded-pill py-2 shadow-sm text-white'
                disabled={isGameOver}
              >
                Get Hint
              </Button>
              <Button 
                variant='success' 
                onClick={handleFinish} 
                className='rounded-pill py-2 shadow-sm'
                disabled={score === 0}
              >
                Finish Game
              </Button>

              <div className="pt-3 border-top border-secondary leaderboard-section">
                <div className="medium text-light-gray text-uppercase fw-bold mb-2">Leaderboard</div>
                <Table responsive borderless hover size="sm" variant="dark" className="leaderboard-table mb-0">
                  <thead>
                    <tr className="text-muted small border-bottom border-secondary">
                      <th>RANK</th>
                      <th>NAME</th>
                      <th className="text-end">SCORE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.length > 0 ? (
                      leaderboard.map((entry, i) => (
                        <tr key={i}>
                          <td>{i + 1}.</td>
                          <td>{entry.name}</td>
                          <td className="text-end text-indigo fw-bold">{entry.score}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="text-center text-muted small py-3 italic">No scores yet</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Stack>
          </Card.Body>
        </Card>
      </Col>

      <Modal show={showModalHints} onHide={() => setShowModalHints(false)} centered contentClassName="score-card text-light">
        <Modal.Header closeButton className="border-secondary text-white">
          <Modal.Title className="fw-bold">Warning!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <div className="small text-light-gray text-uppercase fw-bold mb-1">If you continue, you won't be able to save score.</div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-secondary">
          <Button variant="outline-light" className="rounded-pill px-4" onClick={handleCloseHints}>
            Cancel
          </Button>
          <Button variant="indigo" className="rounded-pill px-4" onClick={handleContinueHints}>
            Continue
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showModal} onHide={handleClose} centered contentClassName="score-card text-light">
        <Modal.Header closeButton className="border-secondary text-white">
          <Modal.Title className="fw-bold">Game Finished!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <div className="small text-light-gray text-uppercase fw-bold mb-1">Your Final Score</div>
            <div className="display-4 fw-bold text-indigo">{score}</div>
          </div>
          {modalEligible ? (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="small text-light-gray fw-bold">NAME</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter your name" 
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="bg-dark border-secondary text-light rounded-pill px-3 shadow-none"
                />
              </Form.Group>
            </Form>
          ) : (
            <div className="text-center text-muted small mt-2">Score will not be saved (Hint was used)</div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-secondary">
          <Button variant="outline-light" className="rounded-pill px-4" onClick={handleClose}>
            Cancel
          </Button>
          {modalEligible  ? (
            <Button variant="outline-light" className="rounded-pill px-4" onClick={hendleRestartWithoutSaving}>
               Restart Without Saving
            </Button>
          ) : null}
          <Button variant="indigo" className="rounded-pill px-4" onClick={handleSaveScore}>
            {modalEligible  ? 'Save Score' : 'Close & Restart'}
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default Canvas;