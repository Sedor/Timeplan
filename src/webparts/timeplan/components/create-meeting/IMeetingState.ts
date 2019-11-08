import { Appointment } from '../../data/Appointment/Appointment';
import { User } from '../../data/User/User';
import { Meeting } from '../../data/Meeting/Meeting';
import { DistributionNames } from '../../data/Distributions/DistributionNames';

import { IColumn } from 'office-ui-fabric-react';

export interface IMeetingState{
    userColumns:IColumn[],
    appointmentColumns:IColumn[],
    selectedAppointment:Appointment,
    meeting:Meeting,
    isUpdate: boolean,
    meetingName: string,
    distributionMethod: DistributionNames,
    appointmentList: Appointment[],
    invitedUserList: User[],
    activated: boolean,
}