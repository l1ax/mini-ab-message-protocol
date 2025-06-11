/**
 * @file session内容渲染组件
 */

import {Session} from '../../refactor/Session';
import {observer} from 'mobx-react-lite';
import {elementRendererMap} from '../elementRenderer';
import styles from './index.module.scss';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';

interface IProps {
    session: Session;
}

export const SessionComponent: React.FC<IProps> = observer((props) => {
    return (
        <div className={styles.sessionContainer}>
            {props.session.elements.map((element) => {
                const Renderer: React.FC<{element: Session.IElement}> | null = elementRendererMap[element.type];
                if (!Renderer) {
                    return null;
                }

                const isUser = element.role === 'user';
                const isAssistant = element.role === 'assistant';

                return (
                    <div 
                        key={element.uiId} 
                        className={`${styles.messageWrapper} ${isUser ? styles.userMessage : ''} ${isAssistant ? styles.assistantMessage : ''}`}
                    >
                        {isUser && (
                            <div className={`${styles.avatar} ${styles.userAvatar}`}>
                                <UserOutlined />
                            </div>
                        )}
                        
                        <div className={styles.messageContent}>
                            {isUser && <div className={`${styles.roleLabel} ${styles.userLabel}`}>用户</div>}
                            {isAssistant && <div className={`${styles.roleLabel} ${styles.assistantLabel}`}>助手</div>}
                            <Renderer element={element} />
                        </div>
                        
                        {isAssistant && (
                            <div className={`${styles.avatar} ${styles.assistantAvatar}`}>
                                <RobotOutlined />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
});