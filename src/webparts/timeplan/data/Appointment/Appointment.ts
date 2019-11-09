export interface IAppointment{    
    foreignMeetingId: string,
    appointmentDate: string,
    appointmentStart: string,
    appointmentEnd: string,
    personCount: string,
    sharepointPrimaryId?: string,
}

export class Appointment {

    foreignMeetingId: string;
    appointmentDate: string;
    appointmentStart: string;
    appointmentEnd: string;
    personCount: string;
    sharepointPrimaryId?: string;

    constructor(obj: IAppointment ) {
        for (let key in obj) {
            this[key] = obj[key];
        }
    }

    // public get sharepointPrimaryId():string {
    //     return this.sharepointPrimaryId;
    // }

    // public get appointmentDate():string {
    //     return this.appointmentDate;
    // }

    // public get appointmentDay():string {
    //     return this.appointmentDay;
    // }

    // public get appointmentStart():string {
    //     return this.appointmentStart;
    // }

    // public get appointmentEnd():string {
    //     return this.appointmentEnd;
    // }

    // public get personCount():string {
    //     return this.personCount;
    // }

    // public set sharepointPrimaryId(sharepointPrimaryId:string) {
    //     this.sharepointPrimaryId = sharepointPrimaryId;
    // }

    // public set appointmentDate(appointmentDate:string) {
    //     this.appointmentDate = appointmentDate;
    // }

    // public set appointmentDay(appointmentDay:string) {
    //     this.appointmentDay = appointmentDay;
    // }

    // public set appointmentStart(appointmentStart:string) {
    //     this.appointmentStart = appointmentStart;
    // }

    // public set appointmentEnd(appointmentEnd:string) {
    //     this.appointmentEnd = appointmentEnd;
    // }

    // public set personCount(personCount:string) {
    //     this.personCount = personCount;
    // }


}