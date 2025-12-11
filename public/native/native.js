window.cordova = {
  exec(success, error, pluginName, methodName, params) {
    return window.flutter_inappwebview
      .callHandler('fPlugin', {
        pluginName,
        methodName,
        params,
      })
      .then((result) => {
        if (!result) {
          error('error:null');
          return;
        }
        if (result.status_code !== 0) {
          error(result.status_mesage);
        } else {
          success(result.data);
        }
      })
      .catch((err) => {
        console.error('fPlugin error:', err);
        error(err);
      });
  },
};

window.navigator = window.navigator || {};
window.navigator.app = {
  exitApp() {
    window.flutter_inappwebview.callHandler('fPlugin', {
      pluginName: 'navigator.app',
      methodName: 'exitApp',
      params: '',
    });
  },
};
