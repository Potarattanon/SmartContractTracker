import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, Bell, Shield, Clock, Upload, Mail, Sparkles } from 'lucide-react'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-teal-50/50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl shadow-soft border-b border-gray-100/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center shadow-soft">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Smart Contract Tracker
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium px-4 py-2 rounded-xl hover:bg-gray-50"
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-2.5 rounded-xl hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-soft hover:shadow-medium transform hover:-translate-y-0.5 font-semibold"
              >
                ลงทะเบียน
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-8 border border-blue-100">
              <Sparkles className="h-4 w-4" />
              <span>ขับเคลื่อนด้วย AI</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              จัดการเอกสารสัญญา
              <span className="block text-3xl lg:text-4xl bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mt-2">
                อย่างฉลาดและปลอดภัย
              </span>
            </h2>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              ระบบจัดการเอกสารสัญญาด้วย AI ที่ช่วยติดตามวันหมดอายุและแจ้งเตือนล่วงหน้า <br />เพื่อให้คุณไม่พลาดกำหนดสำคัญอีกต่อไป
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-medium hover:shadow-strong transform hover:-translate-y-1"
              >
                เริ่มใช้งานฟรี
              </Link>
              <Link
                to="/login"
                className="bg-white text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-soft hover:shadow-medium transform hover:-translate-y-1"
              >
                เข้าสู่ระบบ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              ฟีเจอร์ที่ครบครัน
            </h3>
            <p className="text-lg text-gray-600 font-medium">
              ทุกสิ่งที่คุณต้องการสำหรับการจัดการเอกสารสัญญา
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-100/50 group">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                อัปโหลดเอกสาร
              </h4>
              <p className="text-gray-600 font-medium leading-relaxed">
                รองรับไฟล์ PDF และ PNG สำหรับเอกสารสัญญาและใบอนุญาตต่างๆ
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-100/50 group">
              <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-6 w-6 text-teal-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                AI จับวันหมดอายุ
              </h4>
              <p className="text-gray-600 font-medium leading-relaxed">
                ระบบ AI อ่านเอกสารและระบุวันหมดอายุโดยอัตโนมัติ
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-100/50 group">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Bell className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                แจ้งเตือนล่วงหน้า
              </h4>
              <p className="text-gray-600 font-medium leading-relaxed">
                ตั้งค่าการแจ้งเตือนล่วงหน้าตามที่คุณต้องการ
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-100/50 group">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                แจ้งเตือนทางอีเมล
              </h4>
              <p className="text-gray-600 font-medium leading-relaxed">
                รับการแจ้งเตือนผ่านอีเมลเมื่อใกล้วันหมดอายุ
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-100/50 group">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                จัดหมวดหมู่
              </h4>
              <p className="text-gray-600 font-medium leading-relaxed">
                แยกประเภทเป็น สัญญาเช่า-ซื้อ <br />ใบอนุญาติ และใบรับรอง
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-100/50 group">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                ปลอดภัยสูง
              </h4>
              <p className="text-gray-600 font-medium leading-relaxed">
                เข้ารหัสข้อมูลและเก็บไฟล์อย่างปลอดภัยในระบบคลาวด์
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600 relative overflow-hidden">
        <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20`}></div>
        <div className="max-w-4xl mx-auto text-center px-6 relative">
          <h3 className="text-3xl font-bold text-white mb-6">
            พร้อมที่จะเริ่มจัดการเอกสารอย่างฉลาดแล้วหรือยัง?
          </h3>
          <p className="text-xl text-blue-100 mb-8 font-medium">
            เริ่มใช้งานฟรีวันนี้ ไม่ต้องผูกมัดระยะยาว
          </p>
          <Link
            to="/signup"
            className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-200 shadow-medium hover:shadow-strong transform hover:-translate-y-1 inline-block"
          >
            ลงทะเบียนเลย
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <FileText className="h-3.5 w-3.5 text-white" />
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