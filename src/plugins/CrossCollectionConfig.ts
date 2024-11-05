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
  excludedGlobals: []
};
//@ts-expect-error payload
function ensurePath(obj, path) {
  //@ts-expect-error payload
  return path.reduce((acc, key) => acc[key] ??= {}, obj);
}

const CrossCollectionConfig = (pluginConfig: PluginConfig = {}) =>
  (config: Config): Config => {
    const mergedConfig: Required<PluginConfig> = { ...defaultConfig, ...pluginConfig };
    const { collections, globals } = config;

    if (collections !== undefined) {
      collections
        .filter((x) => !mergedConfig.excludedCollections.includes(x.slug))
        .forEach((currentCollection) => {
          //Custom Versions View
          //@ts-expect-error payload
          if (!currentCollection.admin?.components?.views?.edit?.versions?.Component) {
            const versions = ensurePath(currentCollection, ['admin', 'components', 'views', 'edit', 'versions']);
            versions.Component = '/components/views/versions';
          }
          if (currentCollection?.admin?.custom?.rightPanel) {
            const defaultEdit = ensurePath(currentCollection, ['admin', 'components', 'views', 'edit', 'default']);
            defaultEdit.Component = '/components/views/rightPanel/RightPanelEditView';
          }
          else {
            const defaultEdit = ensurePath(currentCollection, ['admin', 'components', 'views', 'edit', 'default']);
            defaultEdit.Component = '/components/views/default/DefaultEditView';
          }
          if (currentCollection?.admin?.custom?.preview) {
            const defaultAdmin = ensurePath(currentCollection, ['admin']);
            defaultAdmin.preview = (doc: { slug: any; }) => {
              return `${process.env.PAYLOAD_URL}/${currentCollection?.admin?.custom?.preview}/${doc.slug}?isDraft=true`
            };
          }
        });
    }
    if (globals !== undefined) {
      globals
        .filter((x) => !mergedConfig.excludedGlobals.includes(x.slug))
        .forEach((currentGlobal) => {
          //Custom Versions View
          //@ts-expect-error payload
          if (!currentGlobal.admin?.components?.views?.edit?.versions?.Component) {
            const versions = ensurePath(currentGlobal, ['admin', 'components', 'views', 'edit', 'versions']);
            versions.Component = '/components/views/versions';
          }
        });
    }


    return {
      ...config
    };
  };

export default CrossCollectionConfig;
/* eslint-enable */