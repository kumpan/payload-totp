'use client'

import { toast } from '@payloadcms/ui'
import React, { useCallback, useRef, useState } from 'react'

import OTPInput from '../../OTPInput/index.js'
import type { IResponse } from '../../../api/verifyToken.js'

type Args = {
  length?: number
  back?: string
}

export default function OTPForm({ length, back }: Args) {
  const [isPending, setIsPending] = useState(false)
  const form = useRef<HTMLFormElement>(null)

  const onFilled = () => {
    form.current && form.current.requestSubmit()
  }

  const asyncOperation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()

    setIsPending(true)

    const formData = new FormData(event.target as HTMLFormElement)

    let res: Response

    try {
      res = await fetch('/api/verify-totp', {
        method: 'post',
        credentials: 'include',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (err) {
      throw err
    }

    let data: IResponse

    try {
      data = await res.json()
    } catch (err) {
      throw err
    }

    if (!data.ok && data.message) {
      toast.error(data.message)
      return false
    }

    return true
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback((event) => {
    asyncOperation(event)
      .then((ok) => {
        if (ok) {
          if (back) {
            // Use location, auth strategy must run again
            location.replace(back)
          } else {
            window.history.back()
          }
        }
        setIsPending(false)
      })
      .catch((err) => {
        console.error(err)
        toast.error('Something went wrong')
        setIsPending(false)
      })
  }, [])

  return (
    <form ref={form} onSubmit={handleSubmit}>
      <OTPInput name="token" length={length} disabled={isPending} onFilled={onFilled} />
    </form>
  )
}
