/**
 * @file 事件渲染器
 */

import React from 'react';
import styles from './index.module.scss';
import {ExecutionEvent} from '../../model/ExecutionEvent';
import {observer} from 'mobx-react-lite';

interface IProps {
    event: ExecutionEvent<any>;
}

export const EventRenderer: React.FC<IProps> = observer(props => {
    
    switch (props.event.event_type) {
        case 'function_call': {
            return (
                <div className={styles.eventRenderer}>
                    <h2>comes from fc</h2>
                    {(props.event.outputs as ExecutionEvent.IFunctionCallEventOutput).text.component_name}
                </div>
            );
        }
        case 'chat_reasoning': {
            return (
                <div className={styles.eventRenderer}>
                    <h2>comes from chat_reasoning</h2>
                    {props.event.outputs.text}
                </div>
            );
        }
        case 'thought': {
            return (
                <div className={styles.eventRenderer}>
                    <h2>comes from thought</h2>
                    {props.event.outputs.text}
                </div>
            );
        }
        case 'ChatAgent': {
            return (
                <div className={styles.eventRenderer}>
                    <h2>comes from ChatAgent</h2>
                    {props.event.outputs.text}
                </div>
            );
        }
    }

    return (
        <div className={styles.eventRenderer}>
            {props.event.outputs.text}
        </div>
    );
})