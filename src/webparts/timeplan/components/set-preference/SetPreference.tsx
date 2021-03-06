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
import { DistributionNames } from '../../data/Distributions/DistributionNames';
import { DistributionService } from '../../service/Distribution-Service';
import { UserService } from '../../service/User-Service';
import { Priority } from '../../data/Distributions/FairDistribution/Priority';
import { Choice } from '../../data/Distributions/Choise';


const dropDownOption: IDropdownOption[] = [{
  key: 1,
  text: '1'
},{
  key: 2,
  text: '2'
},{
  key: 3,
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
          priorityList: [],
          appointmentColumns: this._setAppointmentColumnNames(),
          currentUser: new User({}),
          choice: new Choice({})
      }
  }

  private _loadPriorityList = (appointmentList:Appointment[], user:User) => {
    DistributionService.getPriorityListForUser(user).then((prioList:Priority[]) => {
        this.setState({
          appointmentList: this.state.appointmentList.concat([]), //just to rerender the list
          priorityList: prioList
        })
      })
  }

  private _loadChoice = (user:User) => {
  // choice: new Choice({
  //   invitedUserSharepointId: user.getSharepointId()
  // }),
    DistributionService.getChoiceOfInvitedUser(user.getSharepointId()).then( (choice:Choice) => {
      if(choice === undefined){
        this.setState({
          choice: new Choice({
            invitedUserSharepointId: user.getSharepointId()
          }),
          appointmentList: this.state.appointmentList.concat([])
        });

      }else{
        this.setState({
          choice: choice,
          appointmentList: this.state.appointmentList.concat([])
        });
      }
    })
  }

  componentDidMount(){
    // window.addEventListener("beforeunload", this._handleWindowBeforeUnload);
    console.log('SetPreference.componentDidMount()');
    if(this.props.location.state !== undefined){
      if(this.props.location.state.selectedMeeting !== undefined){
        let meeting:Meeting = (this.props.location.state.selectedMeeting as Meeting);
        UserService.getInvitedUserIdByEmailAndMeetingId((this.props.location.state.currentUser as User).getEMail(), meeting.sharepointPrimaryId).then((user:User)=>{
          AppointmentService.getAppointmentListForMeetingId(meeting.getSharepointPrimaryId()).then(appointmentList =>{
            if(meeting.distribution === DistributionNames.FAIRDISTRO){
              this._activatePriorityMode();
              this._loadPriorityList(appointmentList,user);
              
            }else if (meeting.distribution === DistributionNames.FIFO){
              this._activateFifoMode();
              this._loadChoice(user);
              //TODO load appointment chose
            }

            this.setState({
              meeting: meeting,
              appointmentList: appointmentList,
              currentUser: user
            })
          });
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
            checked={this.state.choice.getAppointmentSharepointId() === item.getSharepointId()}
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
      onRender: (item: Appointment, index:number) => {
        return <div>
          <Dropdown
            onChanged={this._onDropdownChange}
            selectedKey={this.state.priorityList[index].getPriorityNumber()}
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
    if(this.state.meeting.distribution === DistributionNames.FAIRDISTRO){
      if(this.state.priorityList[0].getSharepointId() === undefined){
        DistributionService.addPriorityListForInvitedUserId(this.state.priorityList);
      }else {
        DistributionService.updatePriorityListForInvitedUserId(this.state.priorityList);
      }
    }else if (this.state.meeting.distribution === DistributionNames.FIFO){
      console.log('would save auswahl');
      if(this.state.choice.getSharepointId() === undefined){
        DistributionService.addChoiceOfInvitedUser(this.state.choice);
      } else {
        DistributionService.updateChoiceOfInvitedUser(this.state.choice);
      }
    }
  }

  private _onDropdownChange = (item: IDropdownOption) => {
    console.log('SetPreference._onDropdownChange()');
    let selectedAppointment = (this._appointmentSelection.getSelection()[0] as Appointment)
    this.state.priorityList[this.state.appointmentList.indexOf(selectedAppointment)].setPriorityNumber( parseInt(item.text));
    this.setState({
      priorityList: this.state.priorityList.concat([])
    });
  }

  private _distributionDescription(distributionNames: DistributionNames){
    return DistributionService.getDistributionDescription(distributionNames);
  }

  private _onClickedCheckbox = (ev: React.FormEvent<HTMLElement>, checked: boolean) => {
    console.log('SetPreference._onClickedCheckbox()');
    if(checked){
      let tmpChoice = this.state.choice; 
      tmpChoice.setAppointmentSharepointId((this._appointmentSelection.getSelection()[0] as Appointment).sharepointPrimaryId)
      this.setState({
        choice: tmpChoice,
        appointmentList: this.state.appointmentList.concat([])
      });
    }
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
          </div>
      </div >
      );
  }
}