import {observer} from 'mobx-react-lite'
import React, { useState, useRef, useEffect } from 'react'
import { UserOutlined, RobotOutlined, MessageOutlined } from '@ant-design/icons'
import { ConversationStore } from '../../store/ConversationStore';
import styles from './index.module.scss'
import {flowResult} from 'mobx';

interface IProps {
    store: ConversationStore;
}

export const ChatContent: React.FC<IProps> = observer((props) => {
    const {store} = props;
    const [inputValue, setInputValue] = useState('')

    const messageListRef = useRef<HTMLDivElement>(null)
    const textAreaRef = useRef<HTMLTextAreaElement>(null)

    // 自动滚动到底部
    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight
        }
    }, [store.conversation.qaList.length])

    // 处理输入框高度自适应
    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto'
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`
        }
    }, [inputValue])

    const handleSendMessage = () => {
        flowResult(store.conversation.sendQuery(inputValue))
            .finally(() => {
                setInputValue('');
            });
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <div className={styles.chatContainer}>
            {/* 聊天头部 */}
            <div className={styles.chatHeader}>
                <div className={styles.conversationId}>
                    对话ID: {store.conversation.conversationId}
                </div>
            </div>

            {/* 聊天内容区域 */}
            <div className={styles.chatBody}>
                <div className={styles.messageList} ref={messageListRef}>
                    {store.conversation.qaList.length === 0 ? (
                        <div className={styles.emptyState}>
                            <MessageOutlined className={styles.emptyIcon} />
                            <p className={styles.emptyText}>开始您的对话吧...</p>
                        </div>
                    ) : (
                        store.conversation.qaList.map((qa) => (
                            <div className={styles.qaContainer} key={qa.id}>
                                <div
                                    className={`${styles.messageItem} ${styles.userMessage}`}
                                >
                                    <div className={styles.avatar}>
                                        <UserOutlined />
                                    </div>
                                    <div className={styles.messageContent}>
                                        {qa.query}
                                    </div>
                                </div>
                                <div
                                    className={`${styles.messageItem} ${styles.assistantMessage}`}
                                >
                                    <div className={styles.avatar}>
                                        <RobotOutlined />
                                    </div>
                                    <div className={styles.messageContent}>
                                        {qa.answer}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* 输入区域 */}
            <div className={styles.inputArea}>
                <div className={styles.inputContainer}>
                    <textarea
                        ref={textAreaRef}
                        className={styles.textArea}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="输入消息... (Enter发送，Shift+Enter换行)"
                        rows={1}
                    />
                    <button
                        className={styles.sendButton}
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                    >
                        发送
                    </button>
                </div>
            </div>
        </div>
    )
})
