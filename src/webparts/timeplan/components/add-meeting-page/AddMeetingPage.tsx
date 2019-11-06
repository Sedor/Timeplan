import * as React from 'react';
import styles from './AddMeetingPage.module.scss';
import { IAddMeetingPageProps } from './IAddMeetingPageProps';
import { IAddMeetingPageState } from './IAddMeetingPageState';
import { MeetingService } from '../../service/meeting-service'

const initialState: IAddMeetingPageState = {
    event: {
        name: 'Tri-State Office 365 User Group',
        location: 'Malvern, PA',
        organizers: ['Jason', 'Michael'],
        numOfAttendees: 33
    }
}

export class AddMeetingPage extends React.Component < any, IAddMeetingPageState > {

    readonly state: IAddMeetingPageState = initialState;

    public shoot1():void {
        MeetingService.getMeetingList();
    }
    public shoot2():void {
        MeetingService.getMeetingById('1');
    }

    public shoot3():void {
        MeetingService.updateMeetingById(null);
    }

    public shoot4():void {
        MeetingService.addMeeting(null);
    }

    public shoot5():void {
        MeetingService.deleteMeetingById(null);
    }

    public render(): React.ReactElement<IAddMeetingPageProps> {
        return(
        <div>  
            <p> AddMeetingPage Modal Component</p>
            <button onClick={this.shoot1}>Get Meeting List</button>
            <button onClick={this.shoot2}>Get Meeting ID 1</button>
            <button onClick={this.shoot3}>Update Meeting ID 2</button>
            <button onClick={this.shoot4}>Add Random Meeting</button>
            <button onClick={this.shoot5}>Delete Meeting ID 3</button>
        </div >
        );
    }
}