import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/database'
import config from './config'
import moment from 'moment'
import _ from 'lodash'

if (!firebase.apps.length) {
    firebase.initializeApp(config)
}
const Firestore = firebase.firestore()
const Database = firebase.database()

export const dataBaseFn = () => {
    return Database
}
export const WashingMachine = () => {
    return Database.ref(`/WashingMachine`)
}
export const Customer = () => {
    return Database.ref(`/User`)
}
export const Promotion = () => {
    return Database.ref(`/Promotion`)
}
export const Wallet = () => {
    return Database.ref(`/Wallet`)
}
export const PointRedemtion = () => {
    return Database.ref(`/PointAndRedemtion`)
}
export const PromotionGetKey = () => {
    return Promotion().push()
}
export const PromotionGet = () => {
    return Promotion().once('value')
}
export const PromotionUpdateByKey = (id, param) => {
    return Database.ref(`/Promotion/${id}`).update(param)
}

export const WashingMachineAdd = (param) => {
    return WashingMachine().push().set(param)
}

export const WashingMachineGetAll = () => {
    return WashingMachine().orderByChild('statusActive').equalTo('ACTIVE').once('value')
}
export const WashingMachineGetOnAll = (callback) => {
    return WashingMachine().on('child_changed',callback)
}
export const UnsubWashingMachineGetOnAll = (callback) => {
    return WashingMachine().off()
    // return WashingMachine().off('child_changed',callback)
}

export const WashingMachineGetFilter = (branchFilter) => {
    if (branchFilter) {
        return WashingMachine().orderByChild('branch').equalTo(branchFilter).once('value')
    } else {
        return WashingMachine().once('value')
    }
}

export const WashingMachineGetByID = (id) => {
    return WashingMachine().orderByChild('idIOT').equalTo(id).once('value')
}


export const WashingMachineGetByChild = (child, value) => {
    return WashingMachine().orderByChild(child).equalTo(value).once('value')
}

export const WashingMachineUpdateByKey = (id, param) => {
    return Database.ref(`/WashingMachine/${id}`).update(param)
}

export const WashingMachineSetProgram = (id, param) => {
    return Database.ref(`/WashingMachine/${id}/program`).set(param)
}

export const WashingMachineGetByKey = (id) => {
    return Database.ref(`/WashingMachine/${id}`).once('value')
}
// export const WashingMachineCheckRef = (id) => {
//     return WashingMachine().orderByChild('ref').equalTo(id).once('value')
// }
export const CustomerGetAll = () => {
    return Database.ref(`/User`).once('value')
}

export const CustomerGetLimlt = (PAGE_SIZE) => {
    return Database.ref(`/User`).orderByKey().limitToFirst(PAGE_SIZE).once('value')
}
export const CustomerGetLimltLoadMore = (lastKey,PAGE_SIZE) => {
    return Database.ref(`/User`).orderByKey().startAt(lastKey).limitToFirst(PAGE_SIZE+1).once('value')
}
export const CustomerGetLimltFilter = async (PAGE_SIZE,type, gender, firstName, phone) => {
    if(firstName){
        return Database.ref(`/User`).orderByChild('firstName').startAt(firstName).endAt(`${firstName}\uf8ff`).limitToFirst(PAGE_SIZE).once('value')
    }else if(type){
        return Database.ref(`/User`).orderByChild('status').equalTo(Number(type)).limitToFirst(PAGE_SIZE).once('value')
    }else if(gender){
        return Database.ref(`/User`).orderByChild('gender').equalTo(Number(gender)).limitToFirst(PAGE_SIZE).once('value')
    }else if(phone){
        return Database.ref(`/User`).orderByChild('phoneNumber').startAt(`${phone}`).endAt(`${phone}\uf8ff`).limitToFirst(PAGE_SIZE).once('value')
    }
    return Database.ref(`/User`).orderByKey().limitToFirst(PAGE_SIZE).once('value')
}
export const CustomerGetLimltLoadMoreFilter = async (lastKey,PAGE_SIZE,type, gender, firstName, phone) => {
    return Database.ref(`/User`).orderByKey().startAt(lastKey).limitToFirst(PAGE_SIZE+1).once('value')
}
export const CustomerGetFilter = async (type, gender, firstName) => {
    if (firstName === '') {
        let items = []
        await Customer().once('value', (snapshot) => {
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
        })
        return items
    } else if (firstName !== '') {
        let items = []
        await Customer().orderByChild('firstName').startAt(firstName).endAt(`${firstName}\uf8ff`).once('value', (snapshot) => {
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
        })
        return items
    } else {
        return await Customer().once('value')
    }
}

