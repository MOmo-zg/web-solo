import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 创建模拟客户端
const mockSupabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: { code: 'PGRST116' } })
      })
    }),
    insert: () => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: null })
      })
    })
  })
};

// 导出客户端
let supabase;
if (process.env.NODE_ENV !== 'production') {
  supabase = mockSupabase;
} else {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  supabase = createClient(supabaseUrl, supabaseServiceKey);
}

export default supabase;
