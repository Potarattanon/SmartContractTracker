# Smart Contract Tracker

ระบบจัดการเอกสารสัญญาด้วย AI ที่ช่วยติดตามวันหมดอายุและแจ้งเตือนล่วงหน้า เพื่อให้คุณไม่พลาดกำหนดสำคัญอีกต่อไป

![Smart Contract Tracker](https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## ✨ ฟีเจอร์หลัก

- 📄 **อัปโหลดเอกสาร** - รองรับไฟล์ PDF และ PNG
- 🤖 **AI จับวันหมดอายุ** - ระบบ AI อ่านเอกสารและระบุวันหมดอายุโดยอัตโนมัติ
- 🔔 **แจ้งเตือนล่วงหน้า** - ตั้งค่าการแจ้งเตือนตามที่คุณต้องการ
- 📧 **แจ้งเตือนทางอีเมล** - รับการแจ้งเตือนผ่านอีเมลเมื่อใกล้วันหมดอายุ
- 📂 **จัดหมวดหมู่** - แยกประเภทเป็น สัญญาเช่า-ซื้อ, ใบอนุญาติ, และใบรับรอง
- 🔒 **ปลอดภัยสูง** - เข้ารหัสข้อมูลและเก็บไฟล์อย่างปลอดภัยในระบบคลาวด์
- 🗑️ **จัดการเอกสาร** - ดู, ดาวน์โหลด, และลบเอกสารได้อย่างง่ายดาย
- 📊 **แดชบอร์ดแบบตาราง** - แสดงข้อมูลเอกสารในรูปแบบตารางที่เข้าใจง่าย

## 🏗️ สถาปัตยกรรมระบบ

### Frontend (React + TypeScript)
- **UI/UX**: การจัดการไฟล์และแสดงผล
- **File Management**: อัปโหลดและจัดเก็บไฟล์
- **User Interface**: Dashboard และการแจ้งเตือน
- **Table View**: แสดงเอกสารในรูปแบบตารางที่เป็นระเบียบ

### Backend API (ที่ทีมจะพัฒนา)
- **AI Processing**: ประมวลผลเอกสารด้วย AI
- **Business Logic**: จัดการข้อมูลและกฎธุรกิจ
- **API Endpoints**: รับส่งข้อมูลกับ Frontend

### Database (Supabase)
- **Data Storage**: เก็บข้อมูลเอกสารและผู้ใช้
- **File Storage**: เก็บไฟล์เอกสารต้นฉบับ
- **Authentication**: จัดการการเข้าสู่ระบบ

## 🔗 การทำงานร่วมกับ Backend และ AI

### ขั้นตอนการทำงาน:

1. **Frontend อัปโหลดไฟล์** → Supabase Storage
2. **สร้าง Database Record** → เก็บข้อมูลเบื้องต้น
3. **เรียก AI Service** → ส่ง signed URL ไปประมวลผล
4. **รับผลจาก AI** → อัปเดต database ด้วยข้อมูลที่ดึงได้
5. **แจ้งผู้ใช้** → แสดงผลลัพธ์ในตาราง

### API Contract สำหรับ Backend Team:

#### 1. Process Document Endpoint
```typescript
POST /api/process-document
Content-Type: application/json

// Request Body
{
  "file_url": "https://signed-url-from-supabase",
  "file_type": "PDF" | "PNG",
  "document_type": "lease_purchase" | "license" | "certificate",
  "document_id": "uuid"
}

// Response
{
  "success": true,
  "data": {
    "expiry_date": "2024-12-31",
    "issue_date": "2024-01-01",
    "document_number": "ABC123456",
    "holder_name": "ชื่อผู้ถือเอกสาร",
    "issuing_authority": "หน่วยงานที่ออกเอกสาร",
    "confidence_score": 0.95,
    "extracted_text": "ข้อความที่ดึงได้จากเอกสาร"
  }
}

// Error Response
{
  "success": false,
  "error": "รายละเอียดข้อผิดพลาด"
}
```

#### 2. Health Check Endpoint
```typescript
GET /api/health

// Response
{
  "success": true,
  "message": "Backend is running"
}
```

#### 3. Document Status Endpoint
```typescript
GET /api/document-status/{document_id}

// Response
{
  "success": true,
  "data": {
    "status": "processing" | "completed" | "error",
    "progress": 75
  }
}
```

## 🚀 เทคโนโลยีที่ใช้

### Frontend Stack
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** - สำหรับ styling
- **Supabase Client** - สำหรับ database และ authentication
- **Lucide React** - สำหรับ icons
- **React Router DOM** - สำหรับ routing

### Backend Stack (แนะนำ)
- **FastAPI** หรือ **Express.js** - สำหรับ API server
- **Python** หรือ **Node.js** - สำหรับ AI processing
- **TensorFlow/PyTorch** - สำหรับ AI models
- **OpenCV/Tesseract** - สำหรับ OCR

### Database & Storage
- **Supabase (PostgreSQL)** - สำหรับข้อมูลหลัก
- **Supabase Storage** - สำหรับเก็บไฟล์

## 📋 ความต้องการของระบบ

- Node.js (version 16 หรือใหม่กว่า)
- npm หรือ yarn
- บัญชี Supabase (สำหรับ database และ authentication)
- Backend API Server (สำหรับ AI processing)

## 🛠️ การติดตั้ง

### 1. Clone โปรเจกต์
```bash
git clone <repository-url>
cd smart-contract-tracker
```

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. ตั้งค่า Environment Variables
สร้างไฟล์ `.env` จาก `.env.example`:
```bash
cp .env.example .env
```

แก้ไขไฟล์ `.env`:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend API Configuration
VITE_API_BASE_URL=http://localhost:8000

# Environment
VITE_NODE_ENV=development
```

### 4. รันโปรเจกต์
```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่ `http://localhost:5173`

## 🗄️ การตั้งค่า Supabase

### 1. สร้างโปรเจกต์ใหม่
1. ไปที่ [Supabase](https://supabase.com)
2. สร้างโปรเจกต์ใหม่
3. คัดลอก Project URL และ Anon Key

### 2. ตั้งค่า Authentication
1. ไปที่ Authentication > Settings
2. เปิดใช้งาน Email authentication
3. ปิด Email confirmation (หรือตั้งค่าตามต้องการ)
4. เพิ่ม Site URL: `http://localhost:5173` (สำหรับ development)

### 3. ตั้งค่า Google OAuth (ถ้าต้องการ)
1. ไปที่ Authentication > Providers
2. เปิดใช้งาน Google
3. ใส่ Google Client ID และ Client Secret

### 4. ตั้งค่า Storage
1. ไปที่ Storage
2. สร้าง bucket ชื่อ `documents`
3. ตั้งค่า RLS policies สำหรับการเข้าถึงไฟล์

## 🔧 การพัฒนา Backend

### สำหรับ Backend Team:

#### 1. ตัวอย่าง FastAPI Implementation
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
from typing import Optional

app = FastAPI()

class ProcessDocumentRequest(BaseModel):
    file_url: str
    file_type: str
    document_type: str
    document_id: str

class ProcessDocumentResponse(BaseModel):
    success: bool
    data: Optional[dict] = None
    error: Optional[str] = None

@app.get("/api/health")
async def health_check():
    return {"success": True, "message": "Backend is running"}

@app.post("/api/process-document")
async def process_document(request: ProcessDocumentRequest):
    try:
        # 1. Download file from URL
        response = requests.get(request.file_url)
        if response.status_code != 200:
            raise Exception("Cannot download file")
        
        # 2. Process with AI
        ai_result = await process_with_ai(
            response.content, 
            request.file_type,
            request.document_type
        )
        
        # 3. Return results
        return ProcessDocumentResponse(
            success=True,
            data=ai_result
        )
    except Exception as e:
        return ProcessDocumentResponse(
            success=False,
            error=str(e)
        )

async def process_with_ai(file_content, file_type, document_type):
    # TODO: Implement AI processing logic
    # - OCR for text extraction
    # - Date recognition
    # - Document classification
    # - Confidence scoring
    
    return {
        "expiry_date": "2024-12-31",
        "confidence_score": 0.95,
        "extracted_text": "Sample extracted text"
    }
```

#### 2. ตัวอย่าง Express.js Implementation
```javascript
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Backend is running' });
});

