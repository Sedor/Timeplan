import { Meeting } from "../../data/Meeting/Meeting";
import { IColumn } from "office-ui-fabric-react/lib/DetailsList";

export interface IMainPageState{
    columns?: IColumn[],
    meetingList?:Meeting[],
    selectedMeeting?:Meeting,
}