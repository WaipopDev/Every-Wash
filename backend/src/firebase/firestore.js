import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, addDoc, deleteDoc } from 'firebase/firestore';
import config from './config'
import moment from 'moment'

const firebaseApp = getApps().length ? getApp() : initializeApp(config);

// Initialize Firestore
const Firestore = getFirestore(firebaseApp);

export const dataBaseFn = () =>{
    return Firestore
}
export const Admin = () => {
    return collection(Firestore, 'Admin');
}

// export const AdminGet = (id) => {
//     return Admin().where('uid', '==', id).get()
// }
// Query Admin by UID
export const AdminGet = async (id) => {
    const adminQuery = query(Admin(), where('uid', '==', id));
    return await getDocs(adminQuery);
};

export const AdminGetByChild = async (child, value) => {
    // return Admin().where(child, '==', value).get()
    const adminQuery = query(Admin(), where(child, '==', value));
    return await getDocs(adminQuery);
}
export const AdminVerifyAccount = async (email, pass) => {
    const adminQuery = query(Admin(), where('email', '==', email), where('password', '==', pass));
    return await getDocs(adminQuery);
    // return Admin().where('email', '==', email).where('password', '==', pass).get()
}
export const AdminVerifyAccountByEmail = async (email)=>{
    const adminQuery = query(Admin(), where('email', '==', email));
    return await getDocs(adminQuery);
    // return Admin().where('email', '==', email).get()
}
export const AdminGetAll = async () => {
    // return Admin().get()
    const adminQuery = query(Admin());
    return await getDocs(adminQuery);
}

export const AdminUpdate = async (id, param) => {
    const adminDocRef = doc(Admin(), id);
    return await updateDoc(adminDocRef, param);
    // return Admin().doc(id).update(param)
}

export const ProgramWashingMachine = () => {
    return collection(Firestore, 'ProgramWashingMachine');
    // return Firestore.collection('ProgramWashingMachine')
}
export const ProgramClothesDryer = () => {
    return collection(Firestore, 'ProgramClothesDryer');
    // return Firestore.collection('ProgramClothesDryer')
}

export const ProgramWashingMachineGet = async () => {
    const adminQuery = query(ProgramWashingMachine(), where('status', '==', 1));
    return await getDocs(adminQuery);
    // return ProgramWashingMachine().where('status','==',1).get()
}
export const ProgramClothesDryerGet = () => {
    const adminQuery = query(ProgramClothesDryer(), where('status', '==', 1));
    return getDocs(adminQuery);
    // return ProgramClothesDryer().where('status','==',1).get()
}

export const ProgramWashingMachineUpdate = async (id, param) => {
        const programWashingMachineDocRef = doc(ProgramWashingMachine(), id);
        return await updateDoc(programWashingMachineDocRef, param);
    // return ProgramWashingMachine().doc(id).update(param)
}
export const ProgramClothesDryerUpdate = async (id, param) => {
    const programClothesDryerDocRef = doc(ProgramClothesDryer(), id);
    return await updateDoc(programClothesDryerDocRef, param);
    // return ProgramClothesDryer().doc(id).update(param)
}


export const Branch = () => {
    return collection(Firestore, 'Branch');
    // return Firestore.collection('Branch')
}
export const BranchGet = async () => {
    const branchCollection = Branch();
    return await getDocs(branchCollection);
    // return Branch().get()
}
export const BranchUpdate = async (id, param) => {
    const branchDocRef = doc(Branch(), id);
    return await updateDoc(branchDocRef, param);
    // return Branch().doc(id).update(param)
}

export const WashingMachineAddLog = async (param) => {
    const logWashingMachineCollection = collection(Firestore, 'LogWashingMachine');
    return await addDoc(logWashingMachineCollection, param);
    // return Firestore.collection(`/LogWashingMachine`).add(param)
}

export const WashingMachineAddLogIOT = async (param) => {
    const logIOTConnectCollection = collection(Firestore, 'LogIOTConnect');
    return await addDoc(logIOTConnectCollection, param);
    // return Firestore.collection(`/LogMachineIOT`).add(param)
}

export const LogIOTConnect = async (param) => {
    const logIOTConnectCollection = collection(Firestore, 'LogIOTConnect');
    return await addDoc(logIOTConnectCollection, param);
    // return Firestore.collection(`/LogIOTConnect`).add(param)
}

export const AdminAdd = async (param) => {
    const adminCollection = collection(Firestore, 'Admin');
    return await addDoc(adminCollection, param);
}

export const LogMachineGet = async (id,startTime,endTime) => {
    const logWashingMachineCollection = collection(Firestore, 'LogWashingMachine');
    return await getDocs(query(logWashingMachineCollection, where('docIdMachine', '==', id), where('createAt', '>=', startTime), where('createAt', '<=', endTime), orderBy('createAt', 'desc')));
    // return Firestore.collection(`/LogWashingMachine`).where('docIdMachine','==',id).where('createAt','>=',startTime).where('createAt','<=',endTime).orderBy('createAt','desc').get()
}
export const LogMachineGetLast = async (id,startTime,endTime) => {
    const logWashingMachineCollection = collection(Firestore, 'LogWashingMachine');
    return await getDocs(query(logWashingMachineCollection, where('docIdMachine', '==', id), where('createAt', '>=', startTime), where('createAt', '<=', endTime), orderBy('createAt', 'desc'), limit(1)));
    // return Firestore.collection(`/LogWashingMachine`).where('docIdMachine','==',id).where('createAt','>=',startTime).where('createAt','<=',endTime).orderBy('createAt','desc').limit(1).get()
}

