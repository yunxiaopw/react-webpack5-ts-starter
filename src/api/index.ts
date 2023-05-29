import req from '@/utils/axois'

// 添加公告
export function apiAddNotice(params: any) {
  return req.post('/api/add_notice', params)
}

// 获取公告列表
export function apiGetNoticeList(params: any) {
  return req.post('/api/get_notice_list', params)
}
