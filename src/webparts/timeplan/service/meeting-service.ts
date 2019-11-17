import { sp, ItemAddResult, spODataEntity, Item, List } from '@pnp/sp';
import { Meeting } from '../data/Meeting/Meeting';
import { MeetingStatus } from '../data/Meeting/MeetingStatus';
import { DistributionNames } from '../data/Distributions/DistributionNames';

export class MeetingService {

    static readonly meetingListName:string = 'MeetingList';

    public static async getMeetingList():Promise<Meeting[]> {
        console.log('Service.algetMeetingList');
        return await sp.web.lists.getByTitle(this.meetingListName).items.get().then((itemsArray: any[]) => {
            return itemsArray.map(element => {
                return new Meeting({
                    id:element.Id,
                    title:element.Title,
                    description:element.akag,
                    status: MeetingStatus[(element.status as string)],
                    distribution: element.distribution
                });
            })
        });
    }

    public static saveMeeting(meeting:Meeting):void {
        console.log('saveMeeting');
        console.log(meeting);
        sp.web.lists.getByTitle(this.meetingListName).items.add({
            Title: meeting.getTitle(),
            akag: meeting.getDescription(),
            status: meeting.status,
            distribution: meeting.distribution,
            // status: MeetingStatus[(element.status as string)],
            // distribution: distributionAlg
          }).then((iar: ItemAddResult) => {
            console.log(iar);
          });
    }

    //deprecated for now
    public static async getMeetingById(id:string):Promise<Meeting> {
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

    //deprecated for now
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

    public static deleteMeetingById(meetingId:number):void {
        sp.web.lists.getByTitle(this.meetingListName).items.getById(meetingId).delete().then(_ => {
            console.log('List Item Deleted')
        });    
    }

}

