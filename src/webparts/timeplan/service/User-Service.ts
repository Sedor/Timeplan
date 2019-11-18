import { sp, ItemAddResult, PrincipalType, PrincipalSource, PeoplePickerEntity  } from '@pnp/sp';
import { User } from '../data/User/User'

export class UserService {

    static readonly invitationListName:string = 'Invitation';


    public static async saveInvitedUser(meetingId:string, user:User){
        console.log('Service.saveInvitedUser()');
        console.log(user);
        return await sp.web.lists.getByTitle(this.invitationListName).items.add({
            Title: String(meetingId),
            UserName: user.name,
            UserEmail: user.eMail
        })
    }

    //TODO Ask if userEmail is unique (one problem is Admin account has the same as User account)
    public static async saveInvitedUsers(meetingId:string, userList: User[]){
        console.log('Service.saveInvitedUsers()');
        console.log(meetingId);
        console.log(userList);
        userList.forEach((user:User)=>{
            try {
                this.saveInvitedUser(meetingId, user);
            } catch (error) {
                return error;
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

    public static async getInvitedUserListForMeetingId(meetingId:string):Promise<User[]> { 
        try {
            return await sp.web.lists.getByTitle(this.invitationListName).items.filter(`Title eq ${meetingId}`).get().then((itemsArray: any[]) => {
                return itemsArray.map(element => {
                    return new User({
                        id: element.Id,
                        name: element.UserName,
                        eMail: element.UserEmail,
                    });
                })
            });
        } catch (error) {
            return error
        }
    }

    public static async deleteAllInvitedUserForMeetingID(meetingId:string) {
        let batch = sp.web.createBatch();
        console.log('deleteAllInvitedUserForMeetingID');
        return await this.getInvitedUserListForMeetingId(meetingId).then((userList:User[]) => {
            // building my batch
            console.log('before inBatch');
            console.log(batch);
            userList.forEach( user => {
                sp.web.lists.getByTitle(this.invitationListName).items.getItemByStringId(user.id).inBatch(batch).delete();
            });
            console.log('after inBatch');
            console.log(batch);
            return batch.execute();
        })
    } 


    // sp.web.lists.getByTitle(this.meetingListName).items.getById(meetingId).delete().then(_ => {
    //     console.log('List Item Deleted')
    // });    

}

