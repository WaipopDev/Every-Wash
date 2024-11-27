import firebase from 'firebase/app'
import 'firebase/firestore'
import config from './config'
import moment from 'moment'

if (!firebase.apps.length) {
    firebase.initializeApp(config)
}
const Firestore = firebase.firestore()

export const dataBaseFn = () =>{
    return Firestore
}
export const Admin = () => {
    return Firestore.collection('Admin')
}

export const AdminGet = (id) => {
    return Admin().where('uid', '==', id).get()
}
export const AdminGetByChild = (child, value) => {
    return Admin().where(child, '==', value).get()
}
export const AdminVerifyAccount = (email, pass) => {
    return Admin().where('email', '==', email).where('password', '==', pass).get()
}
export const AdminVerifyAccountByEmail = (email)=>{
    return Admin().where('email', '==', email).get()
}
export const AdminGetAll = () => {
    return Admin().get()
}

export const AdminUpdate = (id, param) => {
    return Admin().doc(id).update(param)
}

export const ProgramWashingMachine = () => {
    return Firestore.collection('ProgramWashingMachine')
}
export const ProgramClothesDryer = () => {
    return Firestore.collection('ProgramClothesDryer')
}

export const ProgramWashingMachineGet = () => {
    return ProgramWashingMachine().where('status','==',1).get()
}
export const ProgramClothesDryerGet = () => {
    return ProgramClothesDryer().where('status','==',1).get()
}

export const ProgramWashingMachineUpdate = (id, param) => {
    return ProgramWashingMachine().doc(id).update(param)
}
export const ProgramClothesDryerUpdate = (id, param) => {
    return ProgramClothesDryer().doc(id).update(param)
}


export const Branch = () => {
    return Firestore.collection('Branch')
}
export const BranchGet = () => {
    return Branch().get()
}
export const BranchUpdate = (id, param) => {
    return Branch().doc(id).update(param)
}

export const WashingMachineAddLog = (param) => {
    return Firestore.collection(`/LogWashingMachine`).add(param)
}

export const WashingMachineAddLogIOT = (param) => {
    return Firestore.collection(`/LogMachineIOT`).add(param)
}

export const LogIOTConnect = (param) => {
    return Firestore.collection(`/LogIOTConnect`).add(param)
}

export const LogMachineGet = (id,startTime,endTime) => {
    return Firestore.collection(`/LogWashingMachine`).where('docIdMachine','==',id).where('createAt','>=',startTime).where('createAt','<=',endTime).orderBy('createAt','desc').get()
}
export const LogMachineGetLast = (id,startTime,endTime) => {
    return Firestore.collection(`/LogWashingMachine`).where('docIdMachine','==',id).where('createAt','>=',startTime).where('createAt','<=',endTime).orderBy('createAt','desc').limit(1).get()
}

export const LogIOTGet = (id,idIOT,startTime,endTime) => {
    return Firestore.collection(`/LogIOTConnect`).where('id','==',id).where('idIOT','==',idIOT).where('createAt','>=',startTime).where('createAt','<=',endTime).orderBy('createAt','desc').get()
}
export const LogIOTGetLast = (id,idIOT,startTime,endTime) => {
    return Firestore.collection(`/LogIOTConnect`).where('id','==',id).where('idIOT','==',idIOT).where('createAt','>=',startTime).where('createAt','<=',endTime).orderBy('createAt','desc').limit(1).get()
}

export const ReportGetSalesReport = async (branch, startDate, endDate) => {
    let startTime = await new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0).getTime() / 1000
    let endTime = await new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 0).getTime() / 1000

    if (branch) {
        return Firestore.collection(`/LogWashingMachine`).where('branchId','==',branch).where('createAt','>=',startTime).where('createAt','<=',endTime).orderBy('createAt','desc').get()
    }else{
        return Firestore.collection(`/LogWashingMachine`).where('createAt','>=',startTime).where('createAt','<=',endTime).orderBy('createAt','desc').get()
    }
}

