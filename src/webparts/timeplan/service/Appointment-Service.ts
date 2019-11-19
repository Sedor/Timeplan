import { sp, ItemAddResult, Item, List } from '@pnp/sp';
import { IAppointment, Appointment } from '../data/Appointment/Appointment'
import { Meeting } from '../data/Meeting/Meeting'

export class AppointmentService {

    static readonly appointmentListName:string = 'AppointmentList';

    public static convertTypescriptDateToSPDate(date:Date):string {
        return (date.getMonth()) + 1 + '/' + date.getDate() + '/' + (date.getFullYear());
    }

    public static convertSPDateToTypescriptDate(spDate:string):Date{
        spDate = spDate.split('T')[0]; // getting 
        const values = (spDate || '').trim().split('-');
        const year = values.length > 0 ? parseInt(values[0], 10) : 0;
        const month = values.length > 1 ? Math.max(1, Math.min(12, parseInt(values[1], 10))) - 1 : 0;
        const day = values.length > 2 ? Math.max(1, Math.min(31, parseInt(values[2], 10))) : 0;
        return new Date(year, month, day);
    }

    public static async getAppointmentListForMeetingId(meetingId:string):Promise<Appointment[]> { 
        try {
            return await sp.web.lists.getByTitle(this.appointmentListName).items.filter(`Title eq ${meetingId}`).get().then((itemsArray: any[]) => {
                return itemsArray.map(element => {
                    return new Appointment({
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

    public static async saveAppointment(meetingId:string, appointment:IAppointment){
        console.log('Service.saveAppointment()');
        console.log(appointment);
        console.log(meetingId);
        return await sp.web.lists.getByTitle(this.appointmentListName).items.add({
            Title: String(meetingId),
            zdky: this.convertTypescriptDateToSPDate(appointment.appointmentDate),
            OData__x006d_vo4: appointment.appointmentStart,
            h4en: appointment.appointmentEnd,
            pexl: String(appointment.personCount)
        })
    }

    public static async saveAppointments(meetingId:string, appointmentList:Appointment[]){
        console.log('Service.saveAppointments()');
        console.log(appointmentList);
        appointmentList.forEach((appointment:Appointment)=>{
            try {
                this.saveAppointment(meetingId, appointment);
            } catch (error) {
                return error;
            }
        });
    }

    public static async batchDeleteAppointments(appointmentList:Appointment[]) {
        console.log('Service.batchDeleteAppointments()');
        let batch = sp.web.createBatch();
        appointmentList.forEach( appointment  => {
            sp.web.lists.getByTitle(this.appointmentListName).items.getItemByStringId(appointment.sharepointPrimaryId).inBatch(batch).delete();
        });
        batch.execute();
    }

    public static async batchDeleteAppointmentsByMeetingId(meetingId:string) {
        console.log('Service.deleteAppointmentByMeetingId()');
        let batch = sp.web.createBatch();
        return await this.getAppointmentListForMeetingId(meetingId).then((appointmentList:Appointment[]) => {
            appointmentList.forEach( appointment  => {
                sp.web.lists.getByTitle(this.appointmentListName).items.getItemByStringId(appointment.sharepointPrimaryId).inBatch(batch).delete();
            });
            batch.execute();
        })
    }
    
}

