import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminFieldLevel } from '../../access/isAdmin'
import { isAdminOrSelf } from '../../access/isAdminOrSelf'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'Admin',
    useAsTitle: 'completeName',
    listSearchableFields: ['firstName', 'lastName', 'email'],
  },
  access: {
    // Only admins can create users
    create: isAdmin,
    // Admins can read all, but any other logged in user can only read themselves
    read: isAdminOrSelf,
    // Admins can update all, but any other logged in user can only update themselves
    update: isAdminOrSelf,
    // Only admins can delete
    delete: isAdmin,
  },
  auth: {
    useAPIKey: true,
    tokenExpiration: (process.env.NODE_ENV == "production")? 43200 : 432000 // 12 hours in prod, 5 days in dev timeout
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          index: true,
        },
        {
          name: 'lastName',
          type: 'text',
          index: true,
        },
      ],
    },
    {
      type:'text',
      name: 'completeName',
      admin: {
        readOnly: true
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            // ensures data is not stored in DB
            delete siblingData['completeName']
          }
        ],
        afterRead: [
          ({ data }) => {
            return `${data?.firstName} ${data?.lastName}`;
          }
        ],
      },
    },
    {
      name: 'isAdmin',
      type: 'checkbox',
      defaultValue: true,
      saveToJWT: true,
      access: {
        // Only admins can create or update a value for this field
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
    },
    {
      name: 'userRoles',
      type: 'relationship',
      saveToJWT: true,
      relationTo: 'roles', // Reference the 'roles' collection
      hasMany: true, // Allow multiple roles per user
      access: {
        // Only admins can create or update a value for this field
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
    },
  ],
}
