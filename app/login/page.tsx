'use client'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wgcipmzpoiinpbhcihoi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnY2lwbXpwb2lpbnBiaGNpaG9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MzE5NjUsImV4cCI6MjA3MDQwNzk2NX0.gTGgE2X9WQavz9NFFI3JMd-4NLMaOV9qgF4atXFIwp8'

// Basic guard so the page fails gracefully instead of a cryptic error
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function LoginPage() {
  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/', // change to https://fortivo.app in prod
      },
    })
  }

  async function signInWithApple() {
    await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: 'http://localhost:3000/',
      },
    })
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Sign in</h1>
      <button onClick={signInWithGoogle} style={{ display:'block', margin:'8px 0' }}>
        Continue with Google
      </button>
      <button onClick={signInWithApple}>
        Continue with Apple
      </button>
    </div>
  )
}