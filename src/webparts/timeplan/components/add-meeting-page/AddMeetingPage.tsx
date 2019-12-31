import * as React from 'react';
import styles from './AddMeetingPage.module.scss';
import { IAddMeetingPageProps } from './IAddMeetingPageProps';
import { IAddMeetingPageState } from './IAddMeetingPageState';
import { MeetingService } from '../../service/Meeting-Service';
import { UserService } from '../../service/User-Service';
import { Meeting } from '../../data/Meeting/Meeting';
import { Appointment } from '../../data/Appointment/Appointment';
import { AppointmentService } from '../../service/Appointment-Service';
import { PermissionService } from '../../service/Permission-Service';
import { ListService } from '../../service/List-Service';
import { DistributionService } from '../../service/Distribution-Service';
import { User } from '../../data/User/User';
import { CalendarService } from '../../service/Calendar-Service';
import { SPEvent } from '../../data/SPEvent/SPEvent';

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

    public addNewMeeting():void {
        // let newMeeting = new Meeting('8','NewMeeting','A new Meeting that got saved');
        // console.log('Adding a new Meeting');
        // console.log(newMeeting);
        // MeetingService.addMeeting(newMeeting);
        // console.log('New Meeting got added');
    }

    public deleteMeetingWithID4():void {
        console.log('Delete Meeting with ID 4')
        MeetingService.deleteMeetingById(4);
    }

    public testPermissions(){
        PermissionService.getUserPermission('test');
    }

    public getListOfAppointmentsByMeeting() {
        console.log('getListOfAppointmentsByMeeting');
        // let appointmentlist: Appointment[];
        AppointmentService.getAppointmentListForMeetingId(1)
        .then(list => {
            console.log('Got AppointmentList');
            console.log(list);
        });
    }

    public addAppointmentToFirstMeeting() {
        console.log('addAppointmentToFirstMeeting');
        // let appointment = new Appointment({
        //     foreignMeetingId: '1',
        //     appointmentDate: new Date().toDateString(),
        //     appointmentStart: '12:00',
        //     appointmentEnd: '15:00',
        //     personCount: '2',
        // });
        // AppointmentService.addAppointment(appointment).then(result => {console.log('addded appointment')})
    }

    public getCurrentUser(){
        UserService.getCurrentUser();

    }

    public testAssignedRoleOfCurrentUser() {
            // UserService.createParticipantsList(null);
    }

    public testUserFinding(){
        UserService.getUserSearch(null);
    }

    public testUserResolve(){
        UserService.getUserByEmail('buri@mail.hs-ulm.de');
    }

    public testUserResolve2(){
        UserService.getUserByEmail('camdere@hs-ulm.de');
    }

    public testCreateList(){
        ListService.createList();
    }
    
    public TestGetPrio(){
        // DistributionService.getPriorityListForAppointmentList([35,34], 3);
    }

    public testBatchGetChoice(){
        console.log('look here');
        console.log(DistributionService.getChoiceListOfInvitedUserList([new User({sharepointId: 86}),new User({sharepointId: 87}) ]));

    }

    public testEventget(){
        console.log('testEventget');
        console.log(CalendarService.getEvents());
    }

    public testEventAdd(){
        console.log('testEventAdd');
        CalendarService.addEvent(new SPEvent({
            description:'This is to test a description',
            title:'new Testing Title'
        }))
    }


    public render(): React.ReactElement<IAddMeetingPageProps> {
        return(
        <div>  
            <h1>Testing fields</h1>
            <div>
                <button onClick={this.getMeetingList}>Get Meeting List</button>
            </div>
            <div>
                <button onClick={this.addNewMeeting}>Add new Meeting</button>
            </div>
            <div>
                <button onClick={this.deleteMeetingWithID4}>Delete Meeting ID 4</button>
            </div>
            <div>
                <button onClick={this.getListOfAppointmentsByMeeting}>Get AppointmentList for Meeting ID 1</button>
            </div>
            <div>
                <button onClick={this.addAppointmentToFirstMeeting}>Add Appointment to Meeting ID 1</button>
            </div>
            <div>
                <button onClick={this.testAssignedRoleOfCurrentUser}>Check Permission</button>
            </div>
            <div>
                <button onClick={this.testUserFinding}>Find User</button>
            </div>
            <div>
                <button onClick={this.testPermissions}>Test Permissions</button>
            </div>
            <div>
                <button onClick={this.getCurrentUser}>Get CurrentUser</button>
            </div>
            <div>
                <button onClick={this.testUserResolve}>Get buri@hs-ulm.de User</button>
            </div>
            <div>
                <button onClick={this.testUserResolve2}>Get camdere@hs-ulm.de User</button>
            </div>
            <div>
                <button onClick={this.testCreateList}>Create TestList</button>
            </div>
            <div>
                <button onClick={this.TestGetPrio}>Test Get Prio for UserID 3</button>
            </div>
            <div>
                <button onClick={this.testBatchGetChoice}>Test batch get userChoice</button>
            </div>
            <div>
                <button onClick={this.testEventget}>Test Events</button>
            </div>
            <div>
                <button onClick={this.testEventAdd}>Test Events Adding</button>
            </div>
        </div >
        );
    }
}