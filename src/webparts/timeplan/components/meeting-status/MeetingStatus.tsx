import * as React from 'react';
import styles from './MeetingStatus.module.scss';
import { IMeetingStatusProps } from './IMeetingStatusProps';
import { IMeetingStatusState } from './IMeetingStatusState';

import { Meeting } from '../../data/Meeting/Meeting';
import { Appointment } from '../../data/Appointment/Appointment';
import { User } from '../../data/User/User';
import { AppointmentService } from '../../service/Appointment-Service';
import { Participant } from '../../data/User/Participant'
import { DefaultButton } from 'office-ui-fabric-react';
import { DetailsList, Selection, IColumn, SelectionMode, CheckboxVisibility } from 'office-ui-fabric-react/lib/DetailsList';
import { Link } from 'react-router-dom';
import { IDragDropEvents, IDragDropContext } from 'office-ui-fabric-react/lib/utilities/dragdrop';

export class MeetingStatus extends React.Component < any, IMeetingStatusState > {

    private _appointmentSelection: Selection;
    private _unassignedParticipantSelection: Selection;
    private _assignedParticipantsSelection: Selection; //TODO check this up 

    private _dragDropEvents: IDragDropEvents;
    private _dropDestination: Appointment | Participant;
    // private _lastSelectedAppointment: Appointment;

    constructor(props: any){
        super(props);

        this._unassignedParticipantSelection = new Selection();
        this._assignedParticipantsSelection = new Selection();
        this._appointmentSelection = new Selection(); 

        this._dragDropEvents = this._getDragDropEvents();
        // this._draggedIndex = -1;

        this.state = {
            meeting: new Meeting({title:''}),
            appointmentList: [],
            participantsList: this.generateParticipantsList(), //TODO Change to Participant
            appointmentColumns: this._setAppointmentColumnNames(),
            unassignedParticipantsColumns: this._setUnassignedParticipantColumnNames(),
            assignedParticipantsColumns: this._setAssignedParticipantColumnNames()
        }
    }

    private _getDragDropEvents(): IDragDropEvents {
      return {
        canDrop: (dropContext?: IDragDropContext, dragContext?: IDragDropContext) => {
          console.log('canDrop()');
          try {
            return !(dropContext.data as Participant).isAssigned;
          } catch (error) {
            console.log(error);
          }
          return true;
        },
        canDrag: (item?: any) => {
          console.log('canDrag()');
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
          // item is the last visited Element
          return;
        },
        onDrop: (onDropItem?: any, event?: DragEvent) => {
          console.log('onDrop()');
          // console.log('DropDestination is now:');
          if(onDropItem instanceof Appointment){
            // console.log(onDropItem);
            this._dropDestination = onDropItem;
          }else if(onDropItem instanceof Participant){
            if(!(onDropItem as Participant).isAssigned){
              // console.log(onDropItem);
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
          if ((item instanceof Participant) && (this._dropDestination instanceof Appointment)) {
            if(item.isAssigned){
              this._dopFromAppointmentToAppointment(this._dropDestination, item);
            } else {
              this._dropIntoAppointment(this._dropDestination, item);  
            } 
          } else if ((item instanceof Participant) && (this._dropDestination instanceof Participant)){
            if(item.isAssigned){
              this._dropIntoUnassignedParticipants(item);
            }
          }
          this._dropDestination = undefined;
        }
      };
    }

    private _dopFromAppointmentToAppointment = (appointmentToInsertTo:Appointment, participant: Participant) => {
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

    private _dropIntoUnassignedParticipants = (participant: Participant) => {
      this.state.appointmentList.map(appointment => appointment.removeParticipantByReference(participant));
      participant.isAssigned = false;
      this.setState({
        appointmentList: this.state.appointmentList.concat([]),
        participantsList: this.state.participantsList.concat(participant)
      })
      
    }

    private _dropIntoAppointment = (appointment: Appointment, participant: Participant) => {
      if(appointment.isSlotFree()){
        participant.isAssigned = true;
        appointment.addParticipant(participant);
        this.setState({
          appointmentList: this.state.appointmentList.concat([])
        })
        this._removeFromParticipantList(participant);
      }else{
        console.log('No Free Slot');
      }

    }

    private _removeFromParticipantList(participant:Participant){
      this.setState({
        participantsList: this.state.participantsList.filter(obj => obj !== participant)
      });
    }

    //TODO delete this
    private generateParticipantsList = ():Participant[] => {
      console.log('MeetingStatus.generateParticipantsList()');
      let tmpParticipantsList: Participant[] = [];
      for (let index = 0; index < 13; index++) {
        tmpParticipantsList = tmpParticipantsList.concat([new Participant({
          appointmentPriority: new Map(),
          eMail: 'test@test.com',
          sharepointId: index,
          name: `Tester ${String(index)}`,
          participantId: String(index),
          isAssigned: false,
        })]);
      }
      console.log(tmpParticipantsList);
      return tmpParticipantsList;
    }

    componentDidMount(){
      console.log('MeetingStatus.componentDidMount()');  
      window.addEventListener("beforeunload", this._handleWindowBeforeUnload);
      if(this.props.location.state !== undefined){
          if(this.props.location.state.selectedMeeting !== undefined){
              let meetingToUpgrade:Meeting = (this.props.location.state.selectedMeeting as Meeting);
              AppointmentService.getAppointmentListForMeetingId(meetingToUpgrade.getSharepointPrimaryId()).then(appointmentList =>{
                  this.setState({
                      meeting: meetingToUpgrade,
                      appointmentList: appointmentList,
                  })
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
            columns={this.state.assignedParticipantsColumns}
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

    private _setUnassignedParticipantColumnNames = ():IColumn[] => {
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

    private _setAssignedParticipantColumnNames = ():IColumn[] =>{
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
    

    public render(): React.ReactElement<IMeetingStatusProps> {
        return(
        <div className={styles.MeetingStatus} >
            <h1>{this.state.meeting.title}</h1>
            <div>
              <DetailsList
                items={this.state.appointmentList}
                columns={this.state.appointmentColumns}
                selection={this._appointmentSelection}
                dragDropEvents={this._dragDropEvents}
                checkboxVisibility={CheckboxVisibility.hidden}
              />
            </div>
            <div>
              <DetailsList
              items={this.state.participantsList}
              columns={this.state.unassignedParticipantsColumns}
              selection={this._unassignedParticipantSelection}
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
            </div>
        </div >
        );
    }
}