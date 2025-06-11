/**
 * @file 文字query渲染组件
 */

import {Session} from '../../../refactor/Session';
import {observer} from 'mobx-react-lite';
import {TextQuery} from '../../../refactor/TextQuery';

interface IProps {
    element: Session.IElement;
}

export const TextQueryRenderer: React.FC<IProps> = observer((props) => {
    const element: TextQuery = props.element as TextQuery;

    return (
        <div>
            {element.textContent}
        </div>
    )
})