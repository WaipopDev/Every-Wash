
import { Firestore, Database } from '../../../src/firebase'
import _ from 'lodash'
import moment from 'moment'
import { weekOfMonth, reponseFirestore,reponseDatabase, startDate, endDate } from '../../../src/utils/helpers'

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { query: { id: idMachine },
            body: {
                idProgram,
                status,
                countdownTime,
                priceType,
                errorMsg,
                type,
                updateAmount,
                updateTime,
                transactionId
            } } = req

        if (!idMachine || !idProgram || !status || !countdownTime || !priceType) {
            return res.status(401).json({ error: 'Error parameter' })
        }
        if (!_.includes([1, 2, 3,4], Number(status))) {
            return res.status(401).json({ error: 'Error parameter status' })
        }
        console.log('Machine ==> !idMachine || !idProgram || !status || !countdownTime || !priceType', idMachine ,idProgram ,status ,countdownTime ,priceType)
        // status 1.ว่าง 2.กำลังทำงาน 3.error
        const snapshot = await Database.WashingMachineGetByID(idMachine)

        if (snapshot.val()) {
            const data = snapshot.val()
            let key = []
            for (const iterator of Object.keys(data)) {
                if(data[iterator].status != 99 ){
                    key = [iterator]
                }
            }
            if(!key.length){
                return res.status(401).json({ error: 'ไม่สามารถทำรายการได้' })
            }
            const item = data[key]
          
            const machineCheck = await Firestore.LogMachineGetLast(key[0], moment(startDate(new Date())).unix(), moment(endDate(new Date())).unix())
            const machineLast = reponseFirestore(machineCheck)

            if (_.isUndefined(item) || _.isUndefined(item.program[idProgram])) {
                return res.status(401).json({ error: 'Error parameter id program' })
            }
            let transactionUser = {
                userId: '',
                userName: '',
            }
            const itemProgram = item.program[idProgram]
          
            if(transactionId){
                const transactionRes = await Database.GetWalletUserTransactionId(transactionId)
                if(!_.isUndefined(transactionRes) && !_.isNull(transactionRes) && transactionRes !== 'null' && transactionRes !== null && transactionRes !== 'undefined' && transactionRes){
                    if(status === 1){
                        // await Database.SetWalletUserTransaction(transactionRes.uid,null)
                        await Database.CustomerUpdateByID(transactionRes.uid,{use:null})
                    }else if(status === 2){
                        let itemMachine = _.cloneDeep(item)
                        if(_.isUndefined(itemMachine.use)){
                            itemMachine.use = {
                                idProgram,
                                name: itemProgram.name,
                                price: itemProgram.price,
                                countdownTime,
                                userId: transactionRes.uid,
                                userName: `${transactionRes.firstName} ${transactionRes.lastName}`,
                                priceType,
                                startDate: moment().unix(),
                            }
                            await Database.CustomerLogSet(transactionRes.uid,itemMachine)
                            await Database.SetWalletUserTransaction(transactionRes.uid,itemMachine)
                        }
                    } 
                    transactionUser = {
                        userId: transactionRes.uid,
                        userName: `${transactionRes.firstName} ${transactionRes.lastName}`,
                    }
                }
            }
            let param = {}
            if (status === 1) {
                param = {
                    status,
                    use: null
                }
            } else if (status === 3) {
                if (!errorMsg) {
                    return res.status(401).json({ error: 'Error parameter errorMsg' })
                }
                param = {
                    status,
                    errorMsg: "",
                    use: null
                }
            }else{
                param = {
                    status,
                    use: {
                        idProgram,
                        name: itemProgram.name,
                        price: itemProgram.price,
                        countdownTime,
                        userId: transactionUser.userId,
                        userName: transactionUser.userName,
                        priceType,
                        // startDate:moment().unix()
                        startDate: _.isUndefined(item.use) ? moment().unix() : item.use.startDate,
                    }
                }
            }
            let log = {
                createAt: moment().unix(),
                id: item.id,
                idIOT: idMachine,
                nameMachine: item.name,
                machineType: item.machineType,
                branchLatitude: item.branchLatitude,
                branchLongitude: item.branchLongitude,
                branchName: item.branchName,
                branchId: item.branch,
                status,
                errorMsg: errorMsg || '',
                idProgram,
                nameProgram: itemProgram.name,
                priceProgram: itemProgram.price,
                userId: transactionUser.userId,
                userName: transactionUser.userName,
                priceType: priceType,
                docIdMachine: key[0],
                date: moment().format('YYYY-MM-DD'),
                year: moment().format('YYYY'),
                month: moment().format('MM'),
                week: moment().week(),
                dayofweek: moment().day(),
                day: moment().format('DD'),
                weekOfMonth: weekOfMonth(new Date()),
                transactionId : transactionId || null

            }
            const logIOT = {
                id: item.id,
                idIOT: item.idIOT,
                status: status,
                machineType: item.machineType,
                createAt: moment().unix(),
                branchId: item.branch
            }
            let checkTypePayment = false
            if(priceType == 1 || priceType == 4){
                checkTypePayment = true
            }else if((priceType == 2 || priceType == 3) && transactionId){
                checkTypePayment = true
            }
            if (item.status === 1 && (status === 2 || status === 4) && checkTypePayment) {
              
                const resMachine          = await Firestore.WashingMachineAddLog(log)
                const resBranch           = await Firestore.GetBranchById(item.branch)
                      param.idLogMachine  = resMachine.id
                const dataBranch          = resBranch.data()

                const resAll       = await Database.DashboardGetAllData('all')
                const resAllBranch = await Database.DashboardGetAllData(item.branch)

                let   priceCoin           = !_.isUndefined(dataBranch.priceCoinAll) ? Number(dataBranch.priceCoinAll) : 0
                let   pricePayment        = !_.isUndefined(dataBranch.pricePaymentAll) ? Number(dataBranch.pricePaymentAll) : 0
                let   priceWallet         = !_.isUndefined(dataBranch.priceWalletAll) ? Number(dataBranch.priceWalletAll) : 0
                let   itemUpdate          = {}
                      itemUpdate.priceAll = Number(dataBranch.priceAll) + Number(itemProgram.price)
                    if(Number(priceType) === 1){
                        itemUpdate.priceCoinAll = priceCoin + Number(itemProgram.price)
                    }else if(Number(priceType) === 2){
                        itemUpdate.pricePaymentAll = pricePayment + Number(itemProgram.price)
                    }else if(Number(priceType) === 3){
                        itemUpdate.priceWalletAll = priceWallet + Number(itemProgram.price)
                    }

                
                const resAllItem = resAll.val()
                const resAllBranchItem = resAllBranch.val()
         
                await setDataByDay(resAllItem, item.machineType, Number(itemProgram.price), log.createAt, 'all')
                await setDataByDay(resAllBranchItem, item.machineType, Number(itemProgram.price), log.createAt, item.branch)
            

                await Firestore.BranchUpdate(item.branch,itemUpdate)
                await Firestore.LogIOTConnect(logIOT)
            } else if (_.isUndefined(machineLast[0]) && (status === 2 || status === 4) && checkTypePayment) {
                const resBranch          = await Firestore.GetBranchById(item.branch)
                const dataBranch         = resBranch.data()
                const resMachine         = await Firestore.WashingMachineAddLog(log)
                      param.idLogMachine = resMachine.id
                const resAll             = await Database.DashboardGetAllData('all')
                const resAllBranch       = await Database.DashboardGetAllData(item.branch)

                let   priceCoin           = !_.isUndefined(dataBranch.priceCoinAll) ? Number(dataBranch.priceCoinAll) : 0
                let   pricePayment        = !_.isUndefined(dataBranch.pricePaymentAll) ? Number(dataBranch.pricePaymentAll) : 0
                let   priceWallet         = !_.isUndefined(dataBranch.priceWalletAll) ? Number(dataBranch.priceWalletAll) : 0
                let   itemUpdate          = {}
                      itemUpdate.priceAll = Number(dataBranch.priceAll) + Number(itemProgram.price)
                    if(Number(priceType) === 1){
                        itemUpdate.priceCoinAll = priceCoin + Number(itemProgram.price)
                    }else if(Number(priceType) === 2){
                        itemUpdate.pricePaymentAll = pricePayment + Number(itemProgram.price)
                    }else if(Number(priceType) === 3){
                        itemUpdate.priceWalletAll = priceWallet + Number(itemProgram.price)
                    }
                
                const resAllItem = resAll.val()
                const resAllBranchItem = resAllBranch.val()
               await setDataByDay(resAllItem, item.machineType, Number(itemProgram.price), log.createAt, 'all')
               await setDataByDay(resAllBranchItem, item.machineType, Number(itemProgram.price), log.createAt, item.branch)
                

                await Firestore.BranchUpdate(item.branch,itemUpdate)
                await Firestore.LogIOTConnect(logIOT)
            } else if ((item.status === 2 || item.status === 4) && status === 1 && !_.isUndefined(item.idLogMachine)) {
                await Firestore.WashingMachineUpdateLog(item.idLogMachine, { endTime: moment().unix() })
                await Firestore.LogIOTConnect(logIOT)

                const getDataMachine = await Firestore.WashingMachineGetLog(item.idLogMachine)
                if(getDataMachine.data()){
                    const  dataMachine = getDataMachine.data()
                    if(dataMachine.userId){
                        const itemNotification = {
                            idLogMachine : item.idLogMachine,
                            date         : moment().unix(),
                            title        : dataMachine.branchName,
                            status       : 1,
                            transactionId: dataMachine.transactionId,
                            nameMachine  : dataMachine.nameMachine,
                            nameProgram  : dataMachine.nameProgram,
                            detail: `${dataMachine.nameMachine}/${dataMachine.nameProgram} : Succeed`
                        }
                        await Database.CustomerUpdateByID(dataMachine.userId,{use:null})
                        await Database.AddNotificationUser(dataMachine.userId,itemNotification)
                    }
                }
                param.idLogMachine = null
            }

            let resData = {
                idProgram,
                status,
                time: countdownTime
            }

            if(type && updateAmount && updateTime && status == 2){
                let   param2                   = _.cloneDeep(param)
                let   log2                     = _.cloneDeep(log)
                      param2.use.price         = updateAmount
                      param2.use.countdownTime = updateTime
                      param2.use.name          = 'เพิ่มเวลา'
                      log2.nameProgram         = 'เพิ่มเวลา'
                      log2.priceProgram        = updateAmount
                const resMachine               = await Firestore.WashingMachineAddLog(log2)
                const resBranch                = await Firestore.GetBranchById(item.branch)
                const resAll                   = await Database.DashboardGetAllData('all')
                const resAllBranch             = await Database.DashboardGetAllData(item.branch)

                      param2.idLogMachine      = resMachine.id
                const dataBranch               = resBranch.data()
                let   priceCoin                = !_.isUndefined(dataBranch.priceCoinAll) ? Number(dataBranch.priceCoinAll) : 0
                let   pricePayment             = !_.isUndefined(dataBranch.pricePaymentAll) ? Number(dataBranch.pricePaymentAll) : 0
                let   priceWallet              = !_.isUndefined(dataBranch.priceWalletAll) ? Number(dataBranch.priceWalletAll) : 0
                let   itemUpdate               = {}
                      itemUpdate.priceAll      = Number(dataBranch.priceAll) + Number(updateAmount)
                        if(Number(priceType) === 1){
                            itemUpdate.priceCoinAll = priceCoin + Number(updateAmount)
                        }else if(Number(priceType) === 2){
                            itemUpdate.pricePaymentAll = pricePayment + Number(updateAmount)
                        }else if(Number(priceType) === 3){
                            itemUpdate.priceWalletAll = priceWallet + Number(updateAmount)
                        }

                    
                 
                   const resAllItem = resAll.val()
                   const resAllBranchItem = resAllBranch.val()
                    await setDataByDay(resAllItem,item.machineType,Number(updateAmount), log2.createAt, 'all')
                    await setDataByDay(resAllBranchItem,item.machineType,Number(updateAmount), log2.createAt, item.branch)

                    await Firestore.BranchUpdate(item.branch,itemUpdate)
                    await Firestore.LogIOTConnect(logIOT)
                    await Database.WashingMachineUpdateByKey(key, param2)
                    resData.time =  Number(countdownTime) + Number(updateAmount)
            }else{
                // if (item.status === 1 && status === 2) {
                //     param.use.startDate= moment().unix()
                // }
                if (Number(item.status)  !== Number(status)) {
                    await Database.WashingMachineUpdateByKey(key, param)
                }
            }

           
            
            res.status(200).json({ data: resData })
        } else {
            res.status(401).json({ error: 'Error no data machine' })
        }
    } else {
        return res.status(401).json({ error: 'Error method' })
    }
}

