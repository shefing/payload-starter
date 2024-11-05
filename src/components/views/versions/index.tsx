import type { EditViewComponent, PaginatedDocs, PayloadServerReactComponent } from 'payload'

import { Gutter, ListQueryProvider } from '@payloadcms/ui'
import { notFound } from 'next/navigation.js'
import { isNumber } from 'payload/shared'
import React from 'react'

import {SetDocumentStepNav} from './SetDocumentStepNav'
import { buildVersionColumns } from './buildColumns'
import { getLatestVersion } from './getLatestVersion'
import { VersionsViewClient } from './index.client'
//import './index.scss'

export const baseClass = 'versions'

export const CustomVersionsView: PayloadServerReactComponent<EditViewComponent> = async (props) => {
  const { initPageResult, searchParams } = props

  if (!initPageResult){
    return (
      <React.Fragment>
        initPageResult is not defined
      </React.Fragment>
      )
  }
  const {
    collectionConfig,
    docID: id,
    globalConfig,
    req,
    req: {
      i18n,
      payload,
      payload: { config },
      user,
    },
  } = initPageResult

  const collectionSlug = collectionConfig?.slug
  const globalSlug = globalConfig?.slug
  const { limit, page, sort } = searchParams

  const {
    routes: { api: apiRoute },
    serverURL,
  } = config

  let versionsData: PaginatedDocs
  let limitToUse = isNumber(limit) ? Number(limit) : undefined
  let latestPublishedVersion = null
  let latestDraftVersion = null

  if (collectionSlug) {
    limitToUse = limitToUse || collectionConfig.admin.pagination.defaultLimit
    try {
      versionsData = await payload.findVersions({
        collection: collectionSlug,
        depth: 0,
        limit: limitToUse,
        overrideAccess: false,
        page: page ? parseInt(page.toString(), 10) : undefined,
        req,
        sort: sort as string,
        user,
        where: {
          parent: {
            equals: id,
          },
        },
      })
      versionsData.docs.forEach((doc)=>{
        if (doc.version.updator) doc.updator=doc.version.updator
      })
      if (collectionConfig?.versions?.drafts) {
        latestDraftVersion = await getLatestVersion({
          slug: collectionSlug,
          type: 'collection',
          payload,
          status: 'draft',
        })
        latestPublishedVersion = await getLatestVersion({
          slug: collectionSlug,
          type: 'collection',
          payload,
          status: 'published',
        })
      }
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    }
  }

  if (globalSlug) {
    limitToUse = limitToUse || 10
    try {
      versionsData = await payload.findGlobalVersions({
        slug: globalSlug,
        depth: 0,
        limit: limitToUse,
        overrideAccess: false,
        page: page ? parseInt(page as string, 10) : undefined,
        req,
        sort: sort as string,
        user,
      })

      if (globalConfig?.versions?.drafts) {
        latestDraftVersion = await getLatestVersion({
          slug: globalSlug,
          type: 'global',
          payload,
          status: 'draft',
        })
        latestPublishedVersion = await getLatestVersion({
          slug: globalSlug,
          type: 'global',
          payload,
          status: 'published',
        })
      }
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    }
//@ts-expect-error payload
    if (!versionsData) {
      return notFound()
    }
  }
  const fetchURL = collectionSlug
    ? `${serverURL}${apiRoute}/${collectionSlug}/versions`
    : globalSlug
      ? `${serverURL}${apiRoute}/globals/${globalSlug}/versions`
      : ''
//@ts-expect-error payload
  const publishedNewerThanDraft = latestPublishedVersion?.updatedAt > latestDraftVersion?.updatedAt

  if (publishedNewerThanDraft) {
    latestDraftVersion = {
      id: '',
      updatedAt: '',
    }
  }

  const columns = buildVersionColumns({
    collectionConfig,
    config,
    docID: id,
    globalConfig,
    i18n,
    latestDraftVersion: latestDraftVersion?.id,
    latestPublishedVersion: latestPublishedVersion?.id,
  })

  return (
    <React.Fragment>
      <SetDocumentStepNav
        collectionSlug={collectionConfig?.slug}
        globalSlug={globalConfig?.slug}
        id={id}
        pluralLabel={collectionConfig?.labels?.plural || globalConfig?.label}
        useAsTitle={collectionConfig?.admin?.useAsTitle || globalConfig?.slug}
        view={i18n.t('version:versions')}
      />
      <main className={baseClass}>
        <Gutter className={`${baseClass}__wrap`}>
          <ListQueryProvider
          //@ts-expect-error payload
            data={versionsData}
            defaultLimit={limitToUse}
            defaultSort={sort as string}
            modifySearchParams
          >
            <VersionsViewClient
              baseClass={baseClass}
              columns={columns}
              fetchURL={fetchURL}
              paginationLimits={collectionConfig?.admin?.pagination?.limits}
            />
          </ListQueryProvider>
        </Gutter>
      </main>
    </React.Fragment>
  )
}

export default CustomVersionsView;