export const ReportGetSalesMonthReport = async (branch,month,year) => {
    let startTime = await new Date(year, month-1, 1, 0, 0, 0, 0).getTime() / 1000
    let endTime = await new Date(year, month-1, 1, 0, 0, 0, 0)
    await endTime.setMonth(endTime.getMonth() + 1)
    endTime = await endTime.getTime() / 1000
    // if (branch) {
    //     return Firestore.collection(`/LogWashingMachine`).where('branchId','==',branch).where('createAt','>=',startTime).where('createAt','<',endTime).orderBy('createAt','desc').get()
    // }else{
    //     return Firestore.collection(`/LogWashingMachine`).where('createAt','>=',startTime).where('createAt','<',endTime).orderBy('createAt','desc').get()
    // }

    
    const snapshot = await Firestore.collection(`/LogWashingMachine`)
            .where('createAt','>=',startTime)
            .where('createAt','<',endTime)
            .orderBy('createAt','desc')
            .get()

    if (snapshot.empty) {
        return []
    } 

    let rowData = null
    let data = {}
    snapshot.forEach(doc => {
        rowData = doc.data()
        if(rowData.priceType !== 4){
            if (`${rowData.branchId}_${rowData.docIdMachine}` in data){
                data[`${rowData.branchId}_${rowData.docIdMachine}`]['priceProgram'] += Number(rowData.priceProgram)
            }else{
                data[`${rowData.branchId}_${rowData.docIdMachine}`] = {}
                data[`${rowData.branchId}_${rowData.docIdMachine}`]['branchName'] = rowData.branchName
                data[`${rowData.branchId}_${rowData.docIdMachine}`]['id'] = rowData.id
                data[`${rowData.branchId}_${rowData.docIdMachine}`]['nameMachine'] = rowData.nameMachine
                data[`${rowData.branchId}_${rowData.docIdMachine}`]['machineType'] = rowData.machineType
                data[`${rowData.branchId}_${rowData.docIdMachine}`]['priceProgram'] = Number(rowData.priceProgram)
                data[`${rowData.branchId}_${rowData.docIdMachine}`]['branchId'] = rowData.branchId
            }
        }
    })
    data = _.values(data)
    return data
}

export const ReportGetWashingReport = async (branch,startDate,endDate) => {
    let startTime = await new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0).getTime() / 1000
    let endTime = await new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 0).getTime() / 1000
    if (branch) {
        return Firestore.collection(`/LogWashingMachine`).where('branchId','==',branch).where('createAt','>=',startTime).where('createAt','<=',endTime).orderBy('createAt','desc').get()
    }else{
        return Firestore.collection(`/LogWashingMachine`).where('createAt','>=',startTime).where('createAt','<=',endTime).orderBy('createAt','desc').get()
    }
}

export const AdminGetKey = () => {
    return Firestore.collection(`/Admin`).doc()
}

export const WashingMachineUpdateLog = (doc,param) => {
    return Firestore.collection(`/LogWashingMachine`).doc(doc).update(param)
}
export const GetBranchById = (id) => {
    return Branch().doc(id).get()
}

export const SetCodePromotion = (param) => {
    return Firestore.collection(`/CodePromotion`).add(param)
}

export const UpdateCodePromotion = (doc,param) => {
    return Firestore.collection(`/CodePromotion`).doc(doc).update(param)
}

export const CodePromotionGet = () => {
    return Firestore.collection(`/CodePromotion`).orderBy('createAt','desc').get()
}

export const getProgramByDate = async (startDate,endDate) => {
    let startTime = await new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0).getTime() / 1000
    let endTime = await new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 0).getTime() / 1000

    return Firestore.collection(`/LogWashingMachine`).where('createAt','>=',startTime).where('createAt','<=',endTime).get()
}

export const WashingMachineGetLog = (doc) => {
    return Firestore.collection(`/LogWashingMachine`).doc(doc).get()
}
export const GetLogMachineIOTAll = async (date) => {
    let startTime = await new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0).getTime() / 1000
    let endTime = await new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 0).getTime() / 1000

    return Firestore.collection(`/LogMachineIOT`).where('createAt','>=',startTime).where('createAt','<=',endTime).get()
}
export const GetLogConnectIOTAll = async (date) => {
    let startTime = await new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0).getTime() / 1000
    let endTime = await new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 0).getTime() / 1000

    return Firestore.collection(`/LogIOTConnect`).where('machineType','==','2').where('createAt','>=',startTime).where('createAt','<=',endTime).get()
}



export const FixGetLogWashingMachine = (id) => {
    return Firestore.collection(`/LogWashingMachine`).where('id','==',id).get()
}

export const FixUpdateGetLogWashingMachine = (id,val) => {
    return Firestore.collection(`/LogWashingMachine`).doc(id).update({nameMachine:val})
}

export const DashboardGetItem6 = async () => {
    const startDate = new Date()
    const endDate   = new Date()
    let   startTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0).getTime() / 1000
    let   endTime   = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 0).getTime() / 1000
    return Firestore.collection(`/LogWashingMachine`).where('createAt','>=',startTime).where('createAt','<=',endTime).get()
 }
 export const DashboardGetItem7 = async (branch) => {
    const startDate = new Date()
    const endDate   = new Date()
    let   startTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0).getTime() / 1000
    let   endTime   = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 0).getTime() / 1000
    return Firestore.collection(`/LogWashingMachine`).where('createAt','>=',startTime).where('createAt','<=',endTime).get()
 }
 