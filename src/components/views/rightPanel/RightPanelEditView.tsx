import type { EditViewComponent, PayloadServerReactComponent } from 'payload'
import { EditView } from '@payloadcms/next/views'
import React from 'react'
import RightPanelDocumentWrapper from './RightPanelDocumentWrapper'

const RightPanelEditView: PayloadServerReactComponent<EditViewComponent> = () => {
  const headerHeight = 120
  return (
    <div className="flex" style={{ height: `calc(100vh - ${headerHeight}px)` }}>
      <div id="edit-view" className="flex overflow-auto">
        <EditView />
      </div>
      <RightPanelDocumentWrapper />
    </div>
  )
}
export default RightPanelEditView
