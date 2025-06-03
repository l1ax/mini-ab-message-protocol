/**
 * @file thought 事件渲染器
 */

import React from "react";
import { ExecutionEvent } from "../../model/ExecutionEvent";
import { observer } from "mobx-react-lite";

import styles from './index.module.scss';
import {eventContentRenderService} from '../eventContentRenderService';

interface IProps {
    event: ExecutionEvent<ExecutionEvent.IThoughtEventOutput>;
}

export const thoughtEventRenderer: React.FC<IProps> = observer(props => {
    const ThoughtContentRenderer: React.FC<any> | undefined = eventContentRenderService.getContentRenderer('thought');
    return (
        <div className={styles.eventRenderer} data-no-border>
            <h2>agent思考</h2>
            {ThoughtContentRenderer && <ThoughtContentRenderer outputs={props.event.outputs} />}
        </div>
    );
});