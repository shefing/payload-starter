import type { Field } from 'payload';
import slugify from 'slugify';

const capitalizeWordsAfterUnderscore = (toReplace: string) => {
  return toReplace
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('_');
};

export const Slug: Field = {
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
  required: true,
  /* eslint-disable */
  validate: async (val) => {
    if (!val) {
      return 'This field is required';
    }
    const slugRegex = /^[a-zA-Z0-9]+(?:[-_][a-zA-Z0-9]+)*$/;
    const isSlugRegex = slugRegex.test(val);
    if (!isSlugRegex) {
      return 'The slug contains invalid characters';
    }

    return true;
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }: any) => {
        if (operation === 'create' || operation == 'update') {
          if (data.title && !data.slug) {
            data.slug = slugify(data.title, {
              lower: true,
              strict: true,
              replacement: '_',
            });
            data.slug = capitalizeWordsAfterUnderscore(data.slug);
          }
        }
        return data.slug;
      },
    ],
    beforeChange: [
      async ({ data, req, previousSiblingDoc, collection }) => {
        if (previousSiblingDoc && Object.keys(previousSiblingDoc).length > 0) {
          if (data?._status === 'published' && JSON.stringify(previousSiblingDoc.slug) !== JSON.stringify(data?.slug)) {
            const prevSlug = previousSiblingDoc?.slug;
            const slug = data.slug;
            const fromUrl = `${collection?.slug}/${prevSlug}`;
            const toUrl = `${collection?.slug}/${slug}`;
            await req.payload.create({
              collection: 'redirects',
              data: {
                from: fromUrl,
                to: {
                  type: 'custom',
                  url: toUrl
                }
              },
            });
          }
        }
      },

    ],
  },
  admin: {
    width: '50%',
  },

  /* eslint-enable */
};;
