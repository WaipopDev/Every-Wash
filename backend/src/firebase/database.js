import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase, ref, set, push, get, child, update, query, orderByChild, equalTo, startAt, endAt, limitToFirst, limitToLast, onChildChanged, off, orderByKey, remove } from 'firebase/database'
import config from './config'
import moment from 'moment'
import _ from 'lodash'

const firebaseApp = getApps().length ? getApp() : initializeApp(config);


const Firestore = getFirestore(firebaseApp);
const Database = getDatabase(firebaseApp)

export const dataBaseFn = () => {
    return Database
}
export const WashingMachine = () => {
    return ref(Database, `/WashingMachine`)
    // return Database.ref(`/WashingMachine`)
}
export const Customer = () => {
    return ref(Database, `/User`)
    // return Database.ref(`/User`)
}
export const Promotion = () => {
    return ref(Database, `/Promotion`)
    // return Database.ref(`/Promotion`)
}
export const Wallet = () => {
    return ref(Database, `/Wallet`)
    // return Database.ref(`/Wallet`)
}
export const PointRedemtion = () => {
    return ref(Database, `/PointAndRedemtion`)
    // return Database.ref(`/PointAndRedemtion`)
}
export const PromotionGetKey = async () => {
    return await push(Promotion());
    // set(newRef, data)
    // return Promotion().push()
}
export const PromotionGet = async () => {
    return await get(Promotion());
    // return Promotion().once('value')
}
export const PromotionUpdateByKey = async (id, param) => {
    return await update(child(Promotion(), id), param);
    // return Database.ref(`/Promotion/${id}`).update(param)
}

export const WashingMachineAdd = async (param) => {
    return await set(push(WashingMachine()), param);
    // return WashingMachine().push().set(param)
}

export const WashingMachineGetAll = async () => {
    const washingMachineRef = WashingMachine();
    const washingMachineQuery = query(washingMachineRef, orderByChild('statusActive'), equalTo('ACTIVE'));
    return await get(washingMachineQuery);
    // return WashingMachine().orderByChild('statusActive').equalTo('ACTIVE').once('value')
}
export const WashingMachineGetOnAll = (callback) => {
    const washingMachineRef = WashingMachine();
    return onChildChanged(washingMachineRef, callback);
    // return WashingMachine().on('child_changed',callback)
}
export const UnsubWashingMachineGetOnAll = (callback) => {
    const washingMachineRef = WashingMachine();
    return off(washingMachineRef);
    // return WashingMachine().off()
    // return WashingMachine().off('child_changed',callback)
}

export const WashingMachineGetFilter = async (branchFilter) => {
    if (branchFilter) {
        const washingMachineQuery = query(WashingMachine(), orderByChild('branch'), equalTo(branchFilter));
        return await get(washingMachineQuery);
        // return WashingMachine().orderByChild('branch').equalTo(branchFilter).once('value')
    } else {
        return await get(WashingMachine());
        // return WashingMachine().once('value')
    }
}

export const WashingMachineGetByID = async (id) => {
    const washingMachineRef = WashingMachine();
    const washingMachineQuery = query(washingMachineRef, orderByChild('idIOT'), equalTo(id));
    return await get(washingMachineQuery);
    // return WashingMachine().orderByChild('idIOT').equalTo(id).once('value')
}

export const WashingMachineGetByIDMachine = async (id) => {
    const washingMachineRef = WashingMachine();
    const washingMachineQuery = query(washingMachineRef, orderByChild('id'), equalTo(id));
    return await get(washingMachineQuery);
    // return WashingMachine().orderByChild('idIOT').equalTo(id).once('value')
}


export const WashingMachineGetByChild = async (child, value) => {
    const washingMachineRef = WashingMachine();
    const washingMachineQuery = query(washingMachineRef, orderByChild(child), equalTo(value));
    return await get(washingMachineQuery);
    // return WashingMachine().orderByChild(child).equalTo(value).once('value')
}

export const WashingMachineUpdateByKey = async (id, param) => {
    const washingMachineRef = WashingMachine();
    return await update(child(washingMachineRef, id), param);
    // return Database.ref(`/WashingMachine/${id}`).update(param)
}

export const WashingMachineSetProgram = async (id, param) => {
    const programRef = ref(db, `/WashingMachine/${id}/program`);
    return await set(programRef, param);
    // return Database.ref(`/WashingMachine/${id}/program`).set(param)
}

export const WashingMachineGetByKey = async (id) => {
    const washingMachineRef = WashingMachine();
    return await get(child(washingMachineRef, id));
    // return Database.ref(`/WashingMachine/${id}`).once('value')
}
// export const WashingMachineCheckRef = (id) => {
//     return WashingMachine().orderByChild('ref').equalTo(id).once('value')
// }
export const CustomerGetAll = async () => {
    const customerRef = Customer();
    return await get(customerRef);
    // return Database.ref(`/User`).once('value')
}

