import { Appointment } from "../../data/Appointment/Appointment";
import { User } from "../../data/User/User";
import { Meeting } from "../../../../../lib/webparts/timeplan/data/Meeting/Meeting";
import { IColumn } from "office-ui-fabric-react";

export interface IMeetingState{
    userColumns:IColumn[],
    appointmentColumns:IColumn[],
    selectedAppointment:Appointment,
    meeting:Meeting,
    isUpdate: boolean,
    meetingName: string,
    distributionMethod: string, // TODO Enum
    appointmentList: Appointment[],
    invitedUserList: User[],
    activated: boolean,
}