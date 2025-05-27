/**
 * @file 问答对类，代表一次问答
 */

import { action, makeObservable, observable } from 'mobx';
import {SSEConversationTypes} from '../types/sseConversation';
import {createEventFromRawData, ExecutionEvent} from './ExecutionEvent';
import {eventContentAggregateService, EventContentAggregateService} from '../service';

export class AssistantQA {
    id: string = '';

    /** 问题 */
    query: string = '';

    /** 回答 */
    answer: string = '';

    events: ExecutionEvent<any>[] = [];

    constructor() {
        makeObservable(this, {
            id: observable,
            query: observable,
            answer: observable,
            events: observable.shallow,
            processMessage: action.bound,
            aggregateEvent: action.bound
        })
    }

    processMessage(message: SSEConversationTypes.IConversationSSEMessage) {
        this.id = message.message_id;
        this.answer += message.answer;

        // 流式下content仅有1个元素
        const eventRawData: SSEConversationTypes.IConversationSSEMessage['content'][number] = message.content[0];

        // 状态事件，先不处理
        if (eventRawData.content_type === 'status') {
            return;
        }

        // 如果事件列表中没有该事件，则添加
        if (!this.events.find(event => event.event_id === eventRawData.event_id)) {
            const newEvent: ExecutionEvent<any> = createEventFromRawData(eventRawData);
            this.events.push(newEvent);
        }
        else {
            this.aggregateEvent(eventRawData);
        }
    }

    /** 聚合事件 */
    aggregateEvent(eventRawData: SSEConversationTypes.IConversationSSEMessage['content'][number]) {
        const event: ExecutionEvent<any> | undefined = this.events.find(event => event.event_id === eventRawData.event_id);
        if (!event) {
            throw new Error(`Event ${eventRawData.event_id} not found`);
        }

        const contentAggregator: EventContentAggregateService.IContentAggregator<any> | undefined
            = eventContentAggregateService.getContentAggregator(event.event_type);

        if (!contentAggregator) {
            throw new Error(`Content aggregator for event type ${event.event_type} not found`);
        }

        event.outputs = contentAggregator(event.outputs, eventRawData.outputs);
    }
}