import * as React from 'react';
import styles from './CreateAppointment.module.scss';
import { ICreateAppointmentProps } from './ICreateAppointmentProps';
import { ICreateAppointmentState } from './ICreateAppointmentState';
import { Appointment } from '../../data/Appointment/Appointment';
import { Meeting } from '../../data/Meeting/Meeting';
import { DefaultButton } from 'office-ui-fabric-react';
import { TextField} from 'office-ui-fabric-react/lib/TextField';

export class CreateAppointment extends React.Component < any, ICreateAppointmentState > {


    constructor(props: any){
        super(props);
       
    }


    public render(): React.ReactElement<ICreateAppointmentProps> {
        return(
            <div>
                <p>CreateAppointment wuhu</p>
            </div>
        );
    }
}