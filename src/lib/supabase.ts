import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper types
export type Document = Database['public']['Tables']['documents']['Row']
export type DocumentInsert = Database['public']['Tables']['documents']['Insert']
export type DocumentUpdate = Database['public']['Tables']['documents']['Update']

export type Notification = Database['public']['Tables']['notifications']['Row']
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert']
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update']

export type UserSettings = Database['public']['Tables']['user_settings']['Row']
export type UserSettingsInsert = Database['public']['Tables']['user_settings']['Insert']
export type UserSettingsUpdate = Database['public']['Tables']['user_settings']['Update']

export type DocumentType = Database['public']['Enums']['document_type']
export type DocumentStatus = Database['public']['Enums']['document_status']
export type NotificationType = Database['public']['Enums']['notification_type']

// Document type labels in Thai
export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  lease_purchase: 'สัญญาเช่า-ซื้อ',
  license: 'ใบอนุญาติ',
  certificate: 'ใบรับรอง'
}

// Document status labels in Thai
export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  active: 'ปกติ',
  expiring_soon: 'ใกล้หมดอายุ',
  expired: 'หมดอายุแล้ว'
}

// Notification type labels in Thai
export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  expiry_warning: 'แจ้งเตือนใกล้หมดอายุ',
  expired: 'แจ้งเตือนหมดอายุ'
}