export const CustomerUpdateByID = (id, param) => {
    return Database.ref(`/User/${id}`).update(param)
}

export const AdminLog = (id, param) => {
    const params = {
        date: moment().unix(),
        menu: param.menu,
        activity: param.activity
    }
    return Database.ref(`/AdminLog/${id}/${moment().format('YYYY-MM-DD')}/`).push().set(params)
}

export const AdminLogGet = (id, date) => {
    return Database.ref(`/AdminLog/${id}/${date}/`).limitToLast(11).once('value')
}
export const AdminLogLoadGet = (id, date, key) => {
    return Database.ref(`/AdminLog/${id}/${date}/`).orderByKey().endAt(key).limitToLast(11).once('value')
}

export const CustomerLogGet = (id, date) => {
    return Database.ref(`/UserLog/${id}/${date}/`).limitToLast(11).once('value')
}
export const CustomerLogGetAll = (id, date) => {
    return Database.ref(`/UserLog/${id}/${date}/`).once('value')
}

export const CustomerLogLoadGet = (id, date, key) => {
    return Database.ref(`/UserLog/${id}/${date}/`).orderByKey().endAt(key).limitToLast(11).once('value')
}
export const CustomerLogSet = async (id, params) => {
    await Database.ref(`/UserLog/${id}/${moment().format('YYYY-MM')}/`).push().set(params)
    return Database.ref(`/UserLog/${id}/${moment().format('YYYY-MM-DD')}/`).push().set(params)
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
            await Database.ref(`/User/${params.keyUser}/pointList`).push().set(point)
            await Database.ref(`/PointAndRedemtion/${moment().format('YYYY-MM-DD')}/`).push().set(point)
            await Database.ref(`/PointAndRedemtion/${moment().format('YYYY-MM')}/`).push().set(point)
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
        await Database.ref(`/User/${params.keyUser}/`).update(itemUpdate)

        await Database.ref(`/User/${params.keyUser}/wallet/`).push().set(param)
        await Database.ref(`/Wallet/${moment().format('YYYY-MM')}/`).push().set(param)
        return Database.ref(`/Wallet/${moment().format('YYYY-MM-DD')}/`).push().set(param)

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

            await Database.ref(`/User/${params.keyUser}/pointList`).push().set(point)
            await Database.ref(`/PointAndRedemtion/${moment().format('YYYY-MM-DD')}/`).push().set(point)
            await Database.ref(`/PointAndRedemtion/${moment().format('YYYY-MM')}/`).push().set(point)
        
        
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
        
        await Database.ref(`/User/${params.keyUser}/`).update(itemUpdate)


    } catch (error) {
        console.log(`error`, error)
    }
}
export const addPointByMachine = async (params) => {
    try {
            await Database.ref(`/User/${params.keyUser}/pointList`).push().set(params)
            await Database.ref(`/PointAndRedemtion/${moment().format('YYYY-MM-DD')}/`).push().set(params)
            await Database.ref(`/PointAndRedemtion/${moment().format('YYYY-MM')}/`).push().set(params)

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
            
            await Database.ref(`/User/${params.keyUser}/`).update(itemUpdate)
    } catch (error) {
        console.log(`error`, error)
    }
}

