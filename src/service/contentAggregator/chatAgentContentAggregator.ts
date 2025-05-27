import {ExecutionEvent} from '../../model/ExecutionEvent';
import {EventContentAggregateService} from '../eventContentAggregateService';

export const chatAgentContentAggregator: EventContentAggregateService.IContentAggregator<
    ExecutionEvent.IChatAgentEventOutput
> = (
    prevContent: ExecutionEvent.IChatAgentEventOutput,
    incomingContent: ExecutionEvent.IChatAgentEventOutput
) => {
    return {
        text: prevContent.text + incomingContent.text,
    };
};