import * as React from 'react';
import styles from './CreateMeeting.module.scss';
import { ICreateMeetingProps } from './ICreateMeetingProps';
import { IMeetingState } from './IMeetingState';
import { Appointment } from '../../data/Appointment/Appointment';
import { User } from '../../data/User/User';
import { Meeting } from '../../data/Meeting/Meeting';
import { MeetingStatus } from '../../data/Meeting/MeetingStatus';
import { MeetingService } from '../../service/Meeting-Service';
import { UserService } from '../../service/User-Service';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
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
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { IObjectWithKey } from 'office-ui-fabric-react/lib/DetailsList';

export class CreateMeeting extends React.Component < any, IMeetingState > {

    private _appointmentSelection: Selection;
    private _userSelection: Selection;
    private _generatedDropdownOptions: IDropdownOption[];

    constructor(props: any){
        super(props);
        console.log('CreateMeeting.Constructor()');
        this.state = {
            userColumns: this._setUserColumnNames(),
            appointmentColumns: this._setAppointmentColumnNames(),
            isUpdate: false,
            meeting: new Meeting({}),
            appointmentList: [],
            appointmentDeletionList: [],
            invitedUserList: [],
            invitedUserDeletionList: [],
            appointmentIsUpdating: false,
        };
        this._generatedDropdownOptions = this._generateDistributionDropdownOptions();
        this._initializeAppointmentSelection();
        this._initializeUserSelection();
    }

    private _initializeAppointmentSelection = ():void => {
        this._appointmentSelection = new Selection({
          onSelectionChanged: () => {
            console.log('onAppointmentSelectionChanged()');
            if(!((this._appointmentSelection.getSelection()[0] as Appointment) === undefined)){
                this.setState({
                    selectedAppointment: (this._appointmentSelection.getSelection()[0] as Appointment),
                })
            }  
          }
        });
    }

    private _initializeUserSelection = ():void => {
        this._userSelection = new Selection({
          onSelectionChanged: () => {
             console.log('onUserSelectionChanged()');
             if(!((this._userSelection.getSelection()[0] as User) === undefined)){
                this.setState({
                    selectedUser: (this._userSelection.getSelection()[0] as User),
                });
             }
          }
        });
    }

    componentDidMount(){
        window.addEventListener('beforeunload', this._handleWindowBeforeUnload);
        console.log('componentDidMount()');
        if(this.props.location.state !== undefined){
            if(this.props.location.state.selectedMeeting !== undefined){
                let meetingToUpgrade:Meeting = (this.props.location.state.selectedMeeting as Meeting);
                this.setState({
                    meeting: meetingToUpgrade,
                    isUpdate: true
                });
                AppointmentService.getAppointmentListForMeetingId(meetingToUpgrade.getSharepointPrimaryId()).then((appointmentList:Appointment[]) =>{
                    this.setState({
                        appointmentList: appointmentList,
                    });
                });
                UserService.getInvitedUserListForMeetingId(meetingToUpgrade.getSharepointPrimaryId()).then((userList:User[])=>{
                    this.setState({
                        invitedUserList: userList,
                    });
                })
            }
        }
    }

    componentWillUnmount(){
        console.log('componentWillUnmount');
        window.removeEventListener('beforeunload', this._handleWindowBeforeUnload);
    }

    private _handleWindowBeforeUnload = (ev: BeforeUnloadEvent):void => {
        console.log('_handleWindowBeforeUnload');
        ev.returnValue = 'Aenderungen sind noch nicht gespeichert. Wirklich die Seite verlassen?';
    }

    public createNewAppointment = ():void => {
        console.log('clicked CreateNewAppointment');
        this.setState({
            showAppointmentModal: true,
        })
    }

    public modifyAppointment = ():void => {
        console.log('CreateMeeting.modifyAppointment()');
        if(this.state.selectedAppointment === undefined || this.state.selectedAppointment === null){
            alert('You didnt select an Appointment'); // TODO remove
        }else {
            this.setState({
                appointmentIsUpdating: true,
                showAppointmentModal: true,
            })
        }
    }