app.post('/api/process-document', async (req, res) => {
  try {
    const { file_url, file_type, document_type, document_id } = req.body;
    
    // Download file
    const response = await axios.get(file_url, { responseType: 'arraybuffer' });
    
    // Process with AI
    const aiResult = await processWithAI(response.data, file_type, document_type);
    
    res.json({
      success: true,
      data: aiResult
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message
    });
  }
});

async function processWithAI(fileBuffer, fileType, documentType) {
  // TODO: Implement AI processing
  return {
    expiry_date: '2024-12-31',
    confidence_score: 0.95,
    extracted_text: 'Sample text'
  };
}

app.listen(8000, () => {
  console.log('Backend running on port 8000');
});
```

## 📁 โครงสร้างโปรเจกต์

```
src/
├── components/          # React components
│   ├── LoadingSpinner.tsx
│   ├── ProtectedRoute.tsx
│   ├── DocumentCard.tsx
│   ├── FileUpload.tsx
│   ├── NotificationBell.tsx
│   └── DeleteDocumentModal.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── hooks/              # Custom hooks
│   ├── useDocuments.ts
│   ├── useNotifications.ts
│   ├── useUserSettings.ts
│   └── useAIProcessing.ts
├── lib/               # Utilities และ configurations
│   ├── supabase.ts
│   ├── database.types.ts
│   └── api.ts
├── pages/             # หน้าต่างๆ ของแอป
│   ├── Dashboard.tsx
│   ├── DocumentsPage.tsx
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── SignUpPage.tsx
│   ├── ForgotPasswordPage.tsx
│   └── ResetPasswordPage.tsx
├── App.tsx            # Main App component
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## 🎨 การออกแบบ

