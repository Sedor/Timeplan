import { User, IUser } from './User';


export interface IParticipant extends IUser{    
    participantId: string;
    appointmentPriority: Map<string, number>[],
}


export class Participant extends User{

    constructor(obj: IParticipant ) {
        super(obj);
        for (let key in obj) {
            this[key] = obj[key];
        }
    }
}