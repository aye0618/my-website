// 八字分析 API 服务

// 使用 Next.js API 路由作为代理，避免 CORS 问题
const API_BASE_URL = '/api/bazi'

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
 * 调用八字分析 API（通过 Next.js API 路由代理）
 * API 使用异步模式：提交任务 → 轮询结果
 */
export async function analyzeBazi(
  params: BaziAnalyzeRequest
): Promise<BaziAnalyzeResponse> {
  try {
    // 调用 Next.js API 路由（内部处理异步轮询）
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const result: BaziAnalyzeResponse = await response.json()
    return result
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        data: null,
        error: error.message,
      }
    }
    return {
      success: false,
      data: null,
      error: '未知错误',
    }
  }
}

/**
 * 从用户输入中提取生辰信息
 * 支持格式：
 * - "1990年5月15日10时30分 男"
 * - "1990-05-15 10:30 男"
 * - "出生日期：1990年5月15日，时间：10:30，性别：男"
 */
export function parseBirthInfo(input: string): BaziAnalyzeRequest | null {
  try {
    // 提取年月日
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

    // 提取时分
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

    // 提取性别
    let gender: 'male' | 'female' = 'male'
    if (input.includes('女') || input.includes('female')) {
      gender = 'female'
    }

    // 验证数据
    if (
      year < 1900 || year > 2100 ||
      month < 1 || month > 12 ||
      day < 1 || day > 31 ||
      hour < 0 || hour > 23 ||
      minute < 0 || minute > 59
    ) {
      return null
    }

    return {
      year,
      month,
      day,
      hour,
      minute,
      gender,
    }
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
