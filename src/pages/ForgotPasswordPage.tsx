import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FileText, Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await resetPassword(email)
      if (error) {
        if (error.message.includes('not found')) {
          setError('ไม่พบอีเมลนี้ในระบบ กรุณาตรวจสอบอีเมลอีกครั้ง')
        } else {
          setError('เกิดข้อผิดพลาดในการส่งอีเมล กรุณาลองใหม่อีกครั้ง')
        }
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    } finally {
      setLoading(false)
    }
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
              ส่งอีเมลสำเร็จ!
            </h2>
            <p className="text-gray-600 font-medium mb-8 leading-relaxed">
              เราได้ส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปยังอีเมล <strong>{email}</strong> แล้ว
              <br />
              กรุณาตรวจสอบกล่องจดหมายของคุณ
            </p>
            
            {/* เปลี่ยนไอคอนเป็น Mail */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">
                    ไม่เห็นอีเมล?
                  </h4>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    ลองตรวจสอบในโฟลเดอร์ Spam หรือ Junk Mail ของคุณ
                  </p>
                </div>
              </div>
            </div>
            
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors font-semibold"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>กลับไปหน้าเข้าสู่ระบบ</span>
            </Link>
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
            ลืมรหัสผ่าน?
          </h2>
          <p className="mt-3 text-sm text-gray-600 font-medium leading-relaxed">
            กรอกอีเมลของคุณ เราจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านให้
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-medium border border-gray-100/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                อีเมล
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3.5 pl-12 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium"
                  placeholder="กรอกอีเมลของคุณ"
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                  'ส่งลิงก์รีเซ็ตรหัสผ่าน'
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center space-y-4">
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>กลับไปหน้าเข้าสู่ระบบ</span>
          </Link>
          <div className="text-sm text-gray-500">
            ยังไม่มีบัญชี?{' '}
            <Link
              to="/signup"
              className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
            >
              ลงทะเบียนที่นี่
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}