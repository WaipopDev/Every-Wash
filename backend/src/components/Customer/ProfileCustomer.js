import React, { useEffect, useState, forwardRef } from 'react'
import { connect } from 'react-redux'
import {
    Col,
    Button,
    Table,
    Row,
    Form
} from 'react-bootstrap'
import moment from 'moment'

import DatePicker from "react-datepicker";
import { Database } from '../../firebase'
import { reverseObject } from '../../utils/helpers'

import _ from 'lodash'

export const ProfileCustomer = (props) => {
    const { data, back, userData, language } = props
    const [lastKey, setLastKey] = useState('')
    
    useEffect(async () => {

    }, [])
    return (
        <>
            <Row>
                <Col className="py-2">
                    <Button onClick={() => back()} variant="secondary"><i className="fas fa-chevron-left"></i> {language['global_go_back']}</Button>
                </Col>
            </Row>
            <Row>
                <Col className="py-2" md={6}>
                    <Form>
                        <Form.Group as={Col} className="pb-2">
                            <Form.Label>{language['global_username']}</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                defaultValue={data.firstName}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group as={Col} className="pb-2">
                            <Form.Label>{language['customer_title_8']}</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                defaultValue={data.lastName}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group as={Col} className="pb-2">
                            <Form.Label>{language['customer_table_1']}</Form.Label>
                            <Form.Control
                                type="text"
                                name="phoneNumber"
                                defaultValue={data.phoneNumber}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group as={Col} className="pb-2">
                            <Form.Label>{language['customer_title_9']}</Form.Label>
                            <Form.Control
                                type="text"
                                name="birthDay"
                                defaultValue={data.birthDay ? moment(data.birthDay * 1000).format('DD-MM-YYYY') : ''}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group as={Col} className="pb-2">
                            <Form.Label>{language['customer_title_10']}</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                defaultValue={data.address}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group as={Col} className="pb-2">
                            <Form.Label>{language['global_province']}</Form.Label>
                            <Form.Control
                                type="text"
                                name="province"
                                defaultValue={data.province}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group as={Col} className="pb-2">
                            <Form.Label>{language['global_zip_code']}</Form.Label>
                            <Form.Control
                                type="text"
                                name="zipcode"
                                defaultValue={data.ZIPcode}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group as={Col} className="pb-2">
                            <Form.Label>{language['global_point']}</Form.Label>
                            <Form.Control
                                type="text"
                                name="point"
                                defaultValue={data.point}
                                disabled
                            />
                        </Form.Group>
                       
                        <Form.Group as={Col} className="pb-2">
                            <Form.Label>{language['customer_title_6']}</Form.Label>
                            <Form.Control
                                type="text"
                                name="amount"
                                defaultValue={data.amount}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group as={Col} className="pb-2">
                            <Form.Label>{language['customer_title_11']}</Form.Label>
                            <Form.Control
                                type="text"
                                name="createAt"
                                defaultValue={moment(data.createAt * 1000).format('DD-MM-YYYY HH:mm:ss')}
                                disabled
                            />
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </>
    )
}

const mapStateToProps = (state) => {
    const {
        user: {
            data: userData
        },
        ui: { language }
    } = state
    return { userData,language }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileCustomer)
