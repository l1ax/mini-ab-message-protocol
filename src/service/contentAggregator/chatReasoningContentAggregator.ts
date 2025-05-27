import {ExecutionEvent} from '../../model/ExecutionEvent';
import {EventContentAggregateService} from '../eventContentAggregateService';

export const chatReasoningContentAggregator: EventContentAggregateService.IContentAggregator<
    ExecutionEvent.IChatReasoningEventOutput
> = (
    prevContent: ExecutionEvent.IChatReasoningEventOutput,
    incomingContent: ExecutionEvent.IChatReasoningEventOutput
) => {
    return {
        text: prevContent.text + incomingContent.text,
    };
};