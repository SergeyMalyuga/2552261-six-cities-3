import {OfferPreview} from '../../types/offers.ts';
import {Dispatch, SetStateAction, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {AppRoute, AuthorizationStatus} from '../../const.ts';
import classNames from 'classnames';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {getAuthorizationStatus} from '../../store/user-process/selectors.ts';
import {changeFavoriteStatus} from '../../store/api-actions.ts';

type CardScreenProps = {
  offer: OfferPreview;
  isFavorite?: boolean;
  isOtherPlacesSection?: boolean;
  isActive?: boolean;
  setActiveCard?: Dispatch<SetStateAction<OfferPreview | undefined>>;
}

function Card({
  offer,
  isFavorite = false,
  isActive,
  isOtherPlacesSection = false,
  setActiveCard,
}: CardScreenProps): JSX.Element {

  const [isBookMarked, setBookMarked] = useState<boolean>(offer.isFavorite);
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const mouseEnterHandler = () => {
    if (setActiveCard) {
      setActiveCard(offer);
    }

  };
  const mouseLeaveHandler = () => {
    if (setActiveCard) {
      setActiveCard(undefined);
    }
  };

  const bookMarkedHandler = () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    setBookMarked(!isBookMarked);
    if (authorizationStatus === AuthorizationStatus.NoAuth) {
      navigate(AppRoute.Login);
    }
    dispatch(changeFavoriteStatus({id: offer.id, status: +!isBookMarked}));
    setIsLoading(false);
  };

  const linkClickHandler = () => {
    if (isOtherPlacesSection) {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  };

  return (
    <article className={classNames(
      {'favorites__card': isFavorite},
      {'near-places__card': isOtherPlacesSection},
      {'cities__card_active': isActive},
      {'cities__card': !isFavorite && !isOtherPlacesSection},
      'place-card')}
    onMouseEnter={mouseEnterHandler} onMouseLeave={mouseLeaveHandler}
    >
      {offer.isPremium && <div className={classNames('place-card__mark')}><span>Premium</span></div>}

      <div className={classNames({'cities__image-wrapper': !isFavorite && !isOtherPlacesSection},
        {'favorites__image-wrapper': isFavorite},
        {'near-places__image-wrapper': isOtherPlacesSection},
        'place-card__image-wrapper')}
      >
        <Link onClick={linkClickHandler} to={`${!isOtherPlacesSection ? `${AppRoute.Offer}/${offer.id}` : ''}`}>
          <img className="place-card__image" src={`${offer.previewImage}`} width={isFavorite ? '150' : '260'}
            height={isFavorite ? '110' : '200'}
            alt="Place image"
          />
        </Link>
      </div>
      <div className={classNames({'favorites__card-info': isFavorite}, 'place-card__info')}>
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{offer.price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button
            onClick={bookMarkedHandler}
            className={classNames('place-card__bookmark-button', 'button',
              {'place-card__bookmark-button--active': isBookMarked && authorizationStatus === AuthorizationStatus.Auth})}
            type="button" data-testid={'bookmark-button'}
          >
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">To bookmarks</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{width: `${Math.round(offer.rating) * 20}%`}}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link onClick={linkClickHandler}
            to={`${!isOtherPlacesSection ? `${AppRoute.Offer}/${offer.id}` : ''}`}
          >{offer.title}
          </Link>
        </h2>
        <p className="place-card__type">{offer.type.replace(offer.type.charAt(0), offer.type.charAt(0).toUpperCase())}</p>
      </div>
    </article>
  );
}

export default Card;