export const CustomerGetLimlt = async (PAGE_SIZE) => {
    const customerRef = Customer();
    const customerQuery = query(customerRef, orderByKey(), limitToFirst(PAGE_SIZE));
    return await get(customerQuery);
    // return Database.ref(`/User`).orderByKey().limitToFirst(PAGE_SIZE).once('value')
}
export const CustomerGetLimltLoadMore = async (lastKey,PAGE_SIZE) => {
    const customerRef = Customer();
    const customerQuery = query(customerRef, orderByKey(), startAt(lastKey), limitToFirst(PAGE_SIZE+1));
    return await get(customerQuery);
    // return Database.ref(`/User`).orderByKey().startAt(lastKey).limitToFirst(PAGE_SIZE+1).once('value')
}
export const CustomerGetLimltFilter = async (PAGE_SIZE,type, gender, firstName, phone) => {
    const customerRef = Customer();
    if(firstName){
        const customerQuery = query(customerRef, orderByChild('firstName'), startAt(firstName), endAt(`${firstName}\uf8ff`), limitToFirst(PAGE_SIZE));
        return await get(customerQuery);
        // return Database.ref(`/User`).orderByChild('firstName').startAt(firstName).endAt(`${firstName}\uf8ff`).limitToFirst(PAGE_SIZE).once('value')
    }else if(type){
        const customerQuery = query(customerRef, orderByChild('status'), equalTo(Number(type)), limitToFirst(PAGE_SIZE));
        return await get(customerQuery);
        // return Database.ref(`/User`).orderByChild('status').equalTo(Number(type)).limitToFirst(PAGE_SIZE).once('value')
    }else if(gender){
        const customerQuery = query(customerRef, orderByChild('gender'), equalTo(Number(gender)), limitToFirst(PAGE_SIZE));
        return await get(customerQuery);
        // return Database.ref(`/User`).orderByChild('gender').equalTo(Number(gender)).limitToFirst(PAGE_SIZE).once('value')
    }else if(phone){
        const customerQuery = query(customerRef, orderByChild('phoneNumber'), startAt(phone), endAt(`${phone}\uf8ff`), limitToFirst(PAGE_SIZE));
        return await get(customerQuery);
        // return Database.ref(`/User`).orderByChild('phoneNumber').startAt(`${phone}`).endAt(`${phone}\uf8ff`).limitToFirst(PAGE_SIZE).once('value')
    }
    const customerQuery = query(customerRef,orderByKey(), limitToFirst(PAGE_SIZE));
    return await get(customerQuery);
    // return Database.ref(`/User`).orderByKey().limitToFirst(PAGE_SIZE).once('value')
}
export const CustomerGetLimltLoadMoreFilter = async (lastKey,PAGE_SIZE,type, gender, firstName, phone) => {
    const customerRef = Customer();
    const customerQuery = query(customerRef, orderByKey(), startAt(lastKey), limitToFirst(PAGE_SIZE+1));
    return await get(customerQuery);
    // return Database.ref(`/User`).orderByKey().startAt(lastKey).limitToFirst(PAGE_SIZE+1).once('value')
}
export const CustomerGetFilter = async (type, gender, firstName) => {
    const customerRef = Customer();
    if (firstName === '') {
        let items = []
        const snapshot = await get(customerRef);
        // await Customer().once('value', (snapshot) => {
            snapshot.forEach((snap) => {
                if (type !== 0 && gender === 0) {
                    if (snap.val().status === type) {
                        items.push(snap.val())
                    }
                } else if (type === 0 && gender !== 0) {
                    if (snap.val().gender === gender) {
                        items.push(snap.val())
                    }
                } else if (type !== 0 && gender !== 0) {
                    if (snap.val().status === type && snap.val().gender === gender) {
                        items.push(snap.val())
                    }
                } else {
                    items.push(snap.val())
                }
            })
        // })
        return items
    } else if (firstName !== '') {
        let items = []
        const snapshot = await get(query(customerRef, orderByChild('firstName'), startAt(firstName), endAt(`${firstName}\uf8ff`)));
        // await Customer().orderByChild('firstName').startAt(firstName).endAt(`${firstName}\uf8ff`).once('value', (snapshot) => {
            snapshot.forEach((snap) => {
                if (type !== 0 && gender === 0) {
                    if (snap.val().status === type) {
                        items.push(snap.val())
                    }
                } else if (type === 0 && gender !== 0) {
                    if (snap.val().gender === gender) {
                        items.push(snap.val())
                    }
                } else if (type !== 0 && gender !== 0) {
                    if (snap.val().status === type && snap.val().gender === gender) {
                        items.push(snap.val())
                    }
                } else {
                    items.push(snap.val())
                }
            })
        // })
        return items
    } else {
        return await get(customerRef);
        // return await Customer().once('value')
    }
}

export const CustomerUpdateByID = async (id, param) => {
    const customerRef = Customer();
    return await update(child(customerRef, id), param);
    // return Database.ref(`/User/${id}`).update(param)
}

export const AdminLog = async (id, param) => {
    const params = {
        date: moment().unix(),
        menu: param.menu,
        activity: param.activity
    }
    const logRef = ref(Database, `/AdminLog/${id}/${moment().format('YYYY-MM-DD')}/`);
    const newLogRef = push(logRef);
    return set(newLogRef, params);
    // return Database.ref(`/AdminLog/${id}/${moment().format('YYYY-MM-DD')}/`).push().set(params)
}

export const AdminLogGet = async (id, date) => {
    const adminLogRef = ref(Database, `/AdminLog/${id}/${date}/`);
    return await get(query(adminLogRef, limitToLast(11)));
    // return Database.ref(`/AdminLog/${id}/${date}/`).limitToLast(11).once('value')
}
export const AdminLogLoadGet = async (id, date, key) => {
    const adminLogRef = ref(Database, `/AdminLog/${id}/${date}/`);
    return await get(query(adminLogRef, orderByKey(), endAt(key), limitToLast(11)));
    // return Database.ref(`/AdminLog/${id}/${date}/`).orderByKey().endAt(key).limitToLast(11).once('value')
}

export const CustomerLogGet = async (id, date) => {
    const customerLogRef = ref(Database, `/UserLog/${id}/${date}/`);
    return await get(query(customerLogRef, limitToLast(11)));
    // return Database.ref(`/UserLog/${id}/${date}/`).limitToLast(11).once('value')
}
export const CustomerLogGetAll = async (id, date) => {
    const customerLogRef = ref(Database, `/UserLog/${id}/${date}/`);
    return await get(customerLogRef);
    // return Database.ref(`/UserLog/${id}/${date}/`).once('value')
}

