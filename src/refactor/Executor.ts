/**
 * 执行器
 */

import {action, makeObservable, observable} from 'mobx';
import {ExecutionResponse} from './ExecutionResponse';
import {createSSEHook} from '../api/createSSEHook';
import {flow} from 'mobx';
import {abAuthHook} from '../api/abAuthHook';
import ky from 'ky';
import {ExecutionEvent} from '../model/ExecutionEvent';
import {BaseView} from './views/BaseView';

export class Executor {

    viewPlugin: typeof BaseView;

    eventPlugins: Map<string, typeof ExecutionEvent<any>> = new Map();

    constructor(private readonly options: Executor.IOptions) {
        makeObservable(this, {
            invoke: flow.bound,
            eventPlugins: observable,
            viewPlugin: observable.ref,
            genResponseOptions: action.bound
        })

        options.eventPlugins.forEach((eventPlugin: typeof ExecutionEvent<any>) => {
            this.eventPlugins.set(eventPlugin.name, eventPlugin);
        })

        this.viewPlugin = options.viewPlugin;
    }

    * invoke(params: any) {
        const response: ExecutionResponse = new ExecutionResponse(this.genResponseOptions());

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

    genResponseOptions() {
        return {
            eventPlugins: this.eventPlugins,
            viewPlugin: this.viewPlugin
        }
    }
}

export namespace Executor {
    export interface IOptions {
        /** event 插件 */
        eventPlugins: Array<typeof ExecutionEvent<any>>

        /** 视图插件 */
        viewPlugin: typeof BaseView
    }
}