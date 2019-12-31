import { Meeting } from '../../data/Meeting/Meeting';
import { Appointment } from '../../data/Appointment/Appointment';
import { User } from '../../data/User/User';
import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { Choice } from '../../data/Distributions/Choise';
import { Priority } from '../../data/Distributions/FairDistribution/Priority';

export interface IMeetingStatusState{
    meeting?: Meeting,
    appointmentList?: Appointment[],
    allUsers?: User[],
    invitedUserList?: User[],
    choiceList?: Choice[],
    priorityList?: Priority[],
    appointmentColumns?:IColumn[],
    unassignedInvitedUsersColumns?:IColumn[],
    assignedInvitedUsersColumns?:IColumn[],
    distributionButtonVisible?:boolean
}