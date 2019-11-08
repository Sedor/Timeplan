import * as React from 'react';
import styles from './CreateMeeting.module.scss';
import { ICreateMeetingProps } from './ICreateMeetingProps';
import { IMeetingState } from './IMeetingState';
import { Appointment } from '../../data/Appointment/Appointment';
import { User } from '../../data/User/User';
import { Meeting } from '../../../../../lib/webparts/timeplan/data/Meeting/Meeting';
import { DefaultButton } from 'office-ui-fabric-react';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { TextField} from 'office-ui-fabric-react/lib/TextField';
import { DetailsList, Selection, IColumn} from 'office-ui-fabric-react/lib/DetailsList';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { DistributionNames } from '../../data/Distributions/DistributionNames';
import { Link } from 'react-router-dom';

const initialState: IMeetingState = {
    userColumns: [],
    appointmentColumns: [],
    selectedAppointment: new Appointment(),
    meeting: undefined,
    isUpdate: false,
    meetingName: "",
    distributionMethod: undefined,
    appointmentList: [new Appointment()],
    invitedUserList: [new User('1','Max','max@mail.de')],
    activated: false,
}

export class CreateMeeting extends React.Component < any, IMeetingState > {

    state: IMeetingState = initialState;
    private selection: Selection;

    constructor(props: any){
        super(props);

        // TODO get appointment List
        // vor now Mock appointments
        let list:Appointment[] = [
            new Appointment(),
            new Appointment(),
            new Appointment(),
            new Appointment(),
            new Appointment(),
        ];
        console.log('in Constructor');
        console.log('state is:');
        console.log(this.state);
        this.state ={
            userColumns: this._setUserColumnNames(),
            appointmentColumns: this._setAppointmentColumnNames(),
            selectedAppointment: this._getSelectedAppointment(),
            meeting: this.state.meeting,
            isUpdate: this.state.isUpdate,
            meetingName: this.state.meetingName,
            distributionMethod: this.state.distributionMethod,
            appointmentList: list,
            invitedUserList: this.state.invitedUserList,
            activated: this.state.activated
        }
        console.log('state was set to:');
        console.log(this.state);

        this._onDropdownChange = this._onDropdownChange.bind(this);
        this._onMeetingNameChange = this._onMeetingNameChange.bind(this);
        this._getSelectedAppointment = this._getSelectedAppointment.bind(this);
        this._onReleaseChange = this._onReleaseChange.bind(this);
        this.initializeSelectionCallback = this.initializeSelectionCallback.bind(this);
        this.createNewAppointment = this.createNewAppointment.bind(this);
    }

    private initializeSelectionCallback():void {
        this.selection = new Selection({
          onSelectionChanged: () => {
            console.log('onSelectionChanged:');
            console.log('state is:');
            console.log(this.state);
            this.setState({
                userColumns: this.state.userColumns,
                appointmentColumns: this.state.appointmentColumns,
                selectedAppointment: this._getSelectedAppointment(),
                meeting: this.state.meeting,
                isUpdate: this.state.isUpdate,
                meetingName: this.state.meetingName,
                distributionMethod: this.state.distributionMethod,
                appointmentList: this.state.appointmentList,
                invitedUserList: this.state.invitedUserList,
                activated: this.state.activated
            })
            console.log('state was set to:');
            console.log(this.state);
          }
        });
    }

    private _getSelectedAppointment():Appointment {
        console.log(this.selection);
        return new Appointment();
    }

    componentDidMount(){
        console.log('in ComponentDidMount');
        if(this.props.location.state !== undefined){
            console.log('this.prop.location.state is not undefined');
            if(this.props.location.state.selectedMeeting !== undefined){
                console.log('this.prop.location.state.selectedMeeting is not undefined');
                console.log('state is:');
                console.log(this.state);
                this.setState({
                    userColumns: this.state.userColumns,
                    appointmentColumns: this.state.appointmentColumns,
                    selectedAppointment: new Appointment(),
                    meeting:(this.props.location.state.selectedMeeting as Meeting),
                    isUpdate: true,
                    meetingName: (this.props.location.state.selectedMeeting as Meeting).title,
                    distributionMethod: this.props.distributionMethod,
                    appointmentList: this.state.appointmentList,
                    invitedUserList: [new User('1','Max','max@mail.de')],
                    activated: false, //TOODO get the status for this
                })
                console.log('state was set to:');
                console.log(this.state);
            }
        }
    }

