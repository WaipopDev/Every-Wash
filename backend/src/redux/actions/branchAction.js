import * as types from '../types'
import { Firestore } from '../../firebase'

export const getBranch = () => ({
    types: {
        success: types.BRANCH_GET
    },
    call:Firestore.BranchGet()
    // type: types.BRANCH_GET,
    // value: Firestore.BranchGet()
})

