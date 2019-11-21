import * as React from 'react';
import styles from './CreateUser.module.scss';
import { DefaultButton } from 'office-ui-fabric-react';
import { ICreateUserProps } from './ICreateUserProps';
import { ICreateUserState } from './ICreateUserState';
import { User } from '../../../data/User/User';
import { BasePeoplePicker, TagPicker, ITag } from 'office-ui-fabric-react/lib/Pickers';
import { UserService } from '../../../service/User-Service';

export class CreateUser extends React.Component < any, ICreateUserState > {

    private _selectedUserlist: User[] = [];

    constructor(props: any){
        super(props); 
    }

    private _createUserAndAdd = () => {
      this.props.addUserToList(this._selectedUserlist);
    }

    private _onUserEmailChange = (email:string) => {
        console.log('onUserChange');
        this.setState({
            email: email
        })
    }

    private _onFilterChanged = (filterText: string, tagList: ITag[]): ITag[] | Promise<ITag[]> => {
      this._selectedUserlist = tagList.map( (tag:ITag) =>{
        return new User({name:tag.key, eMail: tag.name});
      });

      if(filterText){
        return UserService.getUserSearch(filterText).then( (userList:User[]) => {
          return userList.map(user => {
            return {key:user.name, name:user.eMail};
          });
        });
      }else{
        return [];
      }
    }

    private _getTextFromItem = (item: ITag): string => {
      return item.name;
    }


    public render(): React.ReactElement<ICreateUserProps> {
        return(
            <div className={styles.createUser}>
                <div className={styles.container}>
                    <h1>Benutzer hinzufuegen</h1>
                    <TagPicker
                      onResolveSuggestions={this._onFilterChanged}
                      getTextFromItem={this._getTextFromItem}
                      pickerSuggestionsProps={{
                        suggestionsHeaderText: 'Gefundene Personen',
                        noResultsFoundText: 'Person nicht vorhanden in AD'
                      }}
                    />
                    {/* <div>
                      <input type="file"/>
                    </div> */}
                    <div>
                        <DefaultButton text='Abbrechen' onClick={this.props.closeCreateUserModal} />
                        <DefaultButton text='Hinzufuegen' onClick={this._createUserAndAdd} />
                    </div>
                </div>
            </div>
        );
    }
}