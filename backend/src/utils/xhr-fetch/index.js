import axios from 'axios';
import { isClientSide } from '../helpers';
const cachedIsClientSide = isClientSide();

const cacheStore = {};
const outgoingRequests = {};


export default function xhrFetch(options) {
  const {
    xhrOpts, path, responseType = 'json', cache = false,
  } = options;
  const cacheKey = `${path}${xhrOpts.data || ''}`;
  let fetchPromise;


  if (cachedIsClientSide && cache === true && cacheStore[cacheKey]) {
    return getResponseFromCache(cacheKey);
  }

 
  if (outgoingRequests[cacheKey]) {
    fetchPromise = outgoingRequests[cacheKey];
  } else {
    fetchPromise = axios({
      method: xhrOpts.method,
      url: path,
      data: xhrOpts.data,
      responseType,
      headers: xhrOpts.headers||'',
      withCredentials: true,
      validateStatus: (status) => {
        return true; 
      },
    })
    outgoingRequests[cacheKey] = fetchPromise;
  }

  return fetchPromise
    .catch((error) => {
      delete outgoingRequests[cacheKey];
      return Promise.reject(error);
    })
    .then((res) => {
      if(res.status !== 200){
        delete outgoingRequests[cacheKey];
        return Promise.reject(res.data);
      }
      return storeResponseInCache(options, res.data, cacheKey);
    });
}

// === PRIVATE FUNCTIONS ===

function getResponseFromCache(cacheKey) {
  return new Promise((resolve, reject) => {
    if (cacheStore[cacheKey] && cacheStore[cacheKey].response) {
      return resolve(cacheStore[cacheKey].response);
    }
    return reject(new Error(`Unable to access cache for: ${cacheStore[cacheKey]}`));
  });
}

function storeResponseInCache(options, res, cacheKey) {
  const { cache = false } = options;
  if (cachedIsClientSide && cache === true) {
    cacheStore[cacheKey] = {
      response: res,
    };

    return cacheStore[cacheKey].response;
  }
  return res;
}
