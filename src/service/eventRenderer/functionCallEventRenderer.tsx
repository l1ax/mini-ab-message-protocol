/**
 * @file function call 事件渲染器
 */

import React, {useState} from "react";
import { ExecutionEvent } from "../../model/ExecutionEvent";
import { observer } from "mobx-react-lite";
import {CaretUpOutlined, CaretDownOutlined} from '@ant-design/icons';
import styles from './index.module.scss';
import {eventContentRenderService} from '../eventContentRenderService';

interface IProps {
    event: ExecutionEvent<ExecutionEvent.IFunctionCallEventOutput>;
}

export const functionCallEventRenderer: React.FC<IProps> = observer(props => {
    const [showFunctionCallArgs, setShowFunctionCallArgs] = useState(true);

    const FunctionCallContentRenderer = eventContentRenderService.getContentRenderer('function_call');
    
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
                FunctionCallContentRenderer && <FunctionCallContentRenderer outputs={props.event.outputs} />
            )}
            
            {props.event.calledEvent.length > 0 && (
                <div className={styles.calledEvent}>
                    {props.event.calledEvent.map(event => {
                        const Renderer: React.FC<any> | undefined = eventContentRenderService.getContentRenderer(event.content_type);
                        if (!Renderer) {
                            throw new Error(`Event content renderer not found: ${event.content_type}`);
                        }

                        return (
                            <div key={event.event_id} className={styles.eventRenderer}>
                                <h2>调用{event.event_type}</h2>
                                <Renderer outputs={event.outputs} />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
});
