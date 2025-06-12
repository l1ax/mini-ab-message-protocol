/**
 * @file agentResponse渲染组件
 */

import {Session} from '../../../refactor/Session';
import {observer} from 'mobx-react-lite';
import {AgentResponse} from '../../../refactor/AgentResponse';
import {TreeViewRenderer} from '../../../components/treeviewRenderer';
import {TreeView} from '../../../refactor/views/TreeView';

import styles from './index.module.scss';

interface IProps {
    element: Session.IElement;
}

export const AgentResponseRenderer: React.FC<IProps> = observer((props) => {
    const element: AgentResponse = props.element as AgentResponse;

    console.log('element', element);
    return (
        <div className={styles.agentResponse}>
            <TreeViewRenderer root={(element.executionResponse.view as TreeView).eventTree.root} />
        </div>
    )
})