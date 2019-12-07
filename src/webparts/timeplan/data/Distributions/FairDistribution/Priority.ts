export interface IPriority{
    sharepointId?:number,
    priorityNumber?:number,
    appointmentSharePointId?:number,
    invitedUserSharepointId?:number
}

export class Priority implements IPriority {

    public sharepointId?:number;
    public priorityNumber?:number;
    public appointmentSharePointId?:number;
    public invitedUserSharepointId?:number;

    constructor(obj: IPriority ) {
        for (let key in obj) {
            this[key] = obj[key];
        }
    }

    getSharepointId():number{
        console.log(`returned ${this.sharepointId}`);
        return this.sharepointId;
    }

    getPriorityNumber():number{
        return this.priorityNumber;
    }

    getAppointmentSharePointId():number{
        return this.appointmentSharePointId;
    }

    getInvitedUserSharepointid():number{
        return this.invitedUserSharepointId;
    }

    setSharepointId(sharepointId:number){
        this.sharepointId = sharepointId;
    }

    setPriorityNumber(priorityNumber:number){
        this.priorityNumber = priorityNumber;
    }

    setAppointmentSharePointId(appointmentSharePointId:number){
        this.appointmentSharePointId = appointmentSharePointId;
    }

    setInvitedUserSharepointid(invitedUserSharepointId:number){
        this.invitedUserSharepointId = invitedUserSharepointId;
    }


}