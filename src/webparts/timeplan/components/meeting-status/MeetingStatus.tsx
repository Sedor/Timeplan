import * as React from 'react';
import styles from './MeetingStatus.module.scss';
import { IMeetingStatusProps } from './IMeetingStatusProps';
import { IMeetingStatusState } from './IMeetingStatusState';
import { MeetingService } from '../../service/Meeting-Service';
import { UserService } from '../../service/User-Service';
import { Meeting } from '../../data/Meeting/Meeting';
import { Appointment } from '../../data/Appointment/Appointment';
import { AppointmentService } from '../../service/Appointment-Service';


const initialState: IMeetingStatusState = {
    event: {
        name: 'Tri-State Office 365 User Group',
        location: 'Malvern, PA',
        organizers: ['Jason', 'Michael'],
        numOfAttendees: 33
    }
}

export class MeetingStatus extends React.Component < any, IMeetingStatusState > {

    state: IMeetingStatusState = initialState;

    public render(): React.ReactElement<IMeetingStatusProps> {
        return(
        <div>
            <p>This is the Meeting Status</p>
        </div >
        );
    }
}