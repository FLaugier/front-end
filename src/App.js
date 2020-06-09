import React, { useEffect, useState } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import Coaches from './pages/Coaches';
import CommonModal from './components/CommonModal';
import Home from './pages/Home';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Participants from './pages/Participants';
import Data from './pages/Data';
import NavbarHome from './components/NavbarHome';
import NavbarWorkshop from './components/NavbarWorkshop';
import Resources from './pages/Resources';
import Results from './pages/Results';
import Simulation from './pages/Simulation';
import Workshops from './pages/Workshops';
import { COLORS } from './vars';
import { getAccessToken } from './utils/auth';
import { useAuthentication } from './hooks/authentication';

const AppRouter = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/workshop/:workshopId/*" component={NavbarWorkshop} />
      <Route component={NavbarHome} />
    </Switch>
    <Switch>
      <Route
        path="/workshop/:workshopId/participants"
        component={Participants}
      />
      <Route path="/workshop/:workshopId/data" component={Data} />
      <Route path="/workshop/:workshopId/simulation" component={Simulation} />
      <Route path="/workshop/:workshopId/results" component={Results} />
      <Route exact path="/">
        <Redirect to="/workshops" />
      </Route>
      <Route path="/home" component={Home} />
      <Route path="/coaches" component={Coaches} />
      <Route path="/workshops" component={Workshops} />
      <Route path="/resources" component={Resources} />
    </Switch>
  </BrowserRouter>
);

const App = () => {
  const { t } = useTranslation();
  const [token, setToken] = useState(getAccessToken());
  const { signedIn, isLoading } = useAuthentication(token);
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bgColor', `${COLORS.BROWN.LIGHT}`);
  }, []);

  const handleLogin = ({ access_token: accessToken }) => {
    setToken(accessToken);
  };

  if (isLoading) {
    return <Spinner animation="border" className="pt-3 mx-auto mt-5" />;
  }
  if (signedIn) {
    return <AppRouter />;
  }

  return (
    <BrowserRouter>
      <Navbar />;
      <CommonModal title={t('common.login')} show>
        <Login handleLogin={handleLogin} />
      </CommonModal>
    </BrowserRouter>
  );
};

export default App;
