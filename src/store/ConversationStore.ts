/**
 * @file 对话数据仓库
 */

import { flow, makeObservable, observable } from 'mobx';
import {abKyInstance} from '../api';
import {Conversation} from './Conversation';

export class ConversationStore {
    static DEFAULT_APP_ID: string = '32bad2ae-9e7f-4d37-a4ad-02cc3c1f1424';

    conversation: Conversation = new Conversation();

    constructor() {
        makeObservable(this, {
            conversation: observable.ref,
            onCreateConversation: flow.bound
        })
    }

    * onCreateConversation(app_id: string) {
        if (window.localStorage.getItem('conversationId')) {
            this.conversation.conversationId = window.localStorage.getItem('conversationId') || '';
            return;
        }

        const response: ConversationStore.ICreateConversationResponse = yield abKyInstance.post('api/app/conversation', {
            json: {
                app_id,
            },
        }).json()

        this.conversation.conversationId = response.conversation_id;

        window.localStorage.setItem('conversationId', response.conversation_id);
    }
}

export namespace ConversationStore {
    export interface ICreateConversationResponse {
        conversation_id: string;
        request_id: string;
    }
}