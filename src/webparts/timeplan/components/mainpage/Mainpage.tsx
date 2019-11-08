import * as React from 'react';
import styles from './Mainpage.module.scss';
import { IMainPageState } from './IMainPageState';
import { IMainPageProps } from './IMainPageProps';
import { Meeting } from '../../data/Meeting/Meeting';
import { MeetingService } from '../../service/meeting-service';
import { Link } from 'react-router-dom';
import { DefaultButton } from 'office-ui-fabric-react';
import { DetailsList, Selection, IColumn} from 'office-ui-fabric-react/lib/DetailsList';

const initialState: IMainPageState = {
    meetingList: [new Meeting('3','Test','Test2')],
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
      },]
      return columns;
    }

    public testButton():void {
      console.log('Clicked Bearbeiten Button');
      console.log(this.state);
    }

    private _onItemInvoked(item: any): void {
      console.log(item);
      alert(`Item invoked: ${item}`);
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
                onItemInvoked={this._onItemInvoked}
                selection={this.selection}
              />
              <Link to='/CreateMeeting'>
                <DefaultButton text='Neue Veranstaltung' onClick={this.testButton} /> 
              </Link>
              <Link to={{
                pathname: '/CreateMeeting',
                state: {
                  selectedMeeting: this.state.selectedMeeting
                  }
                }}>
                <DefaultButton text='Bearbeiten' onClick={this.testButton} />
              </Link> 
              <DefaultButton text='Status' onClick={this.testButton} /> 
          </div>
        </div>
      </div>
      );
    }


}


