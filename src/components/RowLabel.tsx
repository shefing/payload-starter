'use client'
import { useRowLabel } from '@payloadcms/ui'
import { useEffect, useState } from 'react'



export const VariantLabel: React.FC = () => {
    const { data, rowNumber } = useRowLabel<{ header: string }>()
    const [label, setLabel] = useState(`Variant ${rowNumber}`)
    useEffect(() => {
        if (data?.header) {
          // Assuming data.header contains the title you want to use
          setLabel(data.header)
        } else {
          // Default label if header is not present
          setLabel(`Section ${rowNumber}`)
        }
      }, [data, rowNumber])
    
  return (
    <div>
      <span>{label}</span>
    </div>
  )
}