import * as React from 'react';
import styles from './Mainpage.module.scss';
import { IMainPageState } from './IMainPageState';
import { IMainPageProps } from './IMainPageProps';
import { Meeting } from '../../data/Meeting/Meeting';
import { MeetingService } from '../../service/Meeting-Service';
import { Link } from 'react-router-dom';
import { DefaultButton } from 'office-ui-fabric-react';
import { DetailsList, Selection, IColumn, SelectionMode, CheckboxVisibility} from 'office-ui-fabric-react/lib/DetailsList';

export class MainPage extends React.Component < any, IMainPageState > {

    props: any;
    private selection: Selection;

    constructor(props: any){
      super(props);
      this.initializeSelectionCallback();
      console.log('Constructor')
      this.state = {
        meetingList: [],
        columns: this.setColumnNames(),
        selectedMeeting: undefined,
      }
      MeetingService.getMeetingList().then( list => {
        this.setState({
          meetingList: list.concat([]),
        });
      });
    }

    private initializeSelectionCallback = ():void => {
      this.selection = new Selection({
        onSelectionChanged: () => {
          this.setState({
            selectedMeeting:this._getSelectedMeeting()
          })
        }
      });
    }

    private _getSelectedMeeting():Meeting {
      console.log('_getSelectedMeeting');
      if((this.selection.getSelection()[0] as Meeting) === undefined){
        return this.state.selectedMeeting;
      }else{
        return (this.selection.getSelection()[0] as Meeting);
      }
    }

    public setColumnNames():IColumn[] {
      let columns:IColumn[] = [{
        key: 'column1',
        name: 'Name',
        fieldName: 'title',
        minWidth: 210,
        maxWidth: 350,
      },{
        key: 'column2',
        name: 'Beschreibung',
        isMultiline: true,
        fieldName: 'description',
        minWidth: 210,
        maxWidth: 350,
      },{
        key: 'column3',
        name: 'Status',
        fieldName: 'status',
        minWidth: 70,
        maxWidth: 120,
      },{
        key: 'column4',
        name: 'VerteilAlgo',
        fieldName: 'distribution',
        minWidth: 210,
        maxWidth: 350,
      },]
      return columns;
    }

    private _clickedEditWithoutSelection(){
      alert('Please select a Meeting');
    }

    private _clickedStatusWithoutSelection(){
      alert('Please select a Meeting');
    }

    private _clickedPreferenceWithoutSelection(){
      alert('Please select a Meeting');
    }

    public render(): React.ReactElement<IMainPageProps> {
      MeetingService.getMeetingList().then( list => {this.state.meetingList = list;} );
      return(
      <div>
        <div>
          <div>
            <h1>Ihre Veranstaltungen</h1>
              <DetailsList
                items={this.state.meetingList}
                columns={this.state.columns}
                selectionPreservedOnEmptyClick={true}
                selection={this.selection}
                checkboxVisibility={CheckboxVisibility.hidden}
              />
              <Link to='/CreateMeeting'>
                <DefaultButton text='Neue Veranstaltung' /> 
              </Link>
            {this.state.selectedMeeting !== undefined ? 
                <Link to={{
                  pathname: '/CreateMeeting',
                  state: {
                    selectedMeeting: this.state.selectedMeeting
                    }
                  }}>
                  <DefaultButton text='Bearbeiten' />
                </Link>
              :
              <DefaultButton text='Bearbeiten' onClick={this._clickedEditWithoutSelection}/>
            }
            {this.state.selectedMeeting !== undefined ? 
              <Link to={{
                pathname: '/MeetingStatus',
                state: {
                  selectedMeeting: this.state.selectedMeeting
                  }
                }}>
                <DefaultButton text='Status' />
              </Link>
              :
              <DefaultButton text='Status' onClick={this._clickedStatusWithoutSelection}/>
            }
            {this.state.selectedMeeting !== undefined ? 
              <Link to={{
                pathname: '/SetPreference',
                state: {
                  selectedMeeting: this.state.selectedMeeting
                  }
                }}>
                <DefaultButton text='Preference' />
              </Link>
              :
              <DefaultButton text='Preference' onClick={this._clickedPreferenceWithoutSelection}/>
            }
          </div>
        </div>
      </div>
      );
    }


}


