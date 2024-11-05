import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-mongodb'
import { BasePayload, TypeWithID } from 'payload'

/* eslint-disable */
const socialMediaPlatformMap: any = new Map<string, string>()
const platformList: string[] = ['facebook', 'instagram', 'twitter', 'tiktok', 'youtube', 'linkedIn']

const creatSocialMediaPlatformMap = async (payload: BasePayload): Promise<void> => {

    for (const smPlatform of platformList) {
        try {
            const payloadQuery = await payload.find({
                collection: 'socialmedia',
                where: {
                    platform: { equals: smPlatform },
                },
            })
            //@typescript-eslint/no-explicit-any
            const result = payloadQuery.docs[0] as TypeWithID
            if (!result) {
                await payload.create({
                    collection: 'socialmedia',
                    data: { platform: smPlatform },
                })
            }
        } catch (e) {
            console.error('Error finding social Media Platform in Payload CMS:', e)
        }
    }
    const collection = payload.db.collections['socialmedia'];
    const documents = await collection.find({});
    for (const doc of documents) {
        socialMediaPlatformMap.set(doc.platform, doc.id)
    }
    console.log('socialMediaPlatformMap end', socialMediaPlatformMap)
}


export async function up({ payload }: MigrateUpArgs): Promise<void> {
    const collections = ['individualauthors', 'organizationauthors']
    await creatSocialMediaPlatformMap(payload)

    for (const collectionName of collections) {
        const collection = payload.db.collections[collectionName]
        console.log(`Processing collection: ${collectionName}`)

        if (collection) {

            console.log('socialMediaPlatformMap in up', socialMediaPlatformMap)

            const documents = await collection.find({})
            console.log(`Found ${documents.length} documents in collection: ${collectionName}`)

            for (const doc of documents) {
                if (Array.isArray(doc.socialMediaAccounts)) {
                    let updated = false
                    doc.socialMediaAccounts.forEach(async (account: any) => {
                        const newPlatform = socialMediaPlatformMap.get(account.platform)
                        console.log(' newPlatform', newPlatform)
                        if (newPlatform) {
                            account.platform = newPlatform
                            updated = true
                        }
                    })
                    if (updated) {
                        await collection.updateOne({ _id: doc._id }, { $set: doc })
                    }
                }
            }
        }
    }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
    console.log('No rollback functionality provided for this migration.')
}

/* eslint-enable */

export const MigrationSocialMedia = {
    name: "MigrateSocialMedia", up: up, down: down
}
