import * as React from 'react';
import styles from './MeetingStatus.module.scss';
import { IMeetingStatusProps } from './IMeetingStatusProps';
import { IMeetingStatusState } from './IMeetingStatusState';

import { Meeting } from '../../data/Meeting/Meeting';
import { Appointment } from '../../data/Appointment/Appointment';
import { User } from '../../data/User/User';
import { AppointmentService } from '../../service/Appointment-Service';

import { DefaultButton } from 'office-ui-fabric-react';
import { DetailsList, Selection, IColumn, SelectionMode, CheckboxVisibility} from 'office-ui-fabric-react/lib/DetailsList';
import { Link } from 'react-router-dom';

// const initialState: IMeetingStatusState = {
// }

export class MeetingStatus extends React.Component < any, IMeetingStatusState > {

    // state: IMeetingStatusState = initialState;
    private selection: Selection;

    constructor(props: any){
        super(props);
        this.state = {
            meeting: new Meeting({title:''}),
            appointmentList: [],
            participantsList: [], //TODO Change to Participant
            appointmentColumns: this._setAppointmentColumnNames()
        }
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

    private _handleWindowBeforeUnload(ev: BeforeUnloadEvent):void{
        console.log('_handleWindowBeforeUnload');
        ev.returnValue = 'Aenderungen sind noch nicht gespeichert. Wirklich die Seite verlassen?';
    }

    private _saveDistribution(){
        alert('Save and Email Users !');
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
        minWidth: 40,
        maxWidth: 50,
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

    public render(): React.ReactElement<IMeetingStatusProps> {
        return(
        <div>
            <h1>{this.state.meeting.title}</h1>
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
                <Link to='/'>
                    <DefaultButton text='Zurueck' /> 
                </Link>
                <DefaultButton text='Speichern' onClick={this._saveDistribution} />
            </div>
        </div >
        );
    }
}