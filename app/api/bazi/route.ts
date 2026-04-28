import { NextRequest, NextResponse } from 'next/server'

// 使用 AnyNetGate 跨域代理
const PROXY_URL = 'https://anynetgate.cn/?'
const API_BASE_URL = 'https://baziapi.site'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 验证必填字段
    const { year, month, day, hour, minute, gender } = body

    if (!year || !month || !day || hour === undefined || minute === undefined || !gender) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: '缺少必填参数',
        },
        { status: 400 }
      )
    }

    // 1. 提交任务到外部 API (通过代理)
    const submitUrl = `${PROXY_URL}${API_BASE_URL}/api/bazi/submit`
    
    const submitResponse = await fetch(submitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

    // 2. 轮询查询结果（最多60次，每次间隔2秒）
    const maxAttempts = 60
    const interval = 2000

    for (let i = 0; i < maxAttempts; i++) {
      // 等待2秒
      await new Promise((resolve) => setTimeout(resolve, interval))

      // 查询任务状态 (通过代理)
      const resultUrl = `${PROXY_URL}${API_BASE_URL}/api/bazi/result/${taskId}`
      const resultResponse = await fetch(resultUrl)

      if (!resultResponse.ok) {
        throw new Error(`查询结果失败: HTTP ${resultResponse.status}`)
      }

      const result = await resultResponse.json()

      // 任务完成
      if (result.status === 'completed') {
        return NextResponse.json({
          success: true,
          data: result.data,
          error: null,
        })
      }

      // 任务失败
      if (result.status === 'failed') {
        return NextResponse.json(
          {
            success: false,
            data: null,
            error: result.error || '分析失败',
          },
          { status: 500 }
        )
      }

      // 继续等待（status === 'processing'）
    }

    // 超时
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: '分析超时，请稍后重试',
      },
      { status: 504 }
    )
  } catch (error) {
    console.error('API Error:', error)

    if (error instanceof Error) {
      // 网络连接错误
      if (error.message.includes('ECONNRESET') || error.message.includes('fetch failed')) {
        return NextResponse.json(
          {
            success: false,
            data: null,
            error: '网络连接不稳定，请稍后重试',
          },
          { status: 503 }
        )
      }

      return NextResponse.json(
        {
          success: false,
          data: null,
          error: error.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        data: null,
        error: '服务器错误',
      },
      { status: 500 }
    )
  }
}
