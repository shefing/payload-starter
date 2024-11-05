
import { createServerFeature } from '@payloadcms/richtext-lexical'


export const commentFeature = createServerFeature({
   
    feature:{
        ClientFeature: '/fields/richtext/CommentPlugin/client#commentClientFeature'
    },
    key: 'comment',
}  )       