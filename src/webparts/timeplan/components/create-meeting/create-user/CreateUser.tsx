import * as React from 'react';
import styles from './CreateUser.module.scss';
import { TextField} from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton } from 'office-ui-fabric-react';

import { ICreateUserProps } from './ICreateUserProps';
import { ICreateUserState } from './ICreateUserState';
import { User } from '../../../data/User/User';

const initialState: ICreateUserState = {
    email: ''
}

export class CreateUser extends React.Component < any, ICreateUserState > {

    state: ICreateUserState = initialState;

    constructor(props: any){
        super(props); 
      
        this._onUserEmailChange = this._onUserEmailChange.bind(this);
        this._createUserAndAdd = this._createUserAndAdd.bind(this);
    }

    private _createUserAndAdd() {
        //TODO Validation
        console.log('_createUserAndAdd');
        this.props.addUserToList(new User({
            name:'test_name',
            eMail: this.state.email,
        }));
    }

    private _onUserEmailChange(email:string){
        console.log('onUserChange');
        this.setState({
            email: email
        })
    }

    public render(): React.ReactElement<ICreateUserProps> {
        return(
            <div className={styles.createUser}>
                <div className={styles.container}>
                    <h1>Benutzer hinzufuegen</h1>
                    <TextField label='E-Mail:' placeholder='Bitte E-Mail Adresse eintragen' value={this.state.email} onChanged={this._onUserEmailChange} required/>
                    <div>
                        <DefaultButton text='Abbrechen' onClick={this.props.closeCreateUserModal} />
                        <DefaultButton text='Hinzufuegen' onClick={this._createUserAndAdd} />
                    </div>
                </div>
            </div>
        );
    }
}