const setDataByDay = async (resAll,type,val,createAt,branch) =>{
    let date = moment(createAt * 1000)

    const key = date.format('YYYY-MM-DD')
    const keyHH = date.format('HH')
    const keyWeeks = date.weeks()
    const keyWeeksDDD = date.format('ddd')
    const keyMonthly = date.format('YYYY-MM')
    const keyDD = date.format('DD')
    const keyYYYY = date.format('YYYY')
    const keyMM = date.format('MM')

    const dayNow     = date.format('YYYY-MM-DD')
    let   newTotal24 = resAll?.newTotal24?.[`${dayNow}`] || 0
    let   newDaily   = resAll?.newDaily?.[`${dayNow}`]?.[type]?.[`${date.format('HH')}`] || 0
    let   newWeekly  = resAll?.newWeekly?.[`${date.format('YYYY')}`]?.[`${date.weeks()}`]?.[type]?.[`${date.format('ddd')}`] || 0
    let   newMonthly = resAll?.newMonthly?.[`${date.format('YYYY-MM')}`]?.[type]?.[`${date.format('DD')}`] || 0
    let   newAnnual  = resAll?.newAnnual?.[`${date.format('YYYY')}`]?.[type]?.[`${date.format('MM')}`] || 0

    await Database.DashboardSetData(`${branch}/`, {updateTime:createAt})
    await Database.DashboardSetData(`${branch}/newTotal24/`, { [`${key}`]: newTotal24 + val })
    await Database.DashboardSetData(`${branch}/newDaily/${key}/${type}/`, {[`${date.format('HH')}`]: (newDaily + val)})

    await Database.DashboardSetData(`${branch}/newWeekly/${keyYYYY}/${keyWeeks}/${type}/`, {[`${date.format('ddd')}`] : newWeekly + val})

    await Database.DashboardSetData(`${branch}/newMonthly/${keyMonthly}/${type}/`, {[`${date.format('DD')}`] : newMonthly + val})

    await Database.DashboardSetData(`${branch}/newAnnual/${keyYYYY}/${type}/`, {[`${date.format('MM')}`] : newAnnual + val})
  }

