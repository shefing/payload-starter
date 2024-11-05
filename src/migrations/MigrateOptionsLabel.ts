import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-mongodb';
import { stateMap } from '@/refdata/usastates'
import { optionsMap as canadaMap } from '@/refdata/canadaStates'
import { optionsMap as statusMap } from '@/refdata/authorStatus'
/* eslint-disable */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const collections = ['individualauthors', 'organizationauthors'];

  for (const collectionName of collections) {
    const collection = payload.db.collections[collectionName];
    console.log(`Processing collection: ${collectionName}`);
    if (collection) {
      const documents = await collection.find({});
      console.log(`Found ${documents.length} documents in collection: ${collectionName}`);
      let updated = false;
      const condValue = (value: string, mappedValue: string) => {
        if (!mappedValue)
          return value
        updated = true;
        return mappedValue
      }
      for (const doc of documents) {
        updated = false
        const updatedDoc = {
          ...JSON.parse(JSON.stringify(doc)),
          // @ts-ignore
          usaState: condValue(doc.usaState, stateMap.get(doc.usaState)?.label),
          // @ts-ignore
          canadaState: condValue(doc.canadaState, canadaMap.get(doc.canadaState)?.label),
          // @ts-ignore
          status: condValue(doc.status, statusMap.get(doc.status)?.label)
        };
        if (updated) {
          await collection.updateOne({ _id: doc._id }, { $set: updatedDoc });

          //await payload.db.updateOne({ _id: doc._id, data: updatedDoc, collection: collectionName });
          console.log(`${updatedDoc.status} ${updatedDoc.usaState} ${updatedDoc.canadaState}`)
          console.log(`${doc.status} ${doc.usaState} ${doc.canadaState}`)
          console.log(`Updated document ${doc.id} in collection ${collectionName}`);
        }
      }
    }
  }
}
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  console.log('No rollback functionality provided for this migration.');
}
/* eslint-enable */
export const MigrationOptionsLabel = {
  name: "MigrateOptionsLabel", up: up, down: down
}
