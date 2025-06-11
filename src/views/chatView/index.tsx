import { observer } from 'mobx-react-lite'
import React, {useEffect, useMemo} from 'react'

import cls from './index.module.scss'
import {ChatContent} from '../chatContent';
import {flowResult} from 'mobx';
import {Conversation} from '../../refactor/Conversation';

const ChatView: React.FC = observer(() => {
    // const conversationStore: ConversationStore = useMemo(() => new ConversationStore(), []);

    // useEffect(() => {
    //     flowResult(conversationStore.onCreateConversation(ConversationStore.DEFAULT_APP_ID))
    //         .catch((err) => {
    //             console.error(err);
    //         });
    // }, [conversationStore]);

    const conversation: Conversation = useMemo(() => new Conversation(), []);
    useEffect(() => {
        flowResult(conversation.createSession())
            .catch((err) => {
                console.error(err);
            });
    }, [conversation])

    return (
        <div className={cls.chatView}>
            <ChatContent store={conversation} />
        </div>
    )
})

export default ChatView
