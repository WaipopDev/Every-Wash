import xhrFetch from '../xhr-fetch';
import { stringify } from 'query-string';
import { getCookie } from '../storage'
import { server } from '../../config'

export default class ServerCalls {

  get = (...params) => {
    const newParams = ['get', ...params];
    return this.call(...newParams);
  };
  post = (...params) => {
    const newParams = ['post', ...params];
    return this.call(...newParams);
  };
  put = (...params) => {
    const newParams = ['put', ...params];
    return this.call(...newParams);
  };
  delete = (...params) => {
    const newParams = ['delete', ...params];
    return this.call(...newParams);
  };
  call = (method, path, params, data) => {
    // const { emData: { siteConf, playerDetail } } = this._req
    const { forcePath = false, queryURL = {}, headers = {}, clearCache = false, updateRead = {} } = params
    const newParams = { ...queryURL };
    const queryString = stringify(newParams);
    const url = `${path}${queryString ? `?${queryString}` : ''}`;
    const partUrl = `${server.httpEndPoint}/${url}`;
    let session = getCookie('SESSION_TOKEN') || ''
    if (session) {
      session = JSON.parse(session)
    }
    const newHeaders = {
      ...headers,
      session: session
    };
    let callPromise = xhrFetch({
      xhrOpts: {
        method,
        data,
        headers: newHeaders
      },
      path: forcePath ? path : partUrl,
      responseType: 'json',
      clearCache,
      updateRead,
    });

    return callPromise.then((response) => {
      return response;
    }).catch((error) => {
      throw error;
    });
  };

}