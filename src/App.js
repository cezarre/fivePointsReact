import React from 'react';
import Canvas from './components/canvas'
import { Container, Row, Col, Navbar } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import './App.css';

function App() {
  return (
    <React.Fragment>
      <Container>
        <Navbar bg="primary" variant="dark">
          <Navbar.Brand href="/">Five Points Game</Navbar.Brand>
        </Navbar>
        <Row className="firstrow">
          <Canvas className="colcanvas"/>
          <Col xs className="gamerulescol">
            <div className="conteiner gamerules">
              <div className="rulesbutton">
                Rules
              </div>
              <h5>Game rules:</h5>
              <ol>
                <li>Line must be 5 points of length</li>
                <li>New line must be on 4 filled points and 1 empty</li>
                <li>Lines cannot overlap</li>
              </ol>
            </div>
          </Col>
        </Row>
        <footer className="conteiner footer" bg="primary">
          cezary.olkowski@gmail.com
        </footer>
      </Container>
    </React.Fragment>
  );
}

export default App;