export const GetDataTransactionPointAndRedemtion = async (date) => {
    return Database.ref(`/PointAndRedemtion/${date}`).once('value')
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
        await Database.ref(`/User/${params.keyUser}/`).update(itemUpdate)

        await Database.ref(`/User/${params.keyUser}/wallet/`).push().set(param)
        await Database.ref(`/Wallet/${moment().format('YYYY-MM')}/`).push().set(param)
        return Database.ref(`/Wallet/${moment().format('YYYY-MM-DD')}/`).push().set(param)


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
        
        await Database.ref(`/User/${params.keyUser}/codePromotion/${params.dataCode.id}/`).update({baht:amount})
        await Database.ref(`/User/${params.keyUser}/codePromotion/${params.dataCode.id}/use/`).push().set(param)
        await Database.ref(`/Wallet/${moment().format('YYYY-MM')}/`).push().set(param)
        return Database.ref(`/Wallet/${moment().format('YYYY-MM-DD')}/`).push().set(param)

    } catch (error) {
        console.log(`error`, error)
    }
}
export const WalletSetCallbackTest = async (param) => {
    await Database.ref(`/WalletCallbackTest/${moment().format('YYYY-MM')}/`).push().set(param)
    return Database.ref(`/WalletCallbackTest/${moment().format('YYYY-MM-DD')}/`).push().set(param)
}
export const WalletGetCallbackTest = async (param) => {
    // await Database.ref(`/WalletCallbackTest/${moment().format('YYYY-MM')}/`).push().set(param)
    return Database.ref(`/WalletCallbackTest/${moment().format('YYYY-MM-DD')}/`).once('value')
}

export const WalletSetCallback = async (param) => {
    await Database.ref(`/WalletCallback/${moment(param.transactionDateandTime).format('YYYY-MM')}/`).push().set(param)
    return Database.ref(`/WalletCallback/${moment(param.transactionDateandTime).format('YYYY-MM-DD')}/`).push().set(param)
}
export const PaymentSetCallback = async (param) => {
    await Database.ref(`/PaymentCallback/${moment(param.transactionDateandTime).format('YYYY-MM')}/`).push().set(param)
    return Database.ref(`/PaymentCallback/${moment(param.transactionDateandTime).format('YYYY-MM-DD')}/`).push().set(param)
}
export const PaymentCallbackCheck = (ref1, ref2, date) => {
    return Database.ref(`/PaymentCallback/${date}/`).orderByChild('refDefault').equalTo(`${ref1}_${ref2}`).once('value')
}
export const PaymentWalletCallbackCheck = (ref1, ref2, date) => {
    return Database.ref(`/WalletCallback/${date}/`).orderByChild('refDefault').equalTo(`${ref1}_${ref2}`).once('value')
}
export const GetWalletUserTransactionId = async (transactionId) => {
    const resWalletCallback = await Database.ref(`/WalletCallback/${moment().format('YYYY-MM')}/`).orderByChild('transactionId').equalTo(transactionId).once('value')
    if(resWalletCallback.val()){
        const key  = Object.keys(resWalletCallback.val())
        const data = await Database.ref(`/User/${resWalletCallback.val()[key].payerAccountNumber}`).once('value')
        return data.val()
    }
     return null;
}
export const SetWalletUserTransaction = async (keyUser,param) => {
     return Database.ref(`/User/${keyUser}/use`).set(param)
}

export const WalletGetAll = () => {

    return Database.ref(`/Wallet/${moment().format('YYYY-MM-DD')}`).once('value')
}

export const WalletGetFilter = async (startDate, activity, firstName, callback) => {
    if (activity === 0 && firstName === '') {
        return Database.ref(`/Wallet/${startDate}`).once('value')
    } else if (activity !== 0 && firstName === '') {
        return Database.ref(`/Wallet/${startDate}`).orderByChild('activity').equalTo(activity).once('value')
    } else if (activity === 0 && firstName !== '') {
        return Database.ref(`/Wallet/${startDate}`).orderByChild('firstName').startAt(firstName).endAt(`${firstName}\uf8ff`).once('value')
    } else if (activity !== 0 && firstName !== '') {
        let items = []
        await Database.ref(`/Wallet/${startDate}`).orderByChild('firstName').startAt(firstName).endAt(`${firstName}\uf8ff`).once('value', (snapshot) => {
            snapshot.forEach((snap) => {
                if (snap.val().activity === activity) {
                    items.push(snap.val())
                }
            })
        })
        return items
    } else {
        return Database.ref(`/Wallet/${startDate}`).once('value')
    }
}

export const PointRedemtionGetAll = (date) => {
    return Database.ref(`/PointAndRedemtion/${moment().format('YYYY-MM-DD')}`).once('value')
}

