import ky, {KyInstance} from 'ky'

// 自定义错误类型，用于API响应错误
interface ApiError extends Error {
    status: number
    data: Record<string, unknown>
}

const kyInstance: KyInstance = ky.extend({})

const abKyInstance: KyInstance = ky.extend({
    hooks: {
        beforeRequest: [
            (request) => {
                request.headers.set('Authorization', `Bearer ${import.meta.env.VITE_AB_API_KEY}`)
            }
        ],
        afterResponse: [
            async (request, options, response) => {
                // 只处理错误响应，成功响应保持原样
                if (!response.ok) {
                    // 克隆响应以避免消费问题
                    const clonedResponse = response.clone()
                    
                    // 尝试解析错误响应
                    let errorData
                    try {
                        errorData = await clonedResponse.json()
                    } catch {
                        errorData = { message: response.statusText }
                    }
                    
                    // 抛出包含错误信息的错误
                    const error = new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`) as ApiError
                    error.status = response.status
                    error.data = errorData
                    throw error
                }
                
                // 对于成功的JSON响应，自动解包数据
                const contentType = response.headers.get('content-type')
                if (contentType?.includes('application/json')) {
                    const data = await response.json()
                    
                    // 创建一个新的Response，但将解析后的数据作为body
                    return new Response(JSON.stringify(data), {
                        status: response.status,
                        statusText: response.statusText,
                        headers: {
                            ...Object.fromEntries(response.headers.entries()),
                            'content-type': 'application/json'
                        }
                    })
                }
                
                // 对于非JSON响应，返回原响应
                return response
            }
        ]
    }
})

export { kyInstance, abKyInstance }