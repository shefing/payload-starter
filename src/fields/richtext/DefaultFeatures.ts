import {
  AlignFeature,
  BoldFeature,
  FixedToolbarFeature,
  HTMLConverterFeature,
  IndentFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  StrikethroughFeature,
  UnderlineFeature,
  UnorderedListFeature,
  HeadingFeature
} from '@payloadcms/richtext-lexical'

export default [
  HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3'] }),
  LinkFeature(),
  FixedToolbarFeature(),
  BoldFeature(),
  OrderedListFeature(),
  UnorderedListFeature(),
  UnderlineFeature(),
  StrikethroughFeature(),
  ItalicFeature(),
  AlignFeature(),
  ParagraphFeature(),
  IndentFeature(),
  HTMLConverterFeature(),
]
