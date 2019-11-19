import { Appointment } from '../../../data/Appointment/Appointment';

export interface ICreateAppointmentProps{
    appointmentToEdit: Appointment;
    closeCreateAppointmentModal: () => void;
    addAppointmentToList: (appointment:Appointment) => void;
    updateAppointment: (toUpdate:Appointment, updatedAppointment: Appointment) => void;
    isUpdate: boolean;
}