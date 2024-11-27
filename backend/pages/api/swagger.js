
import swagger from '../../swagger.json'
import _ from 'lodash'

export default function handler(req, res) {
        res.status(200).json(swagger)
}