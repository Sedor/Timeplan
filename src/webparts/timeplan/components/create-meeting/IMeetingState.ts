import { Appointment } from "../../data/Appointment/Appointment";
import { User } from "../../data/User/User";

export interface IMeetingState{
    meetingName: string,
    distributionMethod: string, // TODO Enum
    appointmentList: Appointment[],
    invitedUserList: User[],
    activated: boolean,
}