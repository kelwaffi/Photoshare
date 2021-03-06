import React, { useEffect, lazy, Suspense } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import { useHistory } from 'react-router-dom';
import * as Routes from './component/routes';
import ErrorBoundary from './component/ErrorBounday';

// import UserProfile from './screens/UserProfile';
import { connectSocketIo } from './redux/Socket/socketActions';

// components
import NavigationHeader from './component/NavigationHeader';
import MobileTabMenu from './component/MobileTabMenu';
import Footer from './component/Footer';
import LoadingPage from './screens/LoadingScreen';
import GlobaLoader from './component/GlobalLoader';

//  redux
import { loaduser, LogOut, signin } from './redux/Actions/userActions';
import { connect, useDispatch } from 'react-redux';
import { setToken } from './utils';

// react-query


// screens
const ErrorPage = lazy(() => import('./screens/Error404Screen'));
const LogInScreen = lazy(() => import('./screens/LoginScreen'));
const SignUpScreen = lazy(() => import('./screens/SignUpScreen'));
const HomeScreen = lazy(() => import('./screens/Home/HomeScreen'));
const ExploreScreen = lazy(() => import('./screens/Explore'));
const NewPostPage = lazy(() => import('./screens/NewPost'));
const EditProfilePage = lazy(() => import('./screens/SettingsScreen'));
const PostPage = lazy(() => import('./screens/PostPage'));
const ProfilePage = lazy(() => import('./screens/ProfilePage'));
const ForgotPasswordPage = lazy(() => import('./screens/ForgetPassword'));
const ResetPasswordPage = lazy(() => import('./screens/ResetPassword'))
// lazy load component




if (localStorage.authToken) {
  setToken(localStorage.authToken)
}

function App({ loaduser, connectSocketIo, currentUser }) {
  const token = localStorage.getItem('authToken');
  const {
    history,
    location: { pathname },
  } = useHistory();

  const dispatch = useDispatch();

  useEffect(() => {
    // check for token in localStoagre
    if (localStorage.authToken) {
      loaduser();
    }

    return () => null;
  }, [])
  if (!currentUser && localStorage.authToken) {
    return <LoadingPage />
  }
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingPage />}>
        <div className="App">
          {pathname !== Routes.Login &&
            pathname !== Routes.SignUp &&
            pathname !== "/passwordreset/:resetToken" &&
            pathname !== Routes.ForgotPassword &&
            < NavigationHeader />}
          <Switch>
            <Route exact path={Routes.Login} render={() => <LogInScreen />} />
            <Route exact path={Routes.SignUp} render={() => <SignUpScreen />} />
            <Route exact path={Routes.Dashboard} render={() => <HomeScreen />} />
            <Route exact path={Routes.Explore} render={() => <ExploreScreen />} />
            <Route exact path={Routes.NewPostPage} component={NewPostPage} />
            <Route exact path={`${Routes.PostPage}/:postId`} component={PostPage} />
            <Route exact path={`${Routes.ProfilePage}/:username`} component={ProfilePage} />
            <Route path={Routes.SettingsPage} component={EditProfilePage} />
            <Route exact path="/passwordreset/:resetToken" component={ResetPasswordPage} />
            <Route exact path={Routes.ForgotPassword} component={ForgotPasswordPage} />
            <Route component={ErrorPage} />
          </Switch>

          {
            pathname !== Routes.SignUp &&
            pathname !== "/passwordreset/:resetToken" &&
            pathname !== Routes.Login &&
            currentUser &&
            <MobileTabMenu />}
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}
const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser
})
export default connect(mapStateToProps, { loaduser, connectSocketIo, signin })(App);
