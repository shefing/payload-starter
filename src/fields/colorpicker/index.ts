import { Field } from 'payload'

export const FontColorField: Field = {
  name: 'color',
  label: 'Font Color',
  type: 'text',
  admin: {
    components: {
      Field: '/fields/colorpicker/CustomTailWindColors#SelectColorFont',
    },
  },
}
export const BackgroundColorField: Field = {
  name: 'backgroundColor',
  label: 'Background Color',
  type: 'text',
  admin: {
    components: {
      Field: '/fields/colorpicker/CustomTailWindColors#SelectColorBackground',
    },
  },
}
export const solidColorField: Field = {
  name: 'backgroundColor',
  label: 'Background Color',
  type: 'text',
  admin: {
    components: {
      Field: '/fields/colorpicker/CustomTailWindColors#SelectColor',
    },
  },
}
