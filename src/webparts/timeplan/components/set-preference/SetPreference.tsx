import * as React from 'react';
import styles from './SetPreference.module.scss';
import { ISetPreferenceProps } from './ISetPreferenceProps';
import { ISetPreferenceState } from './ISetPreferenceState';

import { Meeting } from '../../data/Meeting/Meeting';
import { Appointment } from '../../data/Appointment/Appointment';
import { User } from '../../data/User/User';
import { AppointmentService } from '../../service/Appointment-Service';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

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
                  //TODO activate priority
                  console.log('activating Priority');
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

                AppointmentService.getAppointmentListForMeetingId(meeting.getSharepointPrimaryId()).then(appointmentList =>{
                    this.setState({
                        meeting: meeting,
                        appointmentList: appointmentList,
                        participant: new Participant({
                          eMail: 'hans.hansen@web.de',
                          name: 'Hans Hansen',
                          appointmentPriority: new Map<string, number>()
                        })
                    })
                });
                console.log('ended ComponentDidMount');
            }
        }
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
                // selectionPreservedOnEmptyClick={true}
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