export const CustomerLogLoadGet = async (id, date, key) => {
    const customerLogRef = ref(Database, `/UserLog/${id}/${date}/`);
    return await get(query(customerLogRef, orderByKey(), endAt(key), limitToLast(11)));
    // return Database.ref(`/UserLog/${id}/${date}/`).orderByKey().endAt(key).limitToLast(11).once('value')
}
export const CustomerLogSet = async (id, params) => {
    const logRef = ref(Database, `/UserLog/${id}/${moment().format('YYYY-MM')}/`);
    const newLogRef = push(logRef);
    await set(newLogRef, params);

    const logRefDay = ref(Database, `/UserLog/${id}/${moment().format('YYYY-MM-DD')}/`);
    const newLogRefDay = push(logRefDay);
    return set(newLogRefDay, params);

    // await Database.ref(`/UserLog/${id}/${moment().format('YYYY-MM')}/`).push().set(params)
    // return Database.ref(`/UserLog/${id}/${moment().format('YYYY-MM-DD')}/`).push().set(params)
}
export const WalletSet = async (params,type) => {
    try {
        const param = {
            date         : moment().unix(),
            keyUser      : params.keyUser,
            firstName    : params.firstName,
            lastName     : params.lastName,
            channel      : params.channel,
            activity     : params.activity,
            refWallet    : params.refWallet,
            amount       : params.amount,
            status       : params.status,
            ref1         : params.ref1,
            ref2         : params.ref2,
            branchId     : params.branchId || '',
            programId    : params.programId || '',
            refDefault   : params.refDefault,
            phoneNumber  : params.phoneNumber,
            defaultAmount: params.defaultAmount,
            defaultPoint : params.defaultPoint
        }
        const pointSum = params.activity === 2 ? Number(params.amount / 10).toFixed(0) : 0
        const point = {
            date: moment().unix(),
            keyUser: params.keyUser,
            firstName: params.firstName,
            lastName: params.lastName,
            activity: params.activity,
            phoneNumber: params.phoneNumber,
            point: Number(pointSum),
            status: params.status,
            activityType: 1 // 1 ได้ 2 ตัด
        }
        let amount = Number(params.amount) + Number(params.defaultAmount)
        if (params.activity === 2 && Number(params.defaultAmount) >= Number(params.amount)) {
            amount = Number(params.defaultAmount) - Number(params.amount)
            const pointRef = ref(Database, `/User/${params.keyUser}/pointList`);
            const newPointRef = push(pointRef);
            await set(newPointRef, point);

            const pointAndRedemtionRef = ref(Database, `/PointAndRedemtion/${moment().format('YYYY-MM-DD')}/`);
            const newPointAndRedemtionRef = push(pointAndRedemtionRef);
            await set(newPointAndRedemtionRef, point);

            const pointAndRedemtionMonthRef = ref(Database, `/PointAndRedemtion/${moment().format('YYYY-MM')}/`);
            const newPointAndRedemtionMonthRef = push(pointAndRedemtionMonthRef);
            await set(newPointAndRedemtionMonthRef, point);
            // await Database.ref(`/User/${params.keyUser}/pointList`).push().set(point)
            // await Database.ref(`/PointAndRedemtion/${moment().format('YYYY-MM-DD')}/`).push().set(point)
            // await Database.ref(`/PointAndRedemtion/${moment().format('YYYY-MM')}/`).push().set(point)
        }
        
        let itemUpdate = {
            amount
        }
        if(!_.isArray(params.level)){
            itemUpdate.level = [{
                createAt: moment().format('YYYY'),
                point: 0,
                nameLevel: 'Green'
            }]
        }
        if(type === 2){
            let totalPoint = Number(pointSum) + Number(params.defaultPoint)
            if(!_.isArray(params.level)){
                itemUpdate.level = [{
                    createAt: moment().format('YYYY'),
                    point: totalPoint,
                    nameLevel: 'Green'
                }]
            }else if(_.isArray(params.level)){
                const levelData = _.findIndex(params.level,e => e.createAt === moment().format('YYYY'))
                const resLevelDefault = await Database.ref(`/LevelDefault`).once('value')
                if(levelData < 0){
                    itemUpdate.level = [...params.level,{
                        createAt: moment().format('YYYY'),
                        point: totalPoint,
                        nameLevel: 'Green'
                    }]
                }else if(levelData >= 0 && resLevelDefault.val()){
                    let itemSetLavel = params.level

                    itemSetLavel[levelData] = {
                        createAt: moment().format('YYYY'),
                        point: totalPoint,
                        nameLevel: totalPoint  >= resLevelDefault.val().pointLevel ? 'Gold' : 'Green'
                    }
                    itemUpdate.level = itemSetLavel
                }
            }
            itemUpdate.point = totalPoint
            // await Database.ref(`/User/${params.keyUser}/`).update({ point: totalPoint, amount })
        }
        const UserRef = ref(Database, `/User/${params.keyUser}/`);
        await update(UserRef, itemUpdate);
        // await Database.ref(`/User/${params.keyUser}/`).update(itemUpdate)

        const walletRef = ref(Database, `/User/${params.keyUser}/wallet/`);
        const newWalletRef = push(walletRef);
        await set(newWalletRef, param);

        const walletMonthRef = ref(Database, `/Wallet/${moment().format('YYYY-MM')}/`);
        const newWalletMonthRef = push(walletMonthRef);
        await set(newWalletMonthRef, param);

        const walletDayRef = ref(Database, `/Wallet/${moment().format('YYYY-MM-DD')}/`);
        const newWalletDayRef = push(walletDayRef);
        return set(newWalletDayRef, param);

        // await Database.ref(`/User/${params.keyUser}/wallet/`).push().set(param)
        // await Database.ref(`/Wallet/${moment().format('YYYY-MM')}/`).push().set(param)
        // return Database.ref(`/Wallet/${moment().format('YYYY-MM-DD')}/`).push().set(param)

    } catch (error) {
        console.log(`error`, error)
    }
}
export const WalletSetPointAdmin = async (params) => {
    try {
        
   
        const point = {
            date        : moment().unix(),
            keyUser     : params.keyUser,
            firstName   : params.firstName,
            lastName    : params.lastName,
            activity    : params.activity,
            phoneNumber : params.phoneNumber,
            point       : params.point,
            status      : params.status,
            activityType: params.activityType,   // 1 ได้ 2 ตัด
            adminBy     : params.adminBy,
            adminName   : params.adminName,
            remarks     : params.remarks,
        }

            const pointRef = ref(Database, `/User/${params.keyUser}/pointList`);
            const newPointRef = push(pointRef);
            await set(newPointRef, point);

            const pointAndRedemtionRef = ref(Database, `/PointAndRedemtion/${moment().format('YYYY-MM-DD')}/`);
            const newPointAndRedemtionRef = push(pointAndRedemtionRef);
            await set(newPointAndRedemtionRef, point);

            const pointAndRedemtionMonthRef = ref(Database, `/PointAndRedemtion/${moment().format('YYYY-MM')}/`);
            const newPointAndRedemtionMonthRef = push(pointAndRedemtionMonthRef);
            await set(newPointAndRedemtionMonthRef, point);
            // await Database.ref(`/User/${params.keyUser}/pointList`).push().set(point)
            // await Database.ref(`/PointAndRedemtion/${moment().format('YYYY-MM-DD')}/`).push().set(point)
            // await Database.ref(`/PointAndRedemtion/${moment().format('YYYY-MM')}/`).push().set(point)
        
        
        let itemUpdate = {
            
        }
        
        let totalPoint = Number(params.point) + Number(params.defaultPoint)
        if(params.activityType === 2){
            totalPoint = Number(params.defaultPoint) - Number(params.point)
        }
        if(!_.isArray(params.level)){
            itemUpdate.level = [{
                createAt: moment().format('YYYY'),
                point: 0,
                nameLevel: 'Green'
            }]
        }else if(_.isArray(params.level)){
            const levelData = _.findIndex(params.level,e => e.createAt === moment().format('YYYY'))
            const resLevelDefault = await Database.ref(`/LevelDefault`).once('value')
            if(levelData < 0){
                itemUpdate.level = [...params.level,{
                    createAt: moment().format('YYYY'),
                    point: 0,
                    nameLevel: 'Green'
                }]
            }else if(levelData >= 0 && resLevelDefault.val()){
                let itemSetLavel = params.level

                itemSetLavel[levelData] = {
                    createAt: moment().format('YYYY'),
                    point: totalPoint,
                    nameLevel: totalPoint  >= resLevelDefault.val().pointLevel ? 'Gold' : 'Green'
                }
                itemUpdate.level = itemSetLavel
            }
        }

        itemUpdate.point = totalPoint
        
        const UserRef = ref(Database, `/User/${params.keyUser}/`);
        await update(UserRef, itemUpdate);
        // await Database.ref(`/User/${params.keyUser}/`).update(itemUpdate)


    } catch (error) {
        console.log(`error`, error)
    }
}
export const addPointByMachine = async (params) => {
    try {
            const pointRef = ref(Database, `/User/${params.keyUser}/pointList`);
            const newPointRef = push(pointRef);
            await set(newPointRef, params);

            const pointAndRedemtionRef = ref(Database, `/PointAndRedemtion/${moment().format('YYYY-MM-DD')}/`);
            const newPointAndRedemtionRef = push(pointAndRedemtionRef);
            await set(newPointAndRedemtionRef, params);

            const pointAndRedemtionMonthRef = ref(Database, `/PointAndRedemtion/${moment().format('YYYY-MM')}/`);
            const newPointAndRedemtionMonthRef = push(pointAndRedemtionMonthRef);
            await set(newPointAndRedemtionMonthRef, params);

            // await Database.ref(`/User/${params.keyUser}/pointList`).push().set(params)
            // await Database.ref(`/PointAndRedemtion/${moment().format('YYYY-MM-DD')}/`).push().set(params)
            // await Database.ref(`/PointAndRedemtion/${moment().format('YYYY-MM')}/`).push().set(params)

            let totalPoint = Number(params.point) + Number(params.defaultPoint)
            let itemUpdate = {}
            if(!_.isArray(params.level)){
                itemUpdate.level = [{
                    createAt: moment().format('YYYY'),
                    point: 0,
                    nameLevel: 'Green'
                }]
            }else if(_.isArray(params.level)){
                const levelData = _.findIndex(params.level,e => e.createAt === moment().format('YYYY'))
                const resLevelDefault = await Database.ref(`/LevelDefault`).once('value')
                if(levelData < 0){
                    itemUpdate.level = [...params.level,{
                        createAt: moment().format('YYYY'),
                        point: 0,
                        nameLevel: 'Green'
                    }]
                }else if(levelData >= 0 && resLevelDefault.val()){
                    let itemSetLavel = params.level

                    itemSetLavel[levelData] = {
                        createAt: moment().format('YYYY'),
                        point: totalPoint,
                        nameLevel: totalPoint  >= resLevelDefault.val().pointLevel ? 'Gold' : 'Green'
                    }
                    itemUpdate.level = itemSetLavel
                }
            }

            itemUpdate.point = totalPoint
            
            const UserRef = ref(Database, `/User/${params.keyUser}/`);
            await update(UserRef, itemUpdate);
            // await Database.ref(`/User/${params.keyUser}/`).update(itemUpdate)
    } catch (error) {
        console.log(`error`, error)
    }
}

