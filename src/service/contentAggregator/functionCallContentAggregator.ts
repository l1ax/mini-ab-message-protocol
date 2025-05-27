import {ExecutionEvent} from '../../model/ExecutionEvent';
import {EventContentAggregateService} from '../eventContentAggregateService';

export const functionCallContentAggregator: EventContentAggregateService.IContentAggregator<
    ExecutionEvent.IFunctionCallEventOutput
> = (
    prevContent: ExecutionEvent.IFunctionCallEventOutput,
    incomingContent: ExecutionEvent.IFunctionCallEventOutput
) => {
    // function call event的内容应该不支持流式，会在一帧内返回，所以此处直接合并即可
    return {
        ...prevContent,
        ...incomingContent,
    };
};