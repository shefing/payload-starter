import type { EditViewComponent, PayloadServerReactComponent } from 'payload'
import { EditView } from '@payloadcms/next/views'
import React from 'react'
import EditViewClientComponent from './EditViewClientComponent';

const DefaultEditView: PayloadServerReactComponent<EditViewComponent> = () => {
  return (
      <>
        <EditView />
        <EditViewClientComponent/>
      </>
  )
}
export default DefaultEditView