export const GetDataTransactionPointAndRedemtion = async (date) => {
    return await get(ref(Database, `/PointAndRedemtion/${date}`));
    // return Database.ref(`/PointAndRedemtion/${date}`).once('value')
}

export const WalletSetByAdmin = async (params) => {
    try {
        
   
        const param = {
            date         : moment().unix(),
            keyUser      : params.keyUser,
            firstName    : params.firstName,
            lastName     : params.lastName,
            channel      : 1,
            activity     : params.activity,
            refWallet    : params.refWallet,
            amount       : params.amount,
            status       : 1,
            ref1         : params.ref1,
            ref2         : params.ref2,
            branchId     : '',
            programId    : '',
            refDefault   : params.refDefault,
            phoneNumber  : params.phoneNumber,
            defaultAmount: params.defaultAmount,
            defaultPoint : params.defaultPoint,
            adminBy      : params.adminBy,
            adminName    : params.adminName,
            remarks      : params.remarks,
        }

        let amount = Number(params.amount) + Number(params.defaultAmount)
        if (params.activity === 2) {
            amount = Number(params.defaultAmount) - Number(params.amount)
        }
        let itemUpdate = {
            amount
        }

        const UserRef = ref(Database, `/User/${params.keyUser}/`);
        await update(UserRef, itemUpdate);
        
        // await Database.ref(`/User/${params.keyUser}/`).update(itemUpdate)

        const walletRef = ref(Database, `/User/${params.keyUser}/wallet/`);
        const newWalletRef = push(walletRef);
        await set(newWalletRef, param);

        const walletMonthRef = ref(Database, `/Wallet/${moment().format('YYYY-MM')}/`);
        const newWalletMonthRef = push(walletMonthRef);
        await set(newWalletMonthRef, param);

        const walletDayRef = ref(Database, `/Wallet/${moment().format('YYYY-MM-DD')}/`);
        const newWalletDayRef = push(walletDayRef);
        return set(newWalletDayRef, param);

        // await Database.ref(`/User/${params.keyUser}/wallet/`).push().set(param)
        // await Database.ref(`/Wallet/${moment().format('YYYY-MM')}/`).push().set(param)
        // return Database.ref(`/Wallet/${moment().format('YYYY-MM-DD')}/`).push().set(param)


    } catch (error) {
        console.log(`error`, error)
    }
}

export const WalletCodeSet = async (params) => {
    try {
        const param = {
            date: moment().unix(),
            keyUser: params.keyUser,
            firstName: params.firstName,
            lastName: params.lastName,
            channel: params.channel,
            activity: params.activity,
            refWallet: params.refWallet,
            amount: params.amount,
            status: params.status,
            ref1: params.ref1,
            ref2: params.ref2,
            dataCode:params.dataCode,
            dataDefault:params.dataDefault
        }
      
        let   amount = Number(params.dataCode.baht) - Number(params.amount)
        
        const UserRef = ref(Database, `/User/${params.keyUser}/codePromotion/${params.dataCode.id}/`);
        await update(UserRef, {baht:amount});

        const UserRefUse = ref(Database, `/User/${params.keyUser}/codePromotion/${params.dataCode.id}/use/`);
        const newUseRef = push(UserRefUse);
        await set(newUseRef, param);

        const walletRef = ref(Database, `/Wallet/${moment().format('YYYY-MM')}/`);
        const newWalletRef = push(walletRef);
        await set(newWalletRef, param);

        const walletDayRef = ref(Database, `/Wallet/${moment().format('YYYY-MM-DD')}/`);
        const newWalletDayRef = push(walletDayRef);
        return set(newWalletDayRef, param);


        // await Database.ref(`/User/${params.keyUser}/codePromotion/${params.dataCode.id}/`).update({baht:amount})
        // await Database.ref(`/User/${params.keyUser}/codePromotion/${params.dataCode.id}/use/`).push().set(param)
        // await Database.ref(`/Wallet/${moment().format('YYYY-MM')}/`).push().set(param)
        // return Database.ref(`/Wallet/${moment().format('YYYY-MM-DD')}/`).push().set(param)

    } catch (error) {
        console.log(`error`, error)
    }
}
export const WalletSetCallbackTest = async (param) => {
    const walletRef = ref(Database, `/WalletCallbackTest/${moment().format('YYYY-MM')}/`);
    const newWalletRef = push(walletRef);
    await set(newWalletRef, param);

    const walletDayRef = ref(Database, `/WalletCallbackTest/${moment().format('YYYY-MM-DD')}/`);
    const newWalletDayRef = push(walletDayRef);
    return await set(newWalletDayRef, param);

    // await Database.ref(`/WalletCallbackTest/${moment().format('YYYY-MM')}/`).push().set(param)
    // return Database.ref(`/WalletCallbackTest/${moment().format('YYYY-MM-DD')}/`).push().set(param)
}
export const WalletGetCallbackTest = async (param) => {
    // await Database.ref(`/WalletCallbackTest/${moment().format('YYYY-MM')}/`).push().set(param)
    // return Database.ref(`/WalletCallbackTest/${moment().format('YYYY-MM-DD')}/`).once('value')
    return await get(ref(Database, `/WalletCallbackTest/${moment().format('YYYY-MM-DD')}/`));
}

