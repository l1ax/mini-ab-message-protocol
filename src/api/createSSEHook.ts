/**
 * @file ky处理SSE的hook
 * @author FranckChen(chenfan02@baidu.com)
 */
import { createParser, EventSourceMessage, ParserCallbacks } from 'eventsource-parser'

// 定义SSE Hook的选项接口
interface SSEHookOptions {
    /**
     * 当接收到SSE消息时的回调
     */
    onMessage?: (event: EventSourceMessage) => void
    
    /**
     * 当接收到SSE事件时的回调
     */
    onEvent?: (event: EventSourceMessage) => void
    
    /**
     * 当接收到数据时的回调
     */
    onData: (data: string) => void
    
    /**
     * 当接收到重连间隔时的回调
     */
    onReconnectInterval?: (interval: number) => void
    
    /**
     * 当连接完成时的回调
     */
    onCompleted?: (error?: Error) => void
    
    /**
     * 当连接被中止时的回调
     */
    onAborted?: () => void
}

// 定义Hook函数类型
type SSEHook = (
    request: Request,
    options: unknown,
    response: Response
) => Promise<Response | void>

/**
 * 创建处理SSE流的hook
 * @param options - SSE处理选项
 * @returns 返回ky可用的hook函数
 */
export const createSSEHook = (options: SSEHookOptions): SSEHook => {
    const hook: SSEHook = async (request, _options, response) => {
    // 检查响应是否有效
    if (!response.ok || !response.body) {
        return
    }

    let completed = false

    /**
     * 内部完成处理函数，确保只执行一次
     */
    const innerOnCompleted = (error?: Error): void => {
        if (completed) {
            return
        }
        completed = true
        options.onCompleted?.(error)
    }

    // 获取响应流读取器
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf8')

    /**
     * 解析SSE事件的回调函数
     */
    const parserCallbacks: ParserCallbacks = {
        onEvent: (event: EventSourceMessage) => {
            // 触发消息回调
            options.onMessage?.(event)

            // 如果有数据，处理数据
            if (event.data) {
                options.onEvent?.(event)
            
                // 处理单个message包含多个data字段的场景
                const dataArray = event.data.split('\n')
                dataArray.forEach((data: string) => {
                    if (data.trim()) { // 过滤空字符串
                        options.onData(data)
                    }
                })
            }
        },
        onRetry: (retry: number) => {
            options.onReconnectInterval?.(retry)
        }
    }

    // 创建SSE解析器
    const parser = createParser(parserCallbacks)

    /**
     * 递归读取流数据
     */
    const readStream = async (): Promise<void> => {
        try {
            const result = await reader.read()
            
            // 检查流是否结束
            if (result.done) {
                innerOnCompleted()
                return
            }

            // 解码并解析数据
            const chunk = decoder.decode(result.value, { stream: true })
            parser.feed(chunk)
            
            // 继续读取下一个数据块
            await readStream()
        } catch (error) {
            // 判断是否是手动中止的请求
            if (request.signal?.aborted) {
                options.onAborted?.()
                return
            }
            
            // 其他错误情况
            innerOnCompleted(error as Error)
        }
    }

        // 开始读取流
        readStream()
    
        return response
    }

    return hook
}

// 保持向后兼容性
export const createHook = createSSEHook
