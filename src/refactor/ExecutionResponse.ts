/**
 * 执行响应类，包含一次agent的回答内容
 */

import {action, computed, makeObservable, observable} from 'mobx';
import {SSEConversationTypes} from '../types/sseConversation';
import {createEventFromRawData, ExecutionEvent} from '../model/ExecutionEvent';
import {eventContentAggregateService, EventContentAggregateService} from '../service';
import {EventTree} from '../model/EventTree';

export class ExecutionResponse {

    isCompleted: boolean = false;

    conversationId: string = '';

    events: ExecutionEvent<any>[] = [];

    eventTree: EventTree = new EventTree();

    constructor() {
        makeObservable(this, {
            isCompleted: observable,
            conversationId: observable,
            events: observable.ref,
            eventTree: observable.ref,
            latestEvent: computed,
            complete: action.bound,
            receiveEventMessage: action.bound,
            processMessage: action.bound,
            aggregateEvent: action.bound
        })
    }

    receiveEventMessage(message: string) {
        const parsedMessage: SSEConversationTypes.IConversationSSEMessage
            = JSON.parse(message) as SSEConversationTypes.IConversationSSEMessage;

        this.processMessage(parsedMessage);
    }

    processMessage(message: SSEConversationTypes.IConversationSSEMessage) {
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

        const eventRawData: SSEConversationTypes.IConversationSSEMessage['content'][number] = message.content[0];

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

    complete() {
        this.isCompleted = true;
    }

    get latestEvent(): ExecutionEvent<any> | undefined {
        return this.events[this.events.length - 1];
    }
}