import { sp, ItemAddResult, spODataEntity, Item, List } from '@pnp/sp';
import { User, IUser } from '../data/User/User'

export class UserService {

    static readonly userListName:string = 'UserList';

    public static async createParticipantsList(callingUser){
        sp.web.getCurrentUserEffectivePermissions().then(perms => {
            console.log('perms')
            console.log(perms);
        });

        sp.web.currentUser.get().then(tmp => {
            console.log('currentUser')
            console.log(tmp);
        });

        sp.web.roleDefinitions.get().then(tmp => {
            console.log('roleDefinitions')
            console.log(tmp);
        });

        
    }


    // sp.web.getCurrentUserEffectivePermissions().then(perms => {

    //     Logger.writeJSON(perms);
    // });


    // public static async getUserList(meetingId:String):Promise<User[]> { //DONE
    //     return await sp.web.lists.getByTitle(this.userListName).items.get().then((itemsArray: any[]) => {
    //         return itemsArray.map(element => {
    //             return new Meeting(element.Id, element.Title, element.akag);
    //         })
    //     });
    // }

    // public static async getMeetingById(id:string):Promise<Meeting> { //DONE
    //     let item = await sp.web.lists.getByTitle(this.meetingListName).items.getItemByStringId(id).get().then(
    //         result => {
    //             return new Meeting(result.Id, result.Title,result.akag);
    //         });
    //     return item;
    // }

    // public static async updateMeetingById(meeting:Meeting):Promise<boolean> {
    //     return await sp.web.lists.getByTitle(this.meetingListName).items.getItemByStringId(meeting.getId()).update({
    //         Title: meeting.getTitle(),
    //         akag: meeting.getDescription(),
    //     }).then( () => {
    //         return true;
    //     }).catch( () => {
    //         return false;
    //     })
    // }

    // public static addMeeting(meeting:Meeting):void {
    //     sp.web.lists.getByTitle(this.meetingListName).items.add({
    //         Title: meeting.getTitle(),
    //         akag: meeting.getDescription(),
    //       }).then((iar: ItemAddResult) => {
    //         console.log(iar);
    //       });
    // }

    // public static deleteMeetingById(meetingId:number):void {
    //     sp.web.lists.getByTitle(this.meetingListName).items.getById(meetingId).delete().then(_ => {
    //         console.log('List Item Deleted')
    //     });    
    // }

}

