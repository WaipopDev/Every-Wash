import React, { useState, useEffect, forwardRef } from 'react'
import { connect } from 'react-redux'
import { Col, Button, Table, Row, Container, Card, Form, FormControl } from 'react-bootstrap'
import moment from 'moment'
import ReactExport from "@ibrahimrahmani/react-export-excel";
import DatePicker from 'react-datepicker'
import { Database, Firestore } from '../../firebase'
import { numberWithSeparators, weekOfMonth } from '../../utils/helpers'
import _ from 'lodash'

import { ReportAction } from '../../redux/actions'

export const TransactionBankReport2 = props => {
	const { setShowReport, typeChannel, permission, branchData, getReportSalesReport, reportSalesReportData, language } = props
	const ExcelFile = ReactExport.ExcelFile;
	const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
	const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

	const [startDate, setStartDate] = useState(new Date())
	const [endDate, setEndDate] = useState(new Date());
	const [data, setData] = useState([])
	const [dataMachine, setDataMachine] = useState(null)
	const [branch, setBranch] = useState('')
	const [machineType, setMachineType] = useState('')
	const [textMashing, setTextMashing] = useState('')
	const [textProgram, setTextProgram] = useState('')
	const [ppId, setPpId] = useState([])
	const [ppIdSelect, setPpIdSelect] = useState('')

	const [totalSales, setTotalSales] = useState(0);

	const getDataTransaction = async () => {
		const item = []

		const res = await Database.GetDataTransaction(moment(startDate).format('YYYY-MM'))
		const resPointAndRedemtion = await Database.GetDataTransactionPointAndRedemtion(moment(startDate).format('YYYY-MM'))
		let dataM = dataMachine
		if (!dataMachine) {
			const resMachine = await Database.WashingMachineGetAll()
			setDataMachine(resMachine.val())
			dataM = resMachine.val()
		}
		let resItem = res.val()
		let resPointAndRedemtionItem = resPointAndRedemtion.val()
		if (resPointAndRedemtionItem) {
			resPointAndRedemtionItem = _.filter(resPointAndRedemtionItem, (e) => e.transactionId)
		}
		if (resItem) {
			if (branch) {
				resItem = _.filter(resItem, (e) => {
					return e.keyBranch === branch
				})
			}
			if(ppIdSelect){
				resItem = _.filter(resItem, (e) => {
					return e.payeeProxyId === ppIdSelect
				})
			}
			_.map(resItem, (e, index) => {
				let startTime = moment(`${moment(startDate).format('YYYY-MM-DD')} 00:00:00`).unix()
				let endTime = moment(`${moment(endDate).format('YYYY-MM-DD')} 23:59:59`).unix()
				if (startTime <= moment(e.transactionDateandTime).unix() && moment(e.transactionDateandTime).unix() <= endTime) {
					if (!_.isUndefined(e.payeeProxyId) && !_.isUndefined(e.payeeProxyType) && !_.isUndefined(dataM[e.keyMachine])) {
						const nameProgram = _.find(reportSalesReportData, (ei) => ei.transactionId === e.transactionId)
						const x = _.find(reportSalesReportData, (ei) => ei.transactionId === '26fd678c25434389b99c56f3bd15b004')
						console.log("🚀 ~ _.map ~ x:", x)
						e.nameProgram = ''
						if (textProgram && !_.lowerCase(nameProgram?.nameProgram || '').includes(_.lowerCase(textProgram))) {
							return;
						}
						if (nameProgram) {
							e.nameProgram = nameProgram.nameProgram
						}
						const program = dataM[e.keyMachine]
						e.program = program
						// if(dataM[e.keyMachine]?.branch == 'mwD8fDulyUvIu5ucwUtV' ){
						e.branchName = program?.branchName || ''
						if (machineType && program?.machineType != machineType) {
							return;
						}
						if (textMashing && !_.lowerCase(program.name).includes(_.lowerCase(textMashing))) {
							return;
						}
						e.nameUser = ''
						if (resPointAndRedemtionItem && resPointAndRedemtionItem.length) {
							const nameUser = _.find(resPointAndRedemtionItem, (ei) => ei.transactionId === e.transactionId)
							if (nameUser) {
								e.nameUser = nameUser.firstName
							}
						}
						const wallet = _.split(e.billPaymentRef1, "WALLET");
						if (permission.length) {
							if (_.find(permission, ei => ei.docId === e.keyBranch)) {
								if (typeChannel === 1 && wallet.length === 2 && wallet[1].length === 9) {
									item.push(e)
								} else if (typeChannel === 2 && wallet.length === 1) {
									item.push(e)
								}
							}
						} else {
							if (typeChannel === 1 && wallet.length === 2 && wallet[1].length === 9) {
								item.push(e)
							} else if (typeChannel === 2 && wallet.length === 1) {
								item.push(e)
							}
						}
						// }

					}
				}

			})
		}

		setTotalSales(_.sumBy(item, (e) => { return Number(e.amount) }))
		setData(item)
	}
	useEffect(() => {
		getReportSalesReport(branch, startDate, endDate)
	}, [branch, startDate, endDate])
	useEffect(() => {
		if(branchData){
			let item = []
			for (const iterator of _.keys(_.groupBy(branchData, (e) => e.ppId))) {
				
				if(iterator && iterator != 'undefined'){
					item.push(iterator)
				}
			}
			setPpId(item)
			
			// setPpId(_.head(_.keys(branchData)))
		}
	}, [branchData])
	useEffect(() => {

		getDataTransaction()
	}, [branch, machineType, textMashing, textProgram, startDate, endDate, reportSalesReportData, ppIdSelect])

	const forceData = async (machine, event) => {
		const pro = _.find(_.values(machine.program), (e) => e.price == Number(event.amount))
		let log = {
			createAt: moment(new Date(event.transactionDateandTime)).unix(),
			id: machine.id,
			idIOT: machine.idIOT,
			nameMachine: machine.name,
			machineType: machine.machineType,
			branchLatitude: machine.branchLatitude,
			branchLongitude: machine.branchLongitude,
			branchName: machine.branchName,
			branchId: machine.branch,
			status: 2,
			errorMsg: '',
			idProgram: pro.id,
			nameProgram: pro.name,
			priceProgram: pro.price,
			userId: '',
			userName: '',
			priceType: 2,
			docIdMachine: event.keyMachine,
			date: moment(new Date(event.transactionDateandTime)).format('YYYY-MM-DD'),
			year: moment(new Date(event.transactionDateandTime)).format('YYYY'),
			month: moment(new Date(event.transactionDateandTime)).format('MM'),
			week: moment(new Date(event.transactionDateandTime)).week(),
			dayofweek: moment(new Date(event.transactionDateandTime)).day(),
			day: moment(new Date(event.transactionDateandTime)).format('DD'),
			weekOfMonth: weekOfMonth(new Date(event.transactionDateandTime)),
			transactionId: event.transactionId

		}
		// await Firestore.WashingMachineAddLog(log)

	}
	const CustomInput = forwardRef((props, ref) => {
		const { onClick, value } = props
		return (
			<Button onClick={onClick}>
				<i className="fas fa-calendar-day"></i> {moment(new Date(value)).format('DD-MM-YYYY')}
			</Button>
		)
	})
	const CustomInput2 = forwardRef((props, ref) => {
		const { onClick, value } = props
		return (
			<Button onClick={onClick}>
				<i className="fas fa-calendar-day"></i> {moment(new Date(value)).format('DD-MM-YYYY')}
			</Button>
		)
	})
	const renderTbody = () => {
		let item = []
		console.log('data', data)
		_.map(_.orderBy(data, 'transactionDateandTime', 'desc'), (res, index) => {
			item.push(
				<tr key={index}>
					<td>{index + 1}</td>
					<td>
						{moment(new Date(res.transactionDateandTime)).format(
							'DD-MM-YYYY HH:mm:ss'
						)}
					</td>
					<td>{res.transactionId}</td>
					<td>{res.billPaymentRef1}</td>
					<td>{res.billPaymentRef2}</td>
					<td>{res.payerName}</td>
					<td>{res.nameUser}</td>
					<td>{!_.isUndefined(res.program) ? res.program.branchName : ''}</td>
					<td>
						{!_.isUndefined(res.program) ? (res.program.machineType === '1' ? language['global_wash'] : language['global_dry']) : ''}
					</td>
					<td>{!_.isUndefined(res.program) ? res.program.name : ''}</td>
					<td>{res.nameProgram}</td>
					<td className="text-end">{res.amount}</td>
					<td>{res.payeeProxyId}</td>
					<td>{!_.isUndefined(res.bankPay) ? res.bankPay : 'SCB'}</td>
				</tr>
			)
		})
		return item
	}

	return (
		<>
			<Row className="justify-content-end">
				<Col className="py-2  text-end" md={2} >
					{
						data.length ?
							<Col>
								<ExcelFile
									element={
										<Button variant='info'>
											<i className="fas fa-file-download"></i> {language['report_export_to_excel']}
										</Button>
									}
									filename="Transaction Bank report"
								// hideElement={true}
								>
									<ExcelSheet data={data} name="Transaction Bank report">
										<ExcelColumn label={language['report_table_1']} value={(e) => moment(new Date(e.transactionDateandTime)).format('DD-MM-YYYY HH:mm:ss')} />
										<ExcelColumn label={language['report_table_2']} value="transactionId" />
										<ExcelColumn label="Ref1" value="billPaymentRef1" />
										<ExcelColumn label="Ref2" value="billPaymentRef2" />
										<ExcelColumn label={language['global_account_name']} value="payerName" />
										<ExcelColumn label={language['global_username']} value="nameUser" />
										<ExcelColumn label={language['report_table_3']} value={(e) => !_.isUndefined(e.program) ? e.program.branchName : ''} />
										<ExcelColumn label={language['report_table_4']} value={(e) => !_.isUndefined(e.program) ? e.program.machineType === '1' ? language['global_wash'] : language['global_dry'] : ''} />
										<ExcelColumn label={language['global_machine_name']} value={(e) => !_.isUndefined(e.program) ? e.program.name : ''} />
										<ExcelColumn label={language['global_program_name']} value="nameProgram" />
										<ExcelColumn label={`${language['global_amount']} (${language['global_baht']})`} value="amount" />
										<ExcelColumn label="Biller ID" value="payeeProxyId" />
										<ExcelColumn label={language['report_table_7']} value={(e) => !_.isUndefined(e.bankPay) ? e.bankPay : 'SCB'} />
									</ExcelSheet>
								</ExcelFile>
							</Col>
							: null
					}

				</Col>
			</Row>
			<Row className='justify-content-end'>
				<Col className='py-2 d-flex align-items-end'>
					<Button onClick={() => setShowReport({})} variant='secondary'>
						<i className="fas fa-chevron-left"></i> {language['global_go_back']}
					</Button>
				</Col>
				<Col className="py-2 text-end align-self-end" md={2}>
					<label>{language['report_select_1']} :</label>
					<Form.Select
						onChange={(e) => { setBranch(e.target.value) }}
						name={'branch'}
					>
						<option value={''}>{language['global_all']}</option>
						{_.orderBy(branchData, 'name', 'asc').map((res, index) => {
							if (permission.length) {
								if (_.find(permission, e => e.docId === res.docId)) {
									return (
										<option key={index} value={res.docId}>{res.name}</option>
									)
								}
							} else {
								return (
									<option key={index} value={res.docId}>{res.name}</option>
								)
							}

						})}
					</Form.Select>
				</Col>
				<Col className="py-2 text-end align-self-end" md={2}>
					<label>{language['report_select_7']} :</label>
					<Form.Select
						onChange={(e) => { setMachineType(e.target.value) }}
					>
						<option value={''}>{language['global_all']}</option>
						<option value={1}>{language['global_wash']}</option>
						<option value={2}>{language['global_dry']}</option>
					</Form.Select>
				</Col>
				<Col className="py-2 text-end" md={2}>
					<label>{language['report_select_3']} :</label>
					<FormControl
						placeholder={language['report_select_placeholder_1']}
						onChange={(e) => setTextMashing(e.target.value)}
					/>
				</Col>
				<Col className="py-2 text-end" md={2}>
					<label>{language['report_select_4']} :</label>
					<FormControl
						placeholder={language['report_select_placeholder_2']}
						onChange={(e) => setTextProgram(e.target.value)}
					/>
				</Col>
				<Col className="py-2 text-end align-self-end" md={2}>
					<label>Biller ID :</label>
					<Form.Select
						onChange={(e) => { setPpIdSelect(e.target.value) }}
					>
						<option value={''}>{language['global_all']}</option>
						{
							_.map(ppId, (res, index) => {
								return (
									<option key={index} value={res}>{res}</option>
								)
							})
						}
					</Form.Select>
				</Col>
			</Row>
			<Row className='justify-content-end'>
				<Col className='py-2 text-end' md={2}>
					<label>{language['report_time_1']} :</label>
					<DatePicker
						customInput={<CustomInput />}
						selected={startDate}
						onChange={date => setStartDate(date)}
					/>
				</Col>
				<Col className="py-2 text-end" md={2}>
					<label>{language['report_time_2']} :</label>
					<DatePicker customInput={<CustomInput2 />} selected={endDate} onChange={(date) => setEndDate(date)} />
				</Col>
			</Row>
			<Row>
				<Col>
					<h4>{language['report_4']} </h4>
				</Col>
			</Row>
			<Row>
				<h4>
					{language['report_total_amount']} :{' '}
					{numberWithSeparators(totalSales)} {language['global_baht']}
				</h4>
			</Row>
			<Row>
				<Col className="tableNoWrap">

					<Table striped bordered hover>
						<thead>
							<tr>
								<th className="px-2">#</th>
								<th className="px-2">{language['report_table_1']}</th>
								<th className="px-2">{language['report_table_2']}</th>
								<th className="px-2">Ref1</th>
								<th className="px-2">Ref2</th>
								<th className="px-2">{language['global_account_name']}</th>
								<th className="px-2">{language['global_username']}</th>
								<th className="px-2">{language['report_table_3']}</th>
								<th className="px-2">{language['report_table_4']}</th>
								<th className="px-2">{language['global_machine_name']}</th>
								<th className="px-2">{language['global_program_name']}</th>
								<th className="px-2">{`${language['global_amount']} (${language['global_baht']})`}</th>
								<th className="px-2">Biller ID</th>
								<th className="px-2">{language['report_table_7']}</th>
							</tr>
						</thead>
						<tbody>{renderTbody()}</tbody>
					</Table>
				</Col>
			</Row>
		</>
	)
}

const mapStateToProps = (state) => {
	const {
		user: { data: userData, permission },
		branch: { data: branchData },
		report: { reportSalesReport: reportSalesReportData },
		ui: { language }
	} = state
	return {
		permission,
		branchData,
		reportSalesReportData,
		language
	}
}

const mapDispatchToProps = {
	getReportSalesReport: ReportAction.getReportSalesReport
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TransactionBankReport2)
