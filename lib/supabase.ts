import { createClient } from '@supabase/supabase-js'

// Supabase 客户端（前台用户认证）
// 这两个值是公开可见的（publishable key），可以安全地放在前端代码中
const SUPABASE_URL = 'https://bocdxdvteqpryrxluztf.supabase.co'
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_BsIGpguMG2MGCytjZcIXXQ_eDLgkMB7'

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
})
