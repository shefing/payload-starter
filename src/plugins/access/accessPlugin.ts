import { hasAccessToAction } from '@/access/general'
import { Config, Plugin } from 'payload'
import { Access, ArrayField, CollectionConfig, Field, GlobalConfig } from 'payload'

const addAccess: Plugin = (incomingConfig: Config): Config => {
  if (!incomingConfig || !incomingConfig.collections) {
    throw new Error('Invalid incoming configuration or collections are missing')
  }
  const entities: {label:string, value:string}[] = [];
  const createAccess = (slugName: string, labelName?:string) => {
    const baseAccess: { read: Access; update: Access; } = {
      read: hasAccessToAction(slugName, 'read'),
      update: hasAccessToAction(slugName, 'write'),
    };
    const label = labelName?labelName:slugName.charAt(0).toUpperCase() + slugName.slice(1)
    entities.push({label, value:slugName})
    return baseAccess;
  };
  const createAccessCollection = (slugName: string, labelName?:string) => {
    const baseAccess: { read: Access; update: Access; create?: Access; delete?: Access; } = createAccess(slugName, labelName)
    const access = {
      ...baseAccess,
      create: hasAccessToAction(slugName, 'write'),
      delete: hasAccessToAction(slugName, 'write'),
    };
    return access;
  };

  const addEntityOptions= (obj:Field[]) =>{
    const permissionIndex = 1//obj.findIndex((field: any) => field.name && field.name === 'permissions');
    const premissionsObj = (obj[permissionIndex]as ArrayField)
    const subPremissionsObj = (premissionsObj.fields[0] as ArrayField).fields
    const entityIndex = 0; //subPremissionsObj.findIndex((field: any) => field?.name === 'entity');
    (subPremissionsObj[entityIndex]as {options:{label:string, value:string}[] }).options = entities
    return obj
  }

  let config: Config = {
    ...incomingConfig,
    collections: incomingConfig.collections?.map((collection) => ({
      ...collection,
      ...(!['users', 'roles', 'media'].includes(collection.slug)  && {
          access: collection.labels?createAccessCollection(collection.slug, String(collection.labels.plural?collection.labels.plural:collection.labels )):createAccessCollection(collection.slug),
        }),
    })) as CollectionConfig[],
    globals: incomingConfig.globals?.map((global) => ({
      ...global,
      access: global.label?createAccess(global.slug, String(global.label)):createAccess(global.slug),
    })) as GlobalConfig[],
  }

  config = {
    ...config,
    collections: incomingConfig.collections?.map((collection) => ({
      ...collection,
      ...(collection.slug == 'roles' && {
          fields: addEntityOptions(collection.fields)
        }),
    })) as CollectionConfig[],
  }
  return config
}
export default addAccess