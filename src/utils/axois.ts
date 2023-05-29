import { message } from 'antd'
import Request from './request'
// import router from '@/router';
// import { useUserStore } from '@/store/modules/user';

let timer: ReturnType<typeof setTimeout>
const request = new Request({
  baseURL: '',
  timeout: 10000,
  successCallback: data => {
    message.success(data.msg)
  },
  errorCallback: data => {
    console.log('error', data)
    if (data.code === 14) {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        message.error(data.msg || '接口错误')
      }, 500)
    } else {
      message.error(data.msg || '接口错误')
    }
  },
  loginExpired: () => {
    // console.log('loginExpired');
    // const { clearCache } = useUserStore();
    // clearCache();
    // router.push('/login');
  },
  wrongCallback: (msg: string) => {
    message.error(msg)
  }
})

export default {
  get: request.get,
  post: request.post,
  put: request.put,
  delete: request.delete,
  request: request.request
}
