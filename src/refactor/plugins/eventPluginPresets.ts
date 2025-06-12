import {ExecutionEvent} from '../../model/ExecutionEvent';
import {BaseEvent, FunctionCallEvent, ChatReasoningEvent, ThoughtEvent, ChatAgentEvent} from '../../service/events';

const eventPluginPresets: Array<typeof ExecutionEvent<any>> = [
    BaseEvent,
    FunctionCallEvent,
    ChatReasoningEvent,
    ThoughtEvent,
    ChatAgentEvent
]

export default eventPluginPresets;