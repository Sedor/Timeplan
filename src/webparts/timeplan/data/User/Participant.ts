import { User, IUser } from './User';
import { Appointment } from '../Appointment/Appointment';


export interface IParticipant extends IUser{    
    participantId?: string;
    isAssigned?: boolean;
    appointmentPriority?: Map<number, number>;
}


export class Participant extends User{

    participantId: string;
    isAssigned: boolean;
    // <AppointmentID, Priority>
    appointmentPriority: Map<number, number> = new Map();


    constructor(obj: IParticipant ) {
        super(obj);
        for (let key in obj) {
            this[key] = obj[key];
        }
    }

    public setPriority(appointment:Appointment, value:number){
        // TODO check if it will be unique in the Map
        this.appointmentPriority.set(appointment.sharepointPrimaryId, value);

    }


}