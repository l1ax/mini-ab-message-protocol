/**
 * @file 对话类，代表一次连续的对话
 */

import { action, flow, makeObservable, observable } from 'mobx';
import {AssistantQA} from './AssistantQA';
import {ConversationStore} from '../store/ConversationStore';

import ky from 'ky';
import {createSSEHook} from '../api/createSSEHook';
import {abAuthHook} from '../api/abAuthHook';
import {SSEConversationTypes} from '../types/sseConversation';

export class Conversation {
    /**
     * 对话ID
     */
    conversationId: string = '';

    /** 问答对列表 */
    qaList: AssistantQA[] = [];

    isSending: boolean = false;

    isCompleted: boolean = false;

    activeQA: AssistantQA | null = null;

    constructor() {
        makeObservable(this, {
            conversationId: observable,
            qaList: observable.ref,
            isSending: observable,
            isCompleted: observable,
            activeQA: observable,
            sendQuery: flow.bound,
            onFinishQA: action.bound
        })
    }

    * sendQuery(query: string) {
        const newQA: AssistantQA = new AssistantQA();
        newQA.query = query;
        this.qaList.push(newQA);
        this.activeQA = newQA;

        const params: Conversation.ISendQueryParams = {
            conversation_id: this.conversationId,
            query,
            app_id: ConversationStore.DEFAULT_APP_ID,
            stream: true
        }

        const sseHook = createSSEHook({
            onData: action((message: string) => {
                const parsedMessage: SSEConversationTypes.IConversationSSEMessage
                    = JSON.parse(message) as SSEConversationTypes.IConversationSSEMessage;
                
                this.processMessage(parsedMessage);
            }),
            onCompleted: action(() => {
                this.onFinishQA();
            })
        })

        try {
            this.isCompleted = false;
            yield ky.post('/api/app/conversation/runs', {
                json: params,
                hooks: {
                    beforeRequest: [abAuthHook],
                    afterResponse: [sseHook]
                }
            })
        } catch (error: unknown) {
            console.error('sendQuery error', error)
        }
    }

    processMessage(message: SSEConversationTypes.IConversationSSEMessage) {
        if (!this.activeQA) {
            throw new Error('activeQA is null');
        }

        if (!message.content) {
            return;
        }

        if (this.conversationId !== message.conversation_id) {
            // TODO：处理一次新的对话
        }

        this.conversationId = message.conversation_id;

        this.activeQA.processMessage(message);
    }

    onFinishQA() {
        this.isCompleted = true;
    }
}

export namespace Conversation {
    export interface ISendQueryParams {
        conversation_id: string;
        query: string;
        app_id: string;
        stream: boolean;
    }

    export interface ISendQueryResponse {
        answer: string;
        /** 消息返回的时间戳，UTC格式 */
        date: string;
        conversation_id: string;
        /** 消息ID，一次回答中 流式数据多次推流message_id保持一致 */
        message_id: string;
    }
}