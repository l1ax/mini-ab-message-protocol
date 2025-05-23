import {observer} from 'mobx-react-lite'
import React from 'react'
import {ConversationStore} from '../../store/ConversationStore';

interface IProps {
    store: ConversationStore;
}
export const ChatContent: React.FC<IProps> = observer((props) => {
    const {store} = props;

    return (
        <div>
            <h1>Chat Content</h1>
            get conversation id: {store.conversationId}
        </div>
    )
})
