'use client'
import { useNav } from '@payloadcms/ui'
import { useEffect } from 'react'

const EditViewClientComponent = () => {
  const { setNavOpen } = useNav()
  useEffect(() => {
    setNavOpen(false)
  }, [])

  return <></>
}
export default EditViewClientComponent
