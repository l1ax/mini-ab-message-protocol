/**
 * @file 问答对类，代表一次问答
 */

import { action, computed, makeObservable, observable } from 'mobx';
import {SSEConversationTypes} from '../types/sseConversation';
import {createEventFromRawData, ExecutionEvent} from './ExecutionEvent';
import {eventContentAggregateService, EventContentAggregateService} from '../service';
import {EventTree} from './EventTree';

export class AssistantQA {
    static TOP_LEVEL_EVENT_TYPES: string[] = ['function_call'];

    id: string = '';

    /** 问题 */
    query: string = '';

    /** 回答 */
    answer: string = '';

    events: ExecutionEvent<any>[] = [];

    eventTree: EventTree = new EventTree();

    constructor() {
        makeObservable(this, {
            id: observable,
            query: observable,
            answer: observable,
            events: observable.shallow,
            eventTree: observable.ref,
            processMessage: action.bound,
            aggregateEvent: action.bound,
            latestEvent: computed
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

        let targetEvent: ExecutionEvent<any> | undefined = this.events.find(event => event.event_id === eventRawData.event_id);
        // 如果事件列表中没有该事件，则添加
        if (!targetEvent) {
            const newEvent: ExecutionEvent<any> = createEventFromRawData(eventRawData);
            const latestEvent: ExecutionEvent<any> | undefined = this.events[this.events.length - 1];
            if (latestEvent) {
                latestEvent.nextEvent = newEvent;
            }
            this.events.push(newEvent);
            targetEvent = newEvent;
        }
        else {
            this.aggregateEvent(eventRawData);
        }

        // 完成聚合后，构建/更新 eventTree
        this.eventTree.update(this.latestEvent!);
    }

    /** 聚合事件 */
    aggregateEvent(eventRawData: SSEConversationTypes.IConversationSSEMessage['content'][number]) {
        const event: ExecutionEvent<any> | undefined = this.events.find(event => event.event_id === eventRawData.event_id);
        if (!event) {
            throw new Error(`Event ${eventRawData.event_id} not found`);
        }

        const contentAggregator: EventContentAggregateService.IContentAggregator<any> | undefined
            = eventContentAggregateService.getContentAggregator(event.event_type);

        if (eventRawData.visible_scope === 'llm') {
            return;
        }

        event.outputs = contentAggregator!(event.outputs, eventRawData.outputs);
    }

    get latestEvent(): ExecutionEvent<any> | undefined {
        return this.events[this.events.length - 1];
    }
}