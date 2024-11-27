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
import { BranchActions } from '../../src/redux/actions'
import moment from 'moment'

export const Profile = (props) => {
    const { userData, permission, branchData, getBranch, language } = props

    const [branch, setBranch] = useState('')

    const router = useRouter()

    useEffect(() => {
        if (!branchData.length) {
            getBranch()
        } else if (branchData.length && branchData[0] && branch === '') {
            let item = branchData[0]
            if (permission.length) {
              const findData =  _.find(branchData, e => e.docId === permission[0].docId)
              if(findData){
                item = findData
              }else{
                item = ''
              }
            }
            setBranch(item)
        }
    }, [branchData])

   const renderStatus = (status) =>{
    let statusShow = ''
        switch (status) {
        case 1:
            statusShow = <span className="text-success">{language['global_active']}</span>
            break;
        case 2:
            statusShow = <span className="text-warning">{language['global_close']}</span>
            break;
        case 99:
            statusShow = <span className="text-danger">{language['global_delete']}</span>
            break;
    }
    return statusShow
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
                                        <h4>{language['profile_brancn']}</h4>
                                    </Col>
                                </Row>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col className="py-2" md={8} xl={6}>
                                        <Form.Select
                                            onChange={e => {
                                               const data = _.find(branchData, ed => ed.docId === e.target.value)
                                                setBranch(data)
                                            }}
                                            name={'branch'}
                                        >
                                            {branchData.map((res, index) => {
                                                if (permission.length) {
                                                    if (_.find(permission, e => e.docId === res.docId)) {
                                                        return (
                                                            <option key={index} value={res.docId}>
                                                                {res.name}
                                                            </option>
                                                        )
                                                    }
                                                } else {
                                                    return (
                                                        <option key={index} value={res.docId}>
                                                            {res.name}
                                                        </option>
                                                    )
                                                }
                                            })}
                                        </Form.Select>
                                    </Col>
                                </Row>
                                {
                                    branch !== '' ?
                                    <>
                                        <Row>
                                            <Col md={12} xl={6}>
                                                <Row>
                                                    <Col>
                                                        <h3>{language['profile_title_1']}</h3>
                                                    </Col>
                                                </Row>
                                                <RedderItemRow name={language['global_branch_name']} value={branch?.name || ''}/>
                                                <RedderItemRow name={language['branch_title_15']} value={branch?.nameCompany || ''}/>
                                                <RedderItemRow name={language['profile_title_2']} value={branch?.contactName || ''}/>
                                                <RedderItemRow name={language['customer_title_10']} value={branch?.address || ''}/>
                                                <RedderItemRow name={language['branch_title_17']} value={branch?.tax || ''}/>
                                                <RedderItemRow name={language['global_email']} value={branch?.contactEmail || ''}/>
                                                <RedderItemRow name={language['branch_title_19']} value={branch?.contactPhone || ''}/>

                                            </Col>
                                            <Col md={12} xl={6}>
                                                    <Row>
                                                        <Col>
                                                            <h3>{language['profile_title_3']}</h3>
                                                        </Col>
                                                    </Row>
                                                    <RedderItemRow name={language['global_status']} value={renderStatus(branch?.status)}/>
                                                    <RedderItemRow name={language['branch_title_10']} value={branch?.typeMember == 1 ? language['branch_free'] : language['branch_subscription'] || language['branch_free']}/>
                                                    <RedderItemRow name={language['branch_title_11']} value={moment(new Date(branch?.createAt * 1000 || new Date())).format('DD-MM-YYYY')}/>
                                                    <RedderItemRow name={language['profile_title_4']} value={moment(new Date(moment(branch?.expire * 1000 || new Date()).format('YYYY-MM-DD'))).format('DD-MM-YYYY')}/>
                                            </Col>
                                        </Row>
                                            <Row>
                                                <Col md={12} xl={6}>
                                                    <Row>
                                                        <Col>
                                                            <h3>{language['profile_title_5']}</h3>
                                                        </Col>
                                                    </Row>
                                                    <RedderItemRow name={language['global_account_name']} value={branch?.bankName || ''}/>
                                                    <RedderItemRow name={language['branch_title_22']} value={branch?.bank || ''}/>
                                                    <RedderItemRow name={language['branch_title_23']} value={branch?.bankBranch || ''}/>
                                                    <RedderItemRow name={language['branch_title_21']} value={branch?.bankNumber || ''}/>
                                                </Col>
                                            </Row>
                                    </>
                                    : null
                                }
                                 <Row className="pt-3">
                                    <Col md={12} xl={6} className="mb-2 text-center">
                                            <Button onClick={() => router.push('/admin/change_password')} className="btn-w-50">{language['profile_title_6']}</Button>
                                    </Col>
                                    <Col md={12} xl={6} className="mb-2 text-center">
                                        { branch !== '' ? <Button onClick={() => router.push(`/admin/profile_edit?id_branch=${branch.docId}`)} className="btn-w-50" >{language['profile_edit']}</Button> : null }
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
    getBranch: BranchActions.getBranch
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
