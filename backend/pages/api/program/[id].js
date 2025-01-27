
import { Firestore, Database } from '../../../src/firebase'
import _ from 'lodash'
import moment from 'moment'
import { reverseObject, reponseFirestore, startDate, endDate } from '../../../src/utils/helpers'

export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const { query: { id: idMachine } } = req
            console.log('idMachine', idMachine)
            if (!idMachine) {
                return res.status(401).json({ error: 'Error query' })
            }
            const snapshot = await Database.WashingMachineGetByID(idMachine)
    
            if (snapshot.val()) {
                const data = snapshot.val()
                const key = Object.keys(data)
                const dataFind = _.find(data, (e)=> e.status != 99)
                const item = dataFind
    
                if (!_.isUndefined(item) && item && item.status !== 99) {
                    const iotCheck = await Firestore.LogIOTGetLast(item.id, item.idIOT, moment(startDate(new Date())).unix(), moment(endDate(new Date())).unix())
                    const iotLast = reponseFirestore(iotCheck)
                    let sentData = {
                        "latitude": item.branchLatitude,
                        "longitude": item.branchLongitude,
                        "branchName": item.branchName,
                        "idMachine": item.id,
                        "machineName": item.name,
                        "intervalTime": item.intervalTime || 60,
                        "status": item.status || 1,
                        "errorMsg":item.errorMsg || ''
                    }
                    let arr = []
                    Object.keys(item.program).map((key) => {
                       const pObject = {
                        "id"              : item.program[key].id,
                        "name"            : item.program[key].name,
                        "order"           : item.program[key].order,
                        "price"           : item.program[key].price,
                        "size"            : item.program[key].size,
                        "status"          : item.program[key].status,
                        "time"            : item.program[key].time,
                        // "branch"          : item.program[key].branch,
                        // "waterTemperature": item.program[key].waterTemperature
                    }
                        arr.push(pObject)
                        return arr
                    })
                    const log = {
                        id: item.id,
                        idIOT: item.idIOT,
                        status: item.status || 1,
                        machineType: item.machineType,
                        createAt: moment().unix(),
                        branchId: item.branch
                    }
                    if (!_.isUndefined(iotLast[0]) && iotLast[0].status !== item.status) {
                        await Firestore.LogIOTConnect(log)
                    }else if(_.isUndefined(iotLast[0])){
                        await Firestore.LogIOTConnect(log)
                    }
                    if(key.length){
                        for (const iterator of key) {
                            if(data[iterator].status != 99){
                                await Database.MachineUpdateConnect(iterator, {
                                    connectAt: moment().unix(),
                                    connectStatus: 1
                                })
                            }
                            
                        }
                    }
                  
                    sentData.program = _.orderBy(arr, 'order', 'asc')
                    res.status(200).json({ data: sentData })
                } else {
                    res.status(401).json({ error: 'Error ไม่สามารถใช้เครื่องนี้ได้' })
                }
            } else {
                res.status(401).json({ error: 'Error no data' })
            }
        } else {
            return res.status(401).json({ error: 'Error method' })
        }
    } catch (error) {
        console.log("🚀 ~ handler ~ error:", error)
        return res.status(401).json({ error: 'Error method' })
    }
    
}