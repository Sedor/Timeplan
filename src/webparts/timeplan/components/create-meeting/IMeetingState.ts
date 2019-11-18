import { Appointment } from '../../data/Appointment/Appointment';
import { User } from '../../data/User/User';
import { Meeting } from '../../data/Meeting/Meeting';
import { DistributionNames } from '../../data/Distributions/DistributionNames';

import { IColumn } from 'office-ui-fabric-react';

export interface IMeetingState{
    isUpdate?: boolean,
    clearance?: boolean,
    userColumns?:IColumn[],
    appointmentColumns?:IColumn[],
    selectedAppointment?:Appointment,
    selectedUser?:User,
    meeting?:Meeting,
    appointmentList?: Appointment[],
    invitedUserList?: User[],
    showAreUSureDialog?: boolean,
    showAppointmentModal?:boolean,
    showUserModal?:boolean,
}