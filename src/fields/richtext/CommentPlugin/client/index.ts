'use client'
import { MarkNode } from '@lexical/mark'
import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import { CommentPlugin } from '../commentPlugin'

export const commentClientFeature = createClientFeature({
  nodes: [MarkNode],
  plugins: [
    {
      Component: CommentPlugin,
      position: 'normal',
    },
  ],
})