/*
  # Smart Contract Tracker Database Schema

  1. New Tables
    - `documents`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text, document title)
      - `description` (text, optional description)
      - `file_name` (text, original file name)
      - `file_path` (text, storage path)
      - `file_type` (text, PDF/PNG)
      - `file_size` (bigint, file size in bytes)
      - `document_type` (enum, lease_purchase/license/certificate)
      - `expiry_date` (date, expiration date)
      - `ai_extracted_data` (jsonb, AI extracted information)
      - `status` (enum, active/expired/expiring_soon)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `document_id` (uuid, foreign key to documents)
      - `type` (enum, expiry_warning/expired)
      - `title` (text, notification title)
      - `message` (text, notification message)
      - `is_read` (boolean, read status)
      - `scheduled_for` (timestamp, when to send notification)
      - `sent_at` (timestamp, when notification was sent)
      - `created_at` (timestamp)

    - `user_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `notification_days_before` (integer[], days before expiry to notify)
      - `email_notifications` (boolean, enable email notifications)
      - `browser_notifications` (boolean, enable browser notifications)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Add policies for CRUD operations

  3. Functions
    - Function to update document status based on expiry date
    - Function to create notifications for expiring documents
    - Trigger to automatically update timestamps
*/

-- Create custom types
CREATE TYPE document_type AS ENUM ('lease_purchase', 'license', 'certificate');
CREATE TYPE document_status AS ENUM ('active', 'expired', 'expiring_soon');
CREATE TYPE notification_type AS ENUM ('expiry_warning', 'expired');

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_type text NOT NULL CHECK (file_type IN ('PDF', 'PNG')),
  file_size bigint NOT NULL,
  document_type document_type NOT NULL,
  expiry_date date,
  ai_extracted_data jsonb DEFAULT '{}',
  status document_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  scheduled_for timestamptz,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  notification_days_before integer[] DEFAULT ARRAY[7, 3, 1],
  email_notifications boolean DEFAULT true,
  browser_notifications boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for documents table
CREATE POLICY "Users can view own documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents"
  ON documents
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON documents
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for notifications table
CREATE POLICY "Users can view own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON notifications
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for user_settings table
CREATE POLICY "Users can view own settings"
  ON user_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_expiry_date ON documents(expiry_date);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_document_type ON documents(document_type);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_document_id ON notifications(document_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Function to update document status based on expiry date
CREATE OR REPLACE FUNCTION update_document_status()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update expired documents
  UPDATE documents 
  SET status = 'expired', updated_at = now()
  WHERE expiry_date < CURRENT_DATE 
    AND status != 'expired';

  -- Update expiring soon documents (within 30 days)
  UPDATE documents 
  SET status = 'expiring_soon', updated_at = now()
  WHERE expiry_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '30 days')
    AND expiry_date >= CURRENT_DATE
    AND status != 'expiring_soon';

  -- Update active documents
  UPDATE documents 
  SET status = 'active', updated_at = now()
  WHERE expiry_date > (CURRENT_DATE + INTERVAL '30 days')
    AND status != 'active';
END;
$$;

-- Function to create notifications for expiring documents
CREATE OR REPLACE FUNCTION create_expiry_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  doc_record RECORD;
  setting_record RECORD;
  notification_day INTEGER;
  notification_date DATE;
BEGIN
  -- Loop through all documents with expiry dates
  FOR doc_record IN 
    SELECT d.*, u.email 
    FROM documents d
    JOIN auth.users u ON d.user_id = u.id
    WHERE d.expiry_date IS NOT NULL
      AND d.expiry_date >= CURRENT_DATE
  LOOP
    -- Get user notification settings
    SELECT * INTO setting_record
    FROM user_settings
    WHERE user_id = doc_record.user_id;

    -- If no settings found, use default
    IF setting_record IS NULL THEN
      INSERT INTO user_settings (user_id) VALUES (doc_record.user_id);
      SELECT * INTO setting_record FROM user_settings WHERE user_id = doc_record.user_id;
    END IF;

    -- Create notifications for each configured day
    FOREACH notification_day IN ARRAY setting_record.notification_days_before
    LOOP
      notification_date := doc_record.expiry_date - notification_day;
      
      -- Only create notification if the date is today or in the future
      IF notification_date >= CURRENT_DATE THEN
        -- Check if notification already exists
        IF NOT EXISTS (
          SELECT 1 FROM notifications 
          WHERE document_id = doc_record.id 
            AND type = 'expiry_warning'
            AND scheduled_for::date = notification_date
        ) THEN
          INSERT INTO notifications (
            user_id,
            document_id,
            type,
            title,
            message,
            scheduled_for
          ) VALUES (
            doc_record.user_id,
            doc_record.id,
            'expiry_warning',
            'เอกสาร "' || doc_record.title || '" ใกล้หมดอายุ',
            'เอกสาร "' || doc_record.title || '" จะหมดอายุในวันที่ ' || 
            to_char(doc_record.expiry_date, 'DD/MM/YYYY') || 
            ' (อีก ' || notification_day || ' วัน)',
            notification_date::timestamptz
          );
        END IF;
      END IF;
    END LOOP;
  END LOOP;

  -- Create expired notifications
  FOR doc_record IN 
    SELECT d.*, u.email 
    FROM documents d
    JOIN auth.users u ON d.user_id = u.id
    WHERE d.expiry_date < CURRENT_DATE
      AND d.status = 'expired'
  LOOP
    -- Check if expired notification already exists
    IF NOT EXISTS (
      SELECT 1 FROM notifications 
      WHERE document_id = doc_record.id 
        AND type = 'expired'
    ) THEN
      INSERT INTO notifications (
        user_id,
        document_id,
        type,
        title,
        message,
        scheduled_for,
        sent_at
      ) VALUES (
        doc_record.user_id,
        doc_record.id,
        'expired',
        'เอกสาร "' || doc_record.title || '" หมดอายุแล้ว',
        'เอกสาร "' || doc_record.title || '" หมดอายุเมื่อวันที่ ' || 
        to_char(doc_record.expiry_date, 'DD/MM/YYYY'),
        now(),
        now()
      );
    END IF;
  END LOOP;
END;
$$;

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create a function to get document statistics
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
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT count(*) FROM documents WHERE user_id = user_uuid),
    (SELECT count(*) FROM documents WHERE user_id = user_uuid AND status = 'active'),
    (SELECT count(*) FROM documents WHERE user_id = user_uuid AND status = 'expiring_soon'),
    (SELECT count(*) FROM documents WHERE user_id = user_uuid AND status = 'expired'),
    (SELECT count(*) FROM documents WHERE user_id = user_uuid AND document_type = 'lease_purchase'),
    (SELECT count(*) FROM documents WHERE user_id = user_uuid AND document_type = 'license'),
    (SELECT count(*) FROM documents WHERE user_id = user_uuid AND document_type = 'certificate'),
    (SELECT count(*) FROM notifications WHERE user_id = user_uuid AND is_read = false);
END;
$$;