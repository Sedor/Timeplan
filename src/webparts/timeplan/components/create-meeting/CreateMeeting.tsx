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
    invitedUserList: [new User('1','Max','max@mail.de')],
    activated: false,
}

export class CreateMeeting extends React.Component < any, IMeetingState > {

    readonly state: IMeetingState = initialState;

    public createNewAppointment():void {
        console.log('clicked CreateNewAppointment');
    }

    public modifyAppointment():void {
        console.log('clicked modifyAppointment');
    }

    public deleteAppointment():void {
        console.log('clicked deleteAppointment');
    }

    public inviteUser():void {
        console.log('clicked inviteUser');
    }

    public deleteInvitedUser():void {
        console.log('clicked deleteInvitedUser');
    }

    public render(): React.ReactElement<ICreateMeetingProps> {
        return(
        <div className = { styles.createMeeting } >
            <div>  
                <h1> Veranstaltung erstellen </h1>
                <div>
                    <div>
                        <p>Veranstaltungsname: </p>
                        <input type='text' name='meetingName' value={this.state.meetingName} />
                    </div>
                    <div>
                        <p>Verteilalgorithmus: </p>
                        <input type='text' name='distributionMethod' value={this.state.distributionMethod} />
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
                    <button onClick={this.createNewAppointment} >Neuer Termin</button>
                    <button onClick={this.modifyAppointment} >Bearbeiten</button>
                    <button onClick={this.deleteAppointment} >Loeschen</button>
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
                    <button onClick={this.inviteUser} >Benutzer einladen</button>
                    <button onClick={this.deleteInvitedUser} >Loeschen</button>
                </div>
                <div>
                    <p>Freigeben:</p>
                </div>
            </div >
        </div>
        );
    }
}