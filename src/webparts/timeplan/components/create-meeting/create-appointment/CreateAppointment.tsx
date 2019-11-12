import * as React from 'react';
import styles from './CreateAppointment.module.scss';
import { ICreateAppointmentProps } from './ICreateAppointmentProps';
import { ICreateAppointmentState } from './ICreateAppointmentState';
import { Appointment, IAppointment } from '../../../data/Appointment/Appointment';
import { Meeting } from '../../../data/Meeting/Meeting';
import { DefaultButton } from 'office-ui-fabric-react';
import { TextField} from 'office-ui-fabric-react/lib/TextField';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';


const DayPickerStrings: IDatePickerStrings = {
    months: ['Januar', 'Februar', 'Maerz', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
  
    days: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag','Sonntag'],
  
    shortDays: [ 'M', 'D', 'M', 'D', 'F', 'S', 'S'],
  
    goToToday: 'Heute',
    prevMonthAriaLabel: 'Go to previous month',
    nextMonthAriaLabel: 'Go to next month',
    prevYearAriaLabel: 'Go to previous year',
    nextYearAriaLabel: 'Go to next year',
    //closeButtonAriaLabel: 'Close date picker',
    isRequiredErrorMessage: 'Start date is required.',
  
    invalidInputErrorMessage: 'Invalid date format.'
  };


export class CreateAppointment extends React.Component < any, ICreateAppointmentState > {


    constructor(props: any){
        super(props);
        
        this.state = {
            firstDayOfWeek: DayOfWeek.Monday,
            meetingDate: null
        };
        this._onParseDateFromString = this._onParseDateFromString.bind(this);
        this._onFromInputChange = this._onFromInputChange.bind(this);
        this._onUntilInputChange = this._onUntilInputChange.bind(this);
        this._onPersonInputChange = this._onPersonInputChange.bind(this);
        this._saveAppointmentToList = this._saveAppointmentToList.bind(this);
    }

    private _onSelectDate = (date: Date | null | undefined): void => {
        this.setState({ meetingDate: date });
    };
    
    private _onClick = (): void => {
        this.setState({ meetingDate: null });
    };

    private _onFormatDate(date: Date):string {
        console.log('in _onFormatDate');
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + (date.getFullYear() % 100);
    };

    private _onParseDateFromString(value: string):Date {
        console.log('in _onParseDateFromString');
        const date = this.state.meetingDate || new Date();
        const values = (value || '').trim().split('/');
        const day = values.length > 0 ? Math.max(1, Math.min(31, parseInt(values[0], 10))) : date.getDate();
        const month = values.length > 1 ? Math.max(1, Math.min(12, parseInt(values[1], 10))) - 1 : date.getMonth();
        let year = values.length > 2 ? parseInt(values[2], 10) : date.getFullYear();
        if (year < 100) {
          year += date.getFullYear() - (date.getFullYear() % 100);
        }
        return new Date(year, month, day);
    };

    private _onFromInputChange(from:string){
        this.setState({
            from: from,
        })
    }

    private _onUntilInputChange(until:string){
        this.setState({
            until: until,
        })
    }

    private _onPersonInputChange(person:string){
        this.setState({
            persons: person,
        })
    }

    private _saveAppointmentToList(){
        console.log('_saveAppointmentToList');
        let appointment= new Appointment({
            foreignMeetingId: this.props.foreignMeetingId,
            appointmentDate: this.state.meetingDate.toString(),
            appointmentStart: this.state.from,
            appointmentEnd: this.state.until,
            personCount: this.state.persons,
        });
        console.log(appointment);
        console.log('calling callback to add to list');
        //TODO verify Appointment
        this.props.closeCreateAppointmentModal();
        this.props.addAppointmentToList(appointment);
        
    }

    public render(): React.ReactElement<ICreateAppointmentProps> {
        return(
            <div className={styles.createAppointment}>
                <div className={styles.container}>
                    <h1>Termin Erstellen</h1>
                        <DatePicker
                            label="Start date"
                            isRequired={false}
                            allowTextInput={true}
                            disableAutoFocus={false}
                            placeholder='MM/DD/YYYY'
                            ariaLabel='Choose your Date!'
                            firstDayOfWeek={this.state.firstDayOfWeek}
                            strings={DayPickerStrings}
                            value={this.state.meetingDate}
                            isMonthPickerVisible={false}
                            onSelectDate={this._onSelectDate}
                            formatDate={this._onFormatDate}
                            parseDateFromString={this._onParseDateFromString}
                        />
                        <div>
                            <TextField label='Von:' placeholder='HH:MM' value={this.state.from} onChanged={this._onFromInputChange} required/>
                            <TextField label='Bis:' placeholder='HH:MM' value={this.state.until} onChanged={this._onUntilInputChange} required/>
                        </div>
                        <div>
                            <TextField label='Personen:' placeholder='' value={this.state.persons} onChanged={this._onPersonInputChange} required/>
                        </div>
                    <div>
                        <DefaultButton text='Zurueck' onClick={this.props.closeCreateAppointmentModal}/>
                        <DefaultButton text='Hinzufuegen' onClick={this._saveAppointmentToList}/>
                    </div>
                </div>
            </div>
        );
    }
}