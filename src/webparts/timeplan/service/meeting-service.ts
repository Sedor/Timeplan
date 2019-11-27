import { sp, ItemAddResult, ItemUpdateResult, spODataEntity, Item, List } from '@pnp/sp';
import { TypedHash } from '@pnp/common/src/collections';
import { Meeting } from '../data/Meeting/Meeting';
import { MeetingStatus } from '../data/Meeting/MeetingStatus';
import { DistributionNames } from '../data/Distributions/DistributionNames';
import { UserService } from './User-Service';
import { AppointmentService } from './Appointment-Service';


export class MeetingService {

    static readonly meetingListName:string = 'MeetingList';

    public static async testUpdate(meeting:Meeting){
        console.log('testUpdate');
        console.log(meeting);
        sp.web.lists.getByTitle('test').items.getItemByStringId
        return await sp.web.lists.getByTitle('test').items.getById(1).update({
            'Title': 'Another Tit312le',
            'blub': 'testin31g'
        }).then(result => {
            console.log(result);
        });
            
    }


    public static async getMeetingList():Promise<Meeting[]> {
        console.log('Service.getMeetingList');
        return await sp.web.lists.getByTitle(this.meetingListName).items.get().then((itemsArray: any[]) => {
            return itemsArray.map(element => {
                console.log(element);
                return new Meeting({
                    sharepointPrimaryId:element.Id,
                    title:element.Title,
                    description:element.akag,
                    status: element.status,
                    distribution: element.distribution
                });
            })
        });
    }

    public static async saveMeeting(meeting:Meeting):Promise<number> {
        console.log('Service.saveMeeting()');
        console.log(meeting);
        return await sp.web.lists.getByTitle(this.meetingListName).items.add({
            Title: meeting.getTitle(),
            akag: meeting.getDescription(),
            status: meeting.status,
            distribution: meeting.distribution,
        }).then((itemResult:ItemAddResult)=>{
            return itemResult.data.ID;
        });
    }

    public static async updateMeeting(meeting:Meeting) {
        console.log('Service.updateMeeting()');
        return await sp.web.lists.getByTitle(this.meetingListName).items.getById(meeting.getSharepointPrimaryId()).update({
            Title: String(meeting.getTitle()),
            akag: String(meeting.getDescription()),
            status: meeting.status,
            distribution: meeting.distribution,
        });          
    }


    public static async deleteMeetingById(meetingId:number) {
        //TODO Delete Participants and the distribution 
        console.log('Service.deleteMeetingById()');
        try {
            UserService.batchDeleteAllInvitedUserForMeetingID(meetingId);  // TODO thing about serial VS parallel
            AppointmentService.batchDeleteAppointmentsByMeetingId(meetingId);
            return sp.web.lists.getByTitle(this.meetingListName).items.getById(meetingId).delete();    
        } catch (error) {
            return error
        }
    }

}

