import { DayOfWeek } from 'office-ui-fabric-react/lib/DatePicker';

export interface ICreateAppointmentState{
    from?: string,
    until?: string,
    persons?: string,
    firstDayOfWeek?: DayOfWeek,
    meetingDate?: Date | null;
}