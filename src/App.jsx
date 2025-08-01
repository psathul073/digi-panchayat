import { ThemeProvider } from './contexts/ThemeContexts'
import PrivateRouter from './Routes/PrivateRouter'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router"
import LandingPage from './pages/LandingPage'
import Login from './components/forms/Login'
import Register  from './components/forms/Register'
import ResetPwd from './components/forms/ResetPwd'
import ApplicationViewer from './components/ApplicationViewer'

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Role base routes */}
          <Route path='/' element={<PrivateRouter />} />
          {/* Auth routes */}
          <Route path='/landing' element={<LandingPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/reset-password' element={<ResetPwd />} />
          <Route path='/certificate/:reqId' element={<ApplicationViewer/>} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>

  )
}

export default App
