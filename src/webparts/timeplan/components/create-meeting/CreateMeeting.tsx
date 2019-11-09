import * as React from 'react';
import styles from './CreateMeeting.module.scss';
import { ICreateMeetingProps } from './ICreateMeetingProps';
import { IMeetingState } from './IMeetingState';
import { Appointment } from '../../data/Appointment/Appointment';
import { User } from '../../data/User/User';
import { Meeting } from '../../data/Meeting/Meeting';
import { DefaultButton } from 'office-ui-fabric-react';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { TextField} from 'office-ui-fabric-react/lib/TextField';
import { DetailsList, Selection, IColumn, CheckboxVisibility} from 'office-ui-fabric-react/lib/DetailsList';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { DistributionNames } from '../../data/Distributions/DistributionNames';
import { Link } from 'react-router-dom';
import { AppointmentService } from '../../service/Appointment-Service';

export class CreateMeeting extends React.Component < any, IMeetingState > {

    private selection: Selection;

    constructor(props: any){
        super(props);
       
        console.log('in Constructor');
        console.log('state is:');
        console.log(this.state);
        this.state = {
            userColumns: this._setUserColumnNames(),
            appointmentColumns: this._setAppointmentColumnNames(),
            isUpdate: false,
            meeting: new Meeting('100','',''),  // TODO remove
            appointmentList: [],
            invitedUserList: [],
            activated: false,
        };

        this.initializeSelection();
        

        this._onDropdownChange = this._onDropdownChange.bind(this);
        this._onMeetingNameChange = this._onMeetingNameChange.bind(this);
        this._getSelectedAppointment = this._getSelectedAppointment.bind(this);
        this._onReleaseChange = this._onReleaseChange.bind(this);
        this.initializeSelection = this.initializeSelection.bind(this);
        this.createNewAppointment = this.createNewAppointment.bind(this);
    }

    private initializeSelection():void {
        this.selection = new Selection({
          onSelectionChanged: () => {
            console.log('onSelectionChanged:');
            this.setState({
                selectedAppointment: this._getSelectedAppointment(),
                isUpdate: this.state.isUpdate,
                activated: this.state.activated
            })
          }
        });
    }

    private _getSelectedAppointment():Appointment {
        console.log(this.selection);
        if((this.selection.getSelection()[0] as Appointment) === undefined){
            return this.state.selectedAppointment;
        }else{
            return (this.selection.getSelection()[0] as Appointment);
        }
    }

    componentDidMount(){
        console.log('in ComponentDidMount');
        if(this.props.location.state !== undefined){
            console.log('this.prop.location.state is defined');
            if(this.props.location.state.selectedMeeting !== undefined){
                console.log('this.prop.location.state.selectedMeeting is defined');
                console.log('state is:');
                console.log(this.state);
                let meetingToUpgrade:Meeting = (this.props.location.state.selectedMeeting as Meeting);
                AppointmentService.getAppointmentListForMeetingId(meetingToUpgrade.id).then(appointmentList =>{
                    this.setState({
                        meeting: this.state.meeting,
                        isUpdate: true,
                        appointmentList: appointmentList,
                        invitedUserList: [new User('1','Max','max@mail.de')],
                        activated: false, //TOODO get the status for this
                    })
                    console.log('state was set to:');
                    console.log(this.state);
                });
                console.log('ended ComponentDidMount');
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
            isUpdate: this.state.isUpdate,
            activated: checked,});
        console.log('state was set to:');
        console.log(this.state);
    }

    private _onMeetingNameChange(meetingName:string){
        this.state.meeting.setTitle(meetingName);
        this.setState({  
            meeting: this.state.meeting,
            isUpdate: this.state.isUpdate,
            activated: this.state.activated,});
    }

    private _onDropdownChange(item: IDropdownOption): void {
        console.log(`Selection change: ${item.text} ${item.selected ? 'selected' : 'unselected'}`);
        console.log(item.key);
        this.setState({
            isUpdate: this.state.isUpdate,
            distributionMethod: DistributionNames[item.key],
            activated: this.state.activated,
        });
    };

    private _setAppointmentColumnNames():IColumn[] {
        let columns:IColumn[] = [{
          key: 'column1',
          name: 'Datum',
          fieldName: 'appointmentDate',
          minWidth: 50,
          maxWidth: 100,
        } as IColumn,{
          key: 'column2',
          name: 'Tag',
          fieldName: 'day',
          minWidth: 50,
          maxWidth: 100,
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
                        <TextField label='Veranstaltungsname:' placeholder='Bitte Veranstaltungsname eintragen' value={this.state.meeting.title} onChanged={this._onMeetingNameChange} required/>
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
                    checkboxVisibility={CheckboxVisibility.hidden}
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
                    // selection={this.selection}
                    checkboxVisibility={CheckboxVisibility.hidden}
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