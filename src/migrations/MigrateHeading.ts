import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-mongodb';
/* eslint-disable */
const processRichTextFields = (obj: any, docId: string, collectionName: string, seenObjects: Set<any>) => {
    let updated = false;

    const processBlock = (block: any) => {
        if (block?.type === 'heading' && ['h4', 'h5', 'h6'].includes(block?.tag)) {
            console.log(`Converting tag ${block.tag} to h3 in document ${docId}, collection: ${collectionName}`);
            block.tag = 'h3';
            updated = true;
        }
    };

    const processRichText = (richText: any) => {
        const richTextChildren = richText?.root?.children;
        if (Array.isArray(richTextChildren)) {
            richTextChildren.forEach(processBlock);
        }
    };

    const processObject = (data: any) => {
        if (typeof data !== 'object' || data === null || seenObjects.has(data)) return;

        seenObjects.add(data);

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const value = data[key];

                if (value?.root?.children) {
                    processRichText(value);
                }

                if (typeof value === 'object') {
                    processObject(value);
                }
            }
        }
    };

    processObject(obj);
    return updated;
};

export async function up({ payload }: MigrateUpArgs): Promise<void> {
    const collections = ['campaigns', 'blogs', 'publicorganizationauthors', 'publicauthors'];

    for (const collectionName of collections) {
        const collection = payload.db.collections[collectionName];
        console.log(`Processing collection: ${collectionName}`);

        if (collection) {
            const documents = await collection.find({});
            console.log(`Found ${documents.length} documents in collection: ${collectionName}`);

            for (const doc of documents) {
                const seenObjects = new Set();
                let updated = processRichTextFields(doc, doc._id, collectionName, seenObjects); 

                if (updated) {
                    await collection.updateOne({ _id: doc._id }, { $set: doc });
                    console.log(`Updated document ${doc._id} in collection ${collectionName}`);
                }
            }
        }
    }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
    console.log('No rollback functionality provided for this migration.');
}
/* eslint-enable */