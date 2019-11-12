import { sp, ItemAddResult, spODataEntity, Item, List } from '@pnp/sp';
import { Meeting } from '../data/Meeting/Meeting';
import { MeetingStatus } from '../data/Meeting/MeetingStatus';

export class MeetingService {

    static readonly meetingListName:string = 'MeetingList';

    public static async getMeetingList():Promise<Meeting[]> { //DONE
        return await sp.web.lists.getByTitle(this.meetingListName).items.get().then((itemsArray: any[]) => {
            return itemsArray.map(element => {
                console.log(element);
                return new Meeting({
                    id:element.Id,
                    title:element.Title,
                    description:element.akag,
                    status: MeetingStatus[(element.status as string)]
                    // status: "CREATED"
                });
            })
        });
    }

    public static async getMeetingById(id:string):Promise<Meeting> { //DONE
        let item = await sp.web.lists.getByTitle(this.meetingListName).items.getItemByStringId(id).get().then(
            result => {
                return new Meeting({
                    id:result.Id,
                    title:result.Title,
                    description:result.akag
                });
            });
        return item;
    }

    public static async updateMeetingById(meeting:Meeting):Promise<boolean> {
        return await sp.web.lists.getByTitle(this.meetingListName).items.getItemByStringId(meeting.getId()).update({
            Title: meeting.getTitle(),
            akag: meeting.getDescription(),
        }).then( () => {
            return true;
        }).catch( () => {
            return false;
        })
    }

    public static addMeeting(meeting:Meeting):void {
        sp.web.lists.getByTitle(this.meetingListName).items.add({
            Title: meeting.getTitle(),
            akag: meeting.getDescription(),
          }).then((iar: ItemAddResult) => {
            console.log(iar);
          });
    }

    public static deleteMeetingById(meetingId:number):void {
        sp.web.lists.getByTitle(this.meetingListName).items.getById(meetingId).delete().then(_ => {
            console.log('List Item Deleted')
        });    
    }

}

