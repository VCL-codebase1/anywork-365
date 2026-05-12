import { NextRequest, NextResponse } from 'next/server'
import { setSession } from '@/lib/auth'
import { auth as adminAuth } from '@/lib/firebase/admin'
import { getUserByUid } from '@/lib/queries'
import type { ApiResponse, AuthUser } from '@/types'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json()
    if (!idToken) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'ID token is required' },
        { status: 400 }
      )
    }

    const decoded = await adminAuth.verifyIdToken(idToken)
    const uid = decoded.uid

    const profile = await getUserByUid(uid)
    if (!profile) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'This account exists on mobile but hasn\'t been set up on web yet. Please sign up with the same email to link your account.' },
        { status: 404 }
      )
    }

    await setSession(profile)

    return NextResponse.json<ApiResponse<AuthUser>>(
      { success: true, data: profile },
      { status: 200 }
    )
  } catch (err: unknown) {
    const e = err as { code?: string; message?: string }
    console.error('[LOGIN ERROR]', e)

    let message = 'Invalid credentials'
    if (e?.code === 'auth/user-not-found') message = 'No account found with this email'
    else if (e?.code === 'auth/wrong-password') message = 'Incorrect password'
    else if (e?.code === 'auth/invalid-credential') message = 'Incorrect email or password'
    else if (e?.code === 'auth/invalid-login-credentials') message = 'Incorrect email or password'
    else if (e?.code === 'auth/user-disabled') message = 'This account has been disabled'
    else if (e?.code === 'auth/too-many-requests') message = 'Too many attempts. Please try again later.'
    else if (e?.message) message = e.message

    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: message },
      { status: 401 }
    )
  }
}