    private _copyAppointment  = (): void => {
        let copiedAppointment = new Appointment({
            appointmentDate: new Date(this.state.selectedAppointment.appointmentDate.getTime()),
            appointmentEnd: this.state.selectedAppointment.appointmentEnd,
            appointmentStart: this.state.selectedAppointment.appointmentStart,
            personCount: this.state.selectedAppointment.personCount,
        });
        copiedAppointment.appointmentDate.setDate(copiedAppointment.appointmentDate.getDate() + 1);
        this.setState({
            appointmentList: this.state.appointmentList.concat([copiedAppointment]),
        });
    }

    private _deleteAppointment = ():void => {
        console.log('CreateMeeting.deleteAppointment()');
        if(this.state.selectedAppointment === undefined || this.state.selectedAppointment === null){
            alert('You didnt select an Appointment'); // TODO remove
        }else{
            let toRemoveAppointment = this.state.selectedAppointment;
            let tmpAppointmentList: Appointment[] = this.state.appointmentList.filter(obj => obj !== toRemoveAppointment);
            if(this.state.selectedAppointment.sharepointPrimaryId){
                this.setState({
                    appointmentDeletionList : this.state.appointmentDeletionList.concat([toRemoveAppointment]),
                });
            }
            this.setState({
                appointmentList: tmpAppointmentList,
                selectedAppointment: undefined,
            });
        }
        console.log(this._appointmentSelection.getSelection());
    }

    public inviteUser = ():void => {
        console.log('inviteUser()');
        this.setState({
            showUserModal:true,
        })
    }

    public deleteInvitedUser = ():void => {
        console.log('CreateMeeting.deleteInvitedUser()');
        if(this.state.selectedUser === undefined || this.state.selectedUser === null){
            alert('You didnt select an User'); // TODO remove
        } else {
            let toRemoveUser = this.state.selectedUser;
            let tmpInvitedUserList:User[] = this.state.invitedUserList.filter(obj => obj !== toRemoveUser);
            if(this.state.selectedUser.sharepointId){
                this.setState({
                    invitedUserDeletionList : tmpInvitedUserList.concat([toRemoveUser]),
                });
            }
            this.setState({
                invitedUserList: tmpInvitedUserList,
                selectedUser: undefined,
            });
        }
    }

    private _saveMeeting = ():void => {
        console.log('Saving Meeting');
        if(this.state.isUpdate){
            this._saveUpdatedMeeting();
        } else {
            this._saveNewMeeting();
        }
        this.props.history.replace('/',{});
    }

    private _saveNewMeeting = () => {
        console.log('CreateMeeting._saveNewMeeting()');
        try {
            MeetingService.saveMeeting(this.state.meeting).then((meetingId:number)=> {
                this._saveAppointments(meetingId, this.state.appointmentList);
                this._saveInvitedUsers(meetingId, this.state.invitedUserList);
            });
        } catch (error) {
            console.log('boooom');
            console.log(error);
            alert('saving new Meeting went wrong');
        }
    }

    private _saveAppointments(meetingId:number, appointments:Appointment[]){
        let appointmentListToUpdate: Appointment[] = appointments.filter( obj => obj.sharepointPrimaryId);
        if(appointmentListToUpdate.length>0){
            AppointmentService.batchUpdateAppointments(meetingId, appointmentListToUpdate);
        }
        let appointmentListToSave: Appointment[] = appointments.filter( obj => !(obj.sharepointPrimaryId));
        if(appointmentListToSave.length>0){
            AppointmentService.batchSaveAppointments(meetingId, appointmentListToSave);
        }
    }

    private _saveInvitedUsers(meetingId:number, userList:User[]){
        let userListToUpdate: User[] = userList.filter( obj => obj.sharepointId);
        if(userListToUpdate.length>0){
            UserService.batchUpdateInvitedUsers(meetingId, userListToUpdate);
        }
        let userListToSave: User[] = userList.filter( obj => !(obj.sharepointId));
        if(userListToSave.length>0){
            UserService.batchSaveInvitedUsers(meetingId, userListToSave);
        }
    }

