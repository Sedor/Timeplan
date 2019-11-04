import * as React from 'react';
import styles from './Mainpage.module.scss';
import { IMainPageState } from './IMainPageState';
import { IMainPageProps } from './IMainPageProps';
import { escape } from '@microsoft/sp-lodash-subset';

const initialState: IMainPageState = {
    event: {
        name: 'Tri-State Office 365 User Group',
        location: 'Malvern, PA',
        organizers: ['Jason', 'Michael'],
        numOfAttendees: 33
    }
}

export class MainPage extends React.Component < any, IMainPageState > {

    readonly state: IMainPageState = initialState;

    public render(): React.ReactElement<IMainPageProps> {
        return(
        //<div className = { styles.createEvent } >
        <div className={styles.mainPage}>
        <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.column}>
            <span className={styles.title}>Welcome to {escape(this.props.description)}!</span>
            <table>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Description</th>
                <th>Owner</th>
              </tr>
              <tr>
                <td>1</td>
                <td>Hans</td>
                <td>Beschreibung blabla</td>
                <td>Severin</td>
              </tr>
            </table>
            <a className={styles.button}>
              <span className={styles.label}>Neue Veranstaltung</span>
            </a>
          </div>
        </div>
      </div>
      </div>
        );
    }


}