export const WalletSetCallback = async (param) => {
    const walletRef = ref(Database, `/WalletCallback/${moment(param.transactionDateandTime).format('YYYY-MM')}/`);
    const newWalletRef = push(walletRef);
    await set(newWalletRef, param);

    const walletDayRef = ref(Database, `/WalletCallback/${moment(param.transactionDateandTime).format('YYYY-MM-DD')}/`);
    const newWalletDayRef = push(walletDayRef);
    return await set(newWalletDayRef, param);

    // await Database.ref(`/WalletCallback/${moment(param.transactionDateandTime).format('YYYY-MM')}/`).push().set(param)
    // return Database.ref(`/WalletCallback/${moment(param.transactionDateandTime).format('YYYY-MM-DD')}/`).push().set(param)
}
export const PaymentSetCallback = async (param) => {
    const paymentRef = ref(Database, `/PaymentCallback/${moment(param.transactionDateandTime).format('YYYY-MM')}/`);
    const newPaymentRef = push(paymentRef);
    await set(newPaymentRef, param);

    const paymentDayRef = ref(Database, `/PaymentCallback/${moment(param.transactionDateandTime).format('YYYY-MM-DD')}/`);
    const newPaymentDayRef = push(paymentDayRef);
    return await set(newPaymentDayRef, param);

    // await Database.ref(`/PaymentCallback/${moment(param.transactionDateandTime).format('YYYY-MM')}/`).push().set(param)
    // return Database.ref(`/PaymentCallback/${moment(param.transactionDateandTime).format('YYYY-MM-DD')}/`).push().set(param)
}
export const PaymentCallbackCheck = async (ref1, ref2, date) => {
    const paymentRef = ref(Database, `/PaymentCallback/${date}/`);
    const paymentQuery = query(paymentRef, orderByChild('refDefault'), equalTo(`${ref1}_${ref2}`));
    return await get(paymentQuery);
    // return Database.ref(`/PaymentCallback/${date}/`).orderByChild('refDefault').equalTo(`${ref1}_${ref2}`).once('value')
}
export const PaymentWalletCallbackCheck = async (ref1, ref2, date) => {
    const walletRef = ref(Database, `/WalletCallback/${date}/`);
    const walletQuery = query(walletRef, orderByChild('refDefault'), equalTo(`${ref1}_${ref2}`));
    return await get(walletQuery);
    // return Database.ref(`/WalletCallback/${date}/`).orderByChild('refDefault').equalTo(`${ref1}_${ref2}`).once('value')
}
export const GetWalletUserTransactionId = async (transactionId) => {
    const walletRef = ref(Database, `/WalletCallback/${moment().format('YYYY-MM')}/`);
    const walletQuery = query(walletRef, orderByChild('transactionId'), equalTo(transactionId));
    const resWalletCallback = await get(walletQuery);
    // const resWalletCallback = await Database.ref(`/WalletCallback/${moment().format('YYYY-MM')}/`).orderByChild('transactionId').equalTo(transactionId).once('value')
    if(resWalletCallback.val()){
        const key  = Object.keys(resWalletCallback.val())
        const userRef = ref(Database, `/User/${resWalletCallback.val()[key].payerAccountNumber}`);
        const data = await get(userRef);
        // const data = await Database.ref(`/User/${resWalletCallback.val()[key].payerAccountNumber}`).once('value')
        return data.val()
    }
     return null;
}
export const SetWalletUserTransaction = async (keyUser,param) => {
        const userRef = ref(Database, `/User/${keyUser}/use/`);
        return await set(userRef, param);
    //  return Database.ref(`/User/${keyUser}/use`).set(param)
}

export const WalletGetAll = async () => {
    const walletRef = ref(Database, `/Wallet/${moment().format('YYYY-MM-DD')}/`);
    return await get(walletRef);
    // return Database.ref(`/Wallet/${moment().format('YYYY-MM-DD')}`).once('value')
}

export const WalletGetFilter = async (startDate, activity, firstName, callback) => {
    if (activity === 0 && firstName === '') {
        const walletRef = ref(Database, `/Wallet/${startDate}/`);
        return await get(walletRef);
        // return Database.ref(`/Wallet/${startDate}`).once('value')
    } else if (activity !== 0 && firstName === '') {
        const walletRef = ref(Database, `/Wallet/${startDate}/`);
        const walletQuery = query(walletRef, orderByChild('activity'), equalTo(activity));
        return await get(walletQuery);
        // return Database.ref(`/Wallet/${startDate}`).orderByChild('activity').equalTo(activity).once('value')
    } else if (activity === 0 && firstName !== '') {
        const walletRef = ref(Database, `/Wallet/${startDate}/`);
        const walletQuery = query(walletRef, orderByChild('firstName'), startAt(firstName), endAt(`${firstName}\uf8ff`));
        return await get(walletQuery);
        // return Database.ref(`/Wallet/${startDate}`).orderByChild('firstName').startAt(firstName).endAt(`${firstName}\uf8ff`).once('value')
    } else if (activity !== 0 && firstName !== '') {
        let items = []
        const walletRef = ref(Database, `/Wallet/${startDate}/`);
        const walletQuery = query(walletRef, orderByChild('firstName'), startAt(firstName), endAt(`${firstName}\uf8ff`));
        const snapshot = await get(walletQuery);

        // await Database.ref(`/Wallet/${startDate}`).orderByChild('firstName').startAt(firstName).endAt(`${firstName}\uf8ff`).once('value', (snapshot) => {
            snapshot.forEach((snap) => {
                if (snap.val().activity === activity) {
                    items.push(snap.val())
                }
            })
        // })
        return items
    } else {
        const walletRef = ref(Database, `/Wallet/${startDate}/`);
        return await get(walletRef);
        // return Database.ref(`/Wallet/${startDate}`).once('value')
    }
}