โปรเจกต์นี้ใช้ design system ที่เน้น:
- **Modern UI/UX** - ดีไซน์สะอาดและใช้งานง่าย
- **Table Layout** - แสดงข้อมูลในรูปแบบตารางที่เป็นระเบียบ
- **Responsive Design** - รองรับทุกขนาดหน้าจอ
- **Thai Typography** - ใช้ฟอนต์ Prompt และ Sarabun สำหรับภาษาไทย
- **Gradient Colors** - ใช้สีไล่โทนสีฟ้าและเขียว
- **Micro-interactions** - เอฟเฟกต์ hover และ transition ที่ลื่นไหล

## 🔧 คำสั่งที่มีประโยชน์

```bash
# รัน development server
npm run dev

# Build สำหรับ production
npm run build

# Preview production build
npm run preview

# ตรวจสอบ code style
npm run lint

# ล้าง cache และติดตั้งใหม่
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 🚀 การ Deploy

### Netlify
1. Build โปรเจกต์: `npm run build`
2. Upload โฟลเดอร์ `dist` ไปยัง Netlify
3. ตั้งค่า Environment Variables ใน Netlify dashboard
4. เพิ่ม Site URL ใน Supabase Authentication settings

### Vercel
1. เชื่อมต่อ repository กับ Vercel
2. ตั้งค่า Environment Variables
3. Deploy อัตโนมัติ

## 🔐 ระบบ Authentication

แอปใช้ Supabase Authentication ที่รองรับ:
- **Email/Password** - ลงทะเบียนและเข้าสู่ระบบด้วยอีเมล
- **Google OAuth** - เข้าสู่ระบบด้วย Google
- **Password Reset** - รีเซ็ตรหัสผ่านผ่านอีเมล
- **Protected Routes** - ป้องกันหน้าที่ต้องเข้าสู่ระบบ

## 🤖 AI Processing Workflow

### การทำงานของ AI:

1. **File Upload** - Frontend อัปโหลดไฟล์ไป Supabase Storage
2. **Create Record** - สร้างข้อมูลเอกสารในฐานข้อมูล
3. **Generate URL** - สร้าง signed URL สำหรับ AI Service
4. **AI Processing** - Backend ดาวน์โหลดและประมวลผลด้วย AI
5. **Extract Data** - ดึงข้อมูลสำคัญ (วันหมดอายุ, เลขที่เอกสาร, ฯลฯ)
6. **Update Database** - อัปเดตข้อมูลที่ดึงได้กลับไปยังฐานข้อมูล
7. **Notify User** - แจ้งผู้ใช้ว่าการประมวลผลเสร็จสิ้น

### ข้อมูลที่ AI สามารถดึงได้:

- **วันหมดอายุ** (expiry_date)
- **วันที่ออกเอกสาร** (issue_date)
- **เลขที่เอกสาร** (document_number)
- **ชื่อผู้ถือเอกสาร** (holder_name)
- **หน่วยงานที่ออก** (issuing_authority)
- **คะแนนความมั่นใจ** (confidence_score)
- **ข้อความที่ดึงได้** (extracted_text)

## 🔄 Error Handling

### Frontend Error Handling:
- **Network Errors** - การเชื่อมต่อขัดข้อง
- **File Upload Errors** - ไฟล์ใหญ่เกินไปหรือประเภทไม่รองรับ
- **AI Processing Errors** - AI ไม่สามารถประมวลผลได้
- **Database Errors** - ปัญหาการบันทึกข้อมูล

### Backend Error Handling:
- **File Download Errors** - ไม่สามารถดาวน์โหลดไฟล์ได้
- **AI Model Errors** - Model ไม่สามารถประมวลผลได้
- **OCR Errors** - ไม่สามารถอ่านข้อความได้
- **Validation Errors** - ข้อมูลไม่ถูกต้อง

## 🐛 การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

**1. ไม่สามารถเข้าสู่ระบบได้**
- ตรวจสอบ Supabase URL และ API Key
- ตรวจสอบการตั้งค่า Authentication ใน Supabase

**2. Google OAuth ไม่ทำงาน**
- ตรวจสอบ Google Client ID และ Secret
- ตรวจสอบ Authorized redirect URIs ใน Google Console

**3. AI ไม่สามารถประมวลผลได้**
- ตรวจสอบการเชื่อมต่อกับ Backend API
- ตรวจสอบ VITE_API_BASE_URL ใน .env
- ตรวจสอบ Backend server ว่าทำงานอยู่หรือไม่

**4. ไฟล์อัปโหลดไม่ได้**
- ตรวจสอบขนาดไฟล์ (ต้องไม่เกิน 10MB)
- ตรวจสอบประเภทไฟล์ (รองรับเฉพาะ PDF และ PNG)
- ตรวจสอบการตั้งค่า Storage ใน Supabase

**5. การแจ้งเตือนไม่ทำงาน**
- ตรวจสอบการตั้งค่า SMTP ใน Supabase
- ตรวจสอบ Spam folder
- ตรวจสอบการตั้งค่า user_settings

**6. ตารางไม่แสดงข้อมูล**
- ตรวจสอบการเชื่อมต่อฐานข้อมูล
- ตรวจสอบ RLS policies ใน Supabase
- ตรวจสอบ console สำหรับ error messages

## 📊 Database Schema

### Tables:
- **documents** - เก็บข้อมูลเอกสาร
- **notifications** - เก็บการแจ้งเตือน
- **user_settings** - เก็บการตั้งค่าผู้ใช้

### Enums:
- **document_type** - ประเภทเอกสาร (lease_purchase, license, certificate)
- **document_status** - สถานะเอกสาร (active, expiring_soon, expired)
- **notification_type** - ประเภทการแจ้งเตือน (expiry_warning, expired)

### Functions:
- **get_document_stats** - สถิติเอกสาร
- **update_document_status** - อัปเดตสถานะเอกสาร
- **create_expiry_notifications** - สร้างการแจ้งเตือน

## 🔮 แผนการพัฒนาต่อไป

### Phase 1: AI Enhancement
- [ ] ปรับปรุงความแม่นยำของ AI
- [ ] รองรับเอกสารประเภทใหม่
- [ ] เพิ่มการตรวจจับภาษาไทย

### Phase 2: Features
- [ ] การส่งออกรายงาน
- [ ] การแชร์เอกสาร
- [ ] การสำรองข้อมูล
- [ ] ฟิลเตอร์และการค้นหาขั้นสูง

### Phase 3: Mobile
- [ ] Progressive Web App (PWA)
- [ ] Mobile notifications
- [ ] Offline support

### Phase 4: Analytics
- [ ] Dashboard analytics
- [ ] Usage statistics
- [ ] Performance monitoring

## 📝 License

MIT License - ดูรายละเอียดใน [LICENSE](LICENSE) file

## 🤝 การมีส่วนร่วม

ยินดีรับ Pull Requests และ Issues! 

### สำหรับ Frontend:
1. Fork โปรเจกต์
2. สร้าง feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit การเปลี่ยนแปลง (`git commit -m 'Add some AmazingFeature'`)
4. Push ไปยัง branch (`git push origin feature/AmazingFeature`)
5. เปิด Pull Request

### สำหรับ Backend Team:
1. ศึกษา API Contract ที่กำหนดไว้
2. Implement endpoints ตามที่ระบุ
3. ทดสอบการทำงานร่วมกับ Frontend
4. Deploy และแจ้ง Frontend team

## 📞 ติดต่อ

หากมีคำถามหรือต้องการความช่วยเหลือ สามารถติดต่อได้ที่:
- Email: support@smartcontracttracker.com
- GitHub Issues: [Create an issue](../../issues)

## 🎯 สำหรับ Backend Team

### ขั้นตอนการเริ่มต้น:
1. **ศึกษา API Contract** - ดูรายละเอียดใน section "การทำงานร่วมกับ Backend และ AI"
2. **Setup Development Environment** - ติดตั้ง Python/Node.js และ dependencies
3. **Implement Health Check** - เริ่มจาก endpoint ง่ายๆ
4. **Implement Document Processing** - พัฒนา AI processing logic
5. **Test Integration** - ทดสอบการทำงานร่วมกับ Frontend
6. **Deploy** - Deploy ไปยัง production server

### สิ่งที่ต้องทำ:
- [ ] สร้าง API Server (FastAPI/Express.js)
- [ ] Implement AI Model สำหรับ OCR
- [ ] Implement Date Recognition
- [ ] Implement Document Classification
- [ ] Setup CORS สำหรับ Frontend
- [ ] Error Handling และ Logging
- [ ] API Documentation
- [ ] Unit Tests

### การทดสอบ Integration:
1. **Local Testing** - รัน Backend บน localhost:8000
2. **Frontend Connection** - ตั้งค่า VITE_API_BASE_URL
3. **File Processing** - ทดสอบการอัปโหลดและประมวลผล
4. **Error Scenarios** - ทดสอบการจัดการข้อผิดพลาด

## 🔧 Development Tools

### Recommended VS Code Extensions:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Auto Rename Tag
- Prettier - Code formatter

### Debugging:
- React Developer Tools
- Redux DevTools (ถ้าใช้)
- Network tab สำหรับ API calls
- Supabase Dashboard สำหรับ database

---

**Smart Contract Tracker** - จัดการเอกสารสัญญาอย่างฉลาดและปลอดภัย 🚀

*พร้อมสำหรับการพัฒนาร่วมกันระหว่าง Frontend และ Backend Team!*

---

## 📋 Changelog

### Version 2.0.0 (Current)
- ✅ เพิ่มรูปแบบตารางสำหรับแสดงเอกสาร
- ✅ ปรับปรุง UI/UX ให้ทันสมัยขึ้น
- ✅ เพิ่ม Modal สำหรับลบเอกสาร
- ✅ ปรับปรุงระบบ AI Processing
- ✅ เพิ่ม Error Handling ที่ดีขึ้น

### Version 1.0.0
- ✅ ระบบ Authentication พื้นฐาน
- ✅ การอัปโหลดไฟล์
- ✅ การแจ้งเตือน
- ✅ Dashboard แบบ Card Layout