import { sp, ItemAddResult, Item, List } from '@pnp/sp';
import { IAppointment, Appointment } from '../data/Appointment/Appointment'
import { Meeting } from '../data/Meeting/Meeting'

export class AppointmentService {

    static readonly appointmentListName:string = 'AppointmentList';

    public static convertSPDateToTypescriptDate(spDate:string):Date{
        spDate = spDate.split('T')[0]; // getting 
        const values = (spDate || '').trim().split('-');
        const year = values.length > 0 ? parseInt(values[0], 10) : 0;
        const month = values.length > 1 ? Math.max(1, Math.min(12, parseInt(values[1], 10))) - 1 : 0;
        const day = values.length > 2 ? Math.max(1, Math.min(31, parseInt(values[2], 10))) : 0;
        return new Date(year, month, day);
    }

    public static async getAppointmentListForMeetingId(meetingId: string):Promise<Appointment[]> { 
        try {
            return await sp.web.lists.getByTitle(this.appointmentListName).items.filter(`Title eq ${meetingId}`).get().then((itemsArray: any[]) => {
                return itemsArray.map(element => {
                    return new Appointment({
                        foreignMeetingId: element.Title,
                        appointmentDate: this.convertSPDateToTypescriptDate(element.zdky),
                        appointmentStart: element.OData__x006d_vo4,
                        appointmentEnd: element.h4en,
                        personCount: parseInt(element.pexl),
                        sharepointPrimaryId: element.Id,
                    });
                })
            });
        } catch (error) {
            return error
        }
    }

    public static async addAppointment(appointment:IAppointment){
        try {
            console.log('addAppointmentToMeetingId');
            console.log(appointment);
            return await sp.web.lists.getByTitle(this.appointmentListName).items.add({
                Title: appointment.foreignMeetingId,
                zdky: appointment.appointmentDate,
                OData__x006d_vo4: appointment.appointmentStart,
                h4en: appointment.appointmentEnd,
                pexl: appointment.personCount
            })
        } catch (error) {
            return error
        }
    }

    // public static async getMeetingList():Promise<Meeting[]> { //DONE
    //     return await sp.web.lists.getByTitle(this.meetingListName).items.get().then((itemsArray: any[]) => {
    //         return itemsArray.map(element => {
    //             return new Meeting(element.Id, element.Title, element.akag);
    //         })
    //     });
    // }



    // public static async getMeetingById(id:string):Promise<Appointment> { 
    //     let item = await sp.web.lists.getByTitle(this.meetingListName).items.getItemByStringId(id).get().then(
    //         result => {
    //             return new Appointment(result.Id, result.Title,result.akag);
    //         });
    //     return item;
    // }

    // public static async updateMeetingById(meeting:Appointment):Promise<boolean> {
    //     return await sp.web.lists.getByTitle(this.meetingListName).items.getItemByStringId(meeting.getId()).update({
    //         Title: meeting.getTitle(),
    //         akag: meeting.getDescription(),
    //     }).then( () => {
    //         return true;
    //     }).catch( () => {
    //         return false;
    //     })
    // }

    // public static deleteMeetingById(meetingId:number):void {
    //     sp.web.lists.getByTitle(this.meetingListName).items.getById(meetingId).delete().then(_ => {
    //         console.log('List Item Deleted')
    //     });    
    // }

}