export const PointRedemtionGetAll = async (date) => {
    const pointAndRedemtionRef = ref(Database, `/PointAndRedemtion/${moment().format('YYYY-MM-DD')}/`);
    return await get(pointAndRedemtionRef);
    // return Database.ref(`/PointAndRedemtion/${moment().format('YYYY-MM-DD')}`).once('value')
}

export const PointRedemtionGetFilter = async (startDate, activity, firstName, callback) => {
    if (activity === 0 && firstName === '') {
        const pointAndRedemtionRef = ref(Database, `/PointAndRedemtion/${startDate}/`);
        return await get(pointAndRedemtionRef);
        // return Database.ref(`/PointAndRedemtion/${startDate}`).once('value')
    } else if (activity !== 0 && firstName === '') {
        const pointAndRedemtionRef = ref(Database, `/PointAndRedemtion/${startDate}/`);
        const pointAndRedemtionQuery = query(pointAndRedemtionRef, orderByChild('activity'), equalTo(activity));
        return await get(pointAndRedemtionQuery);
        // return Database.ref(`/PointAndRedemtion/${startDate}`).orderByChild('activity').equalTo(activity).once('value')
    } else if (activity === 0 && firstName !== '') {
        const pointAndRedemtionRef = ref(Database, `/PointAndRedemtion/${startDate}/`);
        const pointAndRedemtionQuery = query(pointAndRedemtionRef, orderByChild('firstName'), startAt(firstName), endAt(`${firstName}\uf8ff`));
        return await get(pointAndRedemtionQuery);
        // return Database.ref(`/PointAndRedemtion/${startDate}`).orderByChild('firstName').startAt(firstName).endAt(`${firstName}\uf8ff`).once('value')
    } else if (activity !== 0 && firstName !== '') {
        let items = []
        const pointAndRedemtionRef = ref(Database, `/PointAndRedemtion/${startDate}/`);
        const pointAndRedemtionQuery = query(pointAndRedemtionRef, orderByChild('firstName'), startAt(firstName), endAt(`${firstName}\uf8ff`));
        const snapshot = await get(pointAndRedemtionQuery);
        // await Database.ref(`/PointAndRedemtion/${startDate}`).orderByChild('firstName').startAt(firstName).endAt(`${firstName}\uf8ff`).once('value', (snapshot) => {
            snapshot.forEach((snap) => {
                if (snap.val().activity === activity) {
                    items.push(snap.val())
                }
            })
        // })
        return items
    } else {
        const pointAndRedemtionRef = ref(Database, `/PointAndRedemtion/${startDate}/`);
        return await get(pointAndRedemtionRef);
        // return Database.ref(`/PointAndRedemtion/${startDate}`).once('value')
    }
}

export const CustomerGetByKey = async (key) => {
    const userRef = ref(Database, `/User/${key}`);
    return await get(userRef);
    // return Database.ref(`/User/${key}`).once('value')
}

export const CustomerGetByPhone = async (value) => {
    const userRef = ref(Database, `/User`);
    const userQuery = query(userRef, orderByChild('phoneNumber'), equalTo(value));
    return await get(userQuery);
    // return Customer().orderByChild('phoneNumber').equalTo(value).once('value')
}
export const DashboardGetAllData = async (branch) => {
    return await get(ref(Database, `/Dashboard/${branch}`));
    // return Database.ref(`/Dashboard/${branch}`).once('value')
}

export const DashboardGetOnAllData = async (branch,callback) => {
    const dashboardRef = ref(Database, `/Dashboard/${branch}`);
    return onChildChanged(dashboardRef, callback);
    // return Database.ref(`/Dashboard/${branch}`).on('child_changed',callback)
}

export const DashboardSetData = async (branch,param) => {
    const dashboardRef = ref(Database, `/Dashboard/${branch}`);
    return await update(dashboardRef, param);
    // return Database.ref(`/Dashboard/${branch}`).update(param)
}
export const DashboardGetItem1 = async () => {
    let data = []
    const branchCollection = collection(Firestore, 'Branch');
    const branchSnapshot = await getDocs(branchCollection);
    data.push(branchSnapshot.size); 
    // await Firestore.collection('Branch').get().then((snapshot) => {
    //     data.push(snapshot.size)
    // })
    const machineType1Query = query(
        ref(Database, '/WashingMachine'),
        orderByChild('machineType'),
        equalTo('1')
    ); 
    const machineType1Snapshot = await get(machineType1Query);
    data.push(machineType1Snapshot.numChildren())
    // await Database.ref(`/WashingMachine`).orderByChild('machineType').equalTo("1").once('value', (snapshot) => {
    //     data.push(snapshot.numChildren())
    // })
    const machineType2Query = query(
        ref(Database, '/WashingMachine'),
        orderByChild('machineType'),
        equalTo('2')
    );
    const machineType2Snapshot = await get(machineType2Query);
    data.push(machineType2Snapshot.numChildren())
    // await Database.ref(`/WashingMachine`).orderByChild('machineType').equalTo("2").once('value', (snapshot) => {
    //     data.push(snapshot.numChildren())
    // })
    const machineType3Query = query(
        ref(Database, '/WashingMachine'),
        orderByChild('machineType'),
        equalTo('3')
    );
    const machineType3Snapshot = await get(machineType3Query);
    data.push(machineType3Snapshot.numChildren())

    // await Database.ref(`/WashingMachine`).orderByChild('status').equalTo(3).once('value', (snapshot) => {
    //     data.push(snapshot.numChildren())
    // })
    // let sumAmount = 0.00
    // await Database.ref(`/WalletCallback/${moment().format('YYYY-MM-DD')}`).once('value', (snapshot) => {
    //     snapshot.forEach((snap) => {
    //         sumAmount += Number(snap.val().amount)
    //     })
    // })
    // data.push(sumAmount)
    return data
}

export const DashboardGetItem2 = async () => {
    const branchCollection = collection(Firestore, 'Branch');
    return await getDocs(query(branchCollection, orderBy('priceAll', 'desc'), limit(10)));
    // return await Firestore.collection('Branch').orderBy('priceAll', 'desc').limit(10).get()
}

