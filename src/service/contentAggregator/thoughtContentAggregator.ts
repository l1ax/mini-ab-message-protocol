import {ExecutionEvent} from '../../model/ExecutionEvent';
import {EventContentAggregateService} from '../eventContentAggregateService';

export const thoughtContentAggregator: EventContentAggregateService.IContentAggregator<
    ExecutionEvent.IThoughtEventOutput
> = (
    prevContent: ExecutionEvent.IThoughtEventOutput,
    incomingContent: ExecutionEvent.IThoughtEventOutput
) => {
    return {
        text: prevContent.text + incomingContent.text,
    };
};