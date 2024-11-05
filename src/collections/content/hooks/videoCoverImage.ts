// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import ffmpeg from 'fluent-ffmpeg'
import ffmpegStatic from 'ffmpeg-static'
import fs from 'fs'
import { CollectionBeforeChangeHook } from 'payload'

ffmpeg.setFfmpegPath(ffmpegStatic)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
function extractFrame(inputPath: string, outputPath: string){
  return new Promise((resolve, reject) => {
    let duration = 0;
    ffmpeg(inputPath)
      .outputOptions([
        '-f rawvideo',
        '-vframes 1'
      ])
      .output(outputPath)
      .on('start', (cmdline:string) => {
        console.log('Started ffmpeg with command:', cmdline);
      })
      .on('codecData', (data: { duration: string }) => {
        duration = parseFloat(data.duration);
      })
      .on('end', () => {
        // Now that we have the duration, let's extract a frame at an appropriate time
        const seekTime = Math.min(duration/2, 3);

        ffmpeg(inputPath)
          .seekInput(seekTime)
          .frames(1)
          .output(outputPath)
          .on('end', () => {
            resolve({  });
          })
          .on('error', (err:Error) => {
            reject(err);
          })
          .run();
      })
      .on('error', (err:Error) => {
        reject(err);
      })
      .run();
  });
}
export const videoCoverImage: CollectionBeforeChangeHook = async ({ data, req, collection }) => {
  'use server'
  if (req.context?.from || !data?.mimeType?.startsWith('video') || data.thumbnailURL) {
    return data
  }
  console.log('<<<<<<<<<< Starting videoCoverImage hook')
  try {
    if (req.file) {
      const tempVideoFilePath = `${collection.upload.staticDir}/tmp_${req.file.name}`
      const outpuCoverImagetPath = `${collection.upload.staticDir}/coverImage_${req.file.name}.webp`

      fs.writeFileSync(tempVideoFilePath, req.file.data)
      // Extract the first frame
      await extractFrame(tempVideoFilePath, outpuCoverImagetPath)
      console.log('Finished processing')

      const coverImageDoc = await req.payload.create({
        collection: 'media',
        data: { title: 'Auto generated cover image for ' + req.file.name },
        filePath: outpuCoverImagetPath,
        context: { from: 'hook' },
      })
      data.coverImage = coverImageDoc.id
      data.thumbnailURL = (coverImageDoc.sizes as { thumbnail: { url?: string } }).thumbnail?.url;
      data.sizes.thumbnail = {"url":data.thumbnailURL}
      console.log('Cover image created and assigned to media:', coverImageDoc.id)

      //Remove the temporary files after processing
      fs.unlinkSync(tempVideoFilePath)
      fs.unlinkSync(outpuCoverImagetPath)
    }
    console.log(data)
    return data
  } catch (error) {
    console.log("FullError",JSON.stringify(error))
    console.error('<<<<<<<<<< Error processing video cover image:', (error as Error).message)
    //throw new Error('Video cover image processing failed.' + (error as Error).message)
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const generateURL = ({ collectionSlug, config, filename }: GenerateURLArgs) => {
  if (filename) {
    return `${config.serverURL || '/'}${config?.routes?.api || 'api'}/${collectionSlug}/file/${filename}`
  }
  return undefined
}
/* eslint-disable @typescript-eslint/no-explicit-any */

export const isVideo = (data: any) => {
  return data?.mimeType?.toLowerCase().includes('video');
}

export const adminThumbnail = ({ doc: originalDoc }: { doc: any }) => {
  const config = {}; 

  if (isVideo(originalDoc)) {
    return originalDoc.thumbnailURL;
  }

  if (
    typeof adminThumbnail === 'string' &&
    'sizes' in originalDoc &&
    originalDoc.sizes?.[adminThumbnail]?.filename
  ) {
    return generateURL({
      collectionSlug: "media",
      config,
      filename: originalDoc.sizes?.[adminThumbnail].filename as string,
    });
  }
};

//@typescript-eslint/no-unused-vars
// export const videoAfterRead: CollectionAfterReadHook  = async ({doc}:any) => {
//   if (!doc.sizes.thumbnail.url)
//     doc.sizes.thumbnail = {"url":doc.thumbnailURL}
    
//   return doc
// }

