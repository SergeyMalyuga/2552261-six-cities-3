import {OffersPreview} from './offers.ts';

export type OffersProcess = {
  offers: OffersPreview;
  offersFavorites: OffersPreview;
  isOffersLoading: boolean;
  hasError: boolean;
}
