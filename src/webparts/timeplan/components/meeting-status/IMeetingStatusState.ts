import { Meeting } from '../../data/Meeting/Meeting';
import { Appointment } from '../../data/Appointment/Appointment';
import { User } from '../../data/User/User';
import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { Choice } from '../../data/Distributions/Choise';

export interface IMeetingStatusState{
    meeting?: Meeting,
    appointmentList?: Appointment[],
    invitedUserList?: User[],
    choiceList?: Choice[]
    appointmentColumns?:IColumn[],
    unassignedInvitedUsersColumns?:IColumn[],
    assignedInvitedUsersColumns?:IColumn[],
}