    private _saveUpdatedMeeting = () => {
        console.log('CreateMeeting._saveUpdatedMeeting()');
        try {
            MeetingService.updateMeeting(this.state.meeting).then(()=> {
                AppointmentService.batchDeleteAppointments(this.state.appointmentDeletionList);
                UserService.batchDeleteInvitedUser(this.state.invitedUserDeletionList);
                this._saveAppointments(this.state.meeting.sharepointPrimaryId, this.state.appointmentList);
                this._saveInvitedUsers(this.state.meeting.sharepointPrimaryId, this.state.invitedUserList);
            });
        } catch (error) {
            console.log(error);
        }
    }

    private _onReleaseChange = (checked: boolean):void => {
      console.log('_onReleaseChange:');
      if(checked){
        this.state.meeting.setStatus(MeetingStatus.OPEN);
      } else {
        this.state.meeting.setStatus(MeetingStatus.CREATED);
      }
      this.setState({
        meeting: this.state.meeting
      });
    }

    private _onMeetingNameChange = (meetingName:string) => {
        this.state.meeting.setTitle(meetingName);  // TODO Change this
        this.setState({  
            meeting: this.state.meeting
        });
    }

    private _onMeetingDescriptionChange = (meetingDescription: string) => {
        this.state.meeting.setDescription(meetingDescription);  // TODO Change this
        this.setState({  
            meeting: this.state.meeting
        });
    }

    private _onDropdownChange = (item: IDropdownOption): void => {
        console.log('_onDropdownChange()'); //TODO remove
        console.log(item.key);
        this.state.meeting.distribution = DistributionNames[item.key];
        this.setState({
            meeting: this.state.meeting,
        });
    };

    private _closeAppointmentModal = (): void => {
        this.setState({ showAppointmentModal: false });
    };
    
    private _closeUserModal = (): void => {
        this.setState({ showUserModal: false });
    };

    private _closeAreUSureDialog = (): void => {
        console.log('_closeAreUSureDialog()');
        this.setState({ showAreUSureDialog: false});
    }

    private _addAppointment = (appointment:Appointment): void => {
        console.log('CreateMeeting._addAppointment()');
        let newAppointmentList = this.state.appointmentList.concat([appointment]);
        this.setState({
            appointmentList: newAppointmentList,
        });
    }

    private _updateAppointment = (appointmentReference:Appointment, updatedAppointment:Appointment) => {
        console.log('CreateMeeting._updateAppointment()');
        appointmentReference.appointmentDate = new Date(updatedAppointment.appointmentDate.getTime());
        appointmentReference.appointmentEnd = updatedAppointment.appointmentEnd;
        appointmentReference.appointmentStart = updatedAppointment.appointmentStart;
        appointmentReference.personCount =  updatedAppointment.personCount;
        this.setState({
            appointmentIsUpdating: false,
            appointmentList: this.state.appointmentList.concat([])
        });
    }


    private _deleteMeetingButton = (): void => {
        console.log('_deleteMeetingButton()');
        this.setState({
            showAreUSureDialog: true,
        });
    }

    private _deleteMeeting = (): void => {
        console.log('_deleteMeeting()');
        this.setState({
            showAreUSureDialog: false,
        });
        MeetingService.deleteMeetingById(this.state.meeting.getSharepointPrimaryId());
        this.props.history.replace('/',{});
    }
    
    private _addUser = (userList:User[]) => {
        console.log('CreateMeeting._addUser()');
        this._closeUserModal();
        let newUsers:User[] = userList.filter(user => {
            return this.state.invitedUserList.filter(obj => user.getName() === obj.getName()).length === 0;
        });
        this.setState({
            invitedUserList: this.state.invitedUserList.concat(newUsers),
        });
    }

    private _generateDistributionDropdownOptions = ():IDropdownOption[] => {
        console.log('_generateDistributionDropdownOptions()');
        let dropdownOptions:IDropdownOption[] = [];
        for (let item in DistributionNames){
            if(!(dropdownOptions.some(e => e.text === item))){
                dropdownOptions.push({
                    key: item,
                    text: DistributionNames[item],
                });
            }
        }
        return dropdownOptions;
    }

