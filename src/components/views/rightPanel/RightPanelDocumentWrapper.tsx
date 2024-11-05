'use client' // This directive ensures the component is a client component

import React, { useEffect } from 'react'
import { DocumentDrawerContent } from './DocumentView'
import { useNav } from '@payloadcms/ui'
import { useCustomContext } from '@/providers/CustomContext'

const RightPanelDocumentWrapper: React.FC = () => {
  const { isRightPanelOpen, collection, id, resetRightPanel } = useCustomContext()
  const { setNavOpen } = useNav()

  useEffect(() => {
    setNavOpen(false)
    document.body.style.overflowY = 'hidden'

    return () => {
      resetRightPanel()
      document.body.style.overflowY = 'auto'
    }
  }, [])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const editViewElement = document.getElementById('edit-view')
    if (editViewElement) {
      editViewElement.style.width = isRightPanelOpen ? '50%' : '100%'
    }
  }, [isRightPanelOpen])

  return isRightPanelOpen ? (
    <div className="w-1/2 overflow-auto" style={{ borderLeft: '1px solid rgb(235, 235, 235)' }}>
      <DocumentDrawerContent collectionSlug={collection} id={id} />
    </div>
  ) : null
}

export default RightPanelDocumentWrapper
