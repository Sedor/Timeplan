import * as React from 'react';
import styles from './SetPreference.module.scss';
import { ISetPreferenceProps } from './ISetPreferenceProps';
import { ISetPreferenceState } from './ISetPreferenceState';

import { Meeting } from '../../data/Meeting/Meeting';
import { Appointment } from '../../data/Appointment/Appointment';
import { User } from '../../data/User/User';
import { AppointmentService } from '../../service/Appointment-Service';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';

import { DefaultButton } from 'office-ui-fabric-react';
import { DetailsList, Selection, IColumn, SelectionMode, CheckboxVisibility} from 'office-ui-fabric-react/lib/DetailsList';
import { Link } from 'react-router-dom';
import { Participant } from '../../data/User/Participant';
import { DistributionNames } from '../../data/Distributions/DistributionNames';


const dropDownOption: IDropdownOption[] = [{
  key: '1',
  text: '1'
},{
  key: '2',
  text: '2'
},{
  key: '3',
  text: '3'
}];

export class SetPreference extends React.Component < any, ISetPreferenceState > {

  private _appointmentSelection: Selection;

  constructor(props: any){
      super(props);
      this._appointmentSelection = new Selection();
      this.state = {
          meeting: new Meeting({title:''}),
          appointmentList: [],
          appointmentColumns: this._setAppointmentColumnNames()
      }
  }

  componentDidMount(){
      // window.addEventListener("beforeunload", this._handleWindowBeforeUnload);
      console.log('in ComponentDidMount');
      if(this.props.location.state !== undefined){
          if(this.props.location.state.selectedMeeting !== undefined){
              //TODO get Current User from location.histoy
              
              let meeting:Meeting = (this.props.location.state.selectedMeeting as Meeting);
              if(meeting.distribution === DistributionNames.FAIRDISTRO){
                this._activatePriorityMode();
              }else if (meeting.distribution === DistributionNames.FIFO){
                this._activateFifoMode();
              }

              AppointmentService.getAppointmentListForMeetingId(meeting.getSharepointPrimaryId()).then(appointmentList =>{
                let comboBoxDefautlValues:Map<string,boolean> = appointmentList.reduce(
                  (map: Map<string,boolean>, appointment:Appointment) => {
                    map.set(appointment.sharepointPrimaryId, false);
                  return map
                  }, new Map<string,boolean>());
                this.setState({
                    meeting: meeting,
                    appointmentList: appointmentList,
                    participant: new Participant({
                      eMail: 'hans.hansen@web.de', //TODO add the current User here
                      name: 'Hans Hansen',
                      appointmentPriority: new Map<string, number>()
                    }),
                    comboBoxMap: comboBoxDefautlValues
                })
              });
          }
      }
  }

  private _activateFifoMode = () => {
    console.log('SetPreference._activateFifoMode()');
    let tmpColumns = this.state.appointmentColumns.concat({
      key: 'column6',
      name: 'Auswahl',
      fieldName: null,
      onRender: (item: Appointment) => {
        return <div>
          <Checkbox
            checked={this.state.comboBoxMap.get(item.sharepointPrimaryId)}
            onChange={this._onClickedCheckbox}
          />
        </div>;
      },
      minWidth: 50,
      maxWidth: 100,
    });
    this.setState({
      appointmentColumns: tmpColumns,
    })
  }

  private _activatePriorityMode = () => {
    console.log('SetPreference._activatePriorityMode()');
    let tmpColumns = this.state.appointmentColumns.concat({
      key: 'column6',
      name: 'Auswahl',
      fieldName: null,
      onRender: (item: Appointment) => {
        return <div>
          <Dropdown
            placeHolder='0'
            onChanged={this._onDropdownChange}
            selectedKey={this.state.participant.appointmentPriority.get(item.sharepointPrimaryId) ?
              String(this.state.participant.appointmentPriority.get(item.sharepointPrimaryId)) : '1'}
            options={dropDownOption}
          />
        </div>;
      },
      minWidth: 50,
      maxWidth: 100,
    });
    this.setState({
      appointmentColumns: tmpColumns,
    })
  }

  private _savePreferences = () => {
      console.log('would save Preferences');
      console.log(this.state);
  }

  private _onDropdownChange = (item: IDropdownOption) => {
    console.log('_onDropdownChange()');
    let participant:Participant = this.state.participant;
    participant.setPriority(this._appointmentSelection.getSelection()[0] as Appointment, parseInt(item.text))
  }

  private _onClickedCheckbox = (ev: React.FormEvent<HTMLElement>, checked: boolean) => {
    console.log('SetPreference._onClickedCheckbox()');
    let comboBoxDefautlValues:Map<string,boolean> = this.state.appointmentList.reduce(
      (map: Map<string,boolean>, appointment:Appointment) => {
        map.set(appointment.sharepointPrimaryId, false);
      return map
      }, new Map<string,boolean>());
      comboBoxDefautlValues.set((this._appointmentSelection.getSelection()[0] as Appointment).sharepointPrimaryId, true);
    this.setState({
      comboBoxMap: comboBoxDefautlValues,
      appointmentList: this.state.appointmentList.concat([])
    });
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
      },{
        key: 'column2',
        name: 'Tag',
        fieldName: null,
        minWidth: 50,
        maxWidth: 100,
        onRender: (item: Appointment) => {
          return <span>{item.getDayName()}</span>;
        }
      },{
        key: 'column3',
        name: 'Von',
        fieldName: 'appointmentStart',
        minWidth: 50,
        maxWidth: 100,
      },{
        key: 'column4',
        name: 'Bis',
        fieldName: 'appointmentEnd',
        minWidth: 50,
        maxWidth: 100,
      }]
      return columns;
    }

  public render(): React.ReactElement<ISetPreferenceProps> {
      return(
      <div>
        <h1>Set Preference</h1>
        <div>
              <DetailsList
              items={this.state.appointmentList}
              columns={this.state.appointmentColumns}
              selection={this._appointmentSelection}
              checkboxVisibility={CheckboxVisibility.hidden}
              />
          </div>
          <div>
              <Link to='/'>
                  <DefaultButton text='Zurueck' /> 
              </Link>
              <DefaultButton text='Speichern' onClick={this._savePreferences} />
          </div>
      </div >
      );
  }
}