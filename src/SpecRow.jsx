import React from "react";
import { Card, Row, Col } from "react-bootstrap";

const SpecRow = ({ children }) => {
    return (
        <Row className="justify-content-center">
            <Col className="col-12 col-lg-6">
                <Card className="phase0 mx-auto mt-3">
                    <Card.Body className="p2rem">{children}</Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default SpecRow;
