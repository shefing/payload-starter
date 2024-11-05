import path from 'path';
import { fileURLToPath } from 'url';
import type { CollectionConfig } from 'payload';
import { isLoggedIn } from '@/access/isLoggedIn';
import { adminThumbnail, videoCoverImage, isVideo } from './hooks/videoCoverImage';

import {
  BeforeDelete,
  BelongAfterChangeHook,
  AfterDelete,
} from '@/collections/content/hooks/mediaHooks';
/* eslint-enable */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: path.resolve(__dirname, '../../../media'),
    imageSizes: [
      {
        name: 'webp',
        formatOptions: { format: 'webp' },
      },
      {
        name: 'thumbnail',
        width: 250,
        formatOptions: { format: 'webp' },

      },
      {
        name: 'medium',
        width: 800,
        formatOptions: { format: 'webp', options: { quality: 90 } },
      },
      {
        name: 'large',
        width: 1200,
        formatOptions: { format: 'webp' },
      },
    ],
    adminThumbnail,
  },
  access: {
    read: () => true,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  admin: {
    group: 'Content',
    listSearchableFields: ['filename', 'title', 'description', 'belong'] /*source, later on upload date*/,
    defaultColumns: ['filename', 'title', 'description', 'belong'] /*'thumbnailURL',reference count*/,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General Info',
          fields: [
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              filterOptions: {
                mimeType: { contains: 'image' },
              },
              admin: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                condition: (data: any) => {
                  return isVideo(data);
                },
              },
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              index: true,
              admin: {
                components: {
                  Field: '/components/TitleSourceDateFromFilename'
                }
              }
            },
            {
              name: 'description',
              type: 'textarea',
              index: true,
            },
            {
              name: 'source',
              type: 'select',
              options: [
                { label: 'X', value: 'X' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'Dailymotion', value: 'dailymotion' },
                { label: 'Facebook', value: 'facebook' },
                { label: 'Vimeo', value: 'vimeo' },
                { label: 'BitChute', value: 'bitchute' },
                { label: 'Twitter', value: 'twitter' },
                { label: 'Other', value: 'other' },
              ],
            },
            {
              name: 'captureDate',
              label: 'Capture date',
              type: 'date',
            },
            {
              name: 'belong',
              label: 'Belongs To',
              type: 'relationship',
              hasMany: true,
              relationTo: 'individualauthors',
              index: true,
              hooks: {
                afterChange: [BelongAfterChangeHook]
              }
            },
            {
              name: 'belongToOrg',
              label: 'Belongs To Organization',
              type: 'relationship',
              hasMany: true,
              relationTo: 'organizationauthors',
              index: true,
              hooks: {
                afterChange: [BelongAfterChangeHook]
              }
            },
          ],
        },
        {
          label: 'References',
          fields: [
            {
              name: 'pageCount',
              type: 'number',
              defaultValue: 0,
              admin: {
                readOnly: true,
                components: {
                  Field: '/collections/content/components/PageCount',
                }
              },
            },
            {
              name: 'references',
              interfaceName: 'MediaReferences',
              type: 'array',
              fields: [
                {
                  name: 'page',
                  type: 'text',
                },
                {
                  name: 'collection',
                  type: 'text',
                },
                {
                  name: 'count',
                  type: 'number',
                  defaultValue: 0,
                },
                {
                  name: 'pageId',
                  type: 'text',
                },
              ],
              admin: {
                readOnly: true,
                components: {
                  Field: '/collections/content/components/ReferencesTable',
                },
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeDelete: BeforeDelete,
    afterDelete: AfterDelete,
    beforeChange: [videoCoverImage],
    //afterRead: [videoAfterRead]
  }
}

