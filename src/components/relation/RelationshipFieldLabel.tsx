'use client'
import React, {  useEffect, useState } from 'react';
import { useField ,RelationshipField, useFieldProps} from '@payloadcms/ui';
import { RelationshipFieldClientProps } from 'payload'


const RelationshipFieldLabel: React.FC<RelationshipFieldClientProps> = (props) => {
  const { path } = useFieldProps()
  const { value} = useField<string>({
    path: `${path}`,
  })
  const [className,setClassName]=useState<string>()
  useEffect(() => {
    if (value === undefined || value === null || value === '') {
        setClassName("READONLY");
    }
  }, [value])
  return (
    <span className={className} ><RelationshipField {...props} /></span>
  )
}

export default RelationshipFieldLabel
