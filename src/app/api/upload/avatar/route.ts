/**
 * POST /api/upload/avatar
 * Accepts a multipart/form-data image upload
 * Validates: file type, file size, authenticated session
 * Saves to /public/uploads/{userId}.{ext}
 * Returns the public URL of the uploaded photo
 *
 * Production note: replace local disk save with S3/Firebase Storage upload
 */
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { getSession } from '@/lib/auth'
import { updateUserProfile } from '@/lib/queries'
import type { ApiResponse } from '@/types'

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export async function POST(req: NextRequest) {
  try {
    // ── Auth check ──────────────────────────────────────────────────────────
    const session = await getSession()
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // ── Parse multipart form ────────────────────────────────────────────────
    const formData = await req.formData()
    const file     = formData.get('avatar') as File | null

    if (!file) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // ── Validate file type ──────────────────────────────────────────────────
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Only JPEG, PNG, and WebP images are allowed' },
        { status: 400 }
      )
    }

    // ── Validate file size ──────────────────────────────────────────────────
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Image must be smaller than 5MB' },
        { status: 400 }
      )
    }

    // ── Determine file extension ────────────────────────────────────────────
    const extMap: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/jpg':  '.jpg',
      'image/png':  '.png',
      'image/webp': '.webp',
    }
    const ext      = extMap[file.type] ?? '.jpg'
    // Use userId as filename so re-uploading overwrites the old photo
    const filename = `${session.id}${ext}`

    // ── Ensure uploads directory exists ────────────────────────────────────
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    // ── Write file to disk ──────────────────────────────────────────────────
    const bytes  = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filepath = join(uploadsDir, filename)
    await writeFile(filepath, buffer)

    // ── Return public URL ───────────────────────────────────────────────────
    await updateUserProfile(session.id, { profileImage: filename })

    const publicUrl = `/uploads/${filename}`

    return NextResponse.json<ApiResponse<{ url: string }>>(
      { success: true, data: { url: publicUrl }, message: 'Photo uploaded successfully' },
      { status: 200 }
    )
  } catch (err) {
    console.error('[AVATAR UPLOAD]', err)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Upload failed. Please try again.' },
      { status: 500 }
    )
  }
}
