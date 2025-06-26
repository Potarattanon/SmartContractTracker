import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useUserSettings } from '../hooks/useUserSettings'
import { NotificationBell } from '../components/NotificationBell'
import { 
  FileText, 
  Settings, 
  LogOut, 
  ArrowLeft, 
  Bell, 
  Mail, 
  Save, 
  Loader2,
  CheckCircle,
  AlertCircle,
  User,
  Shield
} from 'lucide-react'

export function SettingsPage() {
  const { user, signOut } = useAuth()
  const { settings, loading, updateSettings } = useUserSettings()
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    notification_days_before: [7, 3, 1],
    email_notifications: true,
    browser_notifications: true
  })

  // Update form data when settings load
  useEffect(() => {
    if (settings) {
      setFormData({
        notification_days_before: settings.notification_days_before || [7, 3, 1],
        email_notifications: settings.email_notifications ?? true,
        browser_notifications: settings.browser_notifications ?? true
      })
    }
  }, [settings])

  const handleSignOut = async () => {
    await signOut()
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveMessage(null)

    try {
      await updateSettings(formData)
      setSaveMessage({ type: 'success', text: 'บันทึกการตั้งค่าเรียบร้อยแล้ว' })
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage(null)
      }, 3000)
    } catch (error) {
      setSaveMessage({ 
        type: 'error', 
        text: 'เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่อีกครั้ง' 
      })
    } finally {
      setSaving(false)
    }
  }

  const handleNotificationDaysChange = (days: number[]) => {
    setFormData(prev => ({
      ...prev,
      notification_days_before: days
    }))
  }

  const addNotificationDay = (day: number) => {
    if (!formData.notification_days_before.includes(day)) {
      const newDays = [...formData.notification_days_before, day].sort((a, b) => b - a)
      handleNotificationDaysChange(newDays)
    }
  }

  const removeNotificationDay = (day: number) => {
    const newDays = formData.notification_days_before.filter(d => d !== day)
    if (newDays.length > 0) { // Keep at least one notification day
      handleNotificationDaysChange(newDays)
    }
  }

  const presetDays = [1, 3, 7, 14, 30, 60, 90]

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center shadow-soft">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Smart Contract Tracker
                </h1>
                <p className="text-xs text-gray-500 font-medium">ยินดีต้อนรับ, {user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <NotificationBell />
              <button className="p-2.5 text-blue-600 bg-blue-50 rounded-xl transition-all duration-200">
                <Settings className="h-4 w-4" />
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
              >
                <LogOut className="h-4 w-4" />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>กลับไปแดชบอร์ด</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            ตั้งค่า
          </h2>
          <p className="text-gray-600 font-medium">
            จัดการการตั้งค่าบัญชีและการแจ้งเตือนของคุณ
          </p>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className={`
            mb-6 p-4 rounded-xl border flex items-center space-x-3
            ${saveMessage.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
            }
          `}>
            {saveMessage.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span className="font-medium">{saveMessage.text}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Account Information */}
          <div className="bg-white rounded-2xl shadow-soft border border-gray-100/50 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">ข้อมูลบัญชี</h3>
                <p className="text-sm text-gray-600">ข้อมูลพื้นฐานของบัญชีผู้ใช้</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  อีเมล
                </label>
                <div className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                  <p className="text-gray-900 font-medium">{user?.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  สถานะบัญชี
                </label>
                <div className="bg-green-50 px-4 py-3 rounded-xl border border-green-200">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-green-800 font-medium">ยืนยันแล้ว</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-2xl shadow-soft border border-gray-100/50 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <Bell className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">การแจ้งเตือน</h3>
                <p className="text-sm text-gray-600">ตั้งค่าการแจ้งเตือนเมื่อเอกสารใกล้หมดอายุ</p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">กำลังโหลดการตั้งค่า...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Notification Types */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">ประเภทการแจ้งเตือน</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.email_notifications}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          email_notifications: e.target.checked
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">แจ้งเตือนทางอีเมล</span>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.browser_notifications}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          browser_notifications: e.target.checked
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">แจ้งเตือนในเว็บไซต์</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Notification Days */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">
                    แจ้งเตือนก่อนหมดอายุ (วัน)
                  </h4>
                  
                  {/* Current notification days */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {formData.notification_days_before.map((day) => (
                        <div
                          key={day}
                          className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200"
                        >
                          <span className="text-sm font-medium">{day} วัน</span>
                          {formData.notification_days_before.length > 1 && (
                            <button
                              onClick={() => removeNotificationDay(day)}
                              className="text-blue-500 hover:text-blue-700 transition-colors"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preset options */}
                  <div>
                    <p className="text-xs text-gray-600 mb-3">เลือกเพิ่มเติม:</p>
                    <div className="flex flex-wrap gap-2">
                      {presetDays
                        .filter(day => !formData.notification_days_before.includes(day))
                        .map((day) => (
                          <button
                            key={day}
                            onClick={() => addNotificationDay(day)}
                            className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            + {day} วัน
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-soft hover:shadow-medium transform hover:-translate-y-0.5 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>กำลังบันทึก...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>บันทึกการตั้งค่า</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}