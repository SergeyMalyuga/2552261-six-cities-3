import {State} from '../../types/state.ts';
import {NameSpace} from '../../const.ts';

export const getOffers = (state: Pick<State, NameSpace.Offers>) => state[NameSpace.Offers].offers;
export const getFavoriteOffers = (state: Pick<State, NameSpace.Offers>) => state[NameSpace.Offers].offersFavorites;
export const getOffersLoadingStatus = (state: Pick<State, NameSpace.Offers>) => state[NameSpace.Offers].isOffersLoading;
export const getErrorStatus = (state: Pick<State, NameSpace.Offers>) => state[NameSpace.Offers].hasError;
