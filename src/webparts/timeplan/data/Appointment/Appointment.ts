import { Participant } from '../User/Participant'

export interface IAppointment{    
    appointmentDate?: Date,
    appointmentStart?: string,
    appointmentEnd?: string,
    personCount?: number,
    sharepointPrimaryId?: string,
    participants?: Participant[],
}

export class Appointment {

    sharepointPrimaryId?: string;

    appointmentDate: Date;
    appointmentStart: string;
    appointmentEnd: string;
    personCount: number;
    participants?: Participant[];

    private _WeekdaysGerman = [
        'Sonntag',
        'Montag',
        'Dienstag',
        'Mittwoch',
        'Donnerstag',
        'Freitag',
        'Samstag',
    ]

    constructor(obj: IAppointment ) {
        for (let key in obj) {
            this[key] = obj[key];
        }
    }

    getDayName():string {
        return this._WeekdaysGerman[this.appointmentDate.getDay()];
    }

    setDateAsDIN5008Format(dateAsString:string){
        const values = (dateAsString || '').trim().split('.');
        const day = values.length > 0 ? Math.max(1, Math.min(31, parseInt(values[0], 10))) : 0;
        const month = values.length > 1 ? Math.max(1, Math.min(12, parseInt(values[1], 10))) - 1 : 0;
        let year = values.length > 2 ? parseInt(values[2], 10) : 0; //TODO maybe include transformation if YY is inputted
        this.appointmentDate = new Date(year, month, day);
    }

    getDateAsDIN5008Format():string {
        return this.appointmentDate.getDate() + '.' + (this.appointmentDate.getMonth() + 1) + '.' + (this.appointmentDate.getFullYear());
    }

}