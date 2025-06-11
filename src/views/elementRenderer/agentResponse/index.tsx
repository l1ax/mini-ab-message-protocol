/**
 * @file agentResponse渲染组件
 */

import {Session} from '../../../refactor/Session';
import {observer} from 'mobx-react-lite';
import {AgentResponse} from '../../../refactor/AgentResponse';
import {TreeViewRenderer} from '../../../components/treeviewRenderer';

interface IProps {
    element: Session.IElement;
}

export const AgentResponseRenderer: React.FC<IProps> = observer((props) => {
    const element: AgentResponse = props.element as AgentResponse;

    console.log('element', element);
    return (
        <div>
            <TreeViewRenderer root={element.executionResponse.eventTree.root} />
        </div>
    )
})