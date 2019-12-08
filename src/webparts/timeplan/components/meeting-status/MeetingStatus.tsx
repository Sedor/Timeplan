import * as React from 'react';
import styles from './MeetingStatus.module.scss';
import { IMeetingStatusProps } from './IMeetingStatusProps';
import { IMeetingStatusState } from './IMeetingStatusState';

import { Meeting } from '../../data/Meeting/Meeting';
import { Appointment } from '../../data/Appointment/Appointment';
import { User } from '../../data/User/User';
import { AppointmentService } from '../../service/Appointment-Service';
import { DefaultButton } from 'office-ui-fabric-react';
import { DetailsList, Selection, IColumn, CheckboxVisibility } from 'office-ui-fabric-react/lib/DetailsList';
import { Link } from 'react-router-dom';
import { IDragDropEvents, IDragDropContext } from 'office-ui-fabric-react/lib/utilities/dragdrop';
import { UserService } from '../../service/User-Service';
import { DistributionService } from '../../service/Distribution-Service';
import { Choice } from '../../data/Distributions/Choise';

export class MeetingStatus extends React.Component < any, IMeetingStatusState > {

    private _appointmentSelection: Selection;
    private _unassignedInvitedUsersSelection: Selection;

    private _dragDropEvents: IDragDropEvents;
    private _dropDestination: Appointment | User;

    constructor(props: any){
        super(props);

        this._unassignedInvitedUsersSelection = new Selection();
        this._appointmentSelection = new Selection(); 
        this._dragDropEvents = this._getDragDropEvents();

        this.state = {
            meeting: new Meeting({title:''}),
            appointmentList: [],
            invitedUserList: [],
            appointmentColumns: this._setAppointmentColumnNames(),
            unassignedInvitedUsersColumns: this._setUnassignedInvitedUsersColumnNames(),
            assignedInvitedUsersColumns: this._setAssignedInvitedUsersColumnNames()
        }
    }

    private _getDragDropEvents(): IDragDropEvents {
      return {
        canDrop: (dropContext?: IDragDropContext, dragContext?: IDragDropContext) => {
          try {
            return !this._isAssigned((dropContext.data as User), this.state.appointmentList);
          } catch (error) {
            console.log(error);
          }
          return true;
        },
        canDrag: (item?: any) => {
          if (item instanceof Appointment){
            return false; 
          }else {
            return true;  
          }
        },
        onDragEnter: (item?: any, event?: DragEvent) => {
          return styles.onDropEnter;
        },
        onDragLeave: (item?: any, event?: DragEvent) => {
          return;
        },
        onDrop: (onDropItem?: any, event?: DragEvent) => {
          console.log('onDrop()');
          if(onDropItem instanceof Appointment){
            this._dropDestination = onDropItem;
          }else if(onDropItem instanceof User){
            if(!this._isAssigned((onDropItem as User), this.state.appointmentList)){
              this._dropDestination = onDropItem;
            }            
          }
        },
        onDragStart: (item?: any, itemIndex?: number, selectedItems?: any[], event?: MouseEvent) => {
          // TODO use this when Fabric-UI was upgraded bugFix at -> https://github.com/OfficeDev/office-ui-fabric-react/pull/5688
          console.log('onDragStart()');
        },
        onDragEnd: (item?: any, event?: DragEvent) => {
          console.log('onDragEnd()');
          if ((item instanceof User) && (this._dropDestination instanceof Appointment)) {
            if(this._isAssigned(item, this.state.appointmentList)){
              this._dopFromAppointmentToAppointment(this._dropDestination, item);
            } else {
              this._dropIntoAppointment(this._dropDestination, item);  
            } 
          } else if ((item instanceof User) && (this._dropDestination instanceof User)){
            if(this._isAssigned(item, this.state.appointmentList)){
              this._dropIntoUnassignedParticipants(item);
            }
          }
          this._dropDestination = undefined;
        }
      };
    }

