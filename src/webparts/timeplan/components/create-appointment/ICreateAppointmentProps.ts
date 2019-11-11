import { Appointment } from '../../data/Appointment/Appointment';

export interface ICreateAppointmentProps{
    appointmentToEdit: Appointment;
    closeCreateAppointmentModal: () => void;
    addAppointmentToList: (appointment:Appointment) => void;
}