export namespace SSEConversationTypes {
    export interface IConversationSSEMessage<TOutputs = unknown> {
        /** 请求id */
        request_id: string;
        /** 消息返回时间的时间戳 UTC时间格式 */
        date: string;
        /** 文字答案。 流式场景下是增量数据 */
        answer: string;
        /** 消息id, 流式场景下多次推流message_id保持一致 */
        message_id: string;
        /** 对话id */
        conversation_id: string;
        /** 流式消息推送回答结果是否完结 */
        is_completion: boolean;
        /** 输出信息相关内容 */
        content: Array<IExecutionEvent<TOutputs>>;
    }

    /** 复杂对话消息的消息体 */
    export interface IExecutionEvent<TOutputs = unknown> {
        event_id: string;
        event_type: 'function_call' | 'chat_reasoning' | 'thought' | 'ChatAgent';
        event_status: 'running' | 'error' | 'done' | 'preparing' | 'interrupt';
        content_type: 'text' | 'status' | 'function_call' | 'chat_reasoning';
        outputs: TOutputs;
    }

    /** output 模型tokens消耗数据 */
    export interface IModelTokens {
        // prompt模型token数
        prompt_tokens: number;
        // 调用消耗tokens
        completion_tokens: number;
        // token总数
        total_tokens: number;
        // 模型名称
        name: string;
        // 模型类型 思考 | 问答
        type: 'plan' | 'chat' | 'chatflow' | 'follow_up_query';
    }
}