export const LogIOTGet = async (id,idIOT,startTime,endTime) => {
    const logIOTConnectCollection = collection(Firestore, 'LogIOTConnect');
    return await getDocs(query(logIOTConnectCollection, where('id', '==', id), where('idIOT', '==', idIOT), where('createAt', '>=', startTime), where('createAt', '<=', endTime), orderBy('createAt', 'desc')));
    // return Firestore.collection(`/LogIOTConnect`).where('id','==',id).where('idIOT','==',idIOT).where('createAt','>=',startTime).where('createAt','<=',endTime).orderBy('createAt','desc').get()
}
export const LogIOTGetLast = async (id,idIOT,startTime,endTime) => {
    const logIOTConnectCollection = collection(Firestore, 'LogIOTConnect');
    return await getDocs(query(logIOTConnectCollection, where('id', '==', id), where('idIOT', '==', idIOT), where('createAt', '>=', startTime), where('createAt', '<=', endTime), orderBy('createAt', 'desc'), limit(1)));
    // return Firestore.collection(`/LogIOTConnect`).where('id','==',id).where('idIOT','==',idIOT).where('createAt','>=',startTime).where('createAt','<=',endTime).orderBy('createAt','desc').limit(1).get()
}

export const ReportGetSalesReport = async (branch, startDate, endDate) => {
    let startTime = await new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0).getTime() / 1000
    let endTime = await new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 0).getTime() / 1000

    const logWashingMachineCollection = collection(Firestore, 'LogWashingMachine');
    if (branch) {
        return await getDocs(query(logWashingMachineCollection, where('branchId', '==', branch), where('createAt', '>=', startTime), where('createAt', '<=', endTime), orderBy('createAt', 'desc')));
        // return Firestore.collection(`/LogWashingMachine`).where('branchId','==',branch).where('createAt','>=',startTime).where('createAt','<=',endTime).orderBy('createAt','desc').get()
    }else{
        return await getDocs(query(logWashingMachineCollection, where('createAt', '>=', startTime), where('createAt', '<=', endTime), orderBy('createAt', 'desc')));
        // return Firestore.collection(`/LogWashingMachine`).where('createAt','>=',startTime).where('createAt','<=',endTime).orderBy('createAt','desc').get()
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

    const logWashingMachineCollection = collection(Firestore, 'LogWashingMachine');
    const snapshot = await getDocs(query(logWashingMachineCollection, where('createAt', '>=', startTime), where('createAt', '<', endTime), orderBy('createAt', 'desc')));
    
    // const snapshot = await Firestore.collection(`/LogWashingMachine`)
    //         .where('createAt','>=',startTime)
    //         .where('createAt','<',endTime)
    //         .orderBy('createAt','desc')
    //         .get()

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
    const logWashingMachineCollection = collection(Firestore, 'LogWashingMachine');
    if (branch) {
        return await getDocs(query(logWashingMachineCollection, where('branchId', '==', branch), where('createAt', '>=', startTime), where('createAt', '<=', endTime), orderBy('createAt', 'desc')));
        // return Firestore.collection(`/LogWashingMachine`).where('branchId','==',branch).where('createAt','>=',startTime).where('createAt','<=',endTime).orderBy('createAt','desc').get()
    }else{
        return await getDocs(query(logWashingMachineCollection, where('createAt', '>=', startTime), where('createAt', '<=', endTime), orderBy('createAt', 'desc')));
        // return Firestore.collection(`/LogWashingMachine`).where('createAt','>=',startTime).where('createAt','<=',endTime).orderBy('createAt','desc').get()
    }
}

export const AdminGetKey = async () => {
    const adminCollectionRef = collection(Firestore, 'Admin');
    return  doc(adminCollectionRef);
    // const adminQuery = query(Admin());
    // return await getDocs(adminQuery);
    // return Firestore.collection(`/Admin`).doc()
}

export const WashingMachineUpdateLog = async (doc,param) => {
    const logWashingMachineDocRef = doc(Firestore, 'LogWashingMachine', doc);
    return await updateDoc(logWashingMachineDocRef, param);
    // return Firestore.collection(`/LogWashingMachine`).doc(doc).update(param)
}
export const GetBranchById = async (id) => {
    return doc(Firestore, 'Branch', id);
    // const branchCollection = collection(Firestore, 'Branch');
    // return await getDocs(query(branchCollection, where('id', '==', id)));
    // return Branch().doc(id).get()
}

export const SetCodePromotion = async (param) => {
    const codePromotionCollection = collection(Firestore, 'CodePromotion');
    return await addDoc(codePromotionCollection, param);
    // return Firestore.collection(`/CodePromotion`).add(param)
}

