import * as React from 'react';
import styles from './AddMeetingPage.module.scss';
import { IAddMeetingPageProps } from './IAddMeetingPageProps';
import { IAddMeetingPageState } from './IAddMeetingPageState';
import { MeetingService } from '../../service/meeting-service';
import { Meeting } from '../../data/Meeting/Meeting';

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

    public getMeetingList():void {
        console.log('requesting meeting list:');
        let meetinglist:Meeting[];
        MeetingService.getMeetingList().then(list => {
            meetinglist = list
            console.log('got meeting list:');
            console.log(meetinglist);
        });
        
    }

    public getMeetingWithId():void {
        console.log('requesting meeting with ID 3:');
        let meeting:Meeting;
        MeetingService.getMeetingById('3').then(item => {
            meeting = item
            console.log('got meeting:');
            console.log(meeting);
        });
        
    }

    public UpdateMeetingWithId1():void {
        console.log('Update Meeting with ID 1:');
        let meeting:Meeting;
        MeetingService.getMeetingById('1').then(meetingItem => {
            meeting= meetingItem
            console.log('Meeting got Updated with:')
            console.log(meeting)
        });
        meeting.title = 'A Brand new Title' 
        MeetingService.updateMeetingById(meeting);
    }

    public addNewMeeting():void {
        let newMeeting = new Meeting('8','NewMeeting','A new Meeting that got saved');
        console.log('Adding a new Meeting');
        console.log(newMeeting);
        MeetingService.addMeeting(newMeeting);
        console.log('New Meeting got added');
    }

    public deleteMeetingWithID4():void {
        console.log('Delete Meeting with ID 4')
        MeetingService.deleteMeetingById(4);
    }

    public render(): React.ReactElement<IAddMeetingPageProps> {
        return(
        <div>  
            <h1>Testing fields</h1>
            <div>
                <button onClick={this.getMeetingList}>Get Meeting List</button>
            </div>
            <div>
                <button onClick={this.getMeetingWithId}>Get Meeting with ID 3</button>
            </div>
            <div>
                <button onClick={this.UpdateMeetingWithId1}>Update Meeting ID with ID 1</button>
            </div>
            <div>
                <button onClick={this.addNewMeeting}>Add new Meeting</button>
            </div>
            <div>
                <button onClick={this.deleteMeetingWithID4}>Delete Meeting ID 4</button>
            </div>
        </div >
        );
    }
}