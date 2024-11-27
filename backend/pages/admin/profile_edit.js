import React, { useEffect, useState, createRef } from 'react'
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
import { Firestore,Database } from '../../src/firebase'
import { useRouter } from 'next/router'
import { BranchActions, Ui } from '../../src/redux/actions'
import { reponseDatabase, AddLogAdmin, reponseFirestore } from '../../src/utils/helpers';
import moment from 'moment'
import _ from 'lodash'

export const Profile = (props) => {
    const { userData, permission, branchData, getBranch, alertShow, language } = props

    const [branch, setBranch]       = useState('')
    const [validated, setValidated] = useState(false);
    const [pending, setPending]   = useState(false);

    const router  = useRouter()
    const refForm = createRef()

    useEffect(() => {
        if (!branchData.length) {
            getBranch()
        } else if (branchData.length && branchData[0] && branch === '') {
             let query = router.query
           const findData = _.find(_.values(branchData), (item) => query.id_branch == item.docId)

            if(findData){
                setBranch(findData)
            }

        }
    }, [branchData])

    const handleClose = () => {
        router.push('/admin/profile')
    }

    const handleSubmit = async () => {
        try {
           
            if(!pending){
                const form = refForm.current
                setPending(true)
                if (form.checkValidity() === true) {
                    let param = {
                        nameCompany      : form['nameCompany'].value,
                        address          : form['address'].value,
                        tax              : form['tax'].value,
                        contactName      : form['contactName'].value,
                        contactEmail     : form['contactEmail'].value,
                        contactPhone     : form['contactPhone'].value,
                        billId           : form['billId'].value,
                        bankName         : form['bankName'].value,
                        bankNumber       : form['bankNumber'].value,
                        bank             : form['bank'].value,
                        bankBranch       : form['bankBranch'].value,
                        modifyAt         : moment().unix(),
                        modifyBy         : userData.id,
                    }
                    await Firestore.BranchUpdate(branch.docId, param)
                    await getBranch()
                    AddLogAdmin(userData, 'Branch Profile', `Edit Branch Name : ${form['name'].value}`)
                    alertShow(language['alert_1'])
                }
                setValidated(true);
                setPending(false)
            }
        } catch (error) {
            setPending(false)
            alertShow(language['alert_2'])
            console.log(`error`, error)
        }
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
                                        <h4>{language['branch_edit_information']}</h4>
                                    </Col>
                                </Row>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col className="py-2">
                                        <Button onClick={() => router.push('/admin/profile')} variant="secondary"><i className="fas fa-chevron-left"></i> {language['global_go_back']}</Button>
                                    </Col>
                                </Row>
                                {
                                    branch ? 
                                    <>
                                            <Form noValidate validated={validated} ref={refForm} >
                                               
                                                <Row>
                                                    <Col>
                                                        <Row>
                                                            <Col>
                                                                <h3>{language['profile_title_1']}</h3>
                                                            </Col>
                                                        </Row>
                                                        <Form.Group as={Col} className="pb-2">
                                                            <Form.Label>{language['branch_title_15']}</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                name="nameCompany"
                                                                // placeholder="ชื่อบริษัท ..."
                                                                defaultValue={branch.nameCompany}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group as={Col} className="pb-2">
                                                            <Form.Label>{language['branch_title_26']}</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                name="address"
                                                                // placeholder="ที่อยู่ในการออกใบกำกับภาษี ..."
                                                                defaultValue={branch.address}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group as={Col} className="pb-2">
                                                            <Form.Label>{language['branch_title_17']}</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                name="tax"
                                                                // placeholder="เลขประจำตัวผู้เสียภาษี ..."
                                                                defaultValue={branch.tax}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group as={Col} className="pb-2">
                                                            <Form.Label>{language['branch_title_16']}</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                name="contactName"
                                                                // placeholder="ชื่อผู้ติดต่อหรือชื่อเจ้าของร้าน ..."
                                                                defaultValue={branch.contactName}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group as={Col} className="pb-2">
                                                            <Form.Label>{language['global_email']}</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                name="contactEmail"
                                                                // placeholder="อีเมล ..."
                                                                defaultValue={branch.contactEmail}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group as={Col} className="pb-2">
                                                            <Form.Label>{language['branch_title_19']}</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                name="contactPhone"
                                                                // placeholder="เบอร์โทรติดต่อ ..."
                                                                defaultValue={branch.contactPhone}
                                                            />
                                                        </Form.Group>
                                                    </Col>

                                                    <Col>
                                                    <Row>
                                                        <Col>
                                                            <h3>{language['profile_title_5']}</h3>
                                                        </Col>
                                                    </Row>
                                                        <Form.Group as={Col} className="pb-2">
                                                            <Form.Label>{language['branch_title_20']}</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                name="billId"
                                                                // placeholder="ฺBiller ID ..."
                                                                defaultValue={branch.billId || '010552601807401'}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group as={Col} className="pb-2">
                                                            <Form.Label>{language['global_account_name']}</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                name="bankName"
                                                                // placeholder="ชื่อบัญชี ..."
                                                                defaultValue={branch.bankName}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group as={Col} className="pb-2">
                                                            <Form.Label>{language['branch_title_21']}</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                name="bankNumber"
                                                                // placeholder="เลขที่บัญชี ..."
                                                                defaultValue={branch.bankNumber}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group as={Col} className="pb-2">
                                                            <Form.Label>{language['branch_title_22']}</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                name="bank"
                                                                // placeholder="ชื่อธนาคาร ..."
                                                                defaultValue={branch.bank}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group as={Col} className="pb-2">
                                                            <Form.Label>{language['branch_title_23']}</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                name="bankBranch"
                                                                // placeholder="สาขาธนาคาร ..."
                                                                defaultValue={branch.bankBranch}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>


                                            </Form>
                                     <Col className="pt-3 modal-footer">
                                        <Button variant="secondary" onClick={ () => handleClose()}>
                                            <i className="fas fa-window-close"></i> {language['global_close']}
                                        </Button>
                                        <Button variant="primary" onClick={() => handleSubmit()}>
                                         {pending ? <Spinner animation="border" variant="light" /> : <><i className="fas fa-save"></i> {language['global_save']}</>}
                                        </Button>
                                    </Col>                          
                                    </>
                                    :
                                    <Row>
                                        <Col className="py-2 text-center">
                                        <h5>{language['global_no_data']}</h5>
                                        </Col>
                                    </Row>
                                }

                               
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </BasePage>
    )
}

const RedderItemRow = (props) => {
    const { name, value } = props
    return <Row>
        <Col md={5} className="d-flex justify-content-between">
            <p>{name}</p>
            <p>:</p>
        </Col>
        <Col md={7}>
            <p>{value}</p>
        </Col>
    </Row>
}

const mapStateToProps = (state) => {
    const {
        user: {
            data: userData,
            permission
        },
        branch: { data: branchData },
        ui: {language }
    } = state
    return {
        userData,
        permission,
        branchData,
        language
    }
}

const mapDispatchToProps = {
    getBranch: BranchActions.getBranch,
    alertShow: Ui.alertShow
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
