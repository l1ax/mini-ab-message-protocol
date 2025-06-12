/**
 * 执行响应类，包含一次agent的回答内容
 */

import {action, computed, makeObservable, observable} from 'mobx';
import {SSEConversationTypes} from '../types/sseConversation';
import {ExecutionEvent} from '../model/ExecutionEvent';
import {eventContentAggregateService, EventContentAggregateService} from '../service';
import {EventTree} from '../model/EventTree';
import {BaseEvent} from '../service/events';

export class ExecutionResponse {

    isCompleted: boolean = false;

    conversationId: string = '';

    events: ExecutionEvent<any>[] = [];

    eventTree: EventTree = new EventTree();

    eventPlugins: Map<string, typeof ExecutionEvent<any>> = new Map();

    constructor(options: ExecutionResponse.IOptions) {
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

        this.eventPlugins = options.eventPlugins;
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
            const Event: typeof ExecutionEvent<any>= this.eventPlugins.get(eventRawData.event_type) ?? BaseEvent;
            const newEvent: ExecutionEvent<any> = new Event();
            newEvent.event_id = eventRawData.event_id;
            newEvent.event_type = eventRawData.event_type;
            newEvent.event_status = eventRawData.event_status;
            newEvent.content_type = eventRawData.content_type;
            newEvent.outputs = eventRawData.outputs;
            
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

export namespace ExecutionResponse {
    export interface IOptions {
        eventPlugins: Map<string, typeof ExecutionEvent<any>>
    }
}