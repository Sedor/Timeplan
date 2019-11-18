import { sp, ItemAddResult, spODataEntity, Item, List } from '@pnp/sp';
import { Meeting } from '../data/Meeting/Meeting';
import { MeetingStatus } from '../data/Meeting/MeetingStatus';
import { DistributionNames } from '../data/Distributions/DistributionNames';
import { UserService } from './User-Service';


export class MeetingService {

    static readonly meetingListName:string = 'MeetingList';

    public static async getMeetingList():Promise<Meeting[]> {
        console.log('Service.getMeetingList');
        return await sp.web.lists.getByTitle(this.meetingListName).items.get().then((itemsArray: any[]) => {
            return itemsArray.map(element => {
                return new Meeting({
                    id:element.Id,
                    title:element.Title,
                    description:element.akag,
                    status: element.status,
                    distribution: element.distribution
                });
            })
        });
    }

    public static async saveMeeting(meeting:Meeting):Promise<string> {
        console.log('Service.saveMeeting');
        console.log(meeting);
        return await sp.web.lists.getByTitle(this.meetingListName).items.add({
            Title: meeting.getTitle(),
            akag: meeting.getDescription(),
            status: meeting.status,
            distribution: meeting.distribution,
        }).then((itemResult:ItemAddResult)=>{
            return itemResult.data.ID;
        })
    }


    public static async deleteMeetingById(meetingId:string) {
        //TODO Delete Participants and the distribution 
        //TODO First delete all Users from InvitationList
        //TODO Second remove all Appointments to this meeting
        //TODO Third delete the meeting
        console.log('deleteMeetingById');
        UserService.deleteAllInvitedUserForMeetingID(meetingId).then(result =>{
            console.log('User deletion complete');
            console.log(result);
        });


        // sp.web.lists.getByTitle(this.meetingListName).items.getById(meetingId).delete().then(_ => {
        //     console.log('List Item Deleted')
        // });    
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

}

