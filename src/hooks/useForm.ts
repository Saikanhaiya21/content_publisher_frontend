import { useState } from 'react'

export function useForm<T extends Record<string, any>>(initial: T) {
  const [values, setValues] = useState<T>(initial)
  const onChange = (name: keyof T) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues(prev => ({ ...prev, [name]: e.target.value }))
  }
  const reset = () => setValues(initial)
  return { values, onChange, setValues, reset }
}
