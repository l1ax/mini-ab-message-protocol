/**
 * @file 事件渲染服务
 */

import {baseEventRenderer} from './eventRenderer/baseEventRenderer';
import {functionCallEventRenderer} from './eventRenderer/functionCallEventRenderer';
import {thoughtEventRenderer} from './eventRenderer/thoughtEventRenderer';

class EventRenderService {
    private eventRenderers: Record<string, EventRenderService.IEventRenderer> = {};

    public registerEventRenderer(eventType: string, renderer: EventRenderService.IEventRenderer): void {
        this.eventRenderers[eventType] = renderer;
    }

    public getEventRenderer(eventType: string): EventRenderService.IEventRenderer | undefined {
        return this.eventRenderers[eventType] ?? baseEventRenderer;
    }
}

export const eventRenderService = new EventRenderService();

eventRenderService.registerEventRenderer('function_call', functionCallEventRenderer);
eventRenderService.registerEventRenderer('thought', thoughtEventRenderer);

export namespace EventRenderService {
    export type IEventRenderer = React.FC<any>;
}