import React from 'react'
import { Container, Row, Col, Card, Table, Form, Button, Spinner } from 'react-bootstrap'

const CardTotalBranch = (props) => {
    const { item1, totalDay, language } = props
  return (
        <Row className='py-md-4'>
            {item1.map((res, index) => {
              return (
                <Col key={index} className="pb-2 box5">
                  <Card className='card-stats card-dashboard shadow mb-4 mb-xl-0 h-100'>
                    <Card.Body>
                      <Row>
                        <div className='col'>
                          <Card.Title className='text-uppercase text-muted mb-0'>
                            {res.title}
                          </Card.Title>
                          <span className='h4 font-weight-bold mb-0'>
                            {res.total}
                          </span>
                        </div>
                        <Col className='col-auto'>
                          <div
                            className='icon icon-shape text-white rounded-circle shadow'
                            style={{ background: '#FF7D80' }}
                          >
                            <i className={res.icon} />
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              )
            })}
            <Col className="pb-2 box5">
              <Card className='card-stats card-dashboard shadow mb-4 mb-xl-0 h-100'>
                <Card.Body>
                  <Row>
                    <div className='col'>
                      <Card.Title className='text-uppercase text-muted mb-0'>
                        {language['dashboard_total_income_24_hours']}
                      </Card.Title>
                      <span className='h4 font-weight-bold mb-0'>
                        {totalDay}
                      </span>
                    </div>
                    <Col className='col-auto'>
                      <div
                        className='icon icon-shape text-white rounded-circle shadow'
                        style={{ background: '#FF7D80' }}
                      >
                        <i className={'fas fa-hand-holding-usd'} />
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
  )
}

export default CardTotalBranch