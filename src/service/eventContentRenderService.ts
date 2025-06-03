/**
 * @file 事件内容渲染服务
 */

import {functionCallContentRenderer} from './contentRenderer/functionCallContentRenderer';
import {textContentRenderer} from './contentRenderer/textContentRenderer';

class EventContentRenderService {
    private contentRenderers: Record<string, EventContentRenderService.IContentRenderer<any>> = {};

    public registerContentRenderer(
        eventType: string,
        renderer: EventContentRenderService.IContentRenderer<any>
    ): void {
        this.contentRenderers[eventType] = renderer;
    }

    public getContentRenderer(eventType: string): EventContentRenderService.IContentRenderer<any> | undefined {
        return this.contentRenderers[eventType];
    }
}

export const eventContentRenderService = new EventContentRenderService();

eventContentRenderService.registerContentRenderer('text', textContentRenderer);
eventContentRenderService.registerContentRenderer('function_call', functionCallContentRenderer);
eventContentRenderService.registerContentRenderer('thought', textContentRenderer);

export namespace EventContentRenderService {
    export type IContentRenderer<T = unknown> = (content: T) => React.ReactNode;

    /** 文本内容输出 */
    export type ITextContentOutputs = {
        text: string;
    }
}

