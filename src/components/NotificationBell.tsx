import React, { useState } from 'react'
import { Bell, X, CheckCircle, AlertTriangle, Clock, Trash2 } from 'lucide-react'
import { useNotifications } from '../hooks/useNotifications'
import { NOTIFICATION_TYPE_LABELS } from '../lib/supabase'

export function NotificationBell() {
  const { notifications, loading, markAsRead, markAllAsRead, deleteNotification, getUnreadCount } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = getUnreadCount()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'expiry_warning':
        return <Clock className="h-5 w-5 text-orange-500" />
      case 'expired':
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-blue-500" />
    }
  }

  const handleNotificationClick = async (notification: any) => {
    if (!notification.is_read) {
      await markAsRead(notification.id)
    }
  }

  const handleDeleteNotification = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation()
    await deleteNotification(notificationId)
  }

  const recentNotifications = notifications.slice(0, 10)

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-strong border border-gray-100 z-50 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">การแจ้งเตือน</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    อ่านทั้งหมด
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-80">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Bell className="h-6 w-6 text-gray-400 animate-pulse" />
                  </div>
                  <p className="text-gray-600 font-medium">กำลังโหลด...</p>
                </div>
              ) : recentNotifications.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {recentNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`
                        p-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer group
                        ${!notification.is_read ? 'bg-blue-50/50' : ''}
                      `}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={`
                                text-sm font-semibold leading-tight
                                ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'}
                              `}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {formatDate(notification.created_at)}
                              </p>
                            </div>
                            
                            <button
                              onClick={(e) => handleDeleteNotification(e, notification.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 ml-2"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                          
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-gray-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    ไม่มีการแจ้งเตือน
                  </h4>
                  <p className="text-xs text-gray-600">
                    คุณไม่มีการแจ้งเตือนใหม่ในขณะนี้
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 10 && (
              <div className="p-3 border-t border-gray-100 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                  ดูการแจ้งเตือนทั้งหมด
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}