export const UpdateCodePromotion = async (doc,param) => {
    const codePromotionDocRef = doc(Firestore, 'CodePromotion', doc);
    return await updateDoc(codePromotionDocRef, param);
    // return Firestore.collection(`/CodePromotion`).doc(doc).update(param)
}

export const CodePromotionGet = async () => {
    const codePromotionCollection = collection(Firestore, 'CodePromotion');
    return await getDocs(query(codePromotionCollection, orderBy('createAt', 'desc')));

    // return Firestore.collection(`/CodePromotion`).orderBy('createAt','desc').get()
}

export const getProgramByDate = async (startDate,endDate) => {
    let startTime = await new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0).getTime() / 1000
    let endTime = await new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 0).getTime() / 1000

    const programWashingMachineCollection = collection(Firestore, 'ProgramWashingMachine');
    return await getDocs(query(programWashingMachineCollection, where('createAt', '>=', startTime), where('createAt', '<=', endTime)));
    // return Firestore.collection(`/LogWashingMachine`).where('createAt','>=',startTime).where('createAt','<=',endTime).get()
}

export const WashingMachineGetLog = async (doc) => {
    return doc(Firestore, 'LogWashingMachine', doc);
    // return Firestore.collection(`/LogWashingMachine`).doc(doc).get()
}
export const GetLogMachineIOTAll = async (date) => {
    let startTime = await new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0).getTime() / 1000
    let endTime = await new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 0).getTime() / 1000

    const logIOTConnectCollection = collection(Firestore, 'LogIOTConnect');
    return await getDocs(query(logIOTConnectCollection, where('createAt', '>=', startTime), where('createAt', '<=', endTime)));
    // return Firestore.collection(`/LogMachineIOT`).where('createAt','>=',startTime).where('createAt','<=',endTime).get()
}
export const GetLogConnectIOTAll = async (date) => {
    let startTime = await new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0).getTime() / 1000
    let endTime = await new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 0).getTime() / 1000

    const logIOTConnectCollection = collection(Firestore, 'LogIOTConnect');
    return await getDocs(query(logIOTConnectCollection, where('createAt', '>=', startTime), where('createAt', '<=', endTime), where('machineType', '==', 2)));
    // return Firestore.collection(`/LogIOTConnect`).where('machineType','==','2').where('createAt','>=',startTime).where('createAt','<=',endTime).get()
}



export const FixGetLogWashingMachine = async (id) => {
    const logWashingMachineCollection = collection(Firestore, 'LogWashingMachine');
    return await getDocs(query(logWashingMachineCollection, where('id', '==', id)));

    // return Firestore.collection(`/LogWashingMachine`).where('id','==',id).get()
}

export const FixUpdateGetLogWashingMachine = async (id,val) => {
    const logWashingMachineDocRef = doc(Firestore, 'LogWashingMachine', id);
    return await updateDoc(logWashingMachineDocRef, { nameMachine: val });
    // return Firestore.collection(`/LogWashingMachine`).doc(id).update({nameMachine:val})
}

export const DashboardGetItem6 = async () => {
    const startDate = new Date()
    const endDate   = new Date()
    let   startTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0).getTime() / 1000
    let   endTime   = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 0).getTime() / 1000
    const logWashingMachineCollection = collection(Firestore, 'LogWashingMachine');
    return await getDocs(query(logWashingMachineCollection, where('createAt', '>=', startTime), where('createAt', '<=', endTime)));
    // return Firestore.collection(`/LogWashingMachine`).where('createAt','>=',startTime).where('createAt','<=',endTime).get()
 }
 export const DashboardGetItem7 = async (branch) => {
    const startDate = new Date()
    const endDate   = new Date()
    let   startTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0).getTime() / 1000
    let   endTime   = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 0).getTime() / 1000
    const logWashingMachineCollection = collection(Firestore, 'LogWashingMachine');
    return await getDocs(query(logWashingMachineCollection, where('createAt', '>=', startTime), where('createAt', '<=', endTime)));
    // return Firestore.collection(`/LogWashingMachine`).where('createAt','>=',startTime).where('createAt','<=',endTime).get()
 }
 

 export const AddNewBranch = async (param) => {
    const branchCollection = collection(Firestore, 'Branch');
    return await addDoc(branchCollection, param);
 }

 export const GetTotalBranch = async () => {
    const branchCollection = collection(Firestore, 'Branch');
    return await getDocs(branchCollection);
 }

 export const DeleteBranch = async (id) => {
    const branchDocRef = doc(Firestore, 'Branch', id);
    return await deleteDoc(branchDocRef);
 }

 export const AddProgramWashingMachine = async (param) => {
    const programWashingMachineCollection = collection(Firestore, 'ProgramWashingMachine');
    return await addDoc(programWashingMachineCollection, param);
 }

 export const AddProgramClothesDryer = async (param) => {
    const programClothesDryerCollection = collection(Firestore, 'ProgramClothesDryer');
    return await addDoc(programClothesDryerCollection, param);
 }