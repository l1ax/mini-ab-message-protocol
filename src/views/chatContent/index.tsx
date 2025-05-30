import {observer} from 'mobx-react-lite'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { UserOutlined, RobotOutlined, MessageOutlined } from '@ant-design/icons'
import { ConversationStore } from '../../store/ConversationStore';
import styles from './index.module.scss'
import {action, flowResult} from 'mobx';
import {Button} from 'antd';
import {EventRenderer} from '../../components/eventRenderer';

interface IProps {
    store: ConversationStore;
}

export const ChatContent: React.FC<IProps> = observer((props) => {
    const {store} = props;
    const [inputValue, setInputValue] = useState('')

    const messageListRef = useRef<HTMLDivElement>(null)
    const textAreaRef = useRef<HTMLTextAreaElement>(null)

    // 滚动到底部的函数
    const scrollToBottom = useCallback(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
        }
    }, [])

    // 监听 qaList 变化
    useEffect(() => {
        scrollToBottom()
    }, [store.conversation.qaList.length, store.conversation.activeQA?.latestEvent?.outputs, scrollToBottom])


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
                    <Button
                        type="primary"
                        onClick={action(() => {
                            window.localStorage.removeItem('conversationId');
                            store.onCreateConversation(ConversationStore.DEFAULT_APP_ID)
                        })}
                    >
                        创建新的会话
                    </Button>
                </div>
            </div>

            {/* 聊天内容区域 */}
            <div className={styles.chatBody}>
                <div className={styles.messageList}>
                    <div ref={messageListRef}>
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
                                            {/* {qa.answer} */}
                                            {
                                                qa.events.map((event) => (
                                                    <div key={event.event_id}>
                                                        <EventRenderer event={event} />
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
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
