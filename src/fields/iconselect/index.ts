import { Field } from 'payload'
import * as Icons from 'flowbite-react-icons'
export const iconOptions = Object.entries(Icons).map((icon) => icon[0])

export const IconSelectField: Field = {
  name: 'iconType',
  label: 'Icon',
  type: 'text',
  admin: {
    components: {
      Field: '/fields/iconselect/SelectIcons',
    },
    width: '50%',
  },
}
