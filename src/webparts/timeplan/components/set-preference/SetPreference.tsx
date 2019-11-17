import * as React from 'react';
import styles from './SetPreference.module.scss';
import { ISetPreferenceProps } from './ISetPreferenceProps';
import { ISetPreferenceState } from './ISetPreferenceState';

import { Meeting } from '../../data/Meeting/Meeting';
import { Appointment } from '../../data/Appointment/Appointment';
import { User } from '../../data/User/User';
import { AppointmentService } from '../../service/Appointment-Service';

import { DefaultButton } from 'office-ui-fabric-react';
import { DetailsList, Selection, IColumn, SelectionMode, CheckboxVisibility} from 'office-ui-fabric-react/lib/DetailsList';
import { Link } from 'react-router-dom';

export class SetPreference extends React.Component < any, ISetPreferenceState > {

    // state: IMeetingStatusState = initialState;
    private selection: Selection;

    constructor(props: any){
        super(props);
        this.state = {

        }
    }

    componentDidMount(){
        // window.addEventListener("beforeunload", this._handleWindowBeforeUnload);
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


    public render(): React.ReactElement<ISetPreferenceProps> {
        return(
        <div>
          <h1>Set Preference</h1>
        </div >
        );
    }
}