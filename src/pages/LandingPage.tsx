import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, Bell, Shield, Clock, Upload, Mail, Sparkles } from 'lucide-react'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-teal-50/50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl shadow-soft border-b border-gray-100/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center shadow-soft">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Smart Contract Tracker
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium px-3 py-1.5 rounded-lg hover:bg-gray-50 text-sm"
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-1.5 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-soft hover:shadow-medium transform hover:-translate-y-0.5 font-semibold text-sm"
              >
                ลงทะเบียน
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 border border-blue-100">
              <Sparkles className="h-3 w-3" />
              <span>ขับเคลื่อนด้วย AI</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              จัดการเอกสารสัญญา
              <span className="block text-2xl lg:text-3xl bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mt-1">
                อย่างฉลาดและปลอดภัย
              </span>
            </h2>
            <p className="text-base text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
              ระบบจัดการเอกสารสัญญาด้วย AI ที่ช่วยติดตามวันหมดอายุและแจ้งเตือนล่วงหน้า <br />เพื่อให้คุณไม่พลาดกำหนดสำคัญอีกต่อไป
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-medium hover:shadow-strong transform hover:-translate-y-0.5"
              >
                เริ่มใช้งานฟรี
              </Link>
              <Link
                to="/login"
                className="bg-white text-gray-700 px-6 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-soft hover:shadow-medium transform hover:-translate-y-0.5"
              >
                เข้าสู่ระบบ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              ฟีเจอร์ที่ครบครัน
            </h3>
            <p className="text-base text-gray-600 font-medium">
              ทุกสิ่งที่คุณต้องการสำหรับการจัดการเอกสารสัญญา
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-100/50 group">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Upload className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                อัปโหลดเอกสาร
              </h4>
              <p className="text-gray-600 font-medium leading-relaxed text-sm">
                รองรับไฟล์ PDF และ PNG สำหรับเอกสารสัญญาและใบอนุญาตต่างๆ
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-100/50 group">
              <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-5 w-5 text-teal-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                AI จับวันหมดอายุ
              </h4>
              <p className="text-gray-600 font-medium leading-relaxed text-sm">
                ระบบ AI อ่านเอกสารและระบุวันหมดอายุโดยอัตโนมัติ
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-100/50 group">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Bell className="h-5 w-5 text-orange-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                แจ้งเตือนล่วงหน้า
              </h4>
              <p className="text-gray-600 font-medium leading-relaxed text-sm">
                ตั้งค่าการแจ้งเตือนล่วงหน้าตามที่คุณต้องการ
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-100/50 group">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Mail className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                แจ้งเตือนทางอีเมล
              </h4>
              <p className="text-gray-600 font-medium leading-relaxed text-sm">
                รับการแจ้งเตือนผ่านอีเมลเมื่อใกล้วันหมดอายุ
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-100/50 group">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                จัดหมวดหมู่
              </h4>
              <p className="text-gray-600 font-medium leading-relaxed text-sm">
                แยกประเภทเป็น สัญญาเช่า-ซื้อ ใบอนุญาติ <br />และใบรับรอง
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-100/50 group">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                ปลอดภัยสูง
              </h4>
              <p className="text-gray-600 font-medium leading-relaxed text-sm">
                เข้ารหัสข้อมูลและเก็บไฟล์อย่างปลอดภัย<br />ในระบบคลาวด์
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-teal-600 relative overflow-hidden">
        <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20`}></div>
        <div className="max-w-4xl mx-auto text-center px-6 relative">
          <h3 className="text-2xl font-bold text-white mb-4">
            พร้อมที่จะเริ่มจัดการเอกสารอย่างฉลาดแล้วหรือยัง?
          </h3>
          <p className="text-lg text-blue-100 mb-6 font-medium">
            เริ่มใช้งานฟรีวันนี้ ไม่ต้องผูกมัดระยะยาว
          </p>
          <Link
            to="/signup"
            className="bg-white text-blue-600 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all duration-200 shadow-medium hover:shadow-strong transform hover:-translate-y-0.5 inline-block"
          >
            ลงทะเบียนเลย
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-4">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <FileText className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-semibold">Smart Contract Tracker</span>
            </div>
            <p className="text-gray-400 text-xs font-medium">
              © 2024 Smart Contract Tracker. สงวนลิขสิทธิ์
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}