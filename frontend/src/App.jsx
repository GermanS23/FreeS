import React, { useState, useEffect } from "react"
import { BrowserRouter, useRoutes, useLocation } from "react-router-dom"
import routes from "./routes"

const AppWrapper = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
    console.log("Login status:", !!token)
  }, [])

  useEffect(() => {
    console.log("Current location:", location.pathname)
  }, [location])

  const element = useRoutes(routes(isLoggedIn, setIsLoggedIn))
  return element
}

const App = () => {
  return (
    <BrowserRouter basename="/">
      <AppWrapper />
    </BrowserRouter>
  )
}

export default App