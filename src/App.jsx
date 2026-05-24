import React, { useState, useEffect } from 'react';
import Canvas from './components/canvas'
import { Container, Row, Col, Navbar, Card, ListGroup } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import './App.css';

function App() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      return (
        window.matchMedia("(pointer: coarse)").matches ||
        navigator.maxTouchPoints > 0 ||
        'ontouchstart' in window
      );
    };

    setIsTouchDevice(checkTouch());
  }, []);

  if (isTouchDevice) {
    return (
      <div className="mobile-warning d-flex align-items-center justify-content-center vh-100 bg-dark-theme text-light px-4 text-center">
        <div className="warning-content">
          <h1 className="fw-bold text-indigo mb-3" style={{ fontSize: '2.5rem' }}>Device Not Supported</h1>
          <p className="lead mb-4">Morpion Solitaire requires precise pointer interaction and is currently not supported on touch-based devices.</p>
          <p className="text-muted small">Please visit us from a desktop or laptop to play.</p>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <Container fluid className="px-0 py-2 bg-dark-theme min-vh-100">
        <Navbar variant="dark" className="navbar mb-4 border-bottom border-secondary bg-transparent px-4">
          <Navbar.Brand className="navbar-brand" href="/">
            <span className="fw-bold text-light" style={{ fontSize: '26px' }}>Morpion Solitaire</span>
          </Navbar.Brand>
        </Navbar>

        <Row className="firstrow justify-content-center">
          <Canvas />
          <div className="gamerulescol">
          <div className="gamerules shadow-lg">
            <h5 className="fw-bold mb-4">Game Rules</h5>
            <ListGroup variant="flush">
              <ListGroup.Item className="bg-transparent border-secondary text-light-gray py-3">
                • Line must be <strong>5 points</strong> of length
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent border-secondary text-light-gray py-3">
                • New line must be on <strong>4 filled</strong> points and <strong>1 empty</strong>
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent border-secondary text-light-gray py-3">
                • Lines cannot overlap
              </ListGroup.Item>
            </ListGroup>
          </div>
        </div>
        </Row>

        <Row>
          <footer className="footer text-muted small">
            cezary.olkowski@gmail.com
          </footer>
        </Row>
      </Container>
    </React.Fragment>
  );
}

export default App;
