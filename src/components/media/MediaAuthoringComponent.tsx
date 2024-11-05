'use client'
import { UploadField, useField, useFieldProps } from '@payloadcms/ui'
import React, { useEffect, useState } from 'react'

type MediaAuthoringProps = React.ComponentProps<typeof UploadField>

export const MediaAuthoringComponent: React.FC<MediaAuthoringProps> = (props) => {
  const { path } = useFieldProps()
  const { value  } = useField<string>({
    path: `${path}`,
  })
  const [className, setClassName] = useState<string>()
  useEffect(() => {
    if (value) {
      setClassName('MEDIA')
    }
    if (!value) {
      setClassName('EMPTY')
    }
  }, [value])
  return <span className={className} ><UploadField {...props} /> </span>
}
