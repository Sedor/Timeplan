import { Meeting } from '../../data/Meeting/Meeting';
import { Appointment } from '../../data/Appointment/Appointment';
import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { User } from '../../data/User/User';
import { Priority } from '../../data/Distributions/FairDistribution/Priority';
import { Choice } from '../../data/Distributions/Choise';

export interface ISetPreferenceState{
    meeting?: Meeting,
    appointmentList?: Appointment[],
    priorityList?:Priority[],
    appointmentColumns?:IColumn[],
    currentUser?:User,
    choice?:Choice
}