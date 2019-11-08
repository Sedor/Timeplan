export class Appointment{

    public id: string;
    public date: string;
    public day: string;
    public appointmentStart: string;
    public appointmentEnd: string;
    public personCount: string 

    constructor(){
        this.id = '1';
        let date = new Date()
        this.date = date.toLocaleTimeString('en-us', { day:'numeric', month: 'numeric', year: 'numeric'});
        this.day = date.toLocaleTimeString('en-us', { weekday: 'long'})
        this.appointmentStart = '10:00';
        this.appointmentEnd = '12:00';
        this.personCount = '12';
    }

    public getId():string {
        return this.id;
    }

    public getDate():string {
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

    public getPersonCount():string {
        return this.personCount;
    }

}