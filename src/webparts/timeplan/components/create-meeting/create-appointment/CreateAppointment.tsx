import * as React from 'react';
import styles from './CreateAppointment.module.scss';
import { ICreateAppointmentProps } from './ICreateAppointmentProps';
import { ICreateAppointmentState } from './ICreateAppointmentState';
import { Appointment, IAppointment } from '../../../data/Appointment/Appointment';
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

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class CreateAppointment extends React.Component < ICreateAppointmentProps, ICreateAppointmentState > {

    constructor(props: any){
        super(props);        
        this.state = {
            meetingDate: null,
            persons: 1
        };
    }

    private _onSelectDate = (date: Date | null | undefined) => {
        this.setState({ meetingDate: date, dateError: undefined });
    };

    private _onFormatDate = (date: Date):string => {
        return date.getDate() + '.' + (date.getMonth() + 1) + '.' + (date.getFullYear()); // TT.MM.JJJJ
    };

    private _onParseDateFromString = (value: string):Date => {
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

    componentDidMount(){
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
            fromError: TIME_PATTERN.test(from) ? undefined : 'Bitte eine gueltige Uhrzeit eingeben (HH:MM).',
        });
    }

    private _onUntilInputChange = (until:string) => {
        this.setState({
            until: until,
            untilError: TIME_PATTERN.test(until) ? undefined : 'Bitte eine gueltige Uhrzeit eingeben (HH:MM).',
        });
    }

    private _onPersonInputChange = (person:string) => {
        const parsed = parseInt(person, 10);
        this.setState({
            persons: isNaN(parsed) ? undefined : parsed,
            personsError: (!person || isNaN(parsed) || parsed < 1) ? 'Bitte eine positive Zahl eingeben.' : undefined,
        });
    }

    private _validate = (): boolean => {
        const dateError = !this.state.meetingDate ? 'Bitte ein Datum auswaehlen.' : undefined;
        const fromError = !this.state.from || !TIME_PATTERN.test(this.state.from)
            ? 'Bitte eine gueltige Uhrzeit eingeben (HH:MM).' : undefined;
        const untilError = !this.state.until || !TIME_PATTERN.test(this.state.until)
            ? 'Bitte eine gueltige Uhrzeit eingeben (HH:MM).' : undefined;
        const personsError = (!this.state.persons || this.state.persons < 1)
            ? 'Bitte eine positive Zahl eingeben.' : undefined;
        this.setState({ dateError, fromError, untilError, personsError });
        return !dateError && !fromError && !untilError && !personsError;
    }

    private _saveAppointmentToList = () => {
        if (!this._validate()) {
            return;
        }
        let newAppointment= new Appointment({
            appointmentDate: this.state.meetingDate,
            appointmentStart: this.state.from,
            appointmentEnd: this.state.until,
            personCount: this.state.persons,
        });
        if(this.props.isUpdate){
            this.props.updateAppointment(this.props.appointmentToEdit,newAppointment); 
        }else{
            this.props.addAppointmentToList(newAppointment);
        }
        this.props.closeCreateAppointmentModal();
    }

    public render(): React.ReactElement<ICreateAppointmentProps> {
        return(
            <div className={styles.createAppointment}>
                <div className={styles.container}>
                    <h1>Termin Erstellen</h1>
                        <DatePicker
                            label="Datum"
                            isRequired={true}
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
                        {this.state.dateError && <span style={{ color: 'rgb(168, 0, 0)', fontSize: '12px' }}>{this.state.dateError}</span>}
                        <div>
                            <TextField label='Von:' placeholder='HH:MM' value={this.state.from} onChanged={this._onFromInputChange} required errorMessage={this.state.fromError}/>
                            <TextField label='Bis:' placeholder='HH:MM' value={this.state.until} onChanged={this._onUntilInputChange} required errorMessage={this.state.untilError}/>
                        </div>
                        <div>
                            <TextField  
                                label='Personen:' 
                                placeholder='1'
                                value={this.state.persons !== undefined ? String(this.state.persons) : ''}
                                onChanged={this._onPersonInputChange} 
                                required
                                errorMessage={this.state.personsError}
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