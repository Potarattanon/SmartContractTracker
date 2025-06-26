import { useState, useEffect } from 'react'
import { supabase, UserSettings, UserSettingsInsert, UserSettingsUpdate } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useUserSettings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch user settings
  const fetchSettings = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error
      }

      setSettings(data || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดการตั้งค่า')
    } finally {
      setLoading(false)
    }
  }

  // Create or update settings
  const updateSettings = async (updates: Partial<UserSettingsUpdate>) => {
    if (!user) throw new Error('ไม่พบข้อมูลผู้ใช้')

    try {
      if (settings) {
        // Update existing settings
        const { data, error } = await supabase
          .from('user_settings')
          .update(updates)
          .eq('user_id', user.id)
          .select()
          .single()

        if (error) throw error
        setSettings(data)
        return data
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('user_settings')
          .insert({ ...updates, user_id: user.id } as UserSettingsInsert)
          .select()
          .single()

        if (error) throw error
        setSettings(data)
        return data
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการอัปเดตการตั้งค่า'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Get default settings
  const getDefaultSettings = (): UserSettingsInsert => ({
    user_id: user?.id || '',
    notification_days_before: [7, 3, 1],
    email_notifications: true,
    browser_notifications: true
  })

  useEffect(() => {
    fetchSettings()
  }, [user])

  return {
    settings: settings || getDefaultSettings(),
    loading,
    error,
    fetchSettings,
    updateSettings
  }
}