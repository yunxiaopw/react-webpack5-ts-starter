import dayjs from 'dayjs'

export const formatDate = (date: number, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) {
    return '-'
  }
  if (String(date).length === 10) {
    date *= 1000
  }
  return dayjs(date).format(format)
}
