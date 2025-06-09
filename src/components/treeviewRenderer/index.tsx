/**
 * @file 树形结构渲染器
 */

import {observer} from 'mobx-react-lite';
import React from 'react';
import {EventTreeNode} from '../../model/EventTree';
import {EventRenderService, eventRenderService} from '../../service/eventRenderService';

import styles from './index.module.scss';

interface IProps {
    root: EventTreeNode;
}

export const TreeViewRenderer: React.FC<IProps> = observer(props => {
    const {root} = props;

    return (
        <div>
            {root.children.map(node => {
                const Renderer: EventRenderService.IEventRenderer | undefined = eventRenderService.getEventRenderer(node.event.event_type);

                if (!Renderer) {
                    return null;
                }

                return (
                    <div key={node.event.event_id} className={styles.bubble} data-no-border={!node.event.isTopLevelEvent}>
                        <Renderer event={node.event} />

                        <TreeViewRenderer root={node} />
                    </div>
                )
            })}
        </div>
    )
})