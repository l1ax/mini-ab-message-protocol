import {observer} from 'mobx-react-lite'
import React, { useState, useRef, useEffect } from 'react'
import { UserOutlined, RobotOutlined, MessageOutlined } from '@ant-design/icons'
import { ConversationStore } from '../../store/ConversationStore';
import styles from './index.module.scss'

interface IProps {
    store: ConversationStore;
}

interface Message {
    id: string
    type: 'user' | 'assistant'
    content: string
    timestamp: Date
}

export const ChatContent: React.FC<IProps> = observer((props) => {
    const {store} = props;
    const [inputValue, setInputValue] = useState('')
    const [messages, setMessages] = useState<Message[]>([
        // 模拟一些示例数据
        {
            id: '1',
            type: 'user',
            content: '你好，我想了解一下这个产品的功能',
            timestamp: new Date(Date.now() - 1000 * 60 * 5)
        },
        {
            id: '2',
            type: 'assistant',
            content: '您好！很高兴为您介绍我们的产品。这是一个AI智能对话系统，主要功能包括:\n\n1. 智能问答 - 可以回答各种问题\n2. 对话记忆 - 能够记住上下文内容\n3. 多轮对话 - 支持连续的对话交流\n4. 个性化回复 - 根据用户需求提供定制化回答\n\n您还有什么想了解的吗？',
            timestamp: new Date(Date.now() - 1000 * 60 * 4)
        },
        {
            id: '3',
            type: 'user',
            content: '这个系统支持哪些语言？',
            timestamp: new Date(Date.now() - 1000 * 60 * 2)
        },
        {
            id: '4',
            type: 'assistant',
            content: '我们的系统支持多种语言，包括：\n\n• 中文（简体/繁体）\n• English\n• 日本語\n• 한국어\n• Français\n• Deutsch\n• Español\n\n系统会自动检测您使用的语言并进行相应的回复。您可以随时切换语言进行对话。',
            timestamp: new Date(Date.now() - 1000 * 60 * 1)
        }
    ])

    const messageListRef = useRef<HTMLDivElement>(null)
    const textAreaRef = useRef<HTMLTextAreaElement>(null)

    // 自动滚动到底部
    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight
        }
    }, [messages])

    // 处理输入框高度自适应
    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto'
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`
        }
    }, [inputValue])

    const handleSendMessage = () => {
        if (!inputValue.trim()) return

        const newMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: inputValue.trim(),
            timestamp: new Date()
        }

        setMessages(prev => [...prev, newMessage])
        setInputValue('')

        // 模拟AI回复
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: '感谢您的提问！这是一个模拟的AI回复。在实际应用中，这里会连接到真正的AI模型来生成回复。',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, aiResponse])
        }, 1000)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const formatTime = (timestamp: Date) => {
        return timestamp.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className={styles.chatContainer}>
            {/* 聊天头部 */}
            <div className={styles.chatHeader}>
                <div className={styles.conversationId}>
                    对话ID: {store.conversationId}
                </div>
            </div>

            {/* 聊天内容区域 */}
            <div className={styles.chatBody}>
                <div className={styles.messageList} ref={messageListRef}>
                    {messages.length === 0 ? (
                        <div className={styles.emptyState}>
                            <MessageOutlined className={styles.emptyIcon} />
                            <p className={styles.emptyText}>开始您的对话吧...</p>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <div
                                key={message.id}
                                className={`${styles.messageItem} ${
                                    message.type === 'user'
                                        ? styles.userMessage
                                        : styles.assistantMessage
                                }`}
                            >
                                <div
                                    className={`${styles.avatar} ${
                                        message.type === 'user'
                                            ? styles.userAvatar
                                            : styles.assistantAvatar
                                    }`}
                                >
                                    {message.type === 'user' ? (
                                        <UserOutlined />
                                    ) : (
                                        <RobotOutlined />
                                    )}
                                </div>
                                <div className={styles.messageContent}>
                                    {message.content}
                                    <div className={styles.messageTime}>
                                        {formatTime(message.timestamp)}
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
