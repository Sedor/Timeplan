import { Meeting } from '../../data/Meeting/Meeting';
import { Appointment } from '../../data/Appointment/Appointment';

export interface ISetPreferenceState{
    meeting: Meeting,
    appointmentList: Appointment[],
}