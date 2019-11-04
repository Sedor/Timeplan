import * as React from 'react';
import styles from './CreateMeeting.module.scss';
import { ICreateMeetingProps } from './ICreateMeetingProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IMeetingState } from './IMeetingState';

const initialState: IMeetingState = {
    event: {
        name: 'Tri-State Office 365 User Group',
        location: 'Malvern, PA',
        organizers: ['Jason', 'Michael'],
        numOfAttendees: 33
    }
}

export class CreateMeeting extends React.Component < any, IMeetingState > {

    readonly state: IMeetingState = initialState;

    public render(): React.ReactElement<ICreateMeetingProps> {
        return(
        //<div className = { styles.createEvent } >
        <div>  
            <h1> Create_Event </h1>
            <div>
                <h2>{this.state.event.name}</h2>
                <div>{this.state.event.location}</div>
                <div>{'Organizers: ' + this.state.event.organizers.join(', ')}</div>
                <div>{this.state.event.numOfAttendees + ' attendees'}</div>
            </div>
        </div >
        );
    }
}