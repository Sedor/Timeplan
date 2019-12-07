

export interface IChoice{
    sharepointId?:number,
    appointmentSharepointId?:number,
    invitedUserSharepointId?:number,
}

export class Choice{

    sharepointId?:number;
    appointmentSharepointId?:number;
    invitedUserSharepointId?:number;

    constructor(obj: IChoice) {
        for (let key in obj) {
            this[key] = obj[key];
        }
    }

    getSharepointId():number{
        return this.sharepointId;
    }

    getAppointmentSharepointId():number{
        return this.appointmentSharepointId;
    }

    getInvitedUserSharepointId():number{
        return this.invitedUserSharepointId;
    }

    setSharepointId(sharepointId:number){
        this.sharepointId = sharepointId;
    }

    setAppointmentSharepointId(appointmentSharepointId:number){
        this.appointmentSharepointId = appointmentSharepointId;
    }

    setInvitedUserSharepointId(invitedUserSharepointId:number){
        this.invitedUserSharepointId = invitedUserSharepointId;
    }

}
