import { User } from '../User/User'

export interface ISPEvent{  
    sharepointPrimaryId?: number,
    attendees?:User[],
    description?:String,
    endTime?:String,
    startTime?:String,
    title?:String
}

export class SPEvent {

    sharepointPrimaryId?: number;

    attendees: User[];
    description: String;
    endTime: String;
    startTime: String;
    title: String;

    constructor(obj: ISPEvent ) {
        for (let key in obj) {
            this[key] = obj[key];
        }
    }

}