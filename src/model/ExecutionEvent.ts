/**
 * @file 执行事件单元
 */

import {makeObservable, observable} from 'mobx';
import {SSEConversationTypes} from '../types/sseConversation';

export class ExecutionEvent<TOutput> {
    event_id: string = '';

    /** 事件类型 */
    event_type: SSEConversationTypes.IExecutionEvent['event_type'] = 'ChatAgent';

    /** 事件状态 */
    event_status: SSEConversationTypes.IExecutionEvent['event_status'] = 'running';

    /** 事件消息 */
    event_message: string = '';

    /** 事件内容类型 */
    content_type: SSEConversationTypes.IExecutionEvent['content_type'] = 'text';

    outputs: TOutput = {} as TOutput;

    constructor(event_type: SSEConversationTypes.IExecutionEvent['event_type'] = 'ChatAgent') {
        this.event_type = event_type;

        makeObservable(this, {
            event_id: observable,
            event_type: observable,
            event_status: observable,
            event_message: observable,
            content_type: observable,
            outputs: observable,
        })
    }
}

export function createEventFromRawData<TOutput>(rawData: SSEConversationTypes.IExecutionEvent<TOutput>): ExecutionEvent<TOutput> {
    let event: any;
    
    switch (rawData.event_type) {
        case 'function_call': {
            event = new ExecutionEvent<ExecutionEvent.IFunctionCallEventOutput>();
            event.outputs = rawData.outputs as ExecutionEvent.IFunctionCallEventOutput;
            break;
        }
        case 'chat_reasoning': {
            event = new ExecutionEvent<ExecutionEvent.IChatReasoningEventOutput>();
            event.outputs = rawData.outputs as ExecutionEvent.IChatReasoningEventOutput;
            break;
        }
        case 'thought': {
            event = new ExecutionEvent<ExecutionEvent.IThoughtEventOutput>();
            event.outputs = rawData.outputs as ExecutionEvent.IThoughtEventOutput;
            break;
        }
        case 'ChatAgent': {
            event = new ExecutionEvent<ExecutionEvent.IChatAgentEventOutput>();
            event.outputs = rawData.outputs as ExecutionEvent.IChatAgentEventOutput;
            break;
        }
        default: {
            event = new ExecutionEvent<any>();
            break;
        }
    }

    event.event_id = rawData.event_id;
    event.event_type = rawData.event_type;
    event.event_status = rawData.event_status;
    event.content_type = rawData.content_type;

    return event;
}

export namespace ExecutionEvent {
    export interface IFunctionCallEventOutput {
        /** function_call 的描述json */
        text: {
            /** function call 参数 */
            arguments: Record<string, any>;
            /** 组件代码 */
            component_code: string;
            /** 组件名称 */
            component_name: string;
        };
    }

    export interface IChatReasoningEventOutput {
        /** 普通文本。问答模型思维链内容 */
        text: string;
    }

    export interface IChatAgentEventOutput {
        /** 普通文本。问答模型思维链内容 */
        text: string;
    }

    export interface IThoughtEventOutput {
        /** 普通文本。问答模型思维链内容 */
        text: string;
    }
}