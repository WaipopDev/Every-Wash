import React, { useState, useEffect, createRef } from 'react'
import { connect } from 'react-redux'
import { Firestore, Database } from '../../firebase'
import { Container, Row, Col, Card, Table, Form, Button, Spinner } from 'react-bootstrap'
import {
    AddLogAdmin,
    reponseFirestore,
    reponseDatabase
  } from '../../utils/helpers'
import _ from 'lodash'
import moment from 'moment'
export const MachineShow = (props) => {
    const { permission, branchData, language } = props
    const [machine, setMachine] = useState([])
    const [machineList, setMachineList] = useState([])
    useEffect(() => {
        getDataMachineShow()

        Database.WashingMachineGetOnAll(e =>comWashingMachineGetOnAll(e) )
        return () => {
            // unsubscribe()
            Database.UnsubWashingMachineGetOnAll()
            // onActiveWashingMachine()
        }
    }, [])

    const onActiveWashingMachine = async () => {
        
    }

    const comWashingMachineGetOnAll = (e) =>{
        if(e){
          
            // console.log('e', e.key,e.val())
            let item = e.val()
            item.activeStatus = item.status == 3 ? 0 : 1
            if(item.status !== 99){
                setMachineList(old=>({
                    ...old,
                    [e.key]: item
                }))
            }
        }
    }
    const getDataMachineShow =  async () =>{

        const resWM = await Database.WashingMachineGetAll()
        // const resWM = await Database.WashingMachineGetByBranch()
        
        const gresWM = _.groupBy(reponseDatabase(resWM),'branch')
        setMachine(gresWM)
        setMachineList(resWM.val())
    }

    const _render = () =>{
        let itemRender = []
        
        _.map(machine,(res,index)=>{
            let ckPermission = true
            if (permission.length) {
                if(_.find(permission, e => e.docId === index)){
                    ckPermission = true
                }else{
                    ckPermission = false
                }
            }
            if(res[0] && ckPermission){
                let m1 = []
                let m2 = []
                _.map(machineList,(res2,index2)=>{
                    if(res2.branch == index && res2.status != 99){
                        if(res2.machineType == 1){
                            let saturate = res2.activeStatus == 1 ? 'saturate':''
                            let saturateError = res2.activeStatus == 0 ? 'saturate-red':''
                            const h = moment().diff(res2.connectAt * 1000,'hour')
                            const d = moment().diff(res2.connectAt * 1000,'day')
                            if(!_.isUndefined(res2.activeStatus) && !_.isNaN(h) && h > 0){
                                saturate = ''
                            }else if(_.isUndefined(res2.activeStatus) && d == 0){
                                saturate = 'saturate'
                            }
                            m1.push(
                                <div className={`box-machine-1 ${saturate} ${saturateError}`} key={index2}>
                                    <p className='m-0'>{res2.name}</p>
                                </div>
                            )
                        }else{
                            let saturate = res2.activeStatus == 1 ? 'saturate':''
                            let saturateError = res2.activeStatus == 0 ? 'saturate-red':''
                            const h = moment().diff(res2.connectAt * 1000,'hour')
                            const d = moment().diff(res2.connectAt * 1000,'day')
                            if(!_.isUndefined(res2.activeStatus) && !_.isNaN(h) && h > 0){
                                saturate = ''
                            }else if(_.isUndefined(res2.activeStatus) && d == 0){
                                saturate = 'saturate'
                            }
                            m2.push(
                                <div className={`box-machine-2 ${saturate} ${saturateError}`} key={index2}>
                                    <p className='m-0'>{res2.name}</p>
                                </div>
                            )
                        }
                    }
                })
            itemRender.push(
                <div key={index} className="p-2">
                    <Row>
                        <h5 className="">{res[0].branchName || ''}</h5>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Card className="card-stats card-dashboard shadow h-100">
                                <Card.Body> 
                                    <p>{language['global_washing_machine']}</p>
                                    <div className="d-flex flex-wrap">
                                        {m1}
                                    </div>
                                </Card.Body>
                            </Card>
                        
                        </Col>
                        <Col md={6}>
                            <Card className="card-stats card-dashboard shadow h-100">
                                <Card.Body> 
                                    <p>{language['global_dryer_machine']}</p>
                                    <div className="d-flex flex-wrap">
                                        {m2}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
                )
            }
        })

        return itemRender
    }
    return (
     <div className="p-2">
        {_render()}
     </div>
    )
}

const mapStateToProps = (state) => {
    const {
        user: { data: userData,permission },
        branch: { data: branchData },
        ui: { language }
    } = state
    return {
        branchData,
        permission,
        language
    }
}

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(MachineShow)