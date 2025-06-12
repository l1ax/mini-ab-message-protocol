/**
 * @file 视图基类
 */

import {ExecutionEvent} from '../../model/ExecutionEvent';

export class BaseView {
    static viewName: string = '';

    receiveNewEvent(event: ExecutionEvent<any>): void {
        throw new Error('Not implemented');
    }
}