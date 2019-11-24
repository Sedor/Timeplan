import { User, IUser } from './User';


export interface IParticipant extends IUser{    
    participantId?: string;
    isAssigned?: boolean;
    appointmentPriority?: Map<string, number>;
}


export class Participant extends User{

    participantId: string;
    isAssigned: boolean;
    appointmentPriority: Map<string, number>;


    constructor(obj: IParticipant ) {
        super(obj);
        for (let key in obj) {
            this[key] = obj[key];
        }
    }
}