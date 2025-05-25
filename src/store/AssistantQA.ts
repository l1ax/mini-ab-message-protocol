/**
 * @file 问答对类，代表一次问答
 */

import { action, makeObservable, observable } from 'mobx';
import {SSEConversationTypes} from '../types/sseConversation';

export class AssistantQA {

    id: string = '';

    /** 问题 */
    query: string = '';

    /** 回答 */
    answer: string = '';

    constructor() {
        makeObservable(this, {
            query: observable,
            answer: observable,
            processMessage: action.bound
        })
    }

    processMessage(message: SSEConversationTypes.IConversationSSEMessage) {
        this.id = message.message_id;
        this.answer += message.answer;
    }
}