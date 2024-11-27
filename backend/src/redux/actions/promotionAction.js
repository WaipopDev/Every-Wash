import * as types from '../types'
import { Firestore, Database } from '../../firebase'

export const getPromotion = () => ({
    types: {
        success: types.PROMOTION_GET_SUCCESS
    },
    call: Database.PromotionGet()
})

