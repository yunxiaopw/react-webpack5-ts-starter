import React from 'react'
import Home from '@/views/home/Home'

export interface RouteConfig {
  path: string
  element?: React.ReactNode
  auth?: boolean
  children?: RouteConfig[]
  redirect?: string
}

const routes: RouteConfig[] = [
  {
    path: '/',
    element: <Home />
  }
]

export default routes
