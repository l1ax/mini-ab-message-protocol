/**
 * @file session内容渲染组件
 */

import {Session} from '../../refactor/Session';
import {observer} from 'mobx-react-lite';
import {elementRendererMap} from '../elementRenderer';

interface IProps {
    session: Session;
}

export const SessionComponent: React.FC<IProps> = observer((props) => {
    return (
        <div>
            {props.session.elements.map((element) => {
                const Renderer = elementRendererMap[element.type];
                if (!Renderer) {
                    return null;
                }

                return <Renderer key={element.uiId} element={element} />
            })}
        </div>
    )
})