export const PointRedemtionGetFilter = async (startDate, activity, firstName, callback) => {
    if (activity === 0 && firstName === '') {
        return Database.ref(`/PointAndRedemtion/${startDate}`).once('value')
    } else if (activity !== 0 && firstName === '') {
        return Database.ref(`/PointAndRedemtion/${startDate}`).orderByChild('activity').equalTo(activity).once('value')
    } else if (activity === 0 && firstName !== '') {
        return Database.ref(`/PointAndRedemtion/${startDate}`).orderByChild('firstName').startAt(firstName).endAt(`${firstName}\uf8ff`).once('value')
    } else if (activity !== 0 && firstName !== '') {
        let items = []
        await Database.ref(`/PointAndRedemtion/${startDate}`).orderByChild('firstName').startAt(firstName).endAt(`${firstName}\uf8ff`).once('value', (snapshot) => {
            snapshot.forEach((snap) => {
                if (snap.val().activity === activity) {
                    items.push(snap.val())
                }
            })
        })
        return items
    } else {
        return Database.ref(`/PointAndRedemtion/${startDate}`).once('value')
    }
}

export const CustomerGetByKey = (key) => {
    return Database.ref(`/User/${key}`).once('value')
}

export const CustomerGetByPhone = (value) => {
    return Customer().orderByChild('phoneNumber').equalTo(value).once('value')
}
export const DashboardGetAllData = async (branch) => {
    return Database.ref(`/Dashboard/${branch}`).once('value')
}

export const DashboardGetOnAllData = async (branch,callback) => {
    return Database.ref(`/Dashboard/${branch}`).on('child_changed',callback)
}

export const DashboardSetData = async (branch,param) => {
    return Database.ref(`/Dashboard/${branch}`).update(param)
}
export const DashboardGetItem1 = async () => {
    let data = []
    await Firestore.collection('Branch').get().then((snapshot) => {
        data.push(snapshot.size)
    })
    await Database.ref(`/WashingMachine`).orderByChild('machineType').equalTo("1").once('value', (snapshot) => {
        data.push(snapshot.numChildren())
    })
    await Database.ref(`/WashingMachine`).orderByChild('machineType').equalTo("2").once('value', (snapshot) => {
        data.push(snapshot.numChildren())
    })
    await Database.ref(`/WashingMachine`).orderByChild('status').equalTo(3).once('value', (snapshot) => {
        data.push(snapshot.numChildren())
    })
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
    return await Firestore.collection('Branch').orderBy('priceAll', 'desc').limit(10).get()
}

export const DashboardGetItem3 = async () => {
    let data = []
    await Database.ref(`/User`).once('value', (snapshot) => {
        data.push(snapshot.numChildren())
    })
    let sumWallet = 0.00
    await Database.ref(`/User`).once('value', (snapshot) => {
        snapshot.forEach((snap) => {
            if (snap.val().amount) {
                sumWallet += Number(snap.val().amount)
            }
        })
    })
    data.push(sumWallet)
    await Database.ref(`/WashingMachine`).orderByChild('machineType').equalTo("2").once('value', (snapshot) => {
        data.push(snapshot.numChildren())
    })
    await Database.ref(`/WashingMachine`).orderByChild('status').equalTo(3).once('value', (snapshot) => {
        data.push(snapshot.numChildren())
    })
    let sumAmount = 0.00
    await Database.ref(`/WalletCallback/${moment().format('YYYY-MM-DD')}`).once('value', (snapshot) => {
        snapshot.forEach((snap) => {
            sumAmount += Number(snap.val().amount)
        })
    })
    data.push(sumAmount)
    return data
}

