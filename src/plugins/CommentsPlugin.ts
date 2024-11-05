import type { Config } from 'payload';
/* eslint-disable */
export interface PluginConfig {
  /** Array of collection slugs to exclude */
  excludedCollections?: string[];
  /** Array of global slugs to exclude */
  excludedGlobals?: string[];
}

const defaultConfig: Required<PluginConfig> = {
  excludedCollections: [],
  excludedGlobals:[]
}
//@ts-expect-error payload
function ensurePath(obj, path) {
  //@ts-expect-error payload
  return path.reduce((acc, key) => acc[key] ??= {}, obj);
}

const CommentsPlugin = (pluginConfig: PluginConfig = {}) =>
  (config: Config): Config => {
    const mergedConfig: Required<PluginConfig> = { ...defaultConfig, ...pluginConfig }
    const { collections ,globals} = config;

    if (collections !== undefined) {
        collections
        .filter((collectionConfig) => {
            return collectionConfig?.admin?.custom?.comments;
        })
        .forEach((currentCollection) => {
          //Custom Versions View
          currentCollection.fields.push({
            name:'comments',
            type:'text',
            admin: {
              hidden: true,
              disableListColumn: true,
              disableBulkEdit : true,
              disableListFilter: true,
            }
          },)
        })
    }
  return {
    ...config
  };
};

export default CommentsPlugin;
/* eslint-enable */