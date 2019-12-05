import * as React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';

import styles from './Timeplan.module.scss';
import { ITimeplanProps } from './ITimeplanProps';

import { CreateMeeting } from './create-meeting/CreateMeeting';
import { MainPage } from './mainpage/Mainpage';
import { AddMeetingPage } from './add-meeting-page/AddMeetingPage';
import { MeetingStatus } from './meeting-status/MeetingStatus';
import { SetPreference } from './set-preference/SetPreference';

export default class Timeplan extends React.Component < ITimeplanProps, {} > {
  public render(): React.ReactElement<ITimeplanProps> {
    return(
      <HashRouter>
        <div>
        <Switch>
            <Route path='/addMeeting' component={AddMeetingPage} exact />
            <Route path='/veranstaltungErstellen' component={CreateMeeting} exact />
            <Route path='/veranstaltungsStatus' component={MeetingStatus} exact />
            <Route path='/einteilung' component={SetPreference} exact /> 
            <Route path='/' component={MainPage} exact />
            <Route render={() => <h1>Page Not found</h1> } />
          </Switch>
        </div>
      </HashRouter>
    );
  }
}