    public createNewAppointment():void {
        console.log('clicked CreateNewAppointment');
        console.log(this.state);
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

    public saveMeeting():void{
        alert('Would now save the Meeting');
    }


    private _onReleaseChange(checked: boolean):void {
    
        console.log('_onReleaseChange:');
        console.log('state is:');
        console.log(this.state);
        this.setState({
            userColumns: this.state.userColumns,
            appointmentColumns: this.state.appointmentColumns,                 
            selectedAppointment: this.state.selectedAppointment,   
            meeting: this.state.meeting,
            isUpdate: this.state.isUpdate,
            meetingName: this.state.meetingName,
            distributionMethod: this.state.distributionMethod,
            appointmentList: this.state.appointmentList,
            invitedUserList: this.state.invitedUserList,
            activated: checked,});
        console.log('state was set to:');
        console.log(this.state);
    }

    private _onMeetingNameChange(meetingName:any){
        this.setState({
            userColumns: this.state.userColumns,
            appointmentColumns: this.state.appointmentColumns,                 
            selectedAppointment: this.state.selectedAppointment,   
            meeting: this.state.meeting,
            isUpdate: this.state.isUpdate,
            meetingName: meetingName,
            distributionMethod: this.state.distributionMethod,
            appointmentList: this.state.appointmentList,
            invitedUserList: this.state.invitedUserList,
            activated: this.state.activated,});
    }

    private _onDropdownChange(item: IDropdownOption): void {
        console.log(`Selection change: ${item.text} ${item.selected ? 'selected' : 'unselected'}`);
        console.log(item.key);
        this.setState({
            userColumns: this.state.userColumns,
            appointmentColumns: this.state.appointmentColumns,                 
            selectedAppointment: this.state.selectedAppointment,   
            meeting: this.state.meeting,
            isUpdate: this.state.isUpdate,
            meetingName: this.state.meetingName,
            distributionMethod: DistributionNames[item.key],
            appointmentList: this.state.appointmentList,
            invitedUserList: this.state.invitedUserList,
            activated: this.state.activated,
        });
    };

    private _setAppointmentColumnNames():IColumn[] {
        let columns:IColumn[] = [{
          key: 'column1',
          name: 'Datum',
          fieldName: 'date',
          minWidth: 50,
          maxWidth: 100,
        } as IColumn,{
          key: 'column2',
          name: 'Tag',
          fieldName: 'day',
          minWidth: 100,
          maxWidth: 350,
        } as IColumn,{
          key: 'column3',
          name: 'Von',
          fieldName: 'appointmentStart',
          minWidth: 100,
          maxWidth: 350,
        } as IColumn,{
          key: 'column4',
          name: 'Bis',
          fieldName: 'appointmentEnd',
          minWidth: 100,
          maxWidth: 350,
        } as IColumn,{
          key: 'column5',
          name: 'Personen',
          fieldName: 'personCount',
          minWidth: 100,
          maxWidth: 350,
        } as IColumn,]
        return columns;
      }

      private _setUserColumnNames():IColumn[] {
        let columns:IColumn[] = [{
          key: 'column1',
          name: 'Eingeladener Benutzer',
          fieldName: 'name',
          minWidth: 100,
          maxWidth: 350,
        } as IColumn,{
          key: 'column2',
          name: 'E-Mail',
          fieldName: 'eMail',
          minWidth: 100,
          maxWidth: 350,
        } as IColumn,]
        return columns;
      }

    public render(): React.ReactElement<ICreateMeetingProps> {
        return(
        <div className = { styles.createMeeting } >
            <div>  
                <h1> Veranstaltung {this.state.isUpdate ? 'bearbeiten' : 'erstellen'} </h1>
                <div>
                    <div>
                        <p>{this.state.isUpdate ? this.state.meeting.title : 'Bitte Veranstaltungsname eintragen'}</p>
                        <TextField label='Veranstaltungsname:' placeholder='Bitte Veranstaltungsname eintragen' value={this.state.meetingName} onChanged={this._onMeetingNameChange} required/>
                    </div>
                    <div>
                        <Dropdown
                            label='Verteilalgorithmus:'
                            placeHolder="Verteilalgo auswaehlen"
                            onChanged={this._onDropdownChange}
                            options={[
                                { key: 'FIFO', text: 'First in First out' },
                                { key: 'FAIRDISTRO', text: 'Fair Distribution' },
                              ]}
                        />
                    </div>
                </div>
                <div>
                    <DetailsList
                    items={this.state.appointmentList}
                    columns={this.state.appointmentColumns}
                    selectionPreservedOnEmptyClick={true}
                    selection={this.selection}
                    />
                </div>
                <div>
                    <DefaultButton text='Neuer Termin' onClick={this.createNewAppointment} />
                    <DefaultButton text='Bearbeiten' onClick={this.modifyAppointment} />
                    <DefaultButton text='Loeschen' onClick={this.deleteAppointment} />
                </div>
                <div>
                    <DetailsList
                    items={this.state.invitedUserList}
                    columns={this.state.userColumns}
                    selectionPreservedOnEmptyClick={true}
                    selection={this.selection}
                    />
                </div> 
                <div>
                    <DefaultButton text='Benutzer einladen' onClick={this.inviteUser} />
                    <DefaultButton text='Benutzer Loeschen' onClick={this.deleteInvitedUser} />
                </div>
                <div>
                    <Toggle label="Veranstaltung freigeben?" defaultChecked onText="Ja" offText="Nein" onChanged={this._onReleaseChange} />
                </div>
                <div>
                    <DefaultButton text='Speichern' onClick={this.saveMeeting} />
                    <Link to='/'>
                        <DefaultButton text='Abbrechen' /> 
                    </Link>
                </div>
            </div >
        </div>
        );
    }
}