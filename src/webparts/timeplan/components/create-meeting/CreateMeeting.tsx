import * as React from 'react';
import styles from './CreateMeeting.module.scss';
import { ICreateMeetingProps } from './ICreateMeetingProps';
import { IMeetingState } from './IMeetingState';
import { Appointment } from '../../data/Appointment/Appointment';
import { User } from '../../data/User/User';

const initialState: IMeetingState = {
    meetingName: "Enter Text",
    distributionMethod: "Blub",
    appointmentList: [new Appointment()],
    invitedUserList: [new User('1','Max','Mustermann')],
    activated: false,
}

export class CreateMeeting extends React.Component < any, IMeetingState > {

    readonly state: IMeetingState = initialState;

    public render(): React.ReactElement<ICreateMeetingProps> {
        return(
        <div className = { styles.createMeeting } >
            <div>  
                <h1> Veranstaltung erstellen </h1>
                <div>
                    <div>
                        <p>Veranstaltungsname: </p>
                        <input>this.state.meetingName</input>
                    </div>
                    <div>
                        <p>Verteilalgorithmus: </p>
                        <input>this.state.distributionMethod</input>
                    </div>
                </div>
                <div>
                    <table>
                        <tr>
                            <th>Datum</th>
                            <th>Tag</th>
                            <th>Von</th>
                            <th>Bis</th>
                            <th>Personen</th>
                        </tr>
                        {this.state.appointmentList.map(appointment => {
                            return <tr>
                                    <td>{appointment.getDate().toDateString()}</td>
                                    <td>{appointment.getDay()}</td>
                                    <td>{appointment.getAppointmentStart()}</td>
                                    <td>{appointment.getAppointmentEnd()}</td>
                                    <td>{appointment.getPersonCount()}</td>
                                   </tr>
                        })}
                    </table>
                </div>
                <div>
                    <button>Neuer Termin</button>
                    <button>Bearbeiten</button>
                    <button>Loeschen</button>
                </div>
                <div>
                    <table>
                        <tr>
                            <th>Eingeladener Benutzer</th>
                            <th>E-Mail</th>
                        </tr>
                        {this.state.invitedUserList.map(user => {
                            return <tr>
                                    <td>{user.getName()}</td>
                                    <td>{user.getEMail()}</td>
                                   </tr>
                        })}
                    </table>
                </div>
                <div>
                    <button>Benutzer einladen</button>
                    <button>Loeschen</button>
                </div>
                <div>
                    <p>Freigeben:</p>
                </div>
            </div >
        </div>
        );
    }
}