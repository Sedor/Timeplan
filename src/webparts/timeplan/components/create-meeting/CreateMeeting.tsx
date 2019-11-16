import * as React from 'react';
import styles from './CreateMeeting.module.scss';
import { ICreateMeetingProps } from './ICreateMeetingProps';
import { IMeetingState } from './IMeetingState';
import { Appointment } from '../../data/Appointment/Appointment';
import { User,IUser } from '../../data/User/User';
import { Meeting } from '../../data/Meeting/Meeting';
import { MeetingStatus } from '../../data/Meeting/MeetingStatus';
import { DefaultButton } from 'office-ui-fabric-react';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { TextField} from 'office-ui-fabric-react/lib/TextField';
import { DetailsList, Selection, IColumn, CheckboxVisibility} from 'office-ui-fabric-react/lib/DetailsList';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { DistributionNames } from '../../data/Distributions/DistributionNames';
import { Link } from 'react-router-dom';
import { AppointmentService } from '../../service/Appointment-Service';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { CreateAppointment } from './create-appointment/CreateAppointment';
import { CreateUser } from './create-user/CreateUser';


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
            meeting: new Meeting({
                title: ''
            }),  // TODO remove
            appointmentList: [],
            invitedUserList: [],
            clearance: false,
        };

        this.initializeSelection();
        
        this._addUser = this._addUser.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.deleteAppointment = this.deleteAppointment.bind(this); // TODO maybe also delete this
        this.modifyAppointment = this.modifyAppointment.bind(this); // TODO remove
        this._onDropdownChange = this._onDropdownChange.bind(this);
        this._addAppointment = this._addAppointment.bind(this);
        this._onMeetingNameChange = this._onMeetingNameChange.bind(this);
        this._getSelectedAppointment = this._getSelectedAppointment.bind(this);
        this._onReleaseChange = this._onReleaseChange.bind(this);
        this.initializeSelection = this.initializeSelection.bind(this);
        this.createNewAppointment = this.createNewAppointment.bind(this);
        this.inviteUser = this.inviteUser.bind(this);
    }

    private initializeSelection():void {
        this.selection = new Selection({
          onSelectionChanged: () => {
            console.log('onSelectionChanged:');
            this.setState({
                selectedAppointment: this._getSelectedAppointment(),
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
        window.addEventListener("beforeunload", this._handleWindowBeforeUnload);
        console.log('in ComponentDidMount');
        if(this.props.location.state !== undefined){
            console.log('this.prop.location.state is defined');
            if(this.props.location.state.selectedMeeting !== undefined){
                console.log('this.prop.location.state.selectedMeeting is defined');

                let meetingToUpgrade:Meeting = (this.props.location.state.selectedMeeting as Meeting);
                AppointmentService.getAppointmentListForMeetingId(meetingToUpgrade.id).then(appointmentList =>{
                    this.setState({
                        meeting: meetingToUpgrade,
                        isUpdate: true,
                        appointmentList: appointmentList,
                        invitedUserList: [], //TODO load users
                        clearance: (meetingToUpgrade.status === MeetingStatus.OPEN), //TOODO get the status for this
                    })
                });
                console.log('ended ComponentDidMount');
            }
        }
    }

    componentWillUnmount() {
        console.log('componentWillUnmount');
        window.removeEventListener("beforeunload", this._handleWindowBeforeUnload);
    }

    private _handleWindowBeforeUnload(ev: BeforeUnloadEvent):void{
        console.log('_handleWindowBeforeUnload');
        ev.returnValue = 'Aenderungen sind noch nicht gespeichert. Wirklich die Seite verlassen?';
    }

    public createNewAppointment():void {
        console.log('clicked CreateNewAppointment');
        this.setState({
            showAppointmentModal: true,
        })
    }

    public modifyAppointment():void {
        console.log('clicked modifyAppointment');
        if(this.state.selectedAppointment === undefined || this.state.selectedAppointment === null){
            alert('You didnt select an Appointment');
            console.log(this.state.selectedAppointment);
        }else {
            console.log(this.state.selectedAppointment);
            this.setState({
                showAppointmentModal: true,
            })
        }
    }

    public deleteAppointment():void {
        console.log('clicked deleteAppointment');
        console.log(this.state);
    }

    public inviteUser():void {
        console.log('inviteUser');
        this.setState({
            showUserModal:true,
        })
    }

    public deleteInvitedUser():void {
        alert('clicked deleteInvitedUser');
    }

    public saveMeeting():void{
        alert('Would now save the Meeting');
        
    }


    private _onReleaseChange(checked: boolean):void {
        console.log('_onReleaseChange:');
        this.setState({
            clearance: checked,});
    }

    private _onMeetingNameChange(meetingName:string){
        this.state.meeting.setTitle(meetingName);  // TODO Change this
        this.setState({  
            meeting: this.state.meeting,});
    }

    private _onDropdownChange(item: IDropdownOption): void {
        console.log(`Selection change: ${item.text} ${item.selected ? 'selected' : 'unselected'}`); //TODO remove
        console.log(item.key);
        this.setState({
            distributionMethod: DistributionNames[item.key],
        });
    };

    private _closeAppointmentModal = (): void => {
        this.setState({ showAppointmentModal: false });
    };
    
    private _closeUserModal = (): void => {
        this.setState({ showUserModal: false });
    };


    private _addAppointment(appointment:Appointment): void{
        console.log('_addAppointment');
        appointment.foreignMeetingId = this.state.meeting.id;
        console.log(appointment);
        let newAppointmentList = this.state.appointmentList.concat([appointment]);
        this.setState({
            appointmentList: newAppointmentList,
        });
    }

    private _deleteMeeting() {
        alert('Would delete Meeting');
    }
    
    private _addUser(userList:User[]){
        console.log('_addUser');
        console.log(userList);
        //TODO check if Unique
        this._closeUserModal();
        let newUserlist = this.state.invitedUserList.concat(userList);
        this.setState({
            invitedUserList: newUserlist,
        });
    }

    private _generateDistributionDropdownOptions():IDropdownOption[] {
        let dropdownOptions:IDropdownOption[];
        dropdownOptions = [];
        for (let item in DistributionNames){
            dropdownOptions.push({
                key: item,
                text: DistributionNames[item],
            });
        }
        return dropdownOptions;
    }

    private _setAppointmentColumnNames():IColumn[] {
        let columns:IColumn[] = [{
          key: 'column1',
          name: 'Datum',
          fieldName: null,
          minWidth: 50,
          maxWidth: 100,
          onRender: (item: Appointment) => {
            return <span>{item.getDateAsDIN5008Format()}</span>;
          }
        } as IColumn,{
          key: 'column2',
          name: 'Tag',
          fieldName: null,
          minWidth: 50,
          maxWidth: 100,
          onRender: (item: Appointment) => {
            return <span>{item.getDayName()}</span>;
          }
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
          fieldName: null,
          onRender: (item: Appointment) => {
            return <span>{item.personCount}</span>;
          },
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
                            required
                            label='Verteilalgorithmus:'
                            placeHolder="Verteilalgo auswaehlen"
                            onChanged={this._onDropdownChange}
                            defaultSelectedKey={DistributionNames.MANUEL}
                            options={this._generateDistributionDropdownOptions()}
                        />
                    </div>
                </div>
                <div>
                    <DetailsList
                    items={this.state.appointmentList}
                    columns={this.state.appointmentColumns}
                    // selectionPreservedOnEmptyClick={true}
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
                    // selectionPreservedOnEmptyClick={true}
                    // selection={this.selection}
                    checkboxVisibility={CheckboxVisibility.hidden}
                    />
                </div> 
                <div>
                    <DefaultButton text='Benutzer hinzufuegen' onClick={this.inviteUser} />
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
                    {this.state.isUpdate ? 
                    <DefaultButton text='Loeschen' onClick={this._deleteMeeting} />
                    : null}
                </div>
            </div>
            <Modal
                titleAriaId={'Test_Title'}
                subtitleAriaId={'Test_Subtitle'}
                isOpen={this.state.showUserModal}
                onDismiss={this._closeUserModal}
                isBlocking={false}
                >
                <CreateUser 
                    closeCreateUserModal={this._closeUserModal} 
                    addUserToList={this._addUser}
                />
            </Modal>
            <Modal
                titleAriaId={'Test_Title'}
                subtitleAriaId={'Test_Subtitle'}
                isOpen={this.state.showAppointmentModal}
                onDismiss={this._closeAppointmentModal}
                isBlocking={false}
                >
                <CreateAppointment 
                    closeCreateAppointmentModal={this._closeAppointmentModal}
                    addAppointmentToList={this._addAppointment}
                    appointmentToEdit = {this.state.selectedAppointment}
                />
            </Modal>
        </div>
        );
    }
}