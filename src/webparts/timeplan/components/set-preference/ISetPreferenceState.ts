import { Meeting } from '../../data/Meeting/Meeting';
import { Appointment } from '../../data/Appointment/Appointment';
import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { Participant } from '../../data/User/Participant';

export interface ISetPreferenceState{
    meeting?: Meeting,
    appointmentList?: Appointment[],
    appointmentColumns?:IColumn[],
    participant?:Participant
    comboBoxMap?:Map<string,boolean>
}