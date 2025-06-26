export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      documents: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          file_name: string
          file_path: string
          file_type: string
          file_size: number
          document_type: 'lease_purchase' | 'license' | 'certificate'
          expiry_date: string | null
          ai_extracted_data: Json
          status: 'active' | 'expired' | 'expiring_soon'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          file_name: string
          file_path: string
          file_type: string
          file_size: number
          document_type: 'lease_purchase' | 'license' | 'certificate'
          expiry_date?: string | null
          ai_extracted_data?: Json
          status?: 'active' | 'expired' | 'expiring_soon'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          file_name?: string
          file_path?: string
          file_type?: string
          file_size?: number
          document_type?: 'lease_purchase' | 'license' | 'certificate'
          expiry_date?: string | null
          ai_extracted_data?: Json
          status?: 'active' | 'expired' | 'expiring_soon'
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          document_id: string | null
          type: 'expiry_warning' | 'expired'
          title: string
          message: string
          is_read: boolean
          scheduled_for: string | null
          sent_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          document_id?: string | null
          type: 'expiry_warning' | 'expired'
          title: string
          message: string
          is_read?: boolean
          scheduled_for?: string | null
          sent_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          document_id?: string | null
          type?: 'expiry_warning' | 'expired'
          title?: string
          message?: string
          is_read?: boolean
          scheduled_for?: string | null
          sent_at?: string | null
          created_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          notification_days_before: number[]
          email_notifications: boolean
          browser_notifications: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          notification_days_before?: number[]
          email_notifications?: boolean
          browser_notifications?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          notification_days_before?: number[]
          email_notifications?: boolean
          browser_notifications?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_document_stats: {
        Args: {
          user_uuid: string
        }
        Returns: {
          total_documents: number
          active_documents: number
          expiring_soon_documents: number
          expired_documents: number
          lease_purchase_documents: number
          license_documents: number
          certificate_documents: number
          unread_notifications: number
        }[]
      }
      update_document_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_expiry_notifications: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      document_status: 'active' | 'expired' | 'expiring_soon'
      document_type: 'lease_purchase' | 'license' | 'certificate'
      notification_type: 'expiry_warning' | 'expired'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}