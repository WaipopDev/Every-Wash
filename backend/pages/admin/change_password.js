import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import BasePage from '../../src/components/BasePage'
import {
    Row,
    Col,
    Button,
    Card,
    Form,
    Alert,
    Spinner,
    Container
} from 'react-bootstrap'
import { Auth } from '../../src/firebase'
import { useRouter } from 'next/router'

export const ChangePassword = (props) => {
    const { userData, language } = props
    const [validated, setValidated] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [msg, setMsg] = useState({ type: '', message: '' });
    const router = useRouter()

    const handleSubmit = (event) => {
        const form = event.target

        if (form.checkValidity() === true) {
            if (newPassword !== confirmPassword) {
                setValidated(false)
                form['confirmPassword'].classList.add('is-invalid')
                event.preventDefault()
                event.stopPropagation()
                return
            }
            const user = Auth.currentUser;
            user.updatePassword(newPassword).then(() => {
                setMsg({ type: 'success', message: 'Updata Password Success' })
            }).catch((err) => {
                setMsg({ type: 'error', message: err.message })
                console.log(`err`, err)
            })
            event.preventDefault()
            event.stopPropagation()

        }
        setValidated(true)
        event.preventDefault()
        event.stopPropagation()
    }
    const onNewPassword = (v) => {
        setNewPassword(v)
    }
    const onConfirmPassword = (v) => {
        if (newPassword !== v.value) {
            v.classList.add('is-invalid')
            v.classList.remove('is-valid')
        } else {
            v.classList.add('is-valid')
            v.classList.remove('is-invalid')
        }
        setConfirmPassword(v.value)
    }
    return (
        <BasePage>
            <Container fluid>
                <Row className="py-md-4">
                    <Col>
                        <Card className="card-stats card-dashboard shadow mb-4 mb-xl-0">
                            <Card.Header className="bg-transparent pt-3">
                                <Row>
                                    <Col>
                                        <h4>{language['profile_title_6']}</h4>
                                    </Col>
                                </Row>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col className="py-2">
                                        <Button onClick={() => router.push('/admin/profile')} variant="secondary"><i className="fas fa-chevron-left"></i> {language['global_go_back']}</Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        {
                                            msg.message &&
                                            <Alert variant={msg.type === 'error' ? 'danger' : 'success'}>
                                                {msg.message}
                                            </Alert>
                                        }
                                        <Form noValidate onSubmit={(e) => handleSubmit(e)} validated={validated} >
                                            <Form.Group as={Col} className="pb-2">
                                                <Form.Label>{language['profile_title_7']}</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    name="newPassword"
                                                    value={newPassword}
                                                    onChange={(e) => onNewPassword(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>
                                            <Form.Group as={Col} className="pb-2">
                                                <Form.Label>{language['profile_title_8']}</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={confirmPassword}
                                                    onChange={(e) => onConfirmPassword(e.target)}
                                                    required
                                                />
                                            </Form.Group>
                                            <Button variant="primary" type="submit">
                                                <i className="fas fa-save"></i> {language['global_save']}
                                            </Button>
                                        </Form>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </BasePage>
    )
}

const mapStateToProps = (state) => {
    const {
        user: {
            data: userData
        },
        ui: {language }
    } = state
    return {
        userData,
        language
    }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword)