const setValueAll = async (resAll,type,val, createAt) =>{
    const timeToAdd = moment(createAt * 1000)
    const dayNow     = timeToAdd.format('YYYY-MM-DD')
    let   newTotal24 = resAll?.newTotal24?.[`${dayNow}`] || 0
    let   newDaily   = resAll?.newDaily?.[`${dayNow}`]?.[type]?.[`${timeToAdd.format('HH')}`] || 0
    let   newWeekly  = resAll?.newWeekly?.[`${timeToAdd.format('YYYY')}`]?.[`${timeToAdd.weeks()}`]?.[type]?.[`${timeToAdd.format('ddd')}`] || 0
    let   newMonthly = resAll?.newMonthly?.[`${timeToAdd.format('YYYY-MM')}`]?.[type]?.[`${timeToAdd.format('DD')}`] || 0
    let   newAnnual  = resAll?.newAnnual?.[`${timeToAdd.format('YYYY')}`]?.[type]?.[`${timeToAdd.format('MM')}`] || 0

    let param = {
      newTotal24: {},
      newDaily  : {},
      newWeekly : {},
      newMonthly: {},
      newAnnual : {},
      updateTime: timeToAdd.unix()
    }
    param.newTotal24 = resAll?.newTotal24 || {}
    param.newTotal24[`${dayNow}`] = newTotal24 + val

    param.newDaily  = resAll?.newDaily || {}
    param.newDaily[`${dayNow}`] = resAll?.newDaily?.[`${dayNow}`] || {}
    param.newDaily[`${dayNow}`][`${type}`] = resAll?.newDaily?.[`${dayNow}`]?.[`${type}`] || {}
    param.newDaily[`${dayNow}`][`${type}`][`${timeToAdd.format('HH')}`] = newDaily + val

    param.newWeekly = resAll?.newWeekly || {}
    param.newWeekly[`${timeToAdd.format('YYYY')}`] = resAll?.newWeekly?.[`${timeToAdd.format('YYYY')}`] || {}
    param.newWeekly[`${timeToAdd.format('YYYY')}`][`${timeToAdd.weeks()}`] = resAll?.newWeekly?.[`${timeToAdd.format('YYYY')}`]?.[`${timeToAdd.weeks()}`] || {}
    param.newWeekly[`${timeToAdd.format('YYYY')}`][`${timeToAdd.weeks()}`][`${type}`] = resAll?.newWeekly?.[`${timeToAdd.format('YYYY')}`]?.[`${timeToAdd.weeks()}`]?.[`${type}`] || {}
    param.newWeekly[`${timeToAdd.format('YYYY')}`][`${timeToAdd.weeks()}`][`${type}`][`${timeToAdd.format('ddd')}`] = newWeekly + val
  
    param.newMonthly = resAll?.newMonthly || {}
    param.newMonthly[`${timeToAdd.format('YYYY-MM')}`] = resAll?.newMonthly?.[`${timeToAdd.format('YYYY-MM')}`] || {}
    param.newMonthly[`${timeToAdd.format('YYYY-MM')}`][`${type}`] = resAll?.newMonthly?.[`${timeToAdd.format('YYYY-MM')}`]?.[`${type}`] || {}
    param.newMonthly[`${timeToAdd.format('YYYY-MM')}`][`${type}`][`${timeToAdd.format('DD')}`] = newMonthly + val
    
    param.newAnnual = resAll?.newAnnual || {}
    param.newAnnual[`${timeToAdd.format('YYYY')}`] = resAll?.newAnnual?.[`${timeToAdd.format('YYYY')}`] || {}
    param.newAnnual[`${timeToAdd.format('YYYY')}`][type] = resAll?.newAnnual?.[`${timeToAdd.format('YYYY')}`]?.[type] || {}
    param.newAnnual[`${timeToAdd.format('YYYY')}`][type][`${timeToAdd.format('MM')}`] = newAnnual + val
  
    // param = _.assign(param,resAll)

    return param
}