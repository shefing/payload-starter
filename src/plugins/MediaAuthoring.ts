import _ from 'lodash';
import type { Config,  Field,  Plugin } from 'payload';
/* eslint-disable */
function findUploadFieldsLodash(data: Field[]): Field[] {
  let results: Field[] = [];

  function recursiveSearch(fields: Field[]) {
    const filteredFields = _.filter(fields, { type: 'upload' });
    results = results.concat(filteredFields);
    fields.forEach(item => {
      if (item.type && item.type == 'array' || item.type == 'row' || item.type =='collapsible') {
        recursiveSearch(item.fields);
      }
      if (item.type && item.type =='tabs') {
        item.tabs.forEach(tab => {
          if (tab.fields && Array.isArray(tab.fields)) {
            recursiveSearch(tab.fields);
          }
        });
      }
      if (item.type && item.type =='blocks') {
        item.blocks.forEach(block => {
          if (block.fields && Array.isArray(block.fields)) {
            recursiveSearch(block.fields);
          }
        });
      }
    });
  }

  recursiveSearch(data);
  
  return results;
}

const MediaAuthoring: Plugin = (incomingConfig: Config): Config => {
  if (!incomingConfig || !incomingConfig.collections) {
    throw new Error('Invalid incoming configuration or collections are missing');
  }

  const { collections } = incomingConfig;

  collections.forEach((collection) => {
    if (collection.fields) {
      const uploadFields:any = findUploadFieldsLodash(collection.fields);
      uploadFields.forEach((field:any) => {
        if(field){
        if (!field.admin) {
          field.admin = {};
        }
          if (!field.admin.components){
        field.admin.components = { Field: '/components/media/MediaAuthoringComponent#MediaAuthoringComponent' };
          }
    }
      });
    }
  });

  return {
    ...incomingConfig,
    collections,
  };
};

export default MediaAuthoring;
/* eslint-enable */