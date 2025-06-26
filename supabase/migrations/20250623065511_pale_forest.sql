/*
  # Complete Database Schema Setup

  1. Custom Types
    - `document_type` enum for document categories
    - `document_status` enum for document status
    - `notification_type` enum for notification types

  2. Tables
    - `documents` - stores document information
    - `notifications` - stores user notifications
    - `user_settings` - stores user preferences

  3. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data

  4. Functions
    - Document statistics function
    - Status update functions
    - Notification creation functions

  5. Storage
    - Document storage bucket with policies
*/

-- Create custom types (only if they don't exist)
DO $$ BEGIN
  CREATE TYPE document_type AS ENUM ('lease_purchase', 'license', 'certificate');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE document_status AS ENUM ('active', 'expired', 'expiring_soon');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM ('expiry_warning', 'expired');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_type text NOT NULL CHECK (file_type IN ('PDF', 'PNG')),
  file_size bigint NOT NULL,
  document_type document_type NOT NULL,
  expiry_date date,
  ai_extracted_data jsonb DEFAULT '{}'::jsonb,
  status document_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'documents_user_id_fkey'
  ) THEN
    ALTER TABLE documents ADD CONSTRAINT documents_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  document_id uuid,
  type notification_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  scheduled_for timestamptz,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Add foreign key constraints for notifications if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'notifications_user_id_fkey'
  ) THEN
    ALTER TABLE notifications ADD CONSTRAINT notifications_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'notifications_document_id_fkey'
  ) THEN
    ALTER TABLE notifications ADD CONSTRAINT notifications_document_id_fkey 
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  notification_days_before integer[] DEFAULT ARRAY[7, 3, 1],
  email_notifications boolean DEFAULT true,
  browser_notifications boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add unique constraint and foreign key for user_settings if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_settings_user_id_key'
  ) THEN
    ALTER TABLE user_settings ADD CONSTRAINT user_settings_user_id_key UNIQUE (user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_settings_user_id_fkey'
  ) THEN
    ALTER TABLE user_settings ADD CONSTRAINT user_settings_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for documents (drop existing ones first)
DROP POLICY IF EXISTS "Users can view own documents" ON documents;
DROP POLICY IF EXISTS "Users can insert own documents" ON documents;
DROP POLICY IF EXISTS "Users can update own documents" ON documents;
DROP POLICY IF EXISTS "Users can delete own documents" ON documents;

CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents"
  ON documents FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON documents FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for notifications (drop existing ones first)
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can insert own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for user_settings (drop existing ones first)
DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;

CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_document_type ON documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_expiry_date ON documents(expiry_date);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_document_id ON notifications(document_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at (drop existing ones first)
DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to get document statistics
CREATE OR REPLACE FUNCTION get_document_stats(user_uuid uuid)
RETURNS TABLE (
  total_documents bigint,
  active_documents bigint,
  expiring_soon_documents bigint,
  expired_documents bigint,
  lease_purchase_documents bigint,
  license_documents bigint,
  certificate_documents bigint,
  unread_notifications bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_documents,
    COUNT(*) FILTER (WHERE status = 'active')::bigint as active_documents,
    COUNT(*) FILTER (WHERE status = 'expiring_soon')::bigint as expiring_soon_documents,
    COUNT(*) FILTER (WHERE status = 'expired')::bigint as expired_documents,
    COUNT(*) FILTER (WHERE document_type = 'lease_purchase')::bigint as lease_purchase_documents,
    COUNT(*) FILTER (WHERE document_type = 'license')::bigint as license_documents,
    COUNT(*) FILTER (WHERE document_type = 'certificate')::bigint as certificate_documents,
    (SELECT COUNT(*)::bigint FROM notifications WHERE notifications.user_id = user_uuid AND is_read = false) as unread_notifications
  FROM documents 
  WHERE documents.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update document status based on expiry date
CREATE OR REPLACE FUNCTION update_document_status()
RETURNS void AS $$
BEGIN
  -- Update expired documents
  UPDATE documents 
  SET status = 'expired'
  WHERE expiry_date < CURRENT_DATE 
    AND status != 'expired';

  -- Update expiring soon documents (within 30 days)
  UPDATE documents 
  SET status = 'expiring_soon'
  WHERE expiry_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '30 days')
    AND status = 'active';

  -- Update back to active if expiry date is extended
  UPDATE documents 
  SET status = 'active'
  WHERE expiry_date > (CURRENT_DATE + INTERVAL '30 days')
    AND status = 'expiring_soon';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to create expiry notifications
CREATE OR REPLACE FUNCTION create_expiry_notifications()
RETURNS void AS $$
DECLARE
  doc_record RECORD;
  setting_record RECORD;
  notification_day INTEGER;
  notification_date DATE;
BEGIN
  -- Loop through all documents that have expiry dates
  FOR doc_record IN 
    SELECT d.*, u.notification_days_before, u.email_notifications
    FROM documents d
    JOIN user_settings u ON d.user_id = u.user_id
    WHERE d.expiry_date IS NOT NULL
      AND d.status IN ('active', 'expiring_soon')
  LOOP
    -- Loop through notification days for this user
    FOREACH notification_day IN ARRAY doc_record.notification_days_before
    LOOP
      notification_date := doc_record.expiry_date - notification_day;
      
      -- Create notification if it's time and doesn't exist yet
      IF notification_date = CURRENT_DATE THEN
        INSERT INTO notifications (
          user_id,
          document_id,
          type,
          title,
          message,
          scheduled_for,
          sent_at
        )
        SELECT 
          doc_record.user_id,
          doc_record.id,
          'expiry_warning',
          'เอกสาร "' || doc_record.title || '" ใกล้หมดอายุ',
          'เอกสาร "' || doc_record.title || '" จะหมดอายุในอีก ' || notification_day || ' วัน (วันที่ ' || doc_record.expiry_date || ')',
          now(),
          now()
        WHERE NOT EXISTS (
          SELECT 1 FROM notifications 
          WHERE document_id = doc_record.id 
            AND type = 'expiry_warning'
            AND DATE(created_at) = CURRENT_DATE
        );
      END IF;
    END LOOP;

    -- Create expired notification
    IF doc_record.expiry_date = CURRENT_DATE THEN
      INSERT INTO notifications (
        user_id,
        document_id,
        type,
        title,
        message,
        scheduled_for,
        sent_at
      )
      SELECT 
        doc_record.user_id,
        doc_record.id,
        'expired',
        'เอกสาร "' || doc_record.title || '" หมดอายุแล้ว',
        'เอกสาร "' || doc_record.title || '" หมดอายุวันนี้ กรุณาดำเนินการต่ออายุ',
        now(),
        now()
      WHERE NOT EXISTS (
        SELECT 1 FROM notifications 
        WHERE document_id = doc_record.id 
          AND type = 'expired'
          AND DATE(created_at) = CURRENT_DATE
      );
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create storage bucket for documents (only if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for documents bucket (drop existing ones first)
DROP POLICY IF EXISTS "Users can upload own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own documents" ON storage.objects;

CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);