export const DashboardGetItem4 = async () => {
    let data = []
    let UserName = []
    let UserProvince = []
    await Database.ref(`/User`).once('value', (snapshot) => {
        snapshot.forEach((snap) => {
            if (UserName.indexOf(snap.val().province) === -1) {
                UserName.push(snap.val().province)
                UserProvince.push(0)
            } else {
                UserProvince[UserName.indexOf(snap.val().province)] += 1
            }
        })
    })
    data.push([UserName, UserProvince])
    let UserAge = [0, 0, 0, 0, 0, 0]
    await Database.ref(`/User`).once('value', (snapshot) => {
        snapshot.forEach((snap) => {
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
    })
    data.push(UserAge)
    let UserGender = [0, 0]
    await Database.ref(`/User`).once('value', (snapshot) => {
        snapshot.forEach((snap) => {
            if (snap.val().gender === 1) {
                UserGender[0] += 1
            } else {
                UserGender[1] += 1
            }
        })
    })
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
    await Database.ref(`/Wallet/${moment().format('YYYY-MM')}`).once('value', (snapshot) => {
        snapshot.forEach((snap) => {
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
    })
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

export const SetPoint = () => {
    return Database.ref(`/Point`)
}
export const SetPointGetAll = () => {
    return SetPoint().once('value')
}
export const SetPointGetKey = () => {
    return SetPoint().push()
}
export const SetPointUpdateByKey = (id, param) => {
    return Database.ref(`/Point/${id}`).update(param)
}

export const MachineUpdateConnect = (key, param) => {
    return Database.ref(`/WashingMachine/${key}`).update(param)
}

export const AdminPermissionGet = (key) => {
    return Database.ref(`/AdminPermission/${key}`).once('value')
}

export const AdminPermissionSet = (key, param) => {
    return Database.ref(`/AdminPermission/${key}/`).set(param)
}

export const AdminPermissionDelete = (key) => {
    return Database.ref(`/AdminPermission/${key}/`).remove()
}

export const WashingMachineCheck = (key,id) =>{
    return Database.ref(`/WashingMachine/${key}`).once('value')
}

export const GetDataTransaction = (date) =>{
    return Database.ref(`/WalletCallback/${date}`).once('value')
}

export const UpdateDataTransaction = async (date,key,param) =>{
    await Database.ref(`/WalletCallback/${date}/${key}`).update(param)
}


export const AddNotificationUser = (key,param) =>{
    return Database.ref(`/User/${key}/notification/`).push().set(param)
}

export const SetDataLevel = (param) =>{
    return Database.ref(`/LevelDefault`).set(param)
}

export const GetDataLevel = () =>{
    return Database.ref(`/LevelDefault`).once('value')
}

export const CheckWallet = (value) => {
    return Database.ref(`/Wallet/${moment().format('YYYY-MM')}`).orderByChild('refWallet').equalTo(value).once('value')
}

export const AddLogGetPaymentQRCode = (param) => {
    return Database.ref(`/LogGetPaymentQRCode/${moment().format('YYYY-MM-DD')}/`).push().set(param)
}

export const GetLogDataTransaction = (date) =>{
    return Database.ref(`/LogGetPaymentQRCode/${date}`).once('value')
}

export const AddLogIOTTimeOut = (param) => {
    return Database.ref(`/LogIOTTimeOut/`).push().set(param)
}

export const getUserByPhone = (phoneNumber) => {
    return Customer().orderByChild('phoneNumber').equalTo(phoneNumber).once('value')
}

export const AdminForceGet = () => {
    return Database.ref(`/AdminForce`).once('value')
}

export const GetDataUser = () => {
    return Customer().once('value')
}

export const PointRedemtionGetCheckTransaction = (value) => {
    return Database.ref(`/PointAndRedemtion/${moment().format('YYYY-MM-DD')}`).orderByChild('transactionId').equalTo(value).once('value')
}

export const GetTokenKL = async () => {
    return Database.ref(`/TokenKL`).once('value')
 }

 export const AddTokenKL = async (param) => {
    return Database.ref(`/TokenKL`).set(param)
 }

export const AddLanguage = async (key,param) => {
    await Database.ref(`/Language/${key}/`).set(param)
    await Database.ref(`/Language/Version/`).set(moment().unix())
    return await Database.ref(`/Language/list/${key}`).set(key)
}

export const GetListLanguage = async () => {
    return await Database.ref(`/Language/list/`).once('value')
}

export const GetDetailLanguage = async (key) => {
    return await Database.ref(`/Language/${key}/`).once('value')
}

export const GetAllLanguage = async () => {
    return await Database.ref(`/Language/`).once('value')
}

export const UpdateDetailLanguage = async (key,param) => {
    return await Database.ref(`/Language/${key}/`).set(param)
}