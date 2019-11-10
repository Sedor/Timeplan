import { Appointment } from '../../data/Appointment/Appointment';
import { User } from '../../data/User/User';
import { Meeting } from '../../data/Meeting/Meeting';
import { DistributionNames } from '../../data/Distributions/DistributionNames';

import { IColumn } from 'office-ui-fabric-react';

export interface IMeetingState{
    isUpdate?: boolean,
    activated?: boolean,

    showModal?:boolean,
    userColumns?:IColumn[],
    appointmentColumns?:IColumn[],
    selectedAppointment?:Appointment,
    meeting?:Meeting,
    distributionMethod?: DistributionNames,
    appointmentList?: Appointment[],
    invitedUserList?: User[],
    
}