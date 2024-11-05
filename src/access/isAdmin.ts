import { Access, FieldAccess } from 'payload'
import { User } from '@/payload-types'

export const isAdmin: Access<User> = ({ req: { user } }) => {
  // Return true or false based on if the user has an admin role
  return Boolean(user?.isAdmin)
}

export const isAdminFieldLevel: FieldAccess<{ id: string }, User> = ({
  req: { user },
}) => {
  // Return true or false based on if the user has an admin role
  return Boolean(user?.isAdmin)
}