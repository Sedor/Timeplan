import { Appointment } from '../../data/Appointment/Appointment';
import { User } from '../../data/User/User';
import { Meeting } from '../../data/Meeting/Meeting';

import { IColumn } from 'office-ui-fabric-react';

export interface IMeetingState{
    isUpdate?: boolean,
    userColumns?:IColumn[],
    appointmentColumns?:IColumn[],
    selectedAppointment?:Appointment,
    selectedUser?:User,
    meeting?:Meeting,
    appointmentList?: Appointment[],
    appointmentDeletionList?:Appointment[],
    invitedUserList?: User[],
    invitedUserDeletionList?: User[],
    showAreUSureDialog?: boolean,
    showAppointmentModal?:boolean,
    showUserModal?:boolean,
    appointmentIsUpdating?:boolean,
}