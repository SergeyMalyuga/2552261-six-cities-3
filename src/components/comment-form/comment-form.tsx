import React, {Dispatch, SetStateAction, useRef, useState} from 'react';
import {Comments, NewComment} from '../../types/comments.ts';
import {
  AuthorizationStatus,
  DEFAULT_COMMENT,
  COMMENT_MIN_LENGTH,
  RatingStar,
  RatingStarTitle, COMMENT_MAX_LENGTH
} from '../../const.ts';
import {useAppSelector} from '../../hooks';
import classNames from 'classnames';
import {postComment} from '../../services/api.ts';
import {Offer} from '../../types/offers.ts';
import {getAuthorizationStatus} from '../../store/user-process/selectors.ts';
import {changeFormState} from '../../utils/util.ts';

type ReviewsListProps = {
  setReviewsState: Dispatch<SetStateAction<Comments>>;
  currentReviews: Comments;
  currentOffer: Offer;
}

export function CommentForm({currentOffer, setReviewsState, currentReviews}: ReviewsListProps): JSX.Element {
  const ratingEntries = Object.entries(RatingStar).filter(([, value]) =>
    typeof value === 'number'
  );
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const formRef = useRef<HTMLFormElement>(null);
  const [newReview, setNewReview] = useState<NewComment>(DEFAULT_COMMENT);
  const [hasError, setError] = useState<boolean>(false);

  function submitHandler(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    const newArr = [...currentReviews];
    changeFormState(true, formRef);
    (async () => {
      let newComment;
      try {
        newComment = await postComment(currentOffer.id, newReview);
      } catch (error) {
        setError(true);
        changeFormState(false, formRef);
        return;
      }

      newArr.unshift(newComment);
      setNewReview(DEFAULT_COMMENT);
      setReviewsState(newArr);
      changeFormState(false, formRef);
    })();
  }

  function inputHandler(evt: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) {
    const {name, value} = evt.target;
    setNewReview({...newReview, [name === 'review' ? 'comment' : 'rating']: name === 'rating' ? Number(value) : value});
  }

  if (hasError) {
    return (
      <form onSubmit={submitHandler} className={classNames('reviews__form form',
        {'visually-hidden': authorizationStatus === AuthorizationStatus.NoAuth})} action="#" method="post"
      ref={formRef}
      >
        <p className="cities__status">
         Не удалось отправить комментарий
        </p>
        <button className="reviews__submit form__submit button error-button" type="submit"
          disabled={newReview.rating === 0 || newReview.comment.length < COMMENT_MIN_LENGTH || newReview.comment.length > COMMENT_MAX_LENGTH}
        >Попробовать ещё раз
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={submitHandler} className={classNames('reviews__form form',
      {'visually-hidden': authorizationStatus === AuthorizationStatus.NoAuth})} action="#" method="post"
    ref={formRef}
    >
      <label className="reviews__label form__label" htmlFor="review">Your review</label>
      <div className="reviews__rating-form form__rating">
        {ratingEntries.map(([key, value]) => (
          <React.Fragment key={value}>
            <input
              className="form__rating-input visually-hidden"
              name="rating"
              value={value}
              id={`${value}-stars`}
              type="radio"
              onChange={inputHandler}
              checked={newReview.rating === Number(value)}
            />
            <label htmlFor={`${value}-stars`} className="reviews__rating-label form__rating-label"
              title={RatingStarTitle[key as keyof typeof RatingStarTitle]}
            >
              <svg className="form__star-image" width="37" height="33">
                <use xlinkHref="#icon-star"/>
              </svg>
            </label>
          </React.Fragment>
        ))}
      </div>
      <textarea onChange={inputHandler} className="reviews__textarea form__textarea" id="review" name="review"
        value={newReview.comment} minLength={COMMENT_MIN_LENGTH}
        placeholder="Tell how was your stay, what you like and what can be improved"
      >
      </textarea>
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set <span className="reviews__star">rating</span> and
          describe your stay with at least <b className="reviews__text-amount">50 characters</b>.
        </p>
        <button className="reviews__submit form__submit button" type="submit"
          disabled={newReview.rating === 0 || newReview.comment.length < COMMENT_MIN_LENGTH || newReview.comment.length > COMMENT_MAX_LENGTH}
        >Submit
        </button>
      </div>
    </form>
  );
}
