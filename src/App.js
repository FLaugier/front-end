import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import Coaches from './pages/Coaches';
import CommonModal from './components/CommonModal';
import Home from './pages/Home';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Participants from './pages/Participants';
import Results from './pages/Results';
import Simulation from './pages/Simulation';
import Workshops from './pages/Workshops';
import { COLORS } from './vars';
import { getAccessToken } from './utils/auth';
import { useAuthentication } from './hooks/authentication';

const AppRouter = () => (
  <BrowserRouter>
    <Route exact path="/" component={Workshops} />
    <Route path="/home" component={Home} />
    <Route path="/simulation" component={Simulation} />
    <Route path="/results" component={Results} />
    <Route path="/coaches" component={Coaches} />
    <Route path="/workshops" component={Workshops} />
    <Route path="/participants" component={Participants} />
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
    <>
      <Navbar />;
      <CommonModal title={t('common.login')} show>
        <Login handleLogin={handleLogin} />
      </CommonModal>
    </>
  );
};

export default App;
