/**
 * @file 基础事件渲染器
 */

import React from 'react';
import {ExecutionEvent} from '../../model/ExecutionEvent';
import {observer} from 'mobx-react-lite';

interface IProps {
    event: ExecutionEvent<any>;
}

export const baseEventRenderer: React.FC<IProps> = observer(props => {
    return (
        <div style={{textAlign: 'left'}}>
            {props.event.outputs.text}
        </div>
    )
});