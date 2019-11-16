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
                        appointmentList: appointmentList,
                    })
                });
                console.log('ended ComponentDidMount');
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
          fieldName: 'appointmentDate',
          minWidth: 50,
          maxWidth: 100,
        } as IColumn,{
          key: 'column2',
          name: 'Tag',
          fieldName: 'day',
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
          fieldName: 'personCount',
          onRender: (item: Appointment) => {
            return <span>{item.personCount}</span>;
          },
          minWidth: 100,
          maxWidth: 350,
        } as IColumn,]
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
                <DefaultButton text='Speichern' onClick={this.props._createUserAndAdd} />
            </div>
        </div >
        );
    }
}