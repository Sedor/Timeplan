import * as React from 'react';
import styles from './Mainpage.module.scss';
import { IMainPageState } from './IMainPageState';
import { IMainPageProps } from './IMainPageProps';
import { Meeting } from '../../data/Meeting/Meeting';
import { MeetingService } from '../../service/meeting-service';
import { Link } from 'react-router-dom';
import { DefaultButton } from 'office-ui-fabric-react';

const initialState: IMainPageState = {
    meetingList: [new Meeting('3','Test','Test2')],
}

export class MainPage extends React.Component < any, IMainPageState > {

    state: IMainPageState = initialState;
    props: any;

    constructor(props: any){
      super(props);
      this.props = props;
      console.log(props);
      MeetingService.getMeetingList().then( list => {this.setState({meetingList: list});} );
    }

    public testButton():void {
      console.log('Clicked Bearbeiten Button');
    }

    public render(): React.ReactElement<IMainPageProps> {
      MeetingService.getMeetingList().then( list => {this.state.meetingList = list;} );
        return(
        //<div className = { styles.createEvent } >
        <div >
        <div >
        <div >
          <div >
            <span className={styles.title}>Ihre Veranstaltungen</span>
            <table>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Description</th>
              </tr>
               {this.state.meetingList.map(meeting => {
                 return <tr><td>{meeting.getId()}</td><td>{meeting.getTitle()}</td><td>{meeting.getDescription()}</td></tr>
               })}
            </table>
              <Link to='/CreateMeeting'>
                <DefaultButton text='Neue Veranstaltung' onClick={this.testButton} /> 
              </Link>
              <DefaultButton text='Bearbeiten' onClick={this.testButton} /> 
              <DefaultButton text='Status' onClick={this.testButton} /> 
          </div>
        </div>
      </div>
      </div>
      );
    }


}


