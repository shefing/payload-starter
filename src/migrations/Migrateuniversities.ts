import * as dotenv from 'dotenv';
import csvToJson from 'convert-csv-to-json';
import { readFile } from 'fs/promises';
import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-mongodb';

dotenv.config();

export async function up({ payload }: MigrateUpArgs): Promise<void> {
    const csvPath = 'src/scripts/import/Universities.csv';


    const getCsvData = async () => {
        try {
            const data = await readFile(csvPath, 'utf-8');
            return data;
        } catch (error) {
            throw new Error(`Failed to read CSV file`);
        }
    };


    const clearUniversitiesCollection = async () => {
        try {
            await payload.delete({
                collection: 'universities',
                where: {},
            });
            console.log('Cleared universities collection.');
        } catch (error) {
            console.error('Failed to clear universities collection:', error);
        }
    };

    const importUniversities = async () => {
        try {
            const csvData = await getCsvData();
            const results = csvToJson.fieldDelimiter(',').parseSubArray('*', ',').csvStringToJson(csvData);

            for (const item of results) {
                const universityData = {
                    name: item['UniversityNameforUsers'],
                    acronym: item['AbbreviatedName'] || '',
                    infoBoxName: item['NameforInfoBox'] || '',
                    universitySystem: item['UniversitySystem'] || '',
                    city: item['City'] || '',
                    state: item['State/Province'] || '',
                    country: item['Country'] || '',
                };

                try {
                    await payload.create({
                        collection: 'universities',
                        data: universityData,
                    });

                    console.log(`Created university: ${universityData.name}`);
                } catch (error) {
                    console.error(`Failed to create university: ${universityData.name}`, error);
                }
            }
        } catch (error) {
            console.error('Error during import:', error);
        }
    };

    await clearUniversitiesCollection();
    await importUniversities();
}
export async function down({ }: MigrateDownArgs): Promise<void> {
    console.log('No rollback functionality provided for this migration.');
}
