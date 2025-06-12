/**
 * @file 树形视图
 */

import {ExecutionEvent} from '../../model/ExecutionEvent';
import {BaseView} from './BaseView';
import {EventTree} from '../../model/EventTree';
import {action, makeObservable, observable} from 'mobx';

export class TreeView extends BaseView {
    static viewName: string = 'treeView';

    eventTree: EventTree = new EventTree();


    constructor() {
        super();
        makeObservable(this, {
            eventTree: observable.ref,
            receiveNewEvent: action.bound
        })
    }

    receiveNewEvent(event: ExecutionEvent<any>): void {
        this.eventTree.update(event);
    }
}