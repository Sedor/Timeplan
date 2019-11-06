export class Appointment{

    public id: string;
    public date: Date;
    public day: string;
    public appointmentStart: string;
    public appointmentEnd: string;
    public personCount: number 

    constructor(){
        this.id = '1';
        this.date = new Date();
        this.day = 'Monday'
        this.appointmentStart = '10:00';
        this.appointmentEnd = '12:00';
        this.personCount = 12;
    }

    public getId():string {
        return this.id;
    }

    public getDate():Date {
        return this.date;
    }

    public getDay():string {
        return this.day;
    }
    public getAppointmentStart():string {
        return this.appointmentStart;
    }

    public getAppointmentEnd():string {
        return this.appointmentEnd;
    }

    public getPersonCount():number {
        return this.personCount;
    }

}