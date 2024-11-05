import { Access } from 'payload';
import { RolePermissions } from '@/payload-types';
import {Role} from '@/payload-types';

export const hasAccessToAction =
  (slugName: string, action: string): Access =>
  ({ req: { user } }) => {
    if (user) {
      if (user.isAdmin) return true;

      if (!user.userRoles || user.userRoles.length == 0) return false;

      const userRoles:Role[]= user.userRoles as Role[];
      // if (! userRoles[0].permissions) return false;
      const permissions:(RolePermissions|undefined) = userRoles[0].permissions
      if (!permissions) return false
      for (const permission of permissions) 
        if (((permission.entity as string[]).includes(slugName)) && ((permission.type as string[]).includes(action))) return true;
        
    }
    return false
  }