import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import App from './App'
import 'uno.css'
import '@/styles/index.less'

const root = document.querySelector('#root')

if (root) {
  createRoot(root).render(
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  )
}
