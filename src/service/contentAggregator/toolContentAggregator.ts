/**
 * @file 工具调用事件内容聚合器
 */

import {ExecutionEvent} from '../../model/ExecutionEvent';
import {EventContentAggregateService} from '../eventContentAggregateService';

export const toolContentAggregator: EventContentAggregateService.IContentAggregator<
    ExecutionEvent.IToolEventOutput
> = (prevContent: ExecutionEvent.IToolEventOutput, incomingContent: ExecutionEvent.IToolEventOutput) => {
    return {
        text: prevContent.text + incomingContent.text,
    };
};