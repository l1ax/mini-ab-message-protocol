import {Session} from './Session';
import {uniqueId} from 'lodash-es';
import {ExecutionResponse} from './ExecutionResponse';
import {makeObservable, observable} from 'mobx';

export class AgentResponse implements Session.IElement {
    role: 'assistant' = 'assistant' as const;

    type = 'response' as const;

    uiId: string = uniqueId();

    constructor(public readonly executionResponse: ExecutionResponse) {
        makeObservable(this, {
            role: observable,
            type: observable,
            uiId: observable,
            executionResponse: observable.ref
        })
    }
}