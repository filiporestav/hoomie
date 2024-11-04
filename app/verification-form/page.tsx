'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Upload } from "lucide-react"
import { createClient } from "@/app/utils/supabase/client";
import { useEffect } from 'react'

export default function VerificationForm() {
  const [selfie, setSelfie] = useState<File | null>(null)
  const [idImage, setIdImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/logga-in");
        return;
      }

      const { data: currentUserData, error } = await supabase
        .from("profiles")
        .select("id, username")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching current user:", error);
      } else {
        setCurrentUser(currentUserData);
      }
    };

    fetchCurrentUser();
  }, [router, supabase]);

  const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelfie(e.target.files[0])
      setError(null)
    }
  }

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdImage(e.target.files[0])
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!selfie || !idImage) {
        setError('Vänligen ladda upp båda bilderna.')
        return
      }

      const formData = new FormData()
      formData.append('selfie', selfie)
      formData.append('idImage', idImage)
      formData.append('userId', currentUser?.id)
      formData.append('username', currentUser?.username)

      const response = await fetch('/api/send-verification', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || `Fel: ${response.status}`)
      }

      const data = await response.json()
      console.log('Framgång:', data)

      alert('Verifieringsbegäran skickades framgångsrikt!')
      router.push('/konto')
    } catch (error) {
      console.error('Inlämningsfel:', error)
      setError(error instanceof Error ? error.message : 'Misslyckades med att skicka verifieringsbegäran')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='pt-20 pb-20'>
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verifieringsformulär</CardTitle>
        <CardDescription>Ladda upp dina bilder för verifiering</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="selfie">Ladda upp selfie:</Label>
            <Input
              id="selfie"
              type="file"
              accept="image/*"
              onChange={handleSelfieChange}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="id">Ladda upp ID (Pass eller Körkort):</Label>
            <Input
              id="id"
              type="file"
              accept="image/*"
              onChange={handleIdChange}
              required
              disabled={loading}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Skickar...' : 'Skicka för verifiering'}
          </Button>
        </form>
      </CardContent>
    </Card>
    </div>
  )
}