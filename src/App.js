import React from 'react';
import './App.css';
import Canvas from './components/canvas'

import { Container, Row, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css'

function App() {
  return (
    <Container>
      <Row>
        <Col xs={12}>
          <h3>Five Points Game</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={7}>
          <Canvas />
        </Col>
        <Col xs={5}>
          Right bar
        </Col>
      </Row>
    </Container>
  );
}

export default App;
