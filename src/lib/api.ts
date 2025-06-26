// ไฟล์ใหม่สำหรับจัดการ API calls
export interface AIProcessingRequest {
  file_url: string
  file_type: 'PDF' | 'PNG'
  document_type: 'lease_purchase' | 'license' | 'certificate' | 'auto'
  document_id: string
}

export interface AIProcessingResponse {
  success: boolean
  data?: {
    expiry_date: string | null
    issue_date: string | null
    document_number: string | null
    holder_name: string | null
    issuing_authority: string | null
    confidence_score: number
    extracted_text: string
    document_type?: 'lease_purchase' | 'license' | 'certificate' // AI จะส่งประเภทที่จัดให้มา
  }
  error?: string
}

export interface BackendResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Configuration สำหรับ API endpoints
const API_CONFIG = {
  // ใช้ environment variable หรือ default localhost
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  ENDPOINTS: {
    PROCESS_DOCUMENT: '/api/process-document',
    HEALTH_CHECK: '/api/health',
    DOCUMENT_STATUS: '/api/document-status'
  }
}

// Helper function สำหรับ API calls
async function apiCall<T = any>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<BackendResponse<T>> {
  try {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('API call failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

// ฟังก์ชันสำหรับส่งเอกสารไป AI processing
export async function processDocumentWithAI(
  request: AIProcessingRequest
): Promise<AIProcessingResponse> {
  const response = await apiCall<AIProcessingResponse['data']>(
    API_CONFIG.ENDPOINTS.PROCESS_DOCUMENT,
    {
      method: 'POST',
      body: JSON.stringify(request)
    }
  )

  return {
    success: response.success,
    data: response.data,
    error: response.error
  }
}

// ฟังก์ชันตรวจสอบสถานะ Backend
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await apiCall(API_CONFIG.ENDPOINTS.HEALTH_CHECK)
    return response.success
  } catch {
    return false
  }
}

// ฟังก์ชันตรวจสอบสถานะการประมวลผลเอกสาร
export async function getDocumentProcessingStatus(
  documentId: string
): Promise<BackendResponse<{ status: string; progress: number }>> {
  return apiCall(`${API_CONFIG.ENDPOINTS.DOCUMENT_STATUS}/${documentId}`)
}