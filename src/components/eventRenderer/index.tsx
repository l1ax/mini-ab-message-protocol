/**
 * @file 事件渲染器
 */

import React from 'react';
import {ExecutionEvent} from '../../model/ExecutionEvent';
import {observer} from 'mobx-react-lite';
import {eventRenderService} from '../../service/eventRenderService';

interface IProps {
    event: ExecutionEvent<any>;
}

export const EventRenderer: React.FC<IProps> = observer(props => {

    const Renderer: React.FC<any> | undefined = eventRenderService.getEventRenderer(props.event.event_type);
    if (!Renderer) {
        return null;
    }

    return <Renderer event={props.event} />;
})