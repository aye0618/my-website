// 八字分析 API 服务（直连模式 - 适配 GitHub Pages 静态部署）

// 使用 AnyNetGate 跨域代理直接访问外部 API
const PROXY_URL = 'https://anynetgate.cn/?'
const API_BASE_URL = 'https://baziapi.site'

export interface BaziAnalyzeRequest {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  gender: 'male' | 'female'
  custom_prompt?: string
}

export interface BaziAnalyzeResponse {
  success: boolean
  data: string | null
  error: string | null
}

/**
 * 调用八字分析 API
 * 由于 GitHub Pages 仅支持静态部署，这里直接在浏览器端通过跨域代理调用外部 API。
 * 流程：提交任务 → 轮询结果（最多 60 次，每次间隔 2 秒）。
 */
export async function analyzeBazi(
  params: BaziAnalyzeRequest
): Promise<BaziAnalyzeResponse> {
  try {
    const { year, month, day, hour, minute, gender } = params

    if (!year || !month || !day || hour === undefined || minute === undefined || !gender) {
      return { success: false, data: null, error: '缺少必填参数' }
    }

    // 1. 提交任务
    const submitUrl = `${PROXY_URL}${API_BASE_URL}/api/bazi/submit`
    const submitResponse = await fetch(submitUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        year,
        month,
        day,
        hour,
        minute: minute || 0,
        gender,
      }),
    })

    if (!submitResponse.ok) {
      throw new Error(`提交任务失败: HTTP ${submitResponse.status}`)
    }

    const submitResult = await submitResponse.json()
    const taskId = submitResult.taskId
    if (!taskId) {
      throw new Error('未获取到任务ID')
    }

    // 2. 轮询结果
    const maxAttempts = 60
    const interval = 2000

    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((resolve) => setTimeout(resolve, interval))

      const resultUrl = `${PROXY_URL}${API_BASE_URL}/api/bazi/result/${taskId}`
      const resultResponse = await fetch(resultUrl)

      if (!resultResponse.ok) {
        throw new Error(`查询结果失败: HTTP ${resultResponse.status}`)
      }

      const result = await resultResponse.json()

      if (result.status === 'completed') {
        return { success: true, data: result.data, error: null }
      }
      if (result.status === 'failed') {
        return { success: false, data: null, error: result.error || '分析失败' }
      }
      // processing → 继续等待
    }

    return { success: false, data: null, error: '分析超时，请稍后重试' }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch') || error.message.includes('fetch failed')) {
        return { success: false, data: null, error: '网络连接不稳定，请稍后重试' }
      }
      return { success: false, data: null, error: error.message }
    }
    return { success: false, data: null, error: '未知错误' }
  }
}

/**
 * 从用户输入中提取生辰信息
 */
export function parseBirthInfo(input: string): BaziAnalyzeRequest | null {
  try {
    const datePatterns = [
      /(\d{4})[年\-\/](\d{1,2})[月\-\/](\d{1,2})[日]?/,
      /(\d{4})\.(\d{1,2})\.(\d{1,2})/,
    ]

    let year = 0, month = 0, day = 0
    for (const pattern of datePatterns) {
      const dateMatch = input.match(pattern)
      if (dateMatch) {
        year = parseInt(dateMatch[1])
        month = parseInt(dateMatch[2])
        day = parseInt(dateMatch[3])
        break
      }
    }

    const timePatterns = [
      /(\d{1,2})[时:](\d{1,2})[分]?/,
      /(\d{1,2}):(\d{1,2})/,
    ]

    let hour = 0, minute = 0
    for (const pattern of timePatterns) {
      const timeMatch = input.match(pattern)
      if (timeMatch) {
        hour = parseInt(timeMatch[1])
        minute = parseInt(timeMatch[2])
        break
      }
    }

    let gender: 'male' | 'female' = 'male'
    if (input.includes('女') || input.includes('female')) {
      gender = 'female'
    }

    if (
      year < 1900 || year > 2100 ||
      month < 1 || month > 12 ||
      day < 1 || day > 31 ||
      hour < 0 || hour > 23 ||
      minute < 0 || minute > 59
    ) {
      return null
    }

    return { year, month, day, hour, minute, gender }
  } catch {
    return null
  }
}

/**
 * 格式化生辰信息为可读文本
 */
export function formatBirthInfo(info: BaziAnalyzeRequest): string {
  const genderText = info.gender === 'male' ? '男' : '女'
  return `${info.year}年${info.month}月${info.day}日 ${info.hour}时${info.minute}分 ${genderText}`
}
