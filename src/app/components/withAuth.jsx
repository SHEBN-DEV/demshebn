/*"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../SupabaseClient'

const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
      const checkAuth = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login')
          return
        }
        
        setLoading(false)
      }

      checkAuth()
    }, [router])

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#191617]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF29D7]"></div>
        </div>
      )
    }

    return <WrappedComponent {...props} />
  }
}

export default withAuth */