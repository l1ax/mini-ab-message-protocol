/**
 * @file 消息内容处理服务
 */

import {functionCallContentAggregator, chatReasoningContentAggregator, thoughtContentAggregator, chatAgentContentAggregator} from './contentAggregator';

class EventContentAggregateService {
    /** 已经注册的aggregator的集合 */
    private contentAggregators: Record<string, EventContentAggregateService.IContentAggregator<any>> = {};

    /** 注册一个事件内容聚合器 */
    public registerContentAggregator(
        eventType: string,
        aggregator: EventContentAggregateService.IContentAggregator<any>
    ): void {
        this.contentAggregators[eventType] = aggregator;
    }

    /** 获取事件内容聚合器 */
    public getContentAggregator(
        eventType: string
    ): EventContentAggregateService.IContentAggregator | undefined {
        return this.contentAggregators[eventType];
    }
}

/** 消息处理服务， 单例 */
export const eventContentAggregateService = new EventContentAggregateService();

export namespace EventContentAggregateService {
    /** 对话中sse复杂消息的content内容的聚合器 */
    export type IContentAggregator<T = unknown> = (
        prevContent: T,
        incomingContent: T
    ) => T;
}

eventContentAggregateService.registerContentAggregator('function_call', functionCallContentAggregator);
eventContentAggregateService.registerContentAggregator('chat_reasoning', chatReasoningContentAggregator);
eventContentAggregateService.registerContentAggregator('thought', thoughtContentAggregator);
eventContentAggregateService.registerContentAggregator('ChatAgent', chatAgentContentAggregator);