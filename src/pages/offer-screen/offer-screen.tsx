import {OfferHostComponent} from '../../components/offer-host-component/offer-host-component.tsx';
import {useNavigate, useParams} from 'react-router-dom';
import {Offer, OffersPreview} from '../../types/offers.ts';
import NotFoundScreen from '../not-found-screen/not-found-screen.tsx';
import {ReviewsList} from '../../components/reviews-list/reviews-list.tsx';
import {Comments} from '../../types/comments.ts';
import {CommentForm} from '../../components/comment-form/comment-form.tsx';
import {useEffect, useState} from 'react';
import {Header} from '../../components/header/header.tsx';
import Map from '../../components/map/map.tsx';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {getComments, getNearbyOffers, getOfferById} from '../../services/api.ts';
import {Loader} from '../../components/loader/loader.tsx';
import {NeighbourOffersList} from '../../components/other-places-list/neighbour-offers-list.tsx';
import classNames from 'classnames';
import {AppRoute, AuthorizationStatus, MAX_NEIGHBOURS_OFFERS_LIMIT} from '../../const.ts';
import {getAuthorizationStatus} from '../../store/user-process/selectors.ts';
import {changeFavoriteStatus} from '../../store/api-actions.ts';
import {nanoid} from 'nanoid';
import {offerAdapter} from '../../utils/util.ts';
import {changePageStatus} from '../../store/pages-process/page-process.ts';

function OfferScreen(): JSX.Element {
  const {offerId} = useParams();
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const [currentOffer, setCurrentOffer] = useState<Offer | undefined>(undefined);
  const [neighbourOffers, setNeighbourOffers] = useState<OffersPreview>([]);
  const [reviewsState, setReviewsState] = useState<Comments>([]);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  let neighbourOffersWithCurrentOffer: OffersPreview = [];

  if (currentOffer !== undefined) {
    neighbourOffersWithCurrentOffer = [offerAdapter(currentOffer), ...neighbourOffers.slice(0, MAX_NEIGHBOURS_OFFERS_LIMIT)];
  }

  const bookMarkedHandler = () => {
    if (isLoading) {
      return;
    }
    setCurrentOffer({...currentOffer!, isFavorite: !currentOffer!.isFavorite});
    setIsLoading(true);
    if (authorizationStatus === AuthorizationStatus.NoAuth) {
      navigate(AppRoute.Login);
      setIsLoading(false);
    }
    dispatch(changeFavoriteStatus({id: offerId, status: +!currentOffer?.isFavorite}));
    setIsLoading(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const offer = await getOfferById(offerId);
        const reviews = await getComments(offerId);
        const nearbyOffers = await getNearbyOffers(offerId);
        setCurrentOffer(offer);
        setReviewsState(reviews);
        setNeighbourOffers(nearbyOffers);
      } catch (error) {
        setIsNotFound(true);
      }
    })();
    dispatch(changePageStatus(false));
  }, []);

  if (isNotFound) {
    return <NotFoundScreen/>;
  }

  if (currentOffer === undefined) {
    return <Loader/>;
  }

  return (
    <div className="page">
      <Header/>
      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container" data-testid="offer-gallery">
            <div className="offer__gallery">
              {currentOffer.images.map((image, index) => (
                index !== 6 &&
                <div key={nanoid()} className="offer__image-wrapper">
                  <img className="offer__image" src={image} alt="Photo studio"/>
                </div>))}
            </div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              {currentOffer.isPremium && <div className="offer__mark"><span>Premium</span></div>}
              <div className="offer__name-wrapper">
                <h1 className="offer__name">
                  {currentOffer.title}
                </h1>
                <button onClick={bookMarkedHandler}
                  className={classNames('offer__bookmark-button', 'button',
                    {'offer__bookmark-button--active': currentOffer.isFavorite && authorizationStatus === AuthorizationStatus.Auth})}
                  type="button"
                >
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">To bookmarks</span>
                </button>
              </div>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{width: `${Math.round(currentOffer.rating) * 20}%`}}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">{currentOffer.rating}</span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {currentOffer.type.replace(currentOffer.type.charAt(0), currentOffer.type.charAt(0).toUpperCase())}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {`${currentOffer.bedrooms} ${currentOffer.bedrooms > 1 ? 'Bedrooms' : 'Bedroom'}`}
                </li>
                <li className="offer__feature offer__feature--adults">
                  {`Max ${currentOffer.maxAdults} ${currentOffer.maxAdults > 1 ? 'adults' : 'adult'}`}
                </li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">&euro;{currentOffer.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">{currentOffer.goods.map((good) => (
                  <li key={good} className="offer__inside-item">{good}</li>))}
                </ul>

              </div>
              <OfferHostComponent currentOffer={currentOffer}/>
              <section className="offer__reviews reviews">
                <ReviewsList comments={reviewsState}/>
                {authorizationStatus === AuthorizationStatus.Auth ? <CommentForm currentOffer={currentOffer} setReviewsState={setReviewsState} currentReviews={reviewsState}/> : null}
              </section>
            </div>
          </div>
          <Map city={currentOffer.city} points={neighbourOffersWithCurrentOffer} activeCard={currentOffer}
            className={'offer__map'}
          />
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <div className="near-places__list places__list">
              <NeighbourOffersList neighbourOffers={neighbourOffers}/>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default OfferScreen;
