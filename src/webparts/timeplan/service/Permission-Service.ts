import { sp,  } from '@pnp/sp';
import { graph } from "@pnp/graph";
import { User, IUser } from '../data/User/User'

export class PermissionService {

    public static async getUserPermission(user: string):Promise<User[]> {
        user = 'hs-ulm/buri';
        sp.web.getUserEffectivePermissions(user).then( result => {
            console.log(user);
            console.log('getUserEffectivePermissions');
            console.log(result);
        })

        user = 'buri';
        sp.web.getUserEffectivePermissions(user).then( result => {
            console.log(user);
            console.log('getUserEffectivePermissions');
            console.log(result);
        })

        sp.web.roleAssignments.get().then(result => {
            console.log('roleAssignments');
            console.log(result); 
        });
        return null;
    } 

}
//import { sp, PermissionKind } from "@pnp/sp";

// sp.web.getCurrentUserEffectivePermissions().then(perms => {

//     if (sp.web.hasPermissions(perms, PermissionKind.AddListItems) && sp.web.hasPermissions(perms, PermissionKind.DeleteVersions)) {
//         // ...
//     }
// });