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
import { DetailsList, Selection, IColumn, CheckboxVisibility} from 'office-ui-fabric-react/lib/DetailsList';
import { Link } from 'react-router-dom';
import { Participant } from '../../data/User/Participant';
import { DistributionNames } from '../../data/Distributions/DistributionNames';
import { CurrentUser } from '../../../../../node_modules/@pnp/sp/src/siteusers';
import { DistributionService } from '../../service/Distribution-Service';
import { UserService } from '../../service/User-Service';


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
          meeting: new Meeting({}),
          appointmentList: [],
          appointmentColumns: this._setAppointmentColumnNames(),
          currentUser: new User({}),
          comboBoxMap: new Map<number,number>()
      }
  }

  componentDidMount(){
      // window.addEventListener("beforeunload", this._handleWindowBeforeUnload);
      console.log('in ComponentDidMount');
      if(this.props.location.state !== undefined){
          if(this.props.location.state.selectedMeeting !== undefined){
              let meeting:Meeting = (this.props.location.state.selectedMeeting as Meeting);
              UserService.getInvitedUserIdByEmailAndMeetingId((this.props.location.state.currentUser as User).getEMail(), meeting.sharepointPrimaryId).then((user:User)=>{
                this.setState({
                  currentUser: user
                });
              });
              AppointmentService.getAppointmentListForMeetingId(meeting.getSharepointPrimaryId()).then(appointmentList =>{
                // TODO here load the checkboxDefaultValues
                
                if(meeting.distribution === DistributionNames.FAIRDISTRO){
                  this._activatePriorityMode();
                  DistributionService.getPriorityMapForAppointmentList(
                    //TODO maybe race condition
                    appointmentList.map(appointment => appointment.getSharepointId()), this.state.currentUser.getSharepointId()).then((priomap:Map<number,number>) =>{
                      console.log('setting prio map ________');
                      console.log(priomap);
                      console.log(priomap.size);
                      this.setState({
                        appointmentList: this.state.appointmentList.concat([]),
                        comboBoxMap: priomap
                      })
                    })
                }else if (meeting.distribution === DistributionNames.FIFO){
                  this._activateFifoMode();
                  //TODO load appointment chose
                    this.setState({
                    checkBoxMap: appointmentList.reduce((map: Map<number,boolean>, appointment:Appointment) => {
                        map.set(appointment.sharepointPrimaryId, false);
                        return map
                      }, new Map<number,boolean>())
                    })
                }
                this.setState({
                  meeting: meeting,
                  appointmentList: appointmentList,
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
            checked={this.state.checkBoxMap.get(item.sharepointPrimaryId)}
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
      name: 'Prioritaet',
      fieldName: null,
      onRender: (item: Appointment) => {
        return <div>
          <Dropdown
            onChanged={this._onDropdownChange}
            selectedKey={this.state.comboBoxMap.get(item.sharepointPrimaryId) ?
              String(this.state.comboBoxMap.get(item.sharepointPrimaryId)) : '1'}
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
    console.log('SetPreference._savePreferences()');
    DistributionService.addPriorityMapForInvitedUserId(this.state.comboBoxMap,this.state.currentUser.getSharepointId());
  }

  private _onDropdownChange = (item: IDropdownOption) => {
    console.log('_onDropdownChange()');
    this.state.comboBoxMap.set((this._appointmentSelection.getSelection()[0] as Appointment).sharepointPrimaryId, parseInt(item.text))
  }

  private _distributionDescription(distributionNames: DistributionNames){
    return DistributionService.getDistributionDescription(distributionNames);
  }

  private _onClickedCheckbox = (ev: React.FormEvent<HTMLElement>, checked: boolean) => {
    console.log('SetPreference._onClickedCheckbox()');
    let checkBoxDefautlValues:Map<number,boolean> = this.state.appointmentList.reduce(
      (map: Map<number,boolean>, appointment:Appointment) => {
        map.set(appointment.sharepointPrimaryId, false);
      return map
      }, new Map<number,boolean>());
      checkBoxDefautlValues.set((this._appointmentSelection.getSelection()[0] as Appointment).sharepointPrimaryId, true);
    this.setState({
      checkBoxMap: checkBoxDefautlValues,
      appointmentList: this.state.appointmentList.concat([])
    });
  }

  private _test = () => {
    console.log(this.state);
    console.log(this.state.comboBoxMap.size);
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
        <h1>Bitte setzen sie Ihre Wahl</h1>
        <h3>{this._distributionDescription(this.state.meeting.distribution)}</h3>
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
              <DefaultButton text='Test' onClick={this._test} />
          </div>
      </div >
      );
  }
}