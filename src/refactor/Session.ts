/**
 * 对话会话类，指一次连续（同个上下文）的对话，包含user和assistant的对话
 */

import {makeObservable, observable} from 'mobx';
import {action, flow} from 'mobx';
import {ConversationStore} from '../store/ConversationStore';

import {SSEConversationTypes} from '../types/sseConversation';
import {Executor} from './Executor';
import {ExecutionResponse} from './ExecutionResponse';
import {AgentResponse} from './AgentResponse';
import {TextQuery} from './TextQuery';

export class Session {
    /**
     * 对话ID
     */
    conversationId: string = '';

    isSending: boolean = false;

    isCompleted: boolean = false;

    /** sessions内容，包含query，response和其他内容 */
    elements: Session.IElement[] = [];

    private readonly executor: Executor = new Executor();

    constructor() {
        makeObservable(this, {
            conversationId: observable,
            isSending: observable,
            isCompleted: observable,
            elements: observable.shallow,
            sendQuery: flow.bound,
            onFinishQA: action.bound,
            processMessage: action.bound
        })
    }

    * sendQuery(query: string) {
        const params: Session.ISendQueryParams = {
            conversation_id: this.conversationId,
            query,
            app_id: ConversationStore.DEFAULT_APP_ID,
            stream: true
        }

        try {
            this.isCompleted = false;

            const executionResponse: ExecutionResponse = yield this.executor.invoke(params);

            const agentResponse: AgentResponse = new AgentResponse(executionResponse);

            const textQuery: TextQuery = new TextQuery(query);
            
            this.elements.push(textQuery, agentResponse);

        }
        catch (error: unknown) {
            console.error('sendQuery error', error)
        }
    }

    processMessage(message: SSEConversationTypes.IConversationSSEMessage) {
        if (!this.activeQA) {
            throw new Error('activeQA is null');
        }

        if (!message.content || message.content.length === 0) {
            return;
        }

        if (message.content[0].visible_scope === 'llm') {
            return;
        }

        if (this.conversationId !== message.conversation_id) {
            // TODO：处理一次新的对话
        }

        this.conversationId = message.conversation_id;

        // this.activeQA.processMessage(message);
    }

    onFinishQA() {
        this.isCompleted = true;
    }
}

export namespace Session {
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

    export interface IElement {
        role: 'user' | 'assistant';

        /** 元素类型 */
        type: string;

        /** 用于渲染的id */
        uiId: string;
    }
}