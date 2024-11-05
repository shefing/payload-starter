import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-mongodb';
/* eslint-disable */

export async function up({ payload }: MigrateUpArgs): Promise<void> {
    const collectionName = 'media';
    const collection = payload.db.collections[collectionName];
    console.log(`Starting migration: copying 'text' to 'captureDate' and removing 'text' for collection: ${collectionName}`);

    if (collection) {
        // Fetch all documents from the 'media' collection
        const documents = await collection.find({}); // Make sure to convert cursor to array

        for (const doc of documents) {
            const parsedDoc = JSON.parse(JSON.stringify(doc));  // Convert document to regular JS object
            console.log(`Processing document ID: ${parsedDoc._id}`);

            let updated = false;

            // Check if there is a 'text' field and if 'captureDate' is not already defined
            if (parsedDoc.text && !parsedDoc.captureDate) {
                parsedDoc.captureDate = parsedDoc.text;  // Copy the value from 'text' to 'captureDate'
                updated = true;
            }
            if (parsedDoc.text) {
                delete parsedDoc.text;
                await collection.replaceOne({ _id: parsedDoc._id }, parsedDoc);
            }

        }
    }
}
export async function down({ payload }: MigrateDownArgs): Promise<void> {
    console.log('No rollback functionality provided for this migration.');
}
/* eslint-enable */
