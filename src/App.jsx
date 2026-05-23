import React from 'react';
import Canvas from './components/canvas'
import { Container, Row, Col, Navbar, Card, ListGroup } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import './App.css';

function App() {
  return (
    <React.Fragment>
      <Container fluid className="px-0 py-2 bg-dark-theme min-vh-100">
        <Navbar variant="dark" className="navbar mb-4 border-bottom border-secondary bg-transparent px-4">
          <Navbar.Brand className="navbar-brand" href="/">
            <span className="fw-bold text-light">Five Points</span> Game
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