export const DashboardGetItem3 = async () => {
    let data = []
    const userRef = ref(Database, `/User`);
    const userSnapshot = await get(userRef);
    data.push(userSnapshot.numChildren())
    // await Database.ref(`/User`).once('value', (snapshot) => {
    //     data.push(snapshot.numChildren())
    // })
    let sumWallet = 0.00
   
    // await Database.ref(`/User`).once('value', (snapshot) => {
        userSnapshot.forEach((snap) => {
            if (snap.val().amount) {
                sumWallet += Number(snap.val().amount)
            }
        })
    // })
    data.push(sumWallet)
    const machineType2Query = query(
        ref(Database, '/WashingMachine'),
        orderByChild('machineType'),
        equalTo('2')
    );
    const machineType2Snapshot = await get(machineType2Query);
    data.push(machineType2Snapshot.numChildren())

    // await Database.ref(`/WashingMachine`).orderByChild('machineType').equalTo("2").once('value', (snapshot) => {
    //     data.push(snapshot.numChildren())
    // })
    const machineType3Query = query(
        ref(Database, '/WashingMachine'),
        orderByChild('status'),
        equalTo(3)
    );
    const machineType3Snapshot = await get(machineType3Query);
    data.push(machineType3Snapshot.numChildren())
    // await Database.ref(`/WashingMachine`).orderByChild('status').equalTo(3).once('value', (snapshot) => {
    //     data.push(snapshot.numChildren())
    // })
    let sumAmount = 0.00
    const walletCallbackRef = ref(Database, `/WalletCallback/${moment().format('YYYY-MM-DD')}`);
    const walletCallbackSnapshot = await get(walletCallbackRef);
    // await Database.ref(`/WalletCallback/${moment().format('YYYY-MM-DD')}`).once('value', (snapshot) => {
        walletCallbackSnapshot.forEach((snap) => {
            sumAmount += Number(snap.val().amount)
        })
    // })
    data.push(sumAmount)
    return data
}

export const DashboardGetItem4 = async () => {
    let data = []
    let UserName = []
    let UserProvince = []
    const userRef = ref(Database, `/User`);
    const userSnapshot = await get(userRef);
    // await Database.ref(`/User`).once('value', (snapshot) => {
        userSnapshot.forEach((snap) => {
            if (UserName.indexOf(snap.val().province) === -1) {
                UserName.push(snap.val().province)
                UserProvince.push(0)
            } else {
                UserProvince[UserName.indexOf(snap.val().province)] += 1
            }
        })
    // })
    data.push([UserName, UserProvince])
    let UserAge = [0, 0, 0, 0, 0, 0]
    // await Database.ref(`/User`).once('value', (snapshot) => {
        userSnapshot.forEach((snap) => {
            let age = Math.floor((Date.now() - (snap.val().birthDay * 1000)) / 365 / 1000 / 60 / 60 / 24)
            if (age <= 19) {
                UserAge[0] += 1
            } else if (age <= 25) {
                UserAge[1] += 1
            } else if (age <= 30) {
                UserAge[2] += 1
            } else if (age <= 35) {
                UserAge[3] += 1
            } else if (age <= 40) {
                UserAge[4] += 1
            } else {
                UserAge[5] += 1
            }
        })
    // })
    data.push(UserAge)
    let UserGender = [0, 0]
    // await Database.ref(`/User`).once('value', (snapshot) => {
        userSnapshot.forEach((snap) => {
            if (snap.val().gender === 1) {
                UserGender[0] += 1
            } else {
                UserGender[1] += 1
            }
        })
    // })
    data.push(UserGender)
    return data
}

const weekOfTheMonth = (date) => {
    const day = date.getDate()
    const weekDay = date.getDay()
    let week = Math.ceil(day / 7)

    const ordinal = [1, 2, 3, 4, 5, 6]
    const weekDays = [0, 1, 2, 3, 4, 5, 6]

    // Check the next day of the week and if it' on the same month, if not, respond with "Last"
    const nextWeekDay = new Date(date.getTime() + (1000 * 60 * 60 * 24 * 7))
    if (nextWeekDay.getMonth() !== date.getMonth()) {
        week = 6
    }

    return [ordinal[week - 1], weekDays[weekDay]]
}

export const DashboardGetItem5 = async () => {
    let data = []
    let day = [0, 0, 0, 0, 0, 0, 0]
    let week = [0, 0, 0, 0, 0, 0]

    const walletRef = ref(Database, `/Wallet/${moment().format('YYYY-MM')}`);
    const walletSnapshot = await get(walletRef);
    // await Database.ref(`/Wallet/${moment().format('YYYY-MM')}`).once('value', (snapshot) => {
        walletSnapshot.forEach((snap) => {
            let d_w = weekOfTheMonth(new Date(moment(snap.val().date * 1000).format('YYYY-MM-DD')))
            if (d_w[1] === 0) {
                day[0] += snap.val().amount
            } else if (d_w[1] === 1) {
                day[1] += snap.val().amount
            } else if (d_w[1] === 2) {
                day[2] += snap.val().amount
            } else if (d_w[1] === 3) {
                day[3] += snap.val().amount
            } else if (d_w[1] === 4) {
                day[4] += snap.val().amount
            } else if (d_w[1] === 5) {
                day[5] += snap.val().amount
            } else if (d_w[1] === 6) {
                day[6] += snap.val().amount
            }

            if (d_w[0] === 1) {
                week[0] += snap.val().amount
            } else if (d_w[0] === 2) {
                week[1] += snap.val().amount
            } else if (d_w[0] === 3) {
                week[2] += snap.val().amount
            } else if (d_w[0] === 4) {
                week[3] += snap.val().amount
            } else if (d_w[0] === 5) {
                week[4] += snap.val().amount
            } else if (d_w[0] === 6) {
                week[5] += snap.val().amount
            }
        })
    // })
    data.push(day)
    data.push(week)
    return data
}


export const Chat = (uid = '') => {
    if (uid) {
        return Database.ref(`Chat/${uid}/`)
    }
    return Database.ref(`Chat`)
}

export const getChat = () => {
    return Chat().once('value');
}
export const sendChat = (uid, param) => {
    return Database.ref(`Chat/${uid}/message/`).push().set(param);
}

export const sendNotiChat = (uid, count, msg) => {
    return Chat(uid).update({ notiUserCount: count, modifyAt: moment().unix(), isList: msg });
}

export const readNotiChatAdmin = (uid) => {
    return Chat(uid).update({ notiAdminCount: 0, modifyAt: moment().unix() });
}

export const onChat = (callback) => {
    return Chat().on('child_changed', callback);
}

export const SetPoint = async () => {
    return ref(Database, `/Point`);

    // return Database.ref(`/Point`)
}
export const SetPointGetAll = async () => {
    return await get(SetPoint()); 
    // return SetPoint().once('value')
}
export const SetPointGetKey = async () => {
    return await push(SetPoint());
    // return SetPoint().push()
}
export const SetPointUpdateByKey = async (id, param) => {
    return await update(ref(Database, `/Point/${id}`), param);
    // return Database.ref(`/Point/${id}`).update(param)
}

