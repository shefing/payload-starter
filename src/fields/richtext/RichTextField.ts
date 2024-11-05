import { BlocksFeature, lexicalEditor, lexicalHTML } from '@payloadcms/richtext-lexical';
import type { RichTextField as PayloadRichTextField } from 'payload';
import DefaultFeatures from '@/fields/richtext/DefaultFeatures';
import { Snippet } from '@/blocks/SnippetBlock/SnippetBlock';
import { UserLink } from '@/blocks/UserLinkBlock/UserLinkBlock';
import { LegacyUserLink } from '@/blocks/LegacyUserLinkBlock/LegacyUserLinkBlock';

const richTextFieldConfig: PayloadRichTextField = {
  name: 'richText',
  label: 'richtext',
  type: 'richText',

  editor: lexicalEditor({
    features: ({  }) => [BlocksFeature({ inlineBlocks: [Snippet, UserLink, LegacyUserLink,], }), ...DefaultFeatures ],
  }),
  admin: {
  className: 'HideLabel',
},
};

lexicalHTML('richText', { name: 'richText_html' });

export default richTextFieldConfig;
