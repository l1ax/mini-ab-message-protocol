import { observer } from 'mobx-react-lite'
import React, {useEffect, useMemo} from 'react'

import cls from './index.module.scss'
import { ConversationStore } from '../../store/ConversationStore';
import {ChatContent} from '../chatContent';
import {flowResult} from 'mobx';

const ChatView: React.FC = observer(() => {
    const conversationStore: ConversationStore = useMemo(() => new ConversationStore(), []);

    useEffect(() => {
        flowResult(conversationStore.onCreateConversation(ConversationStore.DEFAULT_APP_ID))
            .catch((err) => {
                console.error(err);
            });
    }, [conversationStore]);

    return (
        <div className={cls.chatView}>
            <ChatContent store={conversationStore} />
        </div>
    )
})

export default ChatView
