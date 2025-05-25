import ky, {KyInstance} from 'ky'
import {responseUnpackHook} from './responseUnpackHook'
import {abAuthHook} from './abAuthHook'

const kyInstance: KyInstance = ky.extend({})

const abKyInstance: KyInstance = ky.extend({
    hooks: {
        beforeRequest: [
            abAuthHook
        ],
        afterResponse: [
            responseUnpackHook
        ]
    }
})

export { kyInstance, abKyInstance }