import { combineReducers } from 'redux'
import uiReducter from './ui'
import userReducer from './user'
import programReducer from './program'
import branchReducer from './branch'
import washingMachineReducer from './washingMachine'
import adminReducer from './admin'
import promotionReducer from './promotion'
import walletReducer from './wallet'
import pointRedemtionReducer from './pointRedemtion'
import dashboardReducer from './dashboard'
import chatReducer from './chat'
import setPointReducer from './setPoint'
import ReportReducer from './report'

const rootReducer = combineReducers({
    ui: uiReducter,
    user: userReducer,
    program: programReducer,
    branch: branchReducer,
    washingMachine: washingMachineReducer,
    admin: adminReducer,
    promotion: promotionReducer,
    wallet: walletReducer,
    pointRedemtion: pointRedemtionReducer,
    dashboard: dashboardReducer,
    chat: chatReducer,
    setPoint: setPointReducer,
    report: ReportReducer
})

export default rootReducer