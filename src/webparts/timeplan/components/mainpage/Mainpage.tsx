import * as React from 'react';
import styles from './Mainpage.module.scss';
import { IMainPageState } from './IMainPageState';
import { IMainPageProps } from './IMainPageProps';
import { Meeting } from '../../data/Meeting/Meeting';
import { MeetingService } from '../../service/Meeting-Service';
import { Link } from 'react-router-dom';
import { DefaultButton } from 'office-ui-fabric-react';
import { DetailsList, Selection, IColumn, SelectionMode, CheckboxVisibility} from 'office-ui-fabric-react/lib/DetailsList';

const initialState: IMainPageState = {
    meetingList: [],
    columns: [],
    selectedMeeting: undefined,
}

export class MainPage extends React.Component < any, IMainPageState > {

    state: IMainPageState = initialState;
    props: any;
    private selection: Selection;

    constructor(props: any){
      super(props);
      this.props = props;
      this.initializeSelectionCallback();
      MeetingService.getMeetingList().then( list => {
        let columns = this.setColumnNames();
        this.setState({
          meetingList: list,
          columns: columns,
          selectedMeeting: this._getSelectedMeeting()})
        ;});

      this.testButton = this.testButton.bind(this);
      this.initializeSelectionCallback = this.initializeSelectionCallback.bind(this);
      
    }

    private initializeSelectionCallback():void {
      this.selection = new Selection({
        onSelectionChanged: () => {
          this.setState({
            meetingList: this.state.meetingList, 
            columns: this.state.columns,
            selectedMeeting:this._getSelectedMeeting()
          })
        }
      });
    }

    private _getSelectedMeeting():Meeting {
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
        fieldName: 'description',
        minWidth: 210,
        maxWidth: 350,
      },{
        key: 'column3',
        name: 'Status',
        fieldName: 'status',
        minWidth: 210,
        maxWidth: 350,
      },]
      return columns;
    }

    public testButton():void {
      console.log('Clicked Bearbeiten Button');
      console.log(this.state);
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
              <Link to={{
                pathname: '/CreateMeeting',
                state: {
                  selectedMeeting: this.state.selectedMeeting
                  }
                }}>
                <DefaultButton text='Bearbeiten' />
              </Link> 
              <Link to={{
                pathname: '/MeetingStatus',
                state: {
                  selectedMeeting: this.state.selectedMeeting
                  }
                }}>
                <DefaultButton text='Status' />
              </Link> 
          </div>
        </div>
      </div>
      );
    }


}


