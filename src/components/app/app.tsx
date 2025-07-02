import MainScreen from '../../pages/main-screen/main-screen.tsx';
import {Route, Routes} from 'react-router-dom';
import NotFoundScreen from '../../pages/not-found-screen/not-found-screen.tsx';
import {AppRoute} from '../../const.ts';
import LoginScreen from '../../pages/login-screen/login-screen.tsx';
import OfferScreen from '../../pages/offer-screen/offer-screen.tsx';
import FavoritesScreen from '../../pages/favorites-screen/favorites-screen.tsx';
import PrivateRoute from '../private-route/private-route.tsx';
import {useAppSelector} from '../../hooks';
import {Loader} from '../loader/loader.tsx';
import {getErrorStatus, getOffersLoadingStatus} from '../../store/offers-process/selectors.ts';
import {ErrorScreen} from '../../pages/error-screen.tsx';

function App(): JSX.Element {

  const isOfferLoading = useAppSelector(getOffersLoadingStatus);
  const hasError = useAppSelector(getErrorStatus);

  if(hasError) {
    return <ErrorScreen />;
  }

  if (isOfferLoading) {
    return (<Loader/>);
  }

  return (
    <Routes>
      <Route path={AppRoute.Root}>
        <Route index element={<MainScreen/>}/>
        <Route path={AppRoute.Login} element={<LoginScreen/>}/>
        <Route path={AppRoute.Favorites} element={
          <PrivateRoute><FavoritesScreen/></PrivateRoute>
        }
        />
        <Route path={`${AppRoute.Offer}/:offerId`} element={<OfferScreen/>}/>
      </Route>
      <Route path='*' element={<NotFoundScreen/>}/>
    </Routes>);
}

export default App;
