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
    private _participantSelection: Selection;

    private _dragDropEvents: IDragDropEvents;
    private _draggedItem: Participant | undefined;
    private _draggedIndex: number;

    constructor(props: any){
        super(props);

        this._participantSelection = new Selection(); // TODO check if notwendig
        this._appointmentSelection = new Selection(); // TODO check if notwendig
        this._dragDropEvents = this._getDragDropEvents();
        this._draggedIndex = -1;

        this.state = {
            meeting: new Meeting({title:''}),
            appointmentList: [],
            participantsList: this.generateParticipantsList(), //TODO Change to Participant
            appointmentColumns: this._setAppointmentColumnNames(),
            userColumns: this._setUserColumnNames(),
        }
    }

    private _getDragDropEvents(): IDragDropEvents {
      return {
        canDrop: (dropContext?: IDragDropContext, dragContext?: IDragDropContext) => {
          console.log('canDrop()');
          // console.log(dropContext); // Here is the Item itself in it. With its Index in the list
          // console.log(dragContext); // empty (maybe here will be the dopped item in it)
          return true;
        },
        canDrag: (item?: any) => {
          console.log('canDrag()');
          if (item instanceof Appointment){
            return item.participants !== undefined && item.participants !== null; 
          }else {
            return true;  
          }
        },
        onDragEnter: (item?: any, event?: DragEvent) => {
          // return string is the css classes that will be added to the entering element.
          console.log('onDragEnter()');
          return styles.onDropEnter;
        },
        onDragLeave: (item?: any, event?: DragEvent) => {
          console.log('onDragLeave()');
          console.log(item);
          console.log(event);
          console.log('kkkkkkkkkkkkkkkkkkkkkkkkkk')
          return;
        },
        onDrop: (item?: any, event?: DragEvent) => {
          console.log('onDrop()');
          console.log('item:');
          console.log(item);
          console.log('draggedItem');
          console.log(this._draggedItem)
          if (this._draggedItem) {
            this._insertBeforeItem(item);
          }
        },
        onDragStart: (item?: any, itemIndex?: number, selectedItems?: any[], event?: MouseEvent) => {
          console.log('onDragStart()');
          this._draggedItem = item;
          this._draggedIndex = itemIndex!;
          console.log(event);
          console.log('wwwwwwwwwwwwwwwwwwwww')
        },
        onDragEnd: (item?: any, event?: DragEvent) => {
          console.log('onDragEnd()');
          // everything was handled
          this._draggedItem = undefined;
          this._draggedIndex = -1;
        }
      };
    }

    private _insertBeforeItem = (item: Participant): void => {
      console.log('rrrrrrrrrrrrrrrrrrrrrrrrr');
      console.log(item);
      console.log(this._draggedItem);


      console.log('rrrrrrrrrrrrrrrrrrrrrrrrr');
      const draggedItems = this._participantSelection.isIndexSelected(this._draggedIndex)
        ? (this._participantSelection.getSelection() as Participant[])
        : [this._draggedItem!];
  
      const items = this.state.participantsList.filter(itm => draggedItems.indexOf(itm) === -1);
      let insertIndex = items.indexOf(item);
  
      // if dragging/dropping on itself, index will be 0.
      if (insertIndex === -1) {
        insertIndex = 0;
      }
  
      items.splice(insertIndex, 0, ...draggedItems);
  
      this.setState({ participantsList: items });
    }
  

    //TODO delete this
    private generateParticipantsList = ():Participant[] => {
      console.log('MeetingStatus.generateParticipantsList()');
      let tmpParticipantsList: Participant[] = [];
      for (let index = 0; index < 13; index++) {
        tmpParticipantsList = tmpParticipantsList.concat([new Participant({
          appointmentPriority: new Map(),
          eMail: 'test@test.com',
          id: String(index),
          name: `Tester ${String(index)}`,
          participantId: String(index),
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

    private _dragDropEvent = () => {
      
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
          return <span>{'User A'}</span>;
        },
        minWidth: 40,
        maxWidth: 50,
      }]
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
              columns={this.state.userColumns}
              selection={this._participantSelection}
              dragDropEvents={this._dragDropEvents}
              checkboxVisibility={CheckboxVisibility.hidden}
              />
            </div> 
            <div>
                <Link to='/'>
                    <DefaultButton text='Zurueck' /> 
                </Link>
                <DefaultButton text='Speichern' onMenuClick={this._saveDistribution}/>
            </div>
        </div >
        );
    }
}