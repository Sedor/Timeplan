import { Meeting } from '../../data/Meeting/Meeting';
import { Appointment } from '../../data/Appointment/Appointment';
import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { User } from '../../data/User/User';

export interface ISetPreferenceState{
    meeting?: Meeting,
    appointmentList?: Appointment[],
    appointmentColumns?:IColumn[],
    currentUser?:User,
    comboBoxMap?:Map<string, number>,
    checkBoxMap?:Map<string, boolean>
}