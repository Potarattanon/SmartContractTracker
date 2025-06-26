import { useState } from 'react'
import { processDocumentWithAI, AIProcessingRequest, AIProcessingResponse } from '../lib/api'
import { supabase } from '../lib/supabase'

export interface ProcessingStatus {
  isProcessing: boolean
  progress: number
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error'
  error?: string
}

export function useAIProcessing() {
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    isProcessing: false,
    progress: 0,
    status: 'idle'
  })

  const processDocument = async (
    documentId: string,
    filePath: string,
    fileType: 'PDF' | 'PNG',
    documentType: 'lease_purchase' | 'license' | 'certificate' | 'auto'
  ): Promise<AIProcessingResponse> => {
    try {
      setProcessingStatus({
        isProcessing: true,
        progress: 10,
        status: 'uploading'
      })

      // สร้าง signed URL สำหรับ AI Service
      const { data: urlData, error: urlError } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 3600) // 1 ชั่วโมง

      if (urlError || !urlData?.signedUrl) {
        throw new Error('ไม่สามารถสร้าง URL สำหรับประมวลผลได้')
      }

      setProcessingStatus(prev => ({
        ...prev,
        progress: 30,
        status: 'processing'
      }))

      // เรียก AI Service
      const aiRequest: AIProcessingRequest = {
        file_url: urlData.signedUrl,
        file_type: fileType,
        document_type: documentType === 'auto' ? 'license' : documentType, // ส่งค่าเริ่มต้น แต่ AI จะตัดสินใจเอง
        document_id: documentId
      }

      const result = await processDocumentWithAI(aiRequest)

      setProcessingStatus(prev => ({
        ...prev,
        progress: 80
      }))

      if (result.success && result.data) {
        // อัปเดตเอกสารด้วยข้อมูลจาก AI รวมถึงประเภทเอกสารที่ AI จัดให้
        const updateData: any = {
          expiry_date: result.data.expiry_date,
          ai_extracted_data: result.data,
          status: result.data.expiry_date ? 'active' : 'active' // จะมีการคำนวณสถานะจริงใน backend
        }

        // ถ้า AI ส่งประเภทเอกสารมา ให้อัปเดตด้วย
        if (result.data.document_type) {
          updateData.document_type = result.data.document_type
        }

        const { error: updateError } = await supabase
          .from('documents')
          .update(updateData)
          .eq('id', documentId)

        if (updateError) {
          throw new Error('ไม่สามารถอัปเดตข้อมูลเอกสารได้')
        }

        setProcessingStatus({
          isProcessing: false,
          progress: 100,
          status: 'completed'
        })

        return result
      } else {
        throw new Error(result.error || 'AI ไม่สามารถประมวลผลเอกสารได้')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการประมวลผล'
      
      setProcessingStatus({
        isProcessing: false,
        progress: 0,
        status: 'error',
        error: errorMessage
      })

      return {
        success: false,
        error: errorMessage
      }
    }
  }

  const resetProcessing = () => {
    setProcessingStatus({
      isProcessing: false,
      progress: 0,
      status: 'idle'
    })
  }

  return {
    processingStatus,
    processDocument,
    resetProcessing
  }
}