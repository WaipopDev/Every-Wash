const canceledRes = 'canceled';

export default class AsyncMiddleware {
  _req;

  _waRequests = {};

  _xhrRequests = {};

  constructor(req) {
    this._req = req;
  }

  create() {
    return (state) => {
      return (next) => {
        return (action) => {
          const {
            types = {},
            call,
            reqKey,
            cancelActiveReq,
            ...rest
          } = action;
          const {
            success,
            error,
            pending
          } = types;
          // handle promise calls and return success/errors
          if (pending) {
            next({ ...rest, type: pending });
          }
          if (call) {
            
            let callTimeout;

            return new Promise((resolve, reject) => {
              if (reqKey) {
                if (cancelActiveReq && this._waRequests[reqKey]) {
                  this._waRequests[reqKey](canceledRes);
                }
                this._waRequests[reqKey] = reject;
              }

              call.then(resolve).catch(reject);
            }).then((result) => {
              clearTimeout(callTimeout);
              if (success) {
                delete this._waRequests[reqKey];
                next({ ...rest, result, type: success });
              }
              return result;
            }).catch((err) => {
              clearTimeout(callTimeout);

              if (err !== canceledRes) {
                delete this._waRequests[reqKey];
                // console.warn('WebApi error when processing action:', types, err);

                if (error) {
                  next({ ...rest, error: err, type: error });
                }
              }
            });
          }

          return next(action);
        };
      };
    };
  }
}
