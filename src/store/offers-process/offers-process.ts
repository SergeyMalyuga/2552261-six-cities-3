import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {OffersProcess} from '../../types/offers-process.ts';
import {NameSpace} from '../../const.ts';
import {OfferPreview, OffersPreview} from '../../types/offers.ts';
import {changeFavoriteStatus, fetchFavoritesOffersAction, fetchOffersAction} from '../api-actions.ts';

const initialState: OffersProcess = {
  offers: [],
  offersFavorites: [],
  isOffersLoading: false,
  hasError: false,
};

export const offerProcess = createSlice({
  name: NameSpace.Offers,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOffersAction.pending, (state) => {
      state.isOffersLoading = true;
      state.hasError = false;
    })
      .addCase(fetchOffersAction.fulfilled, (state, action: PayloadAction<OffersPreview>) => {
        state.offers = action.payload;
        state.isOffersLoading = false;
      }).addCase(fetchOffersAction.rejected, (state) => {
        state.isOffersLoading = false;
        state.hasError = true;
      })
      .addCase(fetchFavoritesOffersAction.fulfilled, (state, action: PayloadAction<OffersPreview>) => {
        state.offersFavorites = action.payload;
      }).addCase(changeFavoriteStatus.fulfilled, (state, action: PayloadAction<OfferPreview>) => {
        if (action.payload.isFavorite) {
          state.offersFavorites.push(action.payload);
        } else {
          state.offersFavorites = state.offersFavorites.filter((offer) => offer.id !== action.payload.id);
        }
        state.offers.forEach((offer) => {
          if(offer.id === action.payload.id) {
            offer.isFavorite = action.payload.isFavorite;
          }
        });
      });
  }
});

