import { Appointment } from '../../data/Appointment/Appointment';

export interface ICreateAppointmentProps{
    appointmentToEdit: Appointment;
    foreignMeetingId: string;
    closeCreateAppointmentModal: () => void;
    addAppointmentToList: (appointment:Appointment) => void;
}