import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { FileText, Upload, Bell, Settings, LogOut, Plus, TrendingUp } from 'lucide-react'

export function Dashboard() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
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
              <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200">
                <Bell className="h-4 w-4" />
              </button>
              <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200">
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
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            แดชบอร์ด
          </h2>
          <p className="text-gray-600 font-medium">
            จัดการเอกสารสัญญาและติดตามวันหมดอายุของคุณ
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">เอกสารทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide">ใกล้หมดอายุ</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">0</p>
              </div>
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <Bell className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-teal-500 uppercase tracking-wide">สัญญาเช่า-ซื้อ</p>
                <p className="text-2xl font-bold text-teal-600 mt-1">0</p>
              </div>
              <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-purple-500 uppercase tracking-wide">ใบอนุญาติ</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">0</p>
              </div>
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <Settings className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100/50 hover:shadow-medium transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">อัปโหลดเอกสารใหม่</h3>
                  <p className="text-sm text-gray-600 font-medium">
                    เพิ่มเอกสารสัญญาหรือใบอนุญาติใหม่เพื่อให้ AI ช่วยจับวันหมดอายุ
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-soft">
                  <Upload className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">รองรับไฟล์ PDF และ PNG</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="font-medium">AI จับวันหมดอายุอัตโนมัติ</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="font-medium">แจ้งเตือนล่วงหน้าตามที่ตั้งค่า</span>
                </div>
              </div>
              <button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-soft hover:shadow-medium transform hover:-translate-y-0.5 font-semibold">
                เลือกไฟล์เพื่ออัปโหลด
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-5 rounded-2xl border border-orange-100">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Bell className="h-5 w-5 text-orange-600" />
                </div>
                <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">ใหม่</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">การแจ้งเตือน</h3>
              <p className="text-sm text-gray-600 mb-3 font-medium">
                ไม่มีการแจ้งเตือนใหม่
              </p>
              <div className="text-2xl font-bold text-orange-600">0</div>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-5 rounded-2xl border border-teal-100">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                  <FileText className="h-5 w-5 text-teal-600" />
                </div>
                <Plus className="h-4 w-4 text-teal-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">เอกสารที่เก็บ</h3>
              <p className="text-sm text-gray-600 mb-3 font-medium">
                จำนวนเอกสารทั้งหมด
              </p>
              <div className="text-2xl font-bold text-teal-600">0</div>
            </div>
          </div>
        </div>

        {/* Recent Documents */}
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100/50">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                เอกสารล่าสุด
              </h3>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                ดูทั้งหมด
              </button>
            </div>
          </div>
          <div className="p-8">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                ยังไม่มีเอกสาร
              </h4>
              <p className="text-gray-600 mb-8 font-medium max-w-sm mx-auto">
                เริ่มต้นด้วยการอัปโหลดเอกสารแรกของคุณเพื่อให้ AI ช่วยจัดการ
              </p>
              <button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-soft hover:shadow-medium transform hover:-translate-y-0.5 font-semibold">
                อัปโหลดเอกสารแรก
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}