import { Meeting } from '../../data/Meeting/Meeting';
import { Appointment } from '../../data/Appointment/Appointment';
import { User } from '../../data/User/User';
import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';

export interface IMeetingStatusState{
    meeting?: Meeting,
    appointmentList?: Appointment[],
    participantsList?: User[], //TODO Change to Participant
    appointmentColumns?:IColumn[],
    userColumns?:IColumn[],
}