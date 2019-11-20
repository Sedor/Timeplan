import { sp, ItemAddResult, ItemUpdateResult, spODataEntity, Item, List } from '@pnp/sp';
import { Meeting } from '../data/Meeting/Meeting';
import { MeetingStatus } from '../data/Meeting/MeetingStatus';
import { DistributionNames } from '../data/Distributions/DistributionNames';
import { UserService } from './User-Service';
import { AppointmentService } from './Appointment-Service';

export class MeetingService {

    static readonly meetingListName:string = 'MeetingList';

    public static async getMeetingList():Promise<Meeting[]> {
        console.log('Service.getMeetingList');
        return await sp.web.lists.getByTitle(this.meetingListName).items.get().then((itemsArray: any[]) => {
            return itemsArray.map(element => {
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

    public static async saveMeeting(meeting:Meeting):Promise<string> {
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
        try {
            return await sp.web.lists.getByTitle(this.meetingListName).items.getItemByStringId(meeting.getSharepointPrimaryId()).update({
                // Title: String(meeting.getTitle()),
                // akag: String(meeting.getDescription()),
                // status: meeting.status,
                // distribution: meeting.distribution,
            });    
        } catch (error) {
            console.log(meeting);
            console.log(error);
        }
        
    }


    public static async deleteMeetingById(meetingId:string) {
        //TODO Delete Participants and the distribution 
        console.log('Service.deleteMeetingById()');
        try {
            UserService.batchDeleteAllInvitedUserForMeetingID(meetingId);  // TODO thing about serial VS parallel
            AppointmentService.batchDeleteAppointmentsByMeetingId(meetingId);
            return sp.web.lists.getByTitle(this.meetingListName).items.getItemByStringId(meetingId).delete();    
        } catch (error) {
            return error
        }
    }

}

