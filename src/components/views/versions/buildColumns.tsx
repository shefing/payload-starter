import type { I18n } from '@payloadcms/translations'
import type { SanitizedCollectionConfig, SanitizedConfig, SanitizedGlobalConfig } from 'payload'

import { type Column, SortColumn } from '@payloadcms/ui'
import React from 'react'

import { AutosaveCell } from './cells/AutosaveCell'
import { CreatedAtCell } from './cells/CreatedAt'
import { IDCell } from './cells/ID'

export const buildVersionColumns = ({
                                      collectionConfig,
                                      docID,
                                      globalConfig,
                                      i18n: { t },
                                      latestDraftVersion,
                                      latestPublishedVersion,
                                    }: {
  collectionConfig?: SanitizedCollectionConfig
  config: SanitizedConfig
  docID?: number | string
  globalConfig?: SanitizedGlobalConfig
  i18n: I18n
  latestDraftVersion?: string
  latestPublishedVersion?: string
}): Column[] => {
  const entityConfig = collectionConfig || globalConfig

  const columns: Column[] = [
    {
      Label: '',
      accessor: 'updatedAt',
      active: true,
      cellProps: {
        field: {
          name: '',
          type: 'date',
        },
      },
      components: {
        Cell: {
          type: 'client',
          //@ts-expect-error payload
          Component: null,
          RenderedComponent: (
            <CreatedAtCell
              collectionSlug={collectionConfig?.slug}
              docID={docID}
              globalSlug={globalConfig?.slug}
            />
          ),
        },
        Heading: <SortColumn Label={t('general:updatedAt')} name="updatedAt" />,
      },
    },
    {
      Label: '',
      accessor: 'updator',
      active: true,
      cellProps: {
        field: {
          name: 'updator',
          type: 'text',
        },
      },
      components: {
        Cell: {
          type: 'client',
          //@ts-expect-error payload
          Component: null,
          RenderedComponent: <IDCell />,
        },
        Heading: <SortColumn Label={'Updated by'} disable name="updator" />,
      },
    },
    {
      Label: '',
      accessor: '_status',
      active: true,
      cellProps: {
        field: {
          name: '',
          type: 'checkbox',
        },
      },
      components: {
        Cell: {
          type: 'client',
          //@ts-expect-error payload
          Component: null,
          RenderedComponent: (
            <AutosaveCell
              latestDraftVersion={latestDraftVersion}
              latestPublishedVersion={latestPublishedVersion}
            />
          ),
        },

        Heading: <SortColumn Label={t('version:status')} disable name="status" />,
      },
    },
    {
      Label: '',
      accessor: 'id',
      active: true,
      cellProps: {
        field: {
          name: '',
          type: 'text',
        },
      },
      components: {
        Cell: {
          type: 'client',
          //@ts-expect-error payload
          Component: null,
          RenderedComponent: <IDCell />,
        },
        Heading: <SortColumn Label={t('version:versionID')} disable name="id" />,
      },
    },
  ]

  if (
    entityConfig?.versions?.drafts ||
    (entityConfig?.versions?.drafts && entityConfig.versions.drafts?.autosave)
  ) {
  }

  return columns
}
