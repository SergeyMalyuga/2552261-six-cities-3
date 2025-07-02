import {Header} from '../components/header/header.tsx';
import classNames from 'classnames';
import {useAppDispatch} from '../hooks';
import {fetchOffersAction} from '../store/api-actions.ts';

export function ErrorScreen() {
  const dispatch = useAppDispatch();

  return (
    <div className="page page--gray page--main">
      <Header />
      <main
        className={classNames('page__main', 'page__main--index', 'page__main--index-empty')}
      >
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
        </div>
        <div className="cities">
          <div className="cities__places-container cities__places-container--empty container">
            <section className="cities__no-places">
              <div className="cities__status-wrapper tabs__content">
                <b className="cities__status">Не удалось загрузить предложения</b>
                <button onClick={() => dispatch(fetchOffersAction())} className="cities__status-description">Попробуйте ещё раз
                </button>
              </div>
            </section>
            <div className="cities__right-section"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
