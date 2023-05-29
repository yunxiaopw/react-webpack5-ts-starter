import req from '@/utils/axois'

// 添加公告
export function apiAddNotice(params: any) {
  return req.post('/add_notice', params)
}
