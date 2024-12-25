import React, { useState, useEffect, forwardRef, createRef } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import {
    Col,
    Button,
    Table,
    Row,
    Container,
    Card,
    Form,
    InputGroup,
    FormControl,
    Modal
} from 'react-bootstrap'
import moment from 'moment'

import DatePicker from 'react-datepicker'
import { Database } from '../../firebase'
import { PointRedemtionAction } from '../../redux/actions'
import { reverseObject, numberWithSeparators } from '../../utils/helpers'
import _ from 'lodash'

export const PointRedemtion = props => {
    const {
        pointRedemtion,
        getPointRedemtionAll,
        getPointRedemtionFilter,
        language
    } = props

    const [startDate, setStartDate] = useState(new Date())
    const [activity, setActivity] = useState(0)
    const [firstName, setFirstName] = useState('')

    const [show, setShow] = useState({ isShow: false })
    const [validated, setValidated] = useState(false)
    const refForm = createRef()

    const fromRefName = createRef()

    useEffect(() => {
        let startDateFormat = moment(startDate).format('YYYY-MM-DD')
        //console.log(startDateFormat, activity, firstName)
        getPointRedemtionFilter(startDateFormat, 0, firstName)
    }, [startDate, activity, firstName])

    useEffect(() => {
        getDataLevel()
    }, [show])

    const getDataLevel = async () => {
        const res = await Database.GetDataLevel()
        const form = refForm.current

        if (res.val() && form) {
            form['level'].value = res.val().pointLevel
        }
    }

    const CustomInput = forwardRef((props, ref) => {
        const { onClick, value } = props
        return (
            <Button onClick={onClick}>
                {`${language['report_time_1']} : `}<i className="fas fa-calendar-day"></i> {moment(new Date(value)).format('DD-MM-YYYY')}
            </Button>
        )
    })
    const renderTbody = () => {
        let item = []
        let itemRender = pointRedemtion
        if (activity) {
            itemRender = _.filter(pointRedemtion, (e) => {
                if (!_.isUndefined(e.activityType) && e.activityType === Number(activity)) {
                    return e
                } else if (_.isUndefined(e.activityType) && Number(activity) === 1) {
                    return e
                }
            })
        }
        itemRender.map((res, index) => {
            let textActivityType = language['global_can']
            if (!_.isUndefined(res.activityType)) {
                textActivityType = res.activityType === 1 ? language['global_can'] : language['global_cut']
            }
            item.push(
                <tr key={index}>
                    <td className="px-2">{moment(res.date * 1000).format('DD-MM-YYYY HH:mm:ss')}</td>
                    <td className="px-2">{res.phoneNumber}</td>
                    <td className="px-2">{`${res.firstName} ${res.firstName}`}</td>
                    <td className="px-2">{textActivityType}</td>
                    <td className="px-2">{res.remarks || ''}</td>
                    <td className="px-2">{numberWithSeparators(res.point)}</td>
                </tr>
            )
        })
        return item
    }

    const handleClose = () => {
        setShow({ isShow: false })
        setValidated(false)
    }

    const handleSubmit = async () => {
        try {
            const form = refForm.current

            if (form.checkValidity() === true) {
                const item = {
                    pointLevel: Number(form['level'].value),
                    pointDefault: 10
                }
                await Database.SetDataLevel(item)
                setValidated(false)
                handleClose()
                return
            }
            setValidated(true)
        } catch (error) {
            console.log(`error`, error)
        }
    }
    return (
        <Container fluid>
            <Row className='py-md-4'>
                <Col>
                    <Card className='card-stats card-dashboard shadow mb-4 mb-xl-0'>
                        <Card.Header className='bg-transparent pt-3'>
                            <Row>
                                <Col>
                                    <h4>{language['point_redemption_management']}</h4>
                                </Col>
                                <Col className='text-end'>
                                    <Button onClick={() => setShow({ isShow: true })}>
                                        <a><i className="fas fa-plus"></i> {language['point_redemption_title_1']}</a>
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Header>
                        <Card.Body>
                            <Row className='justify-content-end'>
                                <Col className='py-2 text-end' md={2}>
                                    <Form.Select
                                        onChange={e => {
                                            setActivity(e.target.value)
                                        }}
                                        name={'type'}
                                    >
                                        <option value={''}>{language['member_card_title_7']}</option>
                                        <option value={1}>{language['global_can']}</option>
                                        <option value={2}>{language['global_cut']}</option>
                                    </Form.Select>
                                </Col>
                                <Col className='py-2 text-end' md={3}>
                                    <InputGroup className='mb-3'>
                                        <FormControl
                                            placeholder={language['customer_title_8']}
                                            name={'name'}
                                            ref={fromRefName}
                                        />
                                        <Button
                                            onClick={() => {
                                                setFirstName(fromRefName.current.value)
                                            }}
                                        >
                                            <i className="fas fa-search"></i> {language['global_search']}
                                        </Button>
                                    </InputGroup>
                                </Col>
                                <Col className='py-2 text-end d-flex' md={3}>
                                    <DatePicker
                                        customInput={<CustomInput />}
                                        selected={startDate}
                                        onChange={date => setStartDate(date)}
                                    />
                                </Col>
                            </Row>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th className="px-2">{language['report_table_1']}</th>
                                        <th className="px-2">{language['point_redemption_title_2']}</th>
                                        <th className="px-2">{language['customer_title_8']}</th>
                                        <th className="px-2">{language['log_table_3']}</th>
                                        <th className="px-2">{language['global_reason']}</th>
                                        <th className="px-2">{language['point_redemption_title_3']}</th>
                                    </tr>
                                </thead>
                                <tbody>{renderTbody()}</tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={show.isShow} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{language['point_redemption_title_4']}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} ref={refForm}>
                        <Form.Group as={Col}>
                            <Form.Label>{language['point_redemption_title_3']}</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    type='number'
                                    name='level'
                                    placeholder=''
                                    required
                                />
                            </InputGroup>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={() => handleClose()}>
                        <i className="fas fa-window-close"></i> {language['global_close']}
                    </Button>
                    <Button variant='primary' onClick={() => handleSubmit()}>
                        <i className="fas fa-save"></i> {language['global_save']}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

const mapStateToProps = state => {
    const {
        pointRedemtion: { data: pointRedemtion },
        ui: { language }
    } = state
    return {
        pointRedemtion,
        language
    }
}

const mapDispatchToProps = {
    getPointRedemtionAll: PointRedemtionAction.getPointRedemtionAll,
    getPointRedemtionFilter: PointRedemtionAction.getPointRedemtionFilter
}

export default connect(mapStateToProps, mapDispatchToProps)(PointRedemtion)
