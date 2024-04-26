import { HashRouter, useRoutes } from 'react-router-dom'
import AppRoutes from './router'

function RouteElement() {
  return useRoutes(AppRoutes)
}

function App() {
  return (
    <HashRouter>
      <RouteElement />
    </HashRouter>
  )
}

export default App
