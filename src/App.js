import React from 'react';
import './App.css';
import Canvas from './components/canvas'

import { Container, Row, Col, Navbar } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css'

function App() {
  return (
    <div>
      <Container>
        <Navbar bg="primary" variant="dark">
          <Navbar.Brand href="/">Five Points Game</Navbar.Brand>
        </Navbar>
        <Row>
          <Col xs={8}>
            <Canvas />
          </Col>
          <Col xs={4}>
            <h5>Game rules:</h5>
            <ol>
              <li>Line must be 5 points of length</li>
              <li>New line must be on 4 filled points and 1 empty</li>
              <li>Lines cannot overlap</li>
            </ol>
          </Col>
        </Row>
        <footer className="footer" bg="primary">
          cezary,olkowski@gmail.com
        </footer>
      </Container>
    </div>
  );
}

export default App;
