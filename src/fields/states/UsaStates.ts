import type { Field } from 'payload'
import { stateSelectOptions } from '@/refdata/usastates'
export const USAState: Field = {
  admin: {
    width: '26%',
    condition: (_, siblingData) => {
      const countryType = siblingData?.country
      return countryType === 'usa'
    },
  },
  name: 'usaState',
  label: 'State',
  type: 'select',
  hasMany: false,
  options: stateSelectOptions,
}
