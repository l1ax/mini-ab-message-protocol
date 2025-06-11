/**
 * 执行器
 */

import {makeObservable} from 'mobx';
import {ExecutionResponse} from './ExecutionResponse';
import {createSSEHook} from '../api/createSSEHook';
import {flow} from 'mobx';
import {abAuthHook} from '../api/abAuthHook';
import ky from 'ky';

export class Executor {
    constructor() {
        makeObservable(this, {
            invoke: flow.bound
        })
    }

    * invoke(params: any) {
        const response: ExecutionResponse = new ExecutionResponse();

        const sseHook = createSSEHook({
            onData: (message: string): void => {
                response.receiveEventMessage(message);
            },
            onCompleted: (): void => {
                response.complete();
            }
        })

        yield ky.post('/api/app/conversation/runs', {
            json: params,
            hooks: {
                beforeRequest: [abAuthHook],
                afterResponse: [sseHook]
            }
        })

        return response;
    }
}