    private _setAppointmentColumnNames = ():IColumn[] => {
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
          minWidth: 50,
          maxWidth: 100,
        } as IColumn,{
          key: 'column4',
          name: 'Bis',
          fieldName: 'appointmentEnd',
          minWidth: 50,
          maxWidth: 100,
        } as IColumn,{
          key: 'column5',
          name: 'Personen',
          fieldName: null,
          onRender: (item: Appointment) => {
            return <span>{item.personCount}</span>;
          },
          minWidth: 50,
          maxWidth: 100,
        } as IColumn,]
        return columns;
      }

      private _setUserColumnNames = ():IColumn[] => {
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
                        <TextField label='Veranstaltungsbeschreibung:' placeholder='Bitte Beschreibung eintragen' multiline rows={2} value={this.state.meeting.description} onChanged={this._onMeetingDescriptionChange} />
                    </div>
                    <div>
                        <Dropdown
                            required
                            label='Verteilalgorithmus:'
                            placeHolder='Verteilalgo auswaehlen'
                            onChanged={this._onDropdownChange}
                            selectedKey={DistributionNames[this.state.meeting.distribution]}
                            options={this._generatedDropdownOptions}
                        />
                    </div>
                </div>
                <div>
                     <DetailsList
                     items={this.state.appointmentList}
                     columns={this.state.appointmentColumns}
                     selection={this._appointmentSelection}
                     checkboxVisibility={CheckboxVisibility.hidden}
                     setKey='id'
                     />
                </div>
                <div>
                    <DefaultButton text='Neuer Termin' onClick={this.createNewAppointment} />
                    <DefaultButton text='Bearbeiten' onClick={this.modifyAppointment} />
                    <DefaultButton text='Termin kopieren' onClick={this._copyAppointment} />
                    <DefaultButton text='Loeschen' onClick={this._deleteAppointment} />
                </div>
                <div>
                    <DetailsList
                    items={this.state.invitedUserList}
                    columns={this.state.userColumns}
                    selection={this._userSelection}
                    checkboxVisibility={CheckboxVisibility.hidden}
                    />
                </div> 
                <div>
                    <DefaultButton text='Benutzer Hinzufuegen' onClick={this.inviteUser} />
                    <DefaultButton text='Benutzer Loeschen' onClick={this.deleteInvitedUser} />
                </div>
                <div>
                    <Toggle 
                      label='Veranstaltung freigeben?' 
                      onText='Ja' 
                      offText='Nein'
                      checked= { this.state.meeting.getStatus() === MeetingStatus.OPEN }
                      onChanged={this._onReleaseChange} 
                    />
                </div>
                <div>
                    <DefaultButton text='Speichern' onClick={this._saveMeeting} />
                    <Link to='/'>
                        <DefaultButton text='Abbrechen' /> 
                    </Link>
                    {this.state.isUpdate ? 
                    <DefaultButton text='Loeschen' onClick={this._deleteMeetingButton} />
                    : null}
                </div>
            </div>
            <Dialog
              isOpen={this.state.showAreUSureDialog}
              onDismiss={this._closeAreUSureDialog}
              title='Veranstaltung loeschen?'
              subText='Wollen Sie wirklich die Veranstaltung unwiederuflich loeschen?'
              isBlocking={true}
              >
              <DialogFooter>
                  <PrimaryButton onClick={this._deleteMeeting} text='Loeschen' />
                  <DefaultButton onClick={this._closeAreUSureDialog} text='Abbrechen' />
              </DialogFooter>
              </Dialog>
            <Modal
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
                isOpen={this.state.showAppointmentModal}
                onDismiss={this._closeAppointmentModal}
                isBlocking={false}
                >
                <CreateAppointment 
                    closeCreateAppointmentModal={this._closeAppointmentModal}
                    addAppointmentToList={this._addAppointment}
                    appointmentToEdit = {this.state.selectedAppointment}
                    updateAppointment = {this._updateAppointment}
                    isUpdate = {this.state.appointmentIsUpdating}
                />
            </Modal>
        </div>
        );
    }
}