    private _dopFromAppointmentToAppointment = (appointmentToInsertTo:Appointment, participant: User) => {
      if(appointmentToInsertTo.isSlotFree()){
        this.state.appointmentList.map(appointment => appointment.removeParticipantByReference(participant));
        appointmentToInsertTo.addParticipant(participant);
        this.setState({
          appointmentList: this.state.appointmentList.concat([])
        });
      }else{
        console.log('No Free Slot');
      }
    }

    private _dropIntoUnassignedParticipants = (participant: User) => {
      this.state.appointmentList.map(appointment => appointment.removeParticipantByReference(participant));
      this.setState({
        appointmentList: this.state.appointmentList.concat([]),
        invitedUserList: this.state.invitedUserList.concat(participant)
      })
      
    }

    private _isAssigned = (user:User, appointmentList: Appointment[]) => {
      return appointmentList.reduce( (isAssigned:boolean, appointment:Appointment) => {
        return isAssigned || appointment.getParticipant().filter(participant => participant.getSharepointId() === user.getSharepointId()).length === 1;
      }, false);
    }

    private _dropIntoAppointment = (appointment: Appointment, participant: User) => {
      if(appointment.isSlotFree()){
        appointment.addParticipant(participant);
        this.setState({
          appointmentList: this.state.appointmentList.concat([])
        })
        this._removeFromParticipantList(participant);
      }else{
        console.log('No Free Slot');
      }

    }

    private _removeFromParticipantList = (userToRemove:User) => {
      this.setState({
        invitedUserList: this.state.invitedUserList.filter((user:User) => user.getSharepointId() !== userToRemove.getSharepointId())
      });
    }

    private _preDistributePersons = (appointmentList:Appointment[], invitedUserList:User[], choiceList:Choice[]) => {
      console.log('MeetingStatus._preDistributePersons()');
      console.log(choiceList);
      choiceList.forEach((choice:Choice) => {
        let appointment = appointmentList.filter( (appointment:Appointment) => appointment.getSharepointId() === choice.getAppointmentSharepointId())[0];
        let invitedUser = invitedUserList.filter( (user:User) => user.getSharepointId() === choice.getInvitedUserSharepointId())[0];
        invitedUserList = invitedUserList.filter((user:User) => user.getSharepointId() !== invitedUser.getSharepointId());
        appointment.addParticipant(invitedUser); 
      });
      this.setState({
        appointmentList: appointmentList,
        invitedUserList: invitedUserList,
        choiceList: choiceList
      });
    }

    componentDidMount(){
      console.log('MeetingStatus.componentDidMount()');  
      window.addEventListener("beforeunload", this._handleWindowBeforeUnload);
      if(this.props.location.state !== undefined){
          if(this.props.location.state.selectedMeeting !== undefined){
              let meeting:Meeting = (this.props.location.state.selectedMeeting as Meeting);
              AppointmentService.getAppointmentListForMeetingId(meeting.getSharepointPrimaryId()).then(appointmentList =>{
                UserService.getInvitedUserListForMeetingId(meeting.getSharepointPrimaryId()).then(invitedUserList => {
                  DistributionService.getChoiceListOfInvitedUserList(invitedUserList).then( choiceList => {
                    choiceList = choiceList.filter( choice => choice !== undefined);
                    this._preDistributePersons(appointmentList, invitedUserList, choiceList);
                  });
                });
              });
            this.setState({
              meeting: meeting,
            });
          }
      }
    }

  componentWillUnmount(){
      console.log('componentWillUnmount');
      window.removeEventListener("beforeunload", this._handleWindowBeforeUnload);
  }

    private _handleWindowBeforeUnload(ev: BeforeUnloadEvent):void{
        console.log('_handleWindowBeforeUnload');
        ev.returnValue = 'Aenderungen sind noch nicht gespeichert. Wirklich die Seite verlassen?';
    }

    private _saveDistribution = () => {
        console.log('MeetingStatus._saveDistribution()');
        console.log(this.state);
    }

    private _distribute = () => {
      console.log('MeetingStatus.verteilen()');
      alert('start distributiong !');
      //TODO do this
    }

    private _setAppointmentColumnNames():IColumn[] {
      let columns:IColumn[] = [{
        key: 'column1',
        name: 'Datum',
        fieldName: null,
        minWidth: 40,
        maxWidth: 60,
        onRender: (item: Appointment) => {
          return <span>{item.getDateAsDIN5008Format()}</span>;
        }
      } as IColumn,{
        key: 'column2',
        name: 'Tag',
        fieldName: null,
        minWidth: 50,
        maxWidth: 80,
        onRender: (item: Appointment) => {
          return <span>{item.getDayName()}</span>;
        }
      } as IColumn,{
        key: 'column3',
        name: 'Von',
        fieldName: 'appointmentStart',
        minWidth: 40,
        maxWidth: 50,
      } as IColumn,{
        key: 'column4',
        name: 'Bis',
        fieldName: 'appointmentEnd',
        minWidth: 40,
        maxWidth: 50,
      } as IColumn,{
        key: 'column5',
        name: 'Personen',
        fieldName: null,
        onRender: (item: Appointment) => {
          return <span>{item.personCount}</span>;
        },
        minWidth: 40,
        maxWidth: 50,
      } as IColumn,{
        key: 'column6',
        name: 'Zugeteilt',
        fieldName: null,
        onRender: (item: Appointment) => {
          if(item.participants.length > 0){
            return <DetailsList
            items={item.participants}
            dragDropEvents={this._dragDropEvents}
            columns={this.state.assignedInvitedUsersColumns}
            checkboxVisibility={CheckboxVisibility.hidden}
          />;
          } else {
            return <div> Leer </div>
          }
        },
        minWidth: 40,
        maxWidth: 50,
      }]
      return columns;
    }

    private _setUnassignedInvitedUsersColumnNames = ():IColumn[] => {
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
      } as IColumn]
      return columns;
    }

    private _setAssignedInvitedUsersColumnNames = ():IColumn[] =>{
      let columns:IColumn[] = [{
        key: 'column1',
        name: 'Benutzername',
        fieldName: 'name',
        minWidth: 50,
        maxWidth: 150,
      } as IColumn,{
        key: 'column2',
        name: 'E-Mail',
        fieldName: 'eMail',
        minWidth: 50,
        maxWidth: 150,
      } as IColumn]
      return columns;
    }
    

    public test = () => {
      console.log(this.state);
    }

    public render(): React.ReactElement<IMeetingStatusProps> {
        return(
        <div className={styles.MeetingStatus} >
            <h1>{this.state.meeting.title}</h1>
            <div>
              <h2>Verteilte Benutzer</h2>
              <DetailsList
                items={this.state.appointmentList}
                columns={this.state.appointmentColumns}
                selection={this._appointmentSelection}
                dragDropEvents={this._dragDropEvents}
                checkboxVisibility={CheckboxVisibility.hidden}
              />
            </div>
            <div>
              <h2>Unverteilte Benutzer</h2>
              <DetailsList
              items={this.state.invitedUserList}
              columns={this.state.unassignedInvitedUsersColumns}
              selection={this._unassignedInvitedUsersSelection}
              dragDropEvents={this._dragDropEvents}
              checkboxVisibility={CheckboxVisibility.hidden}
              />
            </div> 
            <div>
              <DefaultButton text='Verteilen' onClick={this._distribute}/>
            </div>
            <div>
                <Link to='/'>
                    <DefaultButton text='Zurueck' /> 
                </Link>
                <DefaultButton text='Speichern' onClick={this._saveDistribution}/>
                <DefaultButton text='Test' onClick={this.test}/>
            </div>
            
              
            
        </div >
        );
    }
}