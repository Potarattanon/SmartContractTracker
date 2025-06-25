import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FileText, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

export function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [validSession, setValidSession] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const { updatePassword } = useAuth()
  const navigate = useNavigate()

  // ตรวจสอบ session จาก URL fragment
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // ตรวจสอบ URL fragment สำหรับ access_token
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const tokenType = hashParams.get('token_type')

        if (accessToken && refreshToken) {
          // ตั้งค่า session ใน Supabase
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })

          if (error) {
            console.error('Session error:', error)
            setError('ลิงก์ไม่ถูกต้องหรือหมดอายุแล้ว กรุณาขอลิงก์ใหม่')
          } else if (data.session) {
            setValidSession(true)
            // ลบ fragment จาก URL
            window.history.replaceState({}, document.title, window.location.pathname)
          }
        } else {
          setError('ลิงก์ไม่ถูกต้องหรือหมดอายุแล้ว กรุณาขอลิงก์ใหม่')
        }
      } catch (err) {
        console.error('Auth callback error:', err)
        setError('เกิดข้อผิดพลาดในการตรวจสอบลิงก์')
      } finally {
        setCheckingSession(false)
      }
    }

    handleAuthCallback()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
      setLoading(false)
      return
    }

    try {
      const { error } = await updatePassword(password)
      if (error) {
        setError('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน กรุณาลองใหม่อีกครั้ง')
      } else {
        setSuccess(true)
        setTimeout(() => {
          navigate('/dashboard')
        }, 3000)
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    } finally {
      setLoading(false)
    }
  }

  // แสดง loading ขณะตรวจสอบ session
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-teal-50/50 flex items-center justify-center py-12 px-6">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              กำลังตรวจสอบลิงก์...
            </h2>
            <p className="text-gray-600 font-medium">
              กรุณารอสักครู่
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-teal-50/50 flex items-center justify-center py-12 px-6">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              เปลี่ยนรหัสผ่านสำเร็จ!
            </h2>
            <p className="text-gray-600 font-medium mb-8 leading-relaxed">
              รหัสผ่านของคุณได้รับการเปลี่ยนแปลงเรียบร้อยแล้ว
              <br />
              กำลังนำคุณเข้าสู่แดชบอร์ด...
            </p>
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-teal-50/50 flex items-center justify-center py-12 px-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-soft">
              <FileText className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Smart Contract Tracker
            </h1>
          </Link>
          <h2 className="mt-8 text-3xl font-bold text-gray-900">
            ตั้งรหัสผ่านใหม่
          </h2>
          <p className="mt-3 text-sm text-gray-600 font-medium leading-relaxed">
            กรอกรหัสผ่านใหม่ของคุณ
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-medium border border-gray-100/50">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium mb-6 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {validSession ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                  รหัสผ่านใหม่
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full px-4 py-3.5 pr-12 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium"
                    placeholder="กรอกรหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-3">
                  ยืนยันรหัสผ่านใหม่
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none relative block w-full px-4 py-3.5 pr-12 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium"
                    placeholder="กรอกรหัสผ่านอีกครั้ง"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-soft hover:shadow-medium transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'เปลี่ยนรหัสผ่าน'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ลิงก์ไม่ถูกต้อง
              </h3>
              <p className="text-gray-600 font-medium mb-6">
                ลิงก์นี้ไม่ถูกต้องหรือหมดอายุแล้ว
              </p>
              <Link
                to="/forgot-password"
                className="inline-block bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-soft hover:shadow-medium transform hover:-translate-y-0.5 font-semibold"
              >
                ขอลิงก์ใหม่
              </Link>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link
            to="/login"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            ← กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  )
}