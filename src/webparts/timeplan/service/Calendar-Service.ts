import { sp, ItemAddResult , ItemUpdateResult} from '@pnp/sp';
import { SPEvent } from '../data/SPEvent/SPEvent';
import { Appointment } from '../data/Appointment/Appointment';
import { User } from '../data/User/User';

export class CalendarService {

  static readonly calendarListName: string = 'CalendarList';

  //   "2019-12-31T03:00:00Z"
  private static _calculateIntoSPDateTime(appointmenTime:String, appointmentDate:Date):String{
    return appointmentDate.getFullYear()
            + '-' + this._leftpad(appointmentDate.getMonth() + 1, 2)
            + '-' + this._leftpad(appointmentDate.getDate(), 2)
            + 'T' + appointmenTime
            + ':' + this._leftpad(appointmentDate.getSeconds(), 2)
            + 'Z';
  }
  
  private static _leftpad(num:number, size:number): string {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }



  public static addEventsWithAppointmentList(title:String, appointmentlist:Appointment[]){
    console.log('Service.addEventsWithAppointmentList()');
    appointmentlist.forEach( (appointment:Appointment) => {
        if(appointment.getParticipant().length > 0){
            let wuserStringList:String = appointment.getParticipant().reduce((accumulator, currentValue) => {
                return accumulator + `${currentValue.getName()} : ${currentValue.getEMail()} <br>`}, '');
            this.addEvent(new SPEvent ({
                description: wuserStringList,
                endTime: this._calculateIntoSPDateTime(appointment.getAppointmentEndTime(), appointment.getAppointmentDate()),
                startTime: this._calculateIntoSPDateTime(appointment.getAppointmentStartTime(), appointment.getAppointmentDate()),
                title: title
            }));
        }
    })

  }

  public static async addEvent(event:SPEvent){
    console.log('Service.addEvents()');
    return sp.web.lists.getByTitle(this.calendarListName).items.add({
        Description: event.description,
        EndDate: event.endTime,
        EventDate: event.startTime,
        Title: event.title,
    })
  }

  public static async getEvents():Promise<SPEvent[]>{
    console.log('DistributionService.getEvents()');
    return await sp.web.lists.getByTitle(this.calendarListName).items.get().then(eventList => {
        console.log(eventList);
        return eventList.map( event => {
          return new SPEvent({
            description: event.Description,
            endTime: event.EndDate, //"2019-12-31T02:00:00Z"
            startTime: event.EventDate,  //"2019-12-31T02:00:00Z"
            title: event.Title
          });
      })
    });
  }

}
