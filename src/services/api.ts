import axios, {AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import {getToken} from './token.ts';
import {Offer, OffersPreview} from '../types/offers.ts';
import {APIRoute} from '../const.ts';
import {Comment, Comments, NewComment} from '../types/comments.ts';
import {StatusCodes} from 'http-status-codes';
import {toast} from 'react-toastify';

const BASE_URL = 'https://15.design.htmlacademy.pro/six-cities';
const REQUEST_TIMEOUT = 5000;

type DetailMessageType = {
  type: string;
  message: string;
}

const StatusCodeMapping: Record<number, boolean> = {
  [StatusCodes.BAD_REQUEST]: true,
  [StatusCodes.UNAUTHORIZED]: true,
  [StatusCodes.NOT_FOUND]: true
};

const shouldDisplayError = (response: AxiosResponse) => !!StatusCodeMapping[response.status];

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BASE_URL,
    timeout: REQUEST_TIMEOUT,
  });

  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getToken();

      if(token && config.headers) {
        config.headers['x-token'] = token;
      }
      return config;
    });

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<DetailMessageType>) => {
      if (error.response && shouldDisplayError(error.response)) {
        const detailMessage = (error.response.data);
        toast.warn(detailMessage.message);
      } else if (error.request) {
        toast.error('Сервер не отвечает. Проверьте подключение к сети.');
      }
      throw error;
    }
  );

  return api;
};

const api = createAPI();

export const getOfferById = async (id: string | undefined) => {
  const {data} = await api.get<Offer>(`${APIRoute.Offers}/${id}`);
  return data;
};

export const getComments = async (id: string | undefined) => {
  const {data} = await api.get<Comments>(`${APIRoute.Comments}/${id}`);
  return data;
};

export const getNearbyOffers = async (id: string | undefined) => {
  const {data} = await api.get<OffersPreview>(`${APIRoute.Offers}/${id}/nearby`);
  return data;
};

export const postComment = async (id: string, comment: NewComment) => {
  const {data} = await api.post<Comment>(`${APIRoute.Comments}/${id}`, comment);
  return data;
};