export const MachineUpdateConnect = async (key, param) => {
    return await update(ref(Database, `/WashingMachine/${key}`), param);
    // return Database.ref(`/WashingMachine/${key}`).update(param)
}

export const AdminPermissionGet = async (key) => {
    const detailRef = ref(Database, `/AdminPermission/${key}/`);
    return await get(detailRef);
    // return Database.ref(`/AdminPermission/${key}`).once('value')
}

export const AdminPermissionSet = async (key, param) => {
    return await set(ref(Database, `/AdminPermission/${key}/`), param);
    // return Database.ref(`/AdminPermission/${key}/`).set(param)
}

export const AdminPermissionDelete = async (key) => {
    return await remove(ref(Database, `/AdminPermission/${key}/`));
    // return Database.ref(`/AdminPermission/${key}/`).remove()
}

export const WashingMachineCheck = async (key,id) =>{
    const machineRef = ref(Database, `/WashingMachine/${key}`);
    return await get(machineRef);
    // return Database.ref(`/WashingMachine/${key}`).once('value')
}

export const GetDataTransaction = async (date) => {
    return await get(ref(Database, `/WalletCallback/${date}`));
    // return Database.ref(`/WalletCallback/${date}`).once('value')
}

export const UpdateDataTransaction = async (date,key,param) =>{
    return await update(ref(Database, `/WalletCallback/${date}/${key}`), param);
    // await Database.ref(`/WalletCallback/${date}/${key}`).update(param)
}


export const AddNotificationUser = async (key,param) =>{
    const userRef = ref(Database, `/User/${key}/notification/`);
    const newUserRef = push(userRef);
    return await set(newUserRef, param);
    // return Database.ref(`/User/${key}/notification/`).push().set(param)
}

export const SetDataLevel = async (param) =>{
    return await set(ref(Database, `/LevelDefault`), param);
    // return Database.ref(`/LevelDefault`).set(param)
}

export const GetDataLevel = async () =>{
    return await get(ref(Database, `/LevelDefault`));
    // return Database.ref(`/LevelDefault`).once('value')
}

export const CheckWallet = async (value) => {
    const walletRef = ref(Database, `/Wallet/${moment().format('YYYY-MM')}`);
    const walletQuery = query(walletRef, orderByChild('refWallet'), equalTo(value));
    return await get(walletQuery);
    // return Database.ref(`/Wallet/${moment().format('YYYY-MM')}`).orderByChild('refWallet').equalTo(value).once('value')
}

export const AddLogGetPaymentQRCode = async (param) => {
    const logRef = ref(Database, `/LogGetPaymentQRCode/${moment().format('YYYY-MM-DD')}/`);
    const newLogRef = push(logRef);
    return await set(newLogRef, param);

    // return Database.ref(`/LogGetPaymentQRCode/${moment().format('YYYY-MM-DD')}/`).push().set(param)
}

export const GetLogDataTransaction = async (date) =>{
    return await get(ref(Database, `/LogGetPaymentQRCode/${date}`));
    // return Database.ref(`/LogGetPaymentQRCode/${date}`).once('value')
}

export const AddLogIOTTimeOut = async (param) => {
    const logRef = ref(Database, `/LogIOTTimeOut/`);
    const newLogRef = push(logRef);
    return await set(newLogRef, param);
    // return Database.ref(`/LogIOTTimeOut/`).push().set(param)
}

export const getUserByPhone = async (phoneNumber) => {
    const userRef = ref(Database, `/User`);
    const userQuery = query(userRef, orderByChild('phoneNumber'), equalTo(phoneNumber));
    return await get(userQuery);
    // return Customer().orderByChild('phoneNumber').equalTo(phoneNumber).once('value')
}

export const AdminForceGet = async () => {

    const adminForceRef = ref(Database, `/AdminForce`);
    return await get(adminForceRef);
}

export const GetDataUser = async () => {
    return await get(ref(Database, `/User`));
    // return Customer().once('value')
}


// 1. PointRedemtionGetCheckTransaction
export const PointRedemtionGetCheckTransaction = async (value) => {
    const transactionRef = ref(Database, `/PointAndRedemtion/${moment().format('YYYY-MM-DD')}`);
    const transactionQuery = query(transactionRef, orderByChild('transactionId'), equalTo(value));
    return await get(transactionQuery);
};

// 2. GetTokenKL
export const GetTokenKL = async () => {
    const tokenRef = ref(Database, `/TokenKL`);
    return await get(tokenRef);
};

// 3. AddTokenKL
export const AddTokenKL = async (param) => {
    const tokenRef = ref(Database, `/TokenKL`);
    return await set(tokenRef, param);
};

// 4. AddLanguage
export const AddLanguage = async (key, param) => {
    const languageRef = ref(Database, `/Language/${key}/`);
    const versionRef = ref(Database, `/Language/Version/`);
    const listRef = ref(Database, `/Language/list/${key}`);
    
    await set(languageRef, param);
    await set(versionRef, moment().unix());
    return set(listRef, key);
};

// 5. GetListLanguage
export const GetListLanguage = async () => {
    const listRef = ref(Database, `/Language/list/`);
    return await get(listRef);
};

// 6. GetDetailLanguage
export const GetDetailLanguage = async (key) => {
    const detailRef = ref(Database, `/Language/${key}/`);
    return await get(detailRef);
};

// 7. GetAllLanguage
export const GetAllLanguage = async () => {
    const allLanguageRef = ref(Database, `/Language/`);
    return await get(allLanguageRef);
};

// 8. UpdateDetailLanguage
export const UpdateDetailLanguage = async (key, param) => {
    const detailRef = ref(Database, `/Language/${key}/`);
    return await set(detailRef, param);
};

export const RemoveDashboardBranch = async (branch) => {
    return await remove(ref(Database, `/Dashboard/${branch}`));
}

export const PaymentZaloCreate = async (param) => {
    const paymentRef = ref(Database, `/ZaloPaymentCallback`);
    const newPaymentRef = push(paymentRef);
    return await set(newPaymentRef, param);
}

export const PaymentZaloCheck = async (idMachine, transactionId) => {
    const paymentRef = ref(Database, `/ZaloPaymentCallback/`);
    const paymentQuery = query(paymentRef, orderByChild('app_trans_id'), equalTo(`${transactionId}`));
    return await get(paymentQuery);
    // return Database.ref(`/PaymentCallback/${date}/`).orderByChild('refDefault').equalTo(`${ref1}_${ref2}`).once('value')
}