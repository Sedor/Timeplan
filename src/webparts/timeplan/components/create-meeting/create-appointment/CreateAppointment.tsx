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
    invalidInputErrorMessage: 'Falsches Datumsformat.'
  };


export class CreateAppointment extends React.Component < ICreateAppointmentProps, ICreateAppointmentState > {

    constructor(props: any){
        super(props);        
        this.state = {
            meetingDate: null,
            persons: 1
        };
    }

    private _onSelectDate = (date: Date | null | undefined) => {
        this.setState({ meetingDate: date });
    };

    private _onFormatDate = (date: Date):string => {
        console.log('in _onFormatDate');
        return date.getDate() + '.' + (date.getMonth() + 1) + '.' + (date.getFullYear()); // TT.MM.JJJJ
    };

    private _onParseDateFromString = (value: string):Date => {
        console.log('in _onParseDateFromString');
        const date = this.state.meetingDate || new Date();
        const values = (value || '').trim().split('.');
        const day = values.length > 0 ? Math.max(1, Math.min(31, parseInt(values[0], 10))) : date.getDate();
        const month = values.length > 1 ? Math.max(1, Math.min(12, parseInt(values[1], 10))) - 1 : date.getMonth();
        let year = values.length > 2 ? parseInt(values[2], 10) : date.getFullYear();
        if (year < 100) {
          year += date.getFullYear() - (date.getFullYear() % 100);
        }
        return new Date(year, month, day);
    };

    componentDidMount = () => {
        console.log('CreateAppointment.componentDidMount()');
        if(this.props.isUpdate){
            this.setState({
                from: this.props.appointmentToEdit.appointmentStart,
                until: this.props.appointmentToEdit.appointmentEnd,
                meetingDate: new Date(this.props.appointmentToEdit.appointmentDate.getTime()), //making a new referenced Object
                persons: this.props.appointmentToEdit.personCount,
            });
        }
    }


    private _onFromInputChange = (from:string) => {
        this.setState({
            from: from,
        })
    }

    private _onUntilInputChange = (until:string) => {
        this.setState({
            until: until,
        })
    }

    private _onPersonInputChange = (person:string) => {
        this.setState({
            persons: parseInt(person),
        })
    }

    private _saveAppointmentToList = () => {
        console.log('CreateAppointment._saveAppointmentToList()');
        //TODO input verification
        let newAppointment= new Appointment({
            appointmentDate: this.state.meetingDate,
            appointmentStart: this.state.from,
            appointmentEnd: this.state.until,
            personCount: this.state.persons,
        });
        if(this.props.isUpdate){
            console.log('updating');
            this.props.updateAppointment(this.props.appointmentToEdit,newAppointment);
        }else{
            console.log('just adding');
            this.props.addAppointmentToList(newAppointment);
        }
        this.props.closeCreateAppointmentModal();
    }

    private _onNotifyValidationResult = (errorMessage: string, value: string) => {
        console.log('_onNotifyValidationResult for Person');
        console.log(errorMessage);
        console.log(value);
        //TODO validate Persons
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
                            placeholder='TT.MM.YYYY'
                            ariaLabel='Choose your Date!'
                            firstDayOfWeek={DayOfWeek.Monday}
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
                            <TextField  
                                label='Personen:' 
                                placeholder=''
                                defaultValue='1'
                                value={String(this.state.persons)}
                                onChanged={this._onPersonInputChange} 
                                onNotifyValidationResult={this._onNotifyValidationResult}
                                required
                            />
                        </div>
                    <div>
                        <DefaultButton text='Zurueck' onClick={this.props.closeCreateAppointmentModal}/>
                        <DefaultButton text={this.props.isUpdate ? 'Speichern' : 'Hinzufuegen' } onClick={this._saveAppointmentToList} />
                    </div>
                </div>
            </div>
        );
    }
}