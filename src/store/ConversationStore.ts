/**
 * @file 对话数据仓库
 */

import { flow, makeObservable, observable } from 'mobx';
import {abKyInstance} from '../api';

export class ConversationStore {
    static DEFAULT_APP_ID: string = 'f4a72528-dded-4a31-a17e-616bee8b75c1';

    conversationId: string = '';

    constructor() {
        makeObservable(this, {
            conversationId: observable,
            onCreateConversation: flow.bound
        })
    }

    * onCreateConversation(app_id: string) {
        // 防止重复调用：如果已经有conversationId，直接返回
        if (this.conversationId) {
            console.log('Conversation already exists:', this.conversationId);
            return;
        }

        console.log('Creating new conversation...');
        const response: ConversationStore.ICreateConversationResponse = yield abKyInstance.post('api/app/conversation', {
            json: {
                app_id,
            },
        }).json()

        this.conversationId = response.conversation_id;
        console.log('Conversation created:', this.conversationId);
    }
}

export namespace ConversationStore {
    export interface ICreateConversationResponse {
        conversation_id: string;
        request_id: string;
    }
}