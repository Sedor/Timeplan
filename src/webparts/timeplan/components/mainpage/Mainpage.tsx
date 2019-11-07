import * as React from 'react';
import styles from './Mainpage.module.scss';
import { IMainPageState } from './IMainPageState';
import { IMainPageProps } from './IMainPageProps';
import { Meeting } from '../../data/Meeting/Meeting';
import { MeetingService } from '../../service/meeting-service';
import { Link } from 'react-router-dom';

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

    protected routeToCreateMeeting():void {
      this.props.history.push('/createMeeting');
    }

    public render(): React.ReactElement<IMainPageProps> {
      MeetingService.getMeetingList().then( list => {this.state.meetingList = list;} );
        return(
        //<div className = { styles.createEvent } >
        <div className={styles.mainPage}>
        <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.column}>
            <span className={styles.title}>Ihre Veranstaltungen!</span>
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
              <Link className={styles.button} to='/CreateMeeting'>
                <span className={styles.label}>Neue Veranstaltung</span>
              </Link> 
            <a className={styles.button}>
              <span className={styles.label}>Bearbeiten</span>
            </a>
            <a className={styles.button}>
              <span className={styles.label}>Status</span>
            </a>
          </div>
        </div>
      </div>
      </div>
      );
    }


}


