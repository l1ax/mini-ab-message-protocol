/**
 * @file 事件渲染器
 */

import React, {useState} from 'react';
import styles from './index.module.scss';
import {ExecutionEvent} from '../../model/ExecutionEvent';
import {observer} from 'mobx-react-lite';
import ReactJson from 'react-json-view';
import {CaretDownOutlined, CaretUpOutlined} from '@ant-design/icons';

interface IProps {
    event: ExecutionEvent<any>;
}

export const EventRenderer: React.FC<IProps> = observer(props => {

    const [showFunctionCallArgs, setShowFunctionCallArgs] = useState(true);
    
    switch (props.event.event_type) {
        case 'function_call': {
            return (
                <div className={styles.eventRenderer}>
                    <div className={styles.title}>
                        <div className={styles.titleText}>
                            调用{props.event.outputs.text.component_name}
                        </div>
                        <span className={styles.titleIcon} onClick={() => setShowFunctionCallArgs(!showFunctionCallArgs)}>
                            {showFunctionCallArgs ? <CaretUpOutlined /> : <CaretDownOutlined />}
                        </span>
                    </div>
                    {showFunctionCallArgs && (
                        <ReactJson src={props.event.outputs} />
                    )}
                    
                    {props.event.calledEvent.length > 0 && (
                        <div className={styles.calledEvent}>
                            {props.event.calledEvent.map(event => (
                                <div key={event.event_id} className={styles.eventRenderer}>
                                    <h2>调用{event.event_type}</h2>
                                    {event.outputs.text}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }
        case 'chat_reasoning': {
            return (
                <div className={styles.eventRenderer}>
                    <h2>模型思维链</h2>
                    {props.event.outputs.text}
                </div>
            );
        }
        case 'thought': {
            return (
                <div className={styles.eventRenderer}>
                    <h2>agent思考</h2>
                    {props.event.outputs.text}
                </div>
            );
        }
    }

    return null;
})