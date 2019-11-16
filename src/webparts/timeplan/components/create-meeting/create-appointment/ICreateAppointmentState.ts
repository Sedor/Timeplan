import { DayOfWeek } from 'office-ui-fabric-react/lib/DatePicker';

export interface ICreateAppointmentState{
    from?: string,
    until?: string,
    persons?: number,
    meetingDate?: Date | null;
}