export namespace SSEConversationTypes {
    export interface IConversationSSEMessage<> {
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
        content: {
            event_id: string;
            // /** 简单对话(返回结果为纯文本)的结果内容， 复杂对话时这个字段无用 */
            // answer: string;
            // /** AI应用Session_id */
            // conversation_id: string;
            // /** 一次qa消息的id, 主要用于打断 */
            // message_id: string;
            // is_completion: boolean;
            // /** 复杂对话消息的消息体, 流式对话中一条SSE content的长度必定为1 */
            // content: Array<IExecutionEvent<TOutputs>>;
        };
    }

    /** 复杂对话消息的消息体 */
    export interface IExecutionEvent<TOutputs = unknown> {
        /** 消息名称 */
        name_cn: string;
        /** 详细状态码, 非0代表错误 */
        event_code: number;
        /** 错误消息， 当状态码非0时， 此字段包含内容 */
        event_message: string;
        /** 消息节点类型， 主要用户控制前端消息气泡渲染版式 */
        event_type: string;
        /** 节点推送的消息的id, 和content_type是 1:1的关系， 一个event_type会有N个event_id */
        event_id: string;
        /** 执行状态 */
        event_status: 'running' | 'error' | 'done' | 'preparing' | 'success';
        /** 当前AI节点推送的消息的类型 */
        content_type: string;
        /** 可见范围：展示给 用户｜大模型｜用户&大模型 */
        visible_scope?: 'user' | 'llm' | 'all';

        /** 是否是终止消息, function call消息会有这个字段, 如果是true的话表示调用的工具做终止节点 */
        is_stop: boolean;

        /** 消息实际内容, 具体值跟随content_types变动而变动， 与content_type 1:1关联 */
        outputs: TOutputs;

        /** workflow组件输出，存储workflow组件全量输出参数，一期为非全量输出，暂不需要根据类型聚合 */
        raw_data: Record<string, unknown>;

        /** tokens消耗数据 */
        usage?: IModelTokens | undefined;

        /** 当前event的下一个event */
        nextEvent: IExecutionEvent<TOutputs> | null;

        /** 当前事件对应的llm事件 */
        llmEvent: IExecutionEvent<unknown> | null;

        /**
         * function call类型的event的输出
         */
        functionCallUIStatus: 'launching' | 'running' | 'error' | 'success';
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
