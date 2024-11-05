'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { XIcon } from '@payloadcms/ui/icons/X'
import { RenderComponent, useStepNav } from '@payloadcms/ui'
import { useConfig } from '@payloadcms/ui'
import { DocumentInfoProvider } from '@payloadcms/ui'
import { useLocale } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { useRelatedCollections } from '../useRelatedCollections'
import { DocumentInfoContext } from '@payloadcms/ui'
import { useCustomContext } from '@/providers/CustomContext'

export type DrawerProps = {
  readonly Header?: React.ReactNode
  readonly children: React.ReactNode
  readonly className?: string
  readonly gutter?: boolean
  readonly hoverTitle?: boolean
  readonly slug: string
  readonly title?: string
}
export type DocumentDrawerProps = {
  readonly collectionSlug: string
  readonly drawerSlug?: string
  readonly id?: null | number | string
  readonly onSave?: DocumentInfoContext['onSave']
} & Pick<DrawerProps, 'Header'>

const baseClass = 'doc-drawer'

export const DocumentDrawerContent: React.FC<DocumentDrawerProps> = ({
  id: existingDocID,
  collectionSlug,
  onSave: onSaveFromProps,
}) => {
  const { config } = useConfig()
  const { setIsRightPanelOpen, prevStepNav } = useCustomContext()
  const { stepNav, setStepNav } = useStepNav()
  const {
    routes: { api: apiRoute },
    serverURL,
  } = config

  const locale = useLocale()
  const { t } = useTranslation()
  const [docID, setDocID] = useState(existingDocID)
  const [collectionConfig] = useRelatedCollections(collectionSlug)

  const Edit = collectionConfig?.admin.components.views.edit.default.Component

  const isEditing = Boolean(docID)
  const apiURL = docID
    ? `${serverURL}${apiRoute}/${collectionSlug}/${docID}${
        locale?.code ? `?locale=${locale.code}` : ''
      }`
    : undefined

  const onSave = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (args: any) => {
      setDocID(args.doc.id)
      if (typeof onSaveFromProps === 'function') {
        void onSaveFromProps({
          ...args,
          collectionConfig,
        })
      }
    },
    [onSaveFromProps, collectionConfig],
  )
  
  useEffect(() => {
    if (stepNav[0].label != prevStepNav[0]?.label) {
      setStepNav(prevStepNav)
    }
  }, [stepNav])

  return (
    <DocumentInfoProvider
      BeforeDocument={
        <button
          aria-label={t('general:close')}
          className={`${baseClass}__header-close right-panel-close`}
          onClick={() => setIsRightPanelOpen(false)}
          type="button"
        >
          <XIcon />
        </button>
      }
      apiURL={apiURL}
      collectionSlug={collectionConfig?.slug}
      disableActions
      disableLeaveWithoutSaving
      id={docID || null}
      isEditing={isEditing}
      onSave={onSave}
    >
      <RenderComponent mappedComponent={Edit} />
    </DocumentInfoProvider>
  )
}
