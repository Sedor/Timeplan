import { sp, ItemAddResult, PrincipalType, PrincipalSource, PeoplePickerEntity, Item  } from '@pnp/sp';
import { User } from '../data/User/User'
import { CurrentUser } from '@pnp/sp/src/siteusers'; 

export class UserService {

    static readonly invitedUserList:string = 'Invitation';


    public static async saveInvitedUser(meetingId:number, user:User){
        console.log('Service.saveInvitedUser()');
        return await sp.web.lists.getByTitle(this.invitedUserList).items.add({
            Title: String(meetingId),
            UserName: user.name,
            UserEmail: user.eMail
        })
    }

    public static async batchSaveInvitedUsers(meetingId:number, userList: User[]){
        console.log('Service.batchSaveInvitedUsers()');
        let batch = sp.web.createBatch();
        userList.forEach((user:User)=>{
            sp.web.lists.getByTitle(this.invitedUserList).items.inBatch(batch).add({
                Title: String(meetingId),
                UserName: user.name,
                UserEmail: user.eMail
            });
        });
        return await batch.execute();
    }

    public static async batchUpdateInvitedUsers(meetingId:number, userList:User[]){
        console.log('Service.batchUpdateInvitedUsers()');
        let batch = sp.web.createBatch();
        userList.forEach((user:User)=>{
            sp.web.lists.getByTitle(this.invitedUserList).items.inBatch(batch).getById(user.sharepointId).update({
                Title: String(meetingId),
                UserName: user.name,
                UserEmail: user.eMail
            })
        })
        return await batch.execute();
    }


    public static async getCurrentUser():Promise<User> {
        return await sp.web.currentUser.get().then( result => {
            console.log('User-Service.getCurrentUser()');
            return new User({
                eMail: result.Email,
                name: result.Title
            });
        });       
    }

    public static async isCurrentUserSiteAdmin():Promise<boolean>{
        return await sp.web.currentUser.get().then( result => {
            return (result.IsSiteAdmin as boolean);
        })
    }

    public static async getUserByEmail(email: string):Promise<User> {
        return await sp.profiles.clientPeoplePickerResolveUser({
            AllowEmailAddresses: true,
            AllUrlZones: true,
            MaximumEntitySuggestions:7,
            PrincipalSource: PrincipalSource.UserInfoList,
            PrincipalType: PrincipalType.User,
            QueryString: email
        }).then( (peopleEntity:PeoplePickerEntity) => {
            console.log(peopleEntity);
            return new User({
                name: peopleEntity.DisplayText,
                eMail: peopleEntity.EntityData.Email
            });
        })
    }


    public static async getInvitedUserIdByEmailAndMeetingId(userEmail:string, meetingId:number){
        console.log('UserService.getInvitedUserIdByEmailAndMeetingId()');
        return await sp.web.lists.getByTitle(this.invitedUserList).items.filter(`Title eq '${meetingId}' and UserEmail eq '${userEmail}'`).get().then( (user:any[]) =>{
            if(user.length > 0){
                return new User({
                    sharepointId: user[0].ID,
                    eMail: user[0].UserName,
                    name: user[0].UserEmail
                })
            }
        });
    }

    public static async getUserSearch(search: string):Promise<User[]> {
        return await sp.profiles.clientPeoplePickerSearchUser({
            AllowEmailAddresses: true,
            AllowMultipleEntities: true,
            AllUrlZones: true,
            MaximumEntitySuggestions:7,
            PrincipalSource: PrincipalSource.All,
            PrincipalType: PrincipalType.User,
            QueryString: search
        }).then( (peopleList:PeoplePickerEntity[]) => {
            console.log(peopleList);
            console.log('look here');
            return peopleList.filter((entity:PeoplePickerEntity) => {
                return (entity.EntityData.Email);
            }).map( (entity:PeoplePickerEntity) => {
                return new User({
                    name:entity.DisplayText, 
                    eMail:entity.EntityData.Email
                });
            });
        })
    }

    public static async getInvitedUserListForMeetingId(meetingId:number):Promise<User[]> { 
        try {
            return await sp.web.lists.getByTitle(this.invitedUserList).items.filter(`Title eq ${meetingId}`).get().then((itemsArray: any[]) => {
                return itemsArray.map(element => {
                    return new User({
                        sharepointId: element.Id,
                        name: element.UserName,
                        eMail: element.UserEmail,
                    });
                })
            });
        } catch (error) {
            return error
        }
    }

    public static async batchDeleteInvitedUser(userList:User[]) {
        console.log('Service.batchDeleteInvitedUser()');
        let batch = sp.web.createBatch();
        userList.forEach( user => {
            sp.web.lists.getByTitle(this.invitedUserList).items.getById(user.sharepointId).inBatch(batch).delete();
        });
        batch.execute();
    }

    public static async batchDeleteAllInvitedUserForMeetingID(meetingId:number) {
        console.log('Service.deleteAllInvitedUserForMeetingID()');
        let batch = sp.web.createBatch();
        return await this.getInvitedUserListForMeetingId(meetingId).then((userList:User[]) => {
            userList.forEach( user => {
                sp.web.lists.getByTitle(this.invitedUserList).items.getById(user.sharepointId).inBatch(batch).delete();
            });
            batch.execute();
        })
    }

}

