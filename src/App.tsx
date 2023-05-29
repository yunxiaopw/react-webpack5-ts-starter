import { HashRouter, useRoutes } from 'react-router-dom'
import AppRoutes from './router'

function RouteElement() {
  const element = useRoutes(AppRoutes)
  return element
}

function App() {
  return (
    <HashRouter>
      <RouteElement />
    </HashRouter>
  )
}

export default App
