import React, { useState, useEffect, cloneElement, } from 'react'
import { connect } from 'react-redux'
import { Pie, Bar, Line, Chart } from 'react-chartjs-2'
import BasePage from '../src/components/BasePage'
import { Container, Row, Col, Card, Table, Form, Button, Spinner } from 'react-bootstrap'
import MapList from '../src/components/Dashboard/MapList'
import MachineShow from '../src/components/Dashboard/MachineShow'
import { DashboardAction } from '../src/redux/actions'
import {
  AddLogAdmin,
  reponseFirestore,
  reponseDatabase
} from '../src/utils/helpers'
import { Firestore, Database } from '../src/firebase'
import CardTotalBranch from '../src/components/Dashboard/CardTotalBranch'

import _ from 'lodash'
import moment from 'moment'


export const Dashboard = props => {
  const {
    userData,
    dashboardItem1,
    getDashboardItem1,
    dashboardItem2,
    getDashboardItem2,
    dashboardItem3,
    getDashboardItem3,
    dashboardItem4,
    getDashboardItem4,
    dashboardItem5,
    getDashboardItem5,
    branchData,
    permission,
    language
  } = props

  const [dataItem6, setDataItem6] = useState(null)
  const [dataItem7, setDataItem7] = useState(null)
  const [dataItem8, setDataItem8] = useState(null)
  const [dataItem9, setDataItem9] = useState(null)
  const [dataItem10, setDataItem10] = useState(null)
  const [dataItem11, setDataItem11] = useState(null)
  const [dataItem12, setDataItem12] = useState(null)
  const [dataItem13, setDataItem13] = useState(null)

  const [branch, setBranch] = useState('')
  const [totalDay, setTotalDay] = useState(0)
  const [machine, setMachine] = useState([])

  const [updateActive, setUpdateActive] = useState(false)
  const [updateTime, setUpdateTime] = useState('')
  const [item1, setItem1] = useState([
    {
      title: language['dashboard_number_of_branches'], //จำนวนสาขา
      total: 0,
      icon: 'fas fa-globe-asia'
    },
    {
      title: language['dashboard_number_of_washing'],//'จำนวนเครื่องซัก'
      total: 0,
      icon: 'fas fa-store'
    },
    {
      title: language['dashboard_number_of_dryers'],//จำนวนเครื่องอบ
      total: 0,
      icon: 'fas fa-store'
    },
    {
      title: language['dashboard_number_of_broken'],//จำนวนเครื่องเสีย
      total: 0,
      icon: 'fas fa-tools'
    }
  ])

  const labels = [
    '0.00',
    '1.00',
    '2.00',
    '3.00',
    '4.00',
    '5.00',
    '6.00',
    '7.00',
    '8.00',
    '9.00',
    '10.00',
    '11.00',
    '12.00',
    '13.00',
    '14.00',
    '15.00',
    '16.00',
    '17.00',
    '18.00',
    '19.00',
    '20.00',
    '21.00',
    '22.00',
    '23.00'
  ]
  const labelsDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const labelsMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
  const labelsYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  useEffect(() => {
   
    AddLogAdmin(userData, 'Dashboard', '')
    // getDashboardItem1()
    getDashboardItem2()
    getDashboardItem3()
    
    // getDataI6()
  }, [])

  useEffect(()=>{
    const searchParams = new URLSearchParams(document.location.search)
    const  forceUpdate = searchParams.get('updateDataByDay')
    const  updateTotalInDay = searchParams.get('updateTotalInDay')
    if(forceUpdate && branchData.length){
      console.log('forceUpdate', forceUpdate)
      updateDataByDay(forceUpdate)
    }
    if(updateTotalInDay && branchData.length){
      console.log('forceUpdate', updateTotalInDay)
      forceDataDashboardTotalBranch()
    }
  },[branchData])

  useEffect(() => {


    getDataDashboard(branch)
    // forceDataDashboardTotalBranch()
    // forceDataDashboardMachine()
    // Database.DashboardGetOnAllData(branch || 'all',e => getDataDashboardOnAll(e))
    
  }, [branch])
  const getDataDashboardOnAll = async (data) =>{

    if(data.key == 'updateTime'){
      setUpdateTime(moment(data.val() * 1000).format('DD/MM/YYYY HH:mm'))
    }
  }

  const forceDataDashboardTotalBranch = async () => {
    const totalBranch = await Firestore.dataBaseFn().collection('Branch').get()

    await Database.DashboardSetData('all', { totalBranch: (totalBranch.size), updateTime: moment().unix() })
    _.map(reponseFirestore(totalBranch), async (item) => {
      await Database.DashboardSetData(item.docId, { totalBranch: (totalBranch.size), updateTime: moment().unix() })
    })
    console.log('forceDataDashboardTotalBranch ==> SUCCESS')
  }

  const forceDataDashboardMachine = async () => {
    const resWM = await Database.WashingMachineGetAll()

    const resultAllBranch = _.groupBy(resWM.val(), 'branch')
    _.map(resultAllBranch, async (item, key) => {
      const resAllType = _.groupBy(item, 'machineType')
      await Database.DashboardSetData(key, {
        totalWashingMachines: resAllType[1]?.length || 0,
        totalIncubators     : resAllType[2]?.length || 0,
      })


    })

    const resultAll = _.groupBy(resWM.val(), 'machineType')
    await Database.DashboardSetData('all', {
      totalWashingMachines: resultAll[1].length,
      totalIncubators     : resultAll[2].length,
    })
    console.log('forceDataDashboardMachine ==> SUCCESS')
  }

  const getDataDashboard = async (branch) => {
    let res = null
    if(userData.type == 3 && permission[0]){
       res = await Database.DashboardGetAllData(permission[0].docId)
    }else{
       res = await Database.DashboardGetAllData(branch || 'all')
    }

    

    const dayNow        = moment().format('YYYY-MM-DD')
    const dayNowOld     = moment().subtract(1,'day').format('YYYY-MM-DD')
    const keyHH         = moment().format('HH')
    const keyWeeks      = moment().weeks()
    const keyWeeksOld   = moment().subtract(1,'week').weeks()
    const keyWeeksDDD   = moment().format('ddd')
    const keyMonthly    = moment().format('YYYY-MM')
    const keyMonthlyOld = moment().subtract(1,'month').format('YYYY-MM')
    const keyDD         = moment().format('DD')
    const keyYYYY       = moment().format('YYYY')
    const keyYYYYOld    = moment().subtract(1,'year').format('YYYY')
    const keyMM         = moment().format('MM')



    if (res && res.val()) {
      const item = res.val()
      setItem1([
        {
          title: language['dashboard_number_of_branches'], //จำนวนสาขา
          total: numberWithCommas(item.totalBranch || 0),
          icon: 'fas fa-globe-asia'
        },
        {
          title: language['dashboard_number_of_washing'],//'จำนวนเครื่องซัก'
          total: numberWithCommas(item.totalWashingMachines || 0),
          icon: 'fas fa-store'
        },
        {
          title: language['dashboard_number_of_dryers'],//จำนวนเครื่องอบ
          total: numberWithCommas(item.totalIncubators || 0),
          icon: 'fas fa-store'
        },
        {
          title: language['dashboard_number_of_broken'],//จำนวนเครื่องเสีย
          total: numberWithCommas(item.totalBrokenMachines || 0),
          icon: 'fas fa-tools'
        }
      ])
      setUpdateTime(moment(item.updateTime * 1000).format('DD/MM/YYYY HH:mm'))
      setTotalDay(item.newTotal24?.[dayNow] || 0)

      if(item.newDaily){
        dailyCumulativeFn(item.newDaily?.[dayNow] || null) //สรุปการใช้บริการร้านสะดวกซักสะสมรายวัน
        dailySalesFn(item.newDaily?.[dayNow] || null,item.newDaily?.[dayNowOld] || null) //สรุปรายได้/ยอดขายรายวัน
      }
      if(item.newWeekly){
        weeklySalesFn(item.newWeekly?.[keyYYYY]?.[keyWeeks] || null,item.newWeekly?.[keyYYYY]?.[keyWeeksOld] || null) //สรุปรายได้/ยอดขายรายสัปดาห์
        weeklyCumulativeFn(item.newWeekly?.[keyYYYY]?.[keyWeeks] || null) //สรุปการใช้บริการร้านสะดวกซักสะสมรายสัปดาห์
      }
      if(item.newMonthly){
        monthlySalesFn(item.newMonthly?.[keyMonthly] || null,item.newMonthly?.[keyMonthlyOld] || null) // สรุปรายได้/ยอดขายรายเดือน
        monthlyCumulativeFn(item.newMonthly?.[keyMonthly] || null)//สรุปการใช้บริการร้านสะดวกซักสะสมรายเดือน
      }
      if(item.newAnnual){
        annualSalesFn(item.newAnnual?.[keyYYYY] || null,item.newAnnual?.[keyYYYYOld] || null)
        annualCumulativeFn(item.newAnnual?.[keyYYYY] || null)//สรุปการใช้บริการร้านสะดวกซักสะสมรายปี
      }

   
    
      
    }
  }
  const setDataByDay = async (branch, dateTo, fnData, sumPrice) => {
    let date = moment(dateTo)
    const key = date.format('YYYY-MM-DD')
    const keyHH = date.format('HH')
    const keyWeeks = date.weeks()
    const keyWeeksDDD = date.format('ddd')
    const keyMonthly = date.format('YYYY-MM')
    const keyDD = date.format('DD')
    const keyYYYY = date.format('YYYY')
    const keyMM = date.format('MM')

    await Database.DashboardSetData(`${branch}/newTotal24/`, { [`${key}`]: sumPrice })
    await Database.DashboardSetData(`${branch}/newDaily/${key}`, fnData.newDaily[key] || {})

    await Database.DashboardSetData(`${branch}/newWeekly/${keyYYYY}/${keyWeeks}/1/`, fnData.newWeekly?.[keyYYYY]?.[keyWeeks]?.[1] || {})
    await Database.DashboardSetData(`${branch}/newWeekly/${keyYYYY}/${keyWeeks}/2/`, fnData.newWeekly?.[keyYYYY]?.[keyWeeks]?.[2] || {})

    await Database.DashboardSetData(`${branch}/newMonthly/${keyMonthly}/1/`, fnData.newMonthly?.[keyMonthly]?.[1] || {})
    await Database.DashboardSetData(`${branch}/newMonthly/${keyMonthly}/2/`, fnData.newMonthly?.[keyMonthly]?.[2] || {})

    // await Database.DashboardSetData(`${branch}/newAnnual/${keyYYYY}/1/`, fnData.newAnnual?.[keyYYYY]?.[1] || {})
    // await Database.DashboardSetData(`${branch}/newAnnual/${keyYYYY}/2/`, fnData.newAnnual?.[keyYYYY]?.[2] || {})
    console.log("setDataByDay ====> SUCCESS")
  }
  const setDataAnnualByDay = async (branch, dateTo, fnData, sumPrice) => {
    let date = moment(dateTo)
    const key = date.format('YYYY-MM-DD')
    const keyHH = date.format('HH')
    const keyWeeks = date.weeks()
    const keyWeeksDDD = date.format('ddd')
    const keyMonthly = date.format('YYYY-MM')
    const keyDD = date.format('DD')
    const keyYYYY = date.format('YYYY')
    const keyMM = date.format('MM')


    await Database.DashboardSetData(`${branch}/newAnnual/${keyYYYY}/1/`, fnData.newAnnual?.[keyYYYY]?.[1] || {})
    await Database.DashboardSetData(`${branch}/newAnnual/${keyYYYY}/2/`, fnData.newAnnual?.[keyYYYY]?.[2] || {})
    console.log("setDataAnnualByDay ====> SUCCESS")
  }
  const updateDataByDay = async (defaultDate) => {
    // const defaultDate = '2023-03-24'
    if(defaultDate){
     const dateS        = _.split(defaultDate,'-')
     let   dateStartNew = new Date(`${dateS[0]}-${dateS[1]}-01`)
     let   dateNew      = new Date(defaultDate)
     let   res1         = await Firestore.ReportGetSalesReport('', dateNew, dateNew)
           res1         = reponseFirestore(res1)
     let   fnData       = newFn(res1)
     const sumPrice     = _.sumBy(res1,'priceProgram')
       setDataByDay('all',defaultDate,fnData,sumPrice)

       let   resY     = await Firestore.ReportGetSalesReport('', dateStartNew, dateNew)
             resY     = reponseFirestore(resY)
       let   fnDataY   = newFn(resY)
       setDataAnnualByDay('all',defaultDate,fnDataY,0)
      //  newAnnual
      //  newDaily
      //  newMonthly
      //  newWeekly
      _.map(branchData,async (res)=>{
        
        let resDataBranch   = _.filter(res1,(e)=>e.branchId == res.docId)
          if(resDataBranch.length){
            const item =     newFn(resDataBranch)
            const sumPrice = _.sumBy(resDataBranch,'priceProgram')
            setDataByDay(res.docId,defaultDate,item,sumPrice)
          }
          let resDataBranchY   = _.filter(resY,(e)=>e.branchId == res.docId)
          if(resDataBranchY.length){
            const item =     newFn(resDataBranchY)
            setDataAnnualByDay(res.docId,defaultDate,item,0)
          }
      })
     
    }
  }

  const total24Fn = (resI6) => {
    return numberWithCommas(_.sumBy(resI6, (e) => {
      if (permission.length) {
        if (_.find(permission, res => res.docId === e.branchId)) {
          if (e.priceType !== 4) {
            return Number(e.priceProgram)
          } else {
            return 0
          }
        }
      } else if (e.priceType !== 4) {
        return Number(e.priceProgram)
      } else {
        return 0
      }
    }))
  }
  const newFn = (resI6) =>{
    let item       = {}
    let newDaily   = {}
    let newWeekly  = {}
    let newMonthly = {}
    let newAnnual  = {}
 
    resI6.map((res)=>{
      const date        = moment(res.createAt * 1000)
      const key         = date.format('YYYY-MM-DD')
      const keyHH       = date.format('HH')
      const keyWeeks    = date.weeks()
      const keyWeeksDDD = date.format('ddd')
      const keyMonthly  = date.format('YYYY-MM')
      const keyDD       = date.format('DD')
      const keyYYYY     = date.format('YYYY')
      const keyMM       = date.format('MM')
 
      newDaily[`${key}`]                                    = newDaily[`${key}`] || {}
      newDaily[`${key}`][`${res.machineType}`]              = newDaily[`${key}`]?.[`${res.machineType}`] || {}
      newDaily[`${key}`][`${res.machineType}`][`${keyHH}`]  = newDaily[`${key}`]?.[`${res.machineType}`]?.[`${keyHH}`] || 0
      newDaily[`${key}`][`${res.machineType}`][`${keyHH}`] += Number(res.priceProgram)
      
      newWeekly[`${keyYYYY}`] = newWeekly[`${keyYYYY}`] || {}
      newWeekly[`${keyYYYY}`][`${keyWeeks}`]                                          = newWeekly[`${keyYYYY}`]?.[`${keyWeeks}`] || {}
      newWeekly[`${keyYYYY}`][`${keyWeeks}`][`${res.machineType}`]                    = newWeekly[`${keyYYYY}`]?.[`${keyWeeks}`]?.[`${res.machineType}`] || {}
      newWeekly[`${keyYYYY}`][`${keyWeeks}`][`${res.machineType}`][`${keyWeeksDDD}`]  = newWeekly[`${keyYYYY}`]?.[`${keyWeeks}`]?.[`${res.machineType}`]?.[`${keyWeeksDDD}`] || 0
      newWeekly[`${keyYYYY}`][`${keyWeeks}`][`${res.machineType}`][`${keyWeeksDDD}`] += Number(res.priceProgram)

      newMonthly[`${keyMonthly}`]                                    = newMonthly[`${keyMonthly}`] || {}
      newMonthly[`${keyMonthly}`][`${res.machineType}`]              = newMonthly[`${keyMonthly}`]?.[`${res.machineType}`] || {}
      newMonthly[`${keyMonthly}`][`${res.machineType}`][`${keyDD}`]  = newMonthly[`${keyMonthly}`]?.[`${res.machineType}`]?.[`${keyDD}`] || 0
      newMonthly[`${keyMonthly}`][`${res.machineType}`][`${keyDD}`] += Number(res.priceProgram)

      newAnnual[`${keyYYYY}`]                               = newAnnual[`${keyYYYY}`] || {}
      newAnnual[`${keyYYYY}`][res.machineType]              = newAnnual[`${keyYYYY}`]?.[res.machineType] || {}
      newAnnual[`${keyYYYY}`][res.machineType][`${keyMM}`]  = newAnnual[`${keyYYYY}`]?.[res.machineType]?.[`${keyMM}`] || 0
      newAnnual[`${keyYYYY}`][res.machineType][`${keyMM}`] += Number(res.priceProgram)

    })
    item.newDaily   = newDaily
    item.newWeekly  = newWeekly
    item.newMonthly = newMonthly
    item.newAnnual  = newAnnual
    return item
  }
  const dailyCumulativeFn = (resI6) => {
    let item6 = {
      labels,
      datasets: [
        {
          label: language['global_washing_machine'],//'เครื่องซัก'
          data: [],
          borderColor: '#172961',
          backgroundColor: '#172961'
        },
        {
          label: language['global_dryer_machine'],//'เครื่องอบ'
          data: [],
          borderColor: '#FF7D80',
          backgroundColor: '#FF7D80'
        }
      ]
    }
    if(_.isNull(resI6)){
      setDataItem6(item6)
      return false
    }
    
    const data1 = []
    const data2 = []
    let sData1 = 0
    let sData2 = 0
    labels.map(res => {
      let key = ('0' + Number(res)).slice(-2)
      if (moment().format('HH') >= key) {
        if (!_.isUndefined(resI6[1]) && resI6[1][key]) {
          sData1 += resI6[1][key]
          data1.push(sData1)
        } else {
          sData1 += 0
          data1.push(sData1)
        }
        if (!_.isUndefined(resI6[2]) && resI6[2][key]) {
          sData2 += resI6[2][key]
          data2.push(sData2)
        } else {
          sData2 += 0
          data2.push(sData2)
        }
      }
    })
    item6.datasets[0].data = data1
    item6.datasets[1].data = data2
    setDataItem6(item6)
  }

  const dailySalesFn = (resI7New, resI7Old) => {
    let item = {
      labels,
      datasets: [
        {

          label: language['dashboard_chart_detail_1'],//'วันก่อนหน้า',
          backgroundColor: '#36A2EB',
          data: [],
        },
        {

          label: language['dashboard_chart_detail_2'],//'วันปัจจุบัน',
          backgroundColor: '#FFC000',
          data: [],
        },
      ],
    }
    if(_.isNull(resI7New) && _.isNull(resI7Old)){
      setDataItem7(item)
      return false
    }
    const data1 = []
    const data2 = []
    labels.map(res => {
      let key = ('0' + Number(res)).slice(-2)
      if (moment().format('HH') >= key) {
        if (resI7New && !_.isUndefined(resI7New[1]) && resI7New[1][key] && !_.isUndefined(resI7New[2]) && resI7New[2][key]) {
          data1.push(resI7New[1][key] + resI7New[2][key])
        }else if (resI7New && !_.isUndefined(resI7New[1]) && resI7New[1][key]) {
          data1.push(resI7New[1][key])
        }else if (resI7New && !_.isUndefined(resI7New[2]) && resI7New[2][key]) {
          data1.push(resI7New[2][key])
        } else {
          data1.push(0)
        }

        if (resI7Old && !_.isUndefined(resI7Old[1]) && resI7Old[1][key] && !_.isUndefined(resI7Old[2]) && resI7Old[2][key]) {
          data2.push(resI7Old[1][key] + resI7Old[2][key])
        }else if (resI7Old && !_.isUndefined(resI7Old[1]) && resI7Old[1][key]) {
          data2.push(resI7Old[1][key])
        }else if (resI7Old && !_.isUndefined(resI7Old[2]) && resI7Old[2][key]) {
          data2.push(resI7Old[2][key])
        } else {
          data2.push(0)
        }
      }
    })
    item.datasets[0].data = data2
    item.datasets[1].data = data1
    setDataItem7(item)
  }

  const weeklySalesFn = (resI8New,resI8Old)=> { 
    let item = {
      labels: labelsDay,
      datasets: [
        {

          label: language['dashboard_chart_detail_3'],//'สัปดาห์ก่อนหน้า',
          backgroundColor: '#36A2EB',
          data: [],
        },
        {

          label: language['dashboard_chart_detail_4'],//'สัปดาห์ปัจจุบัน',
          backgroundColor: '#FFC000',
          data: [],
        },
      ],
    }
    if(_.isNull(resI8New) && _.isNull(resI8Old)){
      setDataItem8(item)
      return false
    }

    const data1 = []
    const data2 = []
    labelsDay.map(res => {
      if(resI8New && resI8New[1] && resI8New[1][res] && resI8New[2] && resI8New[2][res]){
        data1.push(resI8New[1][res]+resI8New[2][res])
      }else if(resI8New && resI8New[1] && resI8New[1][res]){
        data1.push(resI8New[1][res])
      }else if(resI8New && resI8New[2] && resI8New[2][res]){
        data1.push(resI8New[2][res])
      }else {
        data1.push(0)
      }

      if(resI8Old && resI8Old[1] && resI8Old[1][res] && resI8Old[2] && resI8Old[2][res]){
        data2.push(resI8Old[1][res]+resI8Old[2][res])
      }else if(resI8Old && resI8Old[1] && resI8Old[1][res]){
        data2.push(resI8Old[1][res])
      }else if(resI8Old && resI8Old[2] && resI8Old[2][res]){
        data2.push(resI8Old[2][res])
      }else {
        data2.push(0)
      }

    })
    item.datasets[0].data = data2
    item.datasets[1].data = data1
    setDataItem8(item)
  }

  const weeklyCumulativeFn = (resI8New) =>{
    let item = {
      labels: labelsDay,
      datasets: [
        {

          label: language['global_washing_machine'],//'เครื่องซัก',
          borderColor: '#172961',
          backgroundColor: '#172961',
          data: [],
        },
        {

          label: language['global_dryer_machine'],//'เครื่องอบ',
          borderColor: '#FF7D80',
          backgroundColor: '#FF7D80',
          data: [],
        },
      ],
    }
    if(_.isNull(resI8New)){
      setDataItem11(item)
      return false
    }
    const dataLine1 = []
    const dataLine2 = []
    let sData1 = 0
    let sData2 = 0
    let labelsDaySet = []
    for (const iterator of labelsDay) {
      labelsDaySet.push(iterator)
      if(iterator === moment().format('ddd')){
        break
      }
    }
   
    labelsDaySet.map(res => {
      if (resI8New && resI8New[1] && resI8New[1][res]) {
        sData1 += resI8New[1][res]
        dataLine1.push(sData1)
      }else{
        // sData1 += sData1
        dataLine1.push(sData1)
      }
      if (resI8New && resI8New[2] && resI8New[2][res]) {
        sData2 += resI8New[2][res]
        dataLine2.push(sData2)
      }else{
        // sData2 += sData2
        dataLine2.push(sData2)
      }

    })
    item.datasets[0].data = dataLine1
    item.datasets[1].data = dataLine2
    setDataItem11(item)
  }

  const monthlySalesFn = (resI9New,resI9Old) =>{
    let item = {
      labels: labelsMonth,
      datasets: [
        {

          label: language['dashboard_chart_detail_5'],//'เดือนก่อนหน้า',
          backgroundColor: '#36A2EB',
          data: [],
        },
        {

          label: language['dashboard_chart_detail_6'],//'เดือนปัจจุบัน',
          backgroundColor: '#FFC000',
          data: [],
        },
      ],
    }
    if(_.isNull(resI9New) && _.isNull(resI9Old)){
      setDataItem9(item)
      return false
    }
    const data1 = []
    const data2 = []
    labelsMonth.map(res => {
      let key = ('0' + Number(res)).slice(-2)
      if (resI9New && resI9New[1] && resI9New[1][key] && resI9New && resI9New[2] && resI9New[2][key]) {
        data1.push(resI9New[1][key] + resI9New[2][key])
      }else if(resI9New && resI9New[1] && resI9New[1][key]){
        data1.push(resI9New[1][key])
      }else if(resI9New && resI9New[2] && resI9New[2][key]){
        data1.push(resI9New[2][key])
      } else {
        data1.push(0)
      }
      if (resI9Old && resI9Old[1] && resI9Old[1][key] && resI9Old && resI9Old[2] && resI9Old[2][key]) {
        data2.push(resI9Old[1][key] + resI9Old[2][key])
      }else if(resI9Old && resI9Old[1] && resI9Old[1][key]){
        data2.push(resI9Old[1][key])
      }else if(resI9Old && resI9Old[2] && resI9Old[2][key]){
        data2.push(resI9Old[2][key])
      } else {
        data2.push(0)
      }
    })
    item.datasets[0].data = data2
    item.datasets[1].data = data1
    setDataItem9(item)
  }

  const monthlyCumulativeFn = (resI9New) => {
    let item = {
      labels: labelsMonth,
      datasets: [
        {

          label: language['global_washing_machine'],//'เครื่องซัก',
          borderColor: '#172961',
          backgroundColor: '#172961',
          data: [],
        },
        {

          label: language['global_dryer_machine'],//'เครื่องอบ',
          borderColor: '#FF7D80',
          backgroundColor: '#FF7D80',
          data: [],
        },
      ],
    }
    if(_.isNull(resI9New)){
      setDataItem12(item)
      return false
    }

    const dataLine1 = []
    const dataLine2 = []
    let sData1 = 0
    let sData2 = 0
    let labelsMonthSet = []
    for (const iterator of labelsMonth) {
      labelsMonthSet.push(iterator)
      if(iterator === Number(moment().format('D'))){
        break
      }
    }
    labelsMonthSet.map(res => {
      let key = ('0' + Number(res)).slice(-2)
      if (resI9New && resI9New[1] && resI9New[1][key]) {
        sData1 += resI9New[1][key]
        dataLine1.push(sData1)
      }else{
        dataLine1.push(sData1)
      }
      if (resI9New && resI9New[2] && resI9New[2][key]) {
        sData2 += resI9New[2][key]
        dataLine2.push(sData2)
      }else{
        dataLine2.push(sData2)
      }
    })
    item.datasets[0].data = dataLine1
    item.datasets[1].data = dataLine2
    setDataItem12(item)
  }

  const annualSalesFn = (resI10New,resI10Old) =>{
    let item = {
      labels: labelsYear,
      datasets: [
        {

          label: language['dashboard_chart_detail_7'],//'ปีก่อนหน้า',
          backgroundColor: '#36A2EB',
          data: [],
        },
        {

          label: language['dashboard_chart_detail_8'],//'ปีปัจจุบัน',
          backgroundColor: '#FFC000',
          data: [],
        },
      ],
    }
    if(_.isNull(resI10New) && _.isNull(resI10Old)){
      setDataItem10(item)
      return false
    }

    const data1 = []
    const data2 = []
    labelsYear.map((res, index) => {
      let key = ('0' + Number(index+1)).slice(-2)
      if (resI10New && resI10New[1] && resI10New[1][key] && resI10New && resI10New[2] && resI10New[2][key]) {
        data1.push(resI10New[1][key] + resI10New[2][key])
      }else if (resI10New && resI10New[1] && resI10New[1][key]) {
        data1.push(resI10New[1][key])
      }else if (resI10New && resI10New[2] && resI10New[2][key]) {
        data1.push(resI10New[2][key])
      } else {
        data1.push(0)
      }
      if (resI10Old && resI10Old[1] && resI10Old[1][key] && resI10Old && resI10Old[2] && resI10Old[2][key]) {
        data2.push(resI10Old[1][key] + resI10Old[2][key])
      }else if (resI10Old && resI10Old[1] && resI10Old[1][key]) {
        data2.push(resI10Old[1][key])
      }else if (resI10Old && resI10Old[2] && resI10Old[2][key]) {
        data2.push(resI10Old[2][key])
      } else {
        data2.push(0)
      }
    })
    item.datasets[0].data = data2
    item.datasets[1].data = data1
    setDataItem10(item)
  }

  const annualCumulativeFn = (resI10New) =>{
    let item = {
      labels: labelsYear,
      datasets: [
        {

          label: language['global_washing_machine'],//'เครื่องซัก',
          borderColor: '#172961',
          backgroundColor: '#172961',
          data: [],
        },
        {

          label: language['global_dryer_machine'],//'เครื่องอบ',
          borderColor: '#FF7D80',
          backgroundColor: '#FF7D80',
          data: [],
        },
      ],
    }
    if(_.isNull(resI10New)){
      setDataItem13(item)
      return false
    }

    const dataLine1 = []
    const dataLine2 = []
    let sData1 = 0
    let sData2 = 0
    labelsYear.map((res, index) => {
      if (index < Number(moment().format('M'))) {
        let key = ('0' + Number(index+1)).slice(-2)
        if (resI10New && resI10New[1] && resI10New[1][key]) {
             sData1 += resI10New[1][key]
            dataLine1.push(sData1)
        } else {
              // sData1 += 0
            dataLine1.push(sData1)
        }

        if (resI10New && resI10New[2] && resI10New[2][key]) {
          sData2 += resI10New[2][key]
          dataLine2.push(sData2)
        }else{
          // sData2 += 0
          dataLine2.push(sData2)
        }
      }
    })
    
    item.datasets[0].data = dataLine1
    item.datasets[1].data = dataLine2
    setDataItem13(item)
  }

  const getDataI6 = async () => {
    let resI6 = await Firestore.DashboardGetItem6()
    resI6 = reponseFirestore(resI6)
    const gResI6 = _.groupBy(resI6, 'machineType')
    const gTime1ResI6 = _.groupBy(gResI6['1'], e => {
      if (permission.length) {
        if (_.find(permission, res => res.docId === e.branchId)) {
          return moment(e.createAt * 1000).format('HH')
        }
      } else {
        return moment(e.createAt * 1000).format('HH')
      }
    })
    const gTime2ResI6 = _.groupBy(gResI6['2'], e => {
      if (permission.length) {
        if (_.find(permission, res => res.docId === e.branchId)) {
          return moment(e.createAt * 1000).format('HH')
        }
      } else {
        return moment(e.createAt * 1000).format('HH')
      }
    })
    setTotalDay(numberWithCommas(_.sumBy(resI6, (e) => {
      if (permission.length) {
        if (_.find(permission, res => res.docId === e.branchId)) {
          if (e.priceType !== 4) {
            return Number(e.priceProgram)
          } else {
            return 0
          }
        }
      } else if (e.priceType !== 4) {
        return Number(e.priceProgram)
      } else {
        return 0
      }
    })))
    const item6 = {
      labels,
      datasets: [
        {
          label: language['global_washing_machine'],//'เครื่องซัก',
          data: [],
          borderColor: '#172961',
          backgroundColor: '#172961'
        },
        {
          label: language['global_dryer_machine'],//'เครื่องอบ',
          data: [],
          borderColor: '#FF7D80',
          backgroundColor: '#FF7D80'
        }
      ]
    }
    const data1 = []
    const data2 = []
    let sData1 = 0
    let sData2 = 0
    labels.map(res => {
      let key = ('0' + Number(res)).slice(-2)
      if (moment().format('HH') >= key) {
        if (gTime1ResI6[key]) {
          sData1 += _.sumBy(gTime1ResI6[key], 'priceProgram')
          data1.push(sData1)
        } else {
          sData1 += 0
          data1.push(sData1)
        }
        if (gTime2ResI6[key]) {
          sData2 += _.sumBy(gTime2ResI6[key], 'priceProgram')
          data2.push(sData2)
        } else {
          sData2 += 0
          data2.push(sData2)
        }
      }
    })
    item6.datasets[0].data = data1
    item6.datasets[1].data = data2
    setDataItem6(item6)
  }

  const getDataI7 = async (branch) => {
    let resI7New = await Firestore.ReportGetSalesReport(branch, new Date(), new Date())
    let resI7Old = await Firestore.ReportGetSalesReport(branch, new Date(moment().subtract(1, 'day')), new Date(moment().subtract(1, 'day')))

    resI7New = reponseFirestore(resI7New)
    resI7Old = reponseFirestore(resI7Old)

    const gTimeResI7New = _.groupBy(resI7New, e => {
      if (permission.length) {
        if (_.find(permission, res => res.docId === e.branchId)) {
          return moment(e.createAt * 1000).format('HH')
        }
      } else {
        return moment(e.createAt * 1000).format('HH')
      }
    })
    const gTimeResI7Old = _.groupBy(resI7Old, e => {
      if (permission.length) {
        if (_.find(permission, res => res.docId === e.branchId)) {
          return moment(e.createAt * 1000).format('HH')
        }
      } else {
        return moment(e.createAt * 1000).format('HH')
      }
    })

    const data1 = []
    const data2 = []
    labels.map(res => {
      let key = ('0' + Number(res)).slice(-2)
      if (moment().format('HH') >= key) {
        if (gTimeResI7New[key]) {
          data1.push(_.sumBy(gTimeResI7New[key], 'priceProgram'))
        } else {
          data1.push(0)
        }

      }
      if (gTimeResI7Old[key]) {
        data2.push(_.sumBy(gTimeResI7Old[key], 'priceProgram'))
      } else {
        data2.push(0)
      }
    })
    const item7 = {
      labels,
      datasets: [
        {

          label: 'วันก่อนหน้า',
          backgroundColor: '#36A2EB',
          data: data2,
        },
        {

          label: 'วันปัจจุบัน',
          backgroundColor: '#FFC000',
          data: data1,
        },
      ],
    }
    setDataItem7(item7)
  }

  const getDataI8 = async (branch) => {
    const startDateNew = new Date(moment().isoWeekday(0))
    const endDateNew = new Date(moment().isoWeekday(6))
    const startDateOld = new Date(moment(moment().isoWeekday(-1)).isoWeekday(0))
    const endDateOld = new Date(moment(moment().isoWeekday(-1)).isoWeekday(6))

    let resI8New = await Firestore.ReportGetSalesReport(branch, startDateNew, endDateNew)
    let resI8Old = await Firestore.ReportGetSalesReport(branch, startDateOld, endDateOld)

    resI8New = reponseFirestore(resI8New)
    resI8Old = reponseFirestore(resI8Old)
    const gDayResI8New = _.groupBy(resI8New, e => {
      if (permission.length) {
        if (_.find(permission, res => res.docId === e.branchId)) {
          return moment(e.createAt * 1000).format('ddd')
        }
      } else {
        return moment(e.createAt * 1000).format('ddd')
      }
    })
    const gDayResI8Old = _.groupBy(resI8Old, e => {
      if (permission.length) {
        if (_.find(permission, res => res.docId === e.branchId)) {
          return moment(e.createAt * 1000).format('ddd')
        }
      } else {
        return moment(e.createAt * 1000).format('ddd')
      }
    })

    const gMachineType = _.groupBy(resI8New, 'machineType')
    const gDayMachineType1 = _.groupBy(gMachineType['1'], e => {
      if (permission.length) {
        if (_.find(permission, res => res.docId === e.branchId)) {
          return moment(e.createAt * 1000).format('ddd')
        }
      } else {
        return moment(e.createAt * 1000).format('ddd')
      }
    })
    const gDayMachineType2 = _.groupBy(gMachineType['2'], e => {
      if (permission.length) {
        if (_.find(permission, res => res.docId === e.branchId)) {
          return moment(e.createAt * 1000).format('ddd')
        }
      } else {
        return moment(e.createAt * 1000).format('ddd')
      }
    })

    const data1 = []
    const data2 = []
    const dataLine1 = []
    const dataLine2 = []
    let sData1 = 0
    let sData2 = 0
    labelsDay.map(res => {
      if (gDayMachineType1[res]) {
        sData1 += _.sumBy(gDayMachineType1[res], 'priceProgram')
        dataLine1.push(sData1)
      }
      if (gDayMachineType2[res]) {
        sData2 += _.sumBy(gDayMachineType2[res], 'priceProgram')
        dataLine2.push(sData2)
      }
      if (gDayResI8New[res]) {
        data1.push(_.sumBy(gDayResI8New[res], 'priceProgram'))
      } else {
        data1.push(0)
      }
      if (gDayResI8Old[res]) {
        data2.push(_.sumBy(gDayResI8Old[res], 'priceProgram'))
      } else {
        data2.push(0)
      }
    })
    const item8 = {
      labels: labelsDay,
      datasets: [
        {

          label: 'สัปดาห์ก่อนหน้า',
          backgroundColor: '#36A2EB',
          data: data2,
        },
        {

          label: 'สัปดาห์ปัจจุบัน',
          backgroundColor: '#FFC000',
          data: data1,
        },
      ],
    }
    const item11 = {
      labels: labelsDay,
      datasets: [
        {

          label: 'เครื่องซัก',
          borderColor: '#172961',
          backgroundColor: '#172961',
          data: dataLine1,
        },
        {

          label: 'เครื่องอบ',
          borderColor: '#FF7D80',
          backgroundColor: '#FF7D80',
          data: dataLine2,
        },
      ],
    }
    setDataItem8(item8)
    setDataItem11(item11)
  }
  const getDataI9 = async (branch) => {
    const startDateNew = new Date(`${moment().format('YYYY-MM')}-01`)
    const endDateNew = new Date(`${moment().format('YYYY-MM')}-${moment().daysInMonth()}`)
    const monthOld = moment().subtract(1, 'month')
    const startDateOld = new Date(`${monthOld.format('YYYY-MM')}-01`)
    const endDateOld = new Date(`${monthOld.format('YYYY-MM')}-${monthOld.daysInMonth()}`)
    let resI9New = await Firestore.ReportGetSalesReport(branch, startDateNew, endDateNew)
    let resI9Old = await Firestore.ReportGetSalesReport(branch, startDateOld, endDateOld)

    resI9New = reponseFirestore(resI9New)
    resI9Old = reponseFirestore(resI9Old)
    const gDayResI9New = _.groupBy(resI9New, e => {
      if (permission.length) {
        if (_.find(permission, res => res.docId === e.branchId)) {
          return moment(e.createAt * 1000).format('D')
        }
      } else {
        return moment(e.createAt * 1000).format('D')
      }
    })
    const gDayResI9Old = _.groupBy(resI9Old, e => {
      if (permission.length) {
        if (_.find(permission, res => res.docId === e.branchId)) {
          return moment(e.createAt * 1000).format('D')
        }
      } else {
        return moment(e.createAt * 1000).format('D')
      }
    })

    const gMachineType = _.groupBy(resI9New, 'machineType')
    const gDayMachineType1 = _.groupBy(gMachineType['1'], e => {
      if (permission.length) {
        if (_.find(permission, res => res.docId === e.branchId)) {
          return moment(e.createAt * 1000).format('D')
        }
      } else {
        return moment(e.createAt * 1000).format('D')
      }
    })
    const gDayMachineType2 = _.groupBy(gMachineType['2'], e => {
      if (permission.length) {
        if (_.find(permission, res => res.docId === e.branchId)) {
          return moment(e.createAt * 1000).format('D')
        }
      } else {
        return moment(e.createAt * 1000).format('D')
      }
    })

    const data1 = []
    const data2 = []
    const dataLine1 = []
    const dataLine2 = []
    let sData1 = 0
    let sData2 = 0
    labelsMonth.map(res => {
      if (gDayMachineType1[res]) {
        sData1 += _.sumBy(gDayMachineType1[res], 'priceProgram')
        dataLine1.push(sData1)
      }
      if (gDayMachineType2[res]) {
        sData2 += _.sumBy(gDayMachineType2[res], 'priceProgram')
        dataLine2.push(sData2)
      }
      if (gDayResI9New[res]) {
        data1.push(_.sumBy(gDayResI9New[res], 'priceProgram'))
      } else {
        data1.push(0)
      }
      if (gDayResI9Old[res]) {
        data2.push(_.sumBy(gDayResI9Old[res], 'priceProgram'))
      } else {
        data2.push(0)
      }
    })
    const item9 = {
      labels: labelsMonth,
      datasets: [
        {

          label: 'เดือนก่อนหน้า',
          backgroundColor: '#36A2EB',
          data: data2,
        },
        {

          label: 'เดือนปัจจุบัน',
          backgroundColor: '#FFC000',
          data: data1,
        },
      ],
    }
    const item12 = {
      labels: labelsMonth,
      datasets: [
        {

          label: 'เครื่องซัก',
          borderColor: '#172961',
          backgroundColor: '#172961',
          data: dataLine1,
        },
        {

          label: 'เครื่องอบ',
          borderColor: '#FF7D80',
          backgroundColor: '#FF7D80',
          data: dataLine2,
        },
      ],
    }
    setDataItem9(item9)
    setDataItem12(item12)
  }

  const getDataI10 = async (branch) => {
    const startDateNew = new Date(`${moment().format('YYYY')}-01-01`)
    const endDateNew = new Date(`${moment().format('YYYY')}-12-31`)
    const monthOld = moment().subtract(1, 'year')
    const startDateOld = new Date(`${monthOld.format('YYYY')}-01-01`)
    const endDateOld = new Date(`${monthOld.format('YYYY')}-12-31`)
    let resI10New = await Firestore.ReportGetSalesReport(branch, startDateNew, endDateNew)
    let resI10Old = await Firestore.ReportGetSalesReport(branch, startDateOld, endDateOld)

    resI10New = reponseFirestore(resI10New)
    resI10Old = reponseFirestore(resI10Old)
    const gDayResI10New = _.groupBy(resI10New, e => {
      if (permission.length) {
        if (_.find(permission, res => res.docId === e.branchId)) {
          return moment(e.createAt * 1000).format('MMM')
        }
      } else {
        return moment(e.createAt * 1000).format('MMM')
      }
    })
    const gDayResI10Old = _.groupBy(resI10Old, e => {
      if (permission.length) {
        if (_.find(permission, res => res.docId === e.branchId)) {
          return moment(e.createAt * 1000).format('MMM')
        }
      } else {
        return moment(e.createAt * 1000).format('MMM')
      }
    })

    const gMachineType = _.groupBy(resI10New, 'machineType')
    const gDayMachineType1 = _.groupBy(gMachineType['1'], e => {
      if (permission.length) {
        if (_.find(permission, res => res.docId === e.branchId)) {
          return moment(e.createAt * 1000).format('MMM')
        }
      } else {
        return moment(e.createAt * 1000).format('MMM')
      }
    })
    const gDayMachineType2 = _.groupBy(gMachineType['2'], e => {
      if (permission.length) {
        if (_.find(permission, res => res.docId === e.branchId)) {
          return moment(e.createAt * 1000).format('MMM')
        }
      } else {
        return moment(e.createAt * 1000).format('MMM')
      }
    })

    const data1 = []
    const data2 = []
    const dataLine1 = []
    const dataLine2 = []
    let sData1 = 0
    let sData2 = 0
    labelsYear.map((res, index) => {
      if (index < Number(moment().format('M'))) {
        if (gDayMachineType1[res]) {
          sData1 += _.sumBy(gDayMachineType1[res], (e) => Number(e.priceProgram))
          dataLine1.push(sData1)
        } else {
          sData1 += 0
          dataLine1.push(sData1)
        }
        if (gDayMachineType2[res]) {
          sData2 += _.sumBy(gDayMachineType2[res], (e) => Number(e.priceProgram))
          dataLine2.push(sData2)
        } else {
          sData2 += 0
          dataLine2.push(sData2)
        }
      }

      if (gDayResI10New[res]) {
        data1.push(_.sumBy(gDayResI10New[res], (e) => Number(e.priceProgram)))
      } else {
        data1.push(0)
      }
      if (gDayResI10Old[res]) {
        data2.push(_.sumBy(gDayResI10Old[res], (e) => Number(e.priceProgram)))
      } else {
        data2.push(0)
      }
    })
    const item10 = {
      labels: labelsYear,
      datasets: [
        {

          label: 'ปีก่อนหน้า',
          backgroundColor: '#36A2EB',
          data: data2,
        },
        {

          label: 'ปีปัจจุบัน',
          backgroundColor: '#FFC000',
          data: data1,
        },
      ],
    }
    const item13 = {
      labels: labelsYear,
      datasets: [
        {

          label: 'เครื่องซัก',
          borderColor: '#172961',
          backgroundColor: '#172961',
          data: dataLine1,
        },
        {

          label: 'เครื่องอบ',
          borderColor: '#FF7D80',
          backgroundColor: '#FF7D80',
          data: dataLine2,
        },
      ],
    }
    setDataItem10(item10)
    setDataItem13(item13)
  }

  const numberWithCommas = x => {
    x = x.toString()
    var pattern = /(-?\d+)(\d{3})/
    while (pattern.test(x)) x = x.replace(pattern, '$1,$2')
    return x
  }


  let item2 = [
    /*{
            title: 'แจ้งวัฒนะ 14',
            total: 0
        }*/
  ]

  let item3 = [
    {
      title: language['dashboard_number_of_members'],//'จำนวนสมาชิกทั้งหมด',
      total: 0,
      icon: 'fas fa-user-friends'
    },
    {
      title: language['dashboard_amount_in_wallet'],//'จำนวนเงินในกระเป๋า',
      total: 0,
      icon: 'fas fa-wallet'
    }
  ]

  let item4 = [
    {
      title: 'สมาชิก แยกตามจังหวัด',
      data: {
        labels: ['กทม.', 'นนทบุรี', 'ปทุมธานี'],
        datasets: [
          {
            label: '# of Votes',
            data: [50, 30, 20],
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 0
          }
        ]
      }
    },
    {
      title: 'สมาชิก แยกตามอายุ',
      data: {
        labels: ['20', '25', '30', '35', '40', '45'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 0
          }
        ]
      }
    },
    {
      title: 'สมาชิก แยกตามเพศ',
      data: {
        labels: ['ชาย', 'หญิง'],
        datasets: [
          {
            label: '# of Votes',
            data: [30, 70],
            backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
            borderWidth: 0
          }
        ]
      }
    }
  ]

  let item5 = [
    {
      title: 'ยอดขาย แยกตามวัน',
      data: {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [
          {
            label: '# of Day',
            data: [50, 30, 20, 12, 19, 3, 5],
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(255, 53, 184, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 0
          }
        ]
      }
    },
    {
      title: 'ยอดขาย แยกตามสัปดาห์',
      data: {
        labels: ['1', '2', '3', '4', '5', '6'],
        datasets: [
          {
            label: '# of Week',
            data: [12, 19, 3, 5, 2, 7],
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 0
          }
        ]
      }
    }
  ]

  const barOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  }

  dashboardItem2.map(async (res, index) => {
    if (permission.length) {
      if (_.find(permission, res1 => res1.docId === res.docId)) {
        item2.push({
          title: res.name,
          total: res.priceAll
        })
      }
    } else {
      item2.push({
        title: res.name,
        total: res.priceAll
      })
    }

  })

  dashboardItem3.map(async (res, index) => {
    if (!_.isUndefined(item3[index])) {
      item3[index].total = numberWithCommas(res)
    }
  })

  dashboardItem4.map(async (res, index) => {
    if (index === 0) {
      item4[index].data.labels = res[0]
      item4[index].data.datasets[0].data = res[1]
    } else {
      item4[index].data.datasets[0].data = res
    }
  })

  dashboardItem5.map(async (res, index) => {
    if (index === 0) {
      item5[index].data.datasets[0].data = res
    } else {
      item5[index].data.datasets[0].data = res
    }
  })

  const AnyReactComponent = ({ text }) => <div>{text}</div>
  const option = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
  return (
    <BasePage>
      <Container fluid>
        <Row className='py-md-2 justify-content-end'>
          <Col md={4} className="text-end">
                  <div>
                   {` ${language['dashboard_latest_update']} ${updateTime}`}
                  </div>

          </Col>
        </Row>
        {userData.type <= 3 && (<CardTotalBranch item1={item1} totalDay={totalDay} language={language} />)}


         {userData.type <= 3 && (
          <Row className='py-md-4'>
            <Col className='mb-5 mb-xl-0'>
              <Card className='shadow h-100'>
                <MachineShow></MachineShow>
              </Card>
            </Col>
          </Row>
        )} 

        {userData.type < 3 && (
          <Row className='py-md-4'>
            <Col className='mb-5 mb-xl-0' lg={12}  xxl={8}>
              <Card className='shadow h-100'>
                <Card.Body style={{ minHeight: 400 }}>
                  <MapList />
                </Card.Body>
              </Card>
            </Col>

            <Col lg={12} xxl={4}>
              <Card className='shadow'>
                <Card.Header className='bg-transparent'>
                  <Row className='align-items-center'>
                    <div className='col'>
                      <h5 className='mb-0'>{language['dashboard_highest_earning_branch']}</h5>
                    </div>
                  </Row>
                </Card.Header>
                <Card.Body className='p-0'>
                  <Table striped bordered hover>
                    <thead className='thead-light'>
                      <tr>
                        <th scope='col'>{language['global_branch_name']}</th>
                        <th scope='col'>{language['dashboard_income_baht']}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item2.map((res, index) => {
                        return (
                          <tr key={index}>
                            <td>{res.title}</td>
                            <td className='text-end'>
                              {numberWithCommas(res.total)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
        {
          userData.type == 3 &&
          <Row className='py-md-4'>
            <Col md="12">
              <Card className='shadow'>
                <Card.Header className='bg-transparent'>
                  <h4>{language['global_branch']} : {permission[0]?.name || ''}</h4>
                </Card.Header>
              </Card>
            </Col>
          </Row>
        }
        {
          userData.type <= 3 &&
          <Row className='py-md-4'>
            <Col xxl="6" lg={12} className="pb-2">
              <Card className='shadow h-100'>
                <Card.Header className='bg-transparent'>
                  <Row className='align-items-center'>
                    <div className='col'>
                      <h5 className='mb-0'>
                        {language['dashboard_chart_1']}
                      </h5>
                    </div>
                  </Row>
                </Card.Header>
                <Card.Body className='p-0'>
                  {dataItem6 && <Line options={option} data={dataItem6} />}
                </Card.Body>
              </Card>
            </Col>
            <Col xxl="6" lg={12} className="pb-2">
              <Card className='shadow h-100'>
                <Card.Header className='bg-transparent'>
                  <Row className='align-items-center'>
                    <div className='col'>
                      <h5 className='mb-0'>
                        {language['dashboard_chart_2']}
                      </h5>
                    </div>
                  </Row>
                </Card.Header>
                <Card.Body className='p-0'>
                  {dataItem11 && <Line options={option} data={dataItem11} />}
                </Card.Body>
              </Card>
            </Col>

          </Row>
        }
        {
          userData.type <= 3 &&
          <Row>
            <Col xxl="6" className="pb-2">
              <Card className='shadow h-100'>
                <Card.Header className='bg-transparent'>
                  <Row className='align-items-center'>
                    <div className='col'>
                      <h5 className='mb-0'>
                        {language['dashboard_chart_3']}
                      </h5>
                    </div>
                  </Row>
                </Card.Header>
                <Card.Body className='p-0'>
                  {dataItem12 && <Line options={option} data={dataItem12} />}
                </Card.Body>
              </Card>
            </Col>
            <Col xxl="6" className="pb-2">
              <Card className='shadow h-100'>
                <Card.Header className='bg-transparent'>
                  <Row className='align-items-center'>
                    <div className='col'>
                      <h5 className='mb-0'>
                        {language['dashboard_chart_4']}
                      </h5>
                    </div>
                  </Row>
                </Card.Header>
                <Card.Body className='p-0'>
                  {dataItem13 && <Line options={option} data={dataItem13} />}
                </Card.Body>
              </Card>
            </Col>

          </Row>
        }
        {/* {userData.type < 3 && (
          <Row className='py-md-4'>
            {item3.map((res, index) => {
              return (
                <Col key={index}>
                  <Card className='card-stats card-dashboard shadow mb-4 mb-xl-0'>
                    <Card.Body>
                      <Row>
                        <div className='col'>
                          <Card.Title className='text-uppercase text-muted mb-0'>
                            {res.title}
                          </Card.Title>
                          <span className='h4 font-weight-bold mb-0'>
                            {res.total}
                          </span>
                        </div>
                        <Col className='col-auto'>
                          <div className='icon icon-shape bg-info text-white rounded-circle shadow'>
                            <i className={res.icon} />
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              )
            })}
          </Row>
        )} */}
        {userData.type < 3 && (
          <Row className='py-md-4'>
            <Col md={6}>
              <Form.Select
                onChange={e => {
                  setBranch(e.target.value)
                }}
                name={'branch'}
              >
                <option value={''}>{language['dashboard_select']}</option>
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
        )}
        {userData.type <= 3 && (
          <Row className='py-md-4'>
            <Col xxl={6}>
              <Card className='card-stats shadow mb-4 mb-xl-0'>
                <Card.Body>
                  <Row>
                    <div className='col'>
                      <Card.Title className='text-uppercase text-muted mb-0'>
                        {language['dashboard_chart_5']}
                      </Card.Title>
                    </div>
                    <Col className='col-auto'>
                      <div className='icon icon-shape bg-warning text-white rounded-bar shadow'>
                        <i className='fas fa-chart-bar' />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    {dataItem7 && <Bar options={option} data={dataItem7} />}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col xxl={6}>
              <Card className='card-stats shadow mb-4 mb-xl-0'>
                <Card.Body>
                  <Row>
                    <div className='col'>
                      <Card.Title className='text-uppercase text-muted mb-0'>
                        {language['dashboard_chart_6']}
                      </Card.Title>
                    </div>
                    <Col className='col-auto'>
                      <div className='icon icon-shape bg-warning text-white rounded-bar shadow'>
                        <i className='fas fa-chart-bar' />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    {dataItem8 && <Bar options={option} data={dataItem8} />}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
        {userData.type <= 3 && (
          <Row className='py-md-4'>
            <Col xxl={6}>
              <Card className='card-stats shadow mb-4 mb-xl-0'>
                <Card.Body>
                  <Row>
                    <div className='col'>
                      <Card.Title className='text-uppercase text-muted mb-0'>
                        {language['dashboard_chart_7']}
                      </Card.Title>
                    </div>
                    <Col className='col-auto'>
                      <div className='icon icon-shape bg-warning text-white rounded-bar shadow'>
                        <i className='fas fa-chart-bar' />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    {dataItem9 && <Bar options={option} data={dataItem9} />}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col xxl={6}>
              <Card className='card-stats shadow mb-4 mb-xl-0'>
                <Card.Body>
                  <Row>
                    <div className='col'>
                      <Card.Title className='text-uppercase text-muted mb-0'>
                        {language['dashboard_chart_8']}
                      </Card.Title>
                    </div>
                    <Col className='col-auto'>
                      <div className='icon icon-shape bg-warning text-white rounded-bar shadow'>
                        <i className='fas fa-chart-bar' />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    {dataItem10 && <Bar options={option} data={dataItem10} />}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
        {/* {
                    userData.type < 3 &&
                    <Row className="py-md-4">
                        {
                            item4.map((res, index) => {
                                return (
                                    <Col key={index}>
                                        <Card className="card-stats shadow mb-4 mb-xl-0">
                                            <Card.Body>
                                                <Row>
                                                    <div className="col">
                                                        <Card.Title
                                                            className="text-uppercase text-muted mb-0"
                                                        >
                                                            {res.title}
                                                        </Card.Title>
                                                    </div>
                                                    <Col className="col-auto">
                                                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                                                            <i className="fas fa-chart-pie" />
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Pie data={res.data} />
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                } */}
        {/* {
                    userData.type < 3 &&
                <Row className="py-md-4">
                    {
                        item5.map((res, index) => {
                            return (
                                <Col key={index}>
                                    <Card className="card-stats shadow mb-4 mb-xl-0">
                                        <Card.Body>
                                            <Row>
                                                <div className="col">
                                                    <Card.Title
                                                        className="text-uppercase text-muted mb-0"
                                                    >
                                                        {res.title}
                                                    </Card.Title>
                                                </div>
                                                <Col className="col-auto">
                                                    <div className="icon icon-shape bg-warning text-white rounded-bar shadow">
                                                        <i className="fas fa-chart-bar" />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Bar data={res.data} options={barOptions} />
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                        })
                    }
                </Row>
            } */}

      </Container>
    </BasePage>
  )
}

const mapStateToProps = state => {
  const {
    user: { data: userData, permission },
    dashboard: { item1: dashboardItem1 },
    dashboard: { item2: dashboardItem2 },
    dashboard: { item3: dashboardItem3 },
    dashboard: { item4: dashboardItem4 },
    dashboard: { item5: dashboardItem5 },
    branch: { data: branchData },
    ui:{ language }
  } = state
  return {
    userData,
    dashboardItem1,
    dashboardItem2,
    dashboardItem3,
    dashboardItem4,
    dashboardItem5,
    branchData,
    permission,
    language
  }
}

const mapDispatchToProps = {
  getDashboardItem1: DashboardAction.getDashboardItem1,
  getDashboardItem2: DashboardAction.getDashboardItem2,
  getDashboardItem3: DashboardAction.getDashboardItem3,
  getDashboardItem4: DashboardAction.getDashboardItem4,
  getDashboardItem5: DashboardAction.getDashboardItem5
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
