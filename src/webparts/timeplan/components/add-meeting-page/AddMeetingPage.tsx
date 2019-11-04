import * as React from 'react';
import styles from './AddMeetingPage.module.scss';
import { IAddMeetingPageProps } from './IAddMeetingPageProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IAddMeetingPageState } from './IAddMeetingPageState';

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

    public render(): React.ReactElement<IAddMeetingPageProps> {
        return(
        <div>  
            <p> AddMeetingPage Modal Component</p>
        </div >
        );
    }
}