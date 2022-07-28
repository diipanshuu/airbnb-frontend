let axios = require('axios');
let {checkType} = require('./helpers');
let Models = require('./Models');
let Inputs = require('./Inputs');
let Concepts = require('./Concepts');
let Workflow = require('./Workflow');
let Workflows = require('./Workflows');
let Solutions = require('./solutions/Solutions');
let {API, ERRORS, getBasePath} = require('./constants');
let {TOKEN_PATH} = API;

if (typeof window !== 'undefined' && !('Promise' in window)) {
  window.Promise = require('promise');
}

if (typeof global !== 'undefined' && !('Promise' in global)) {
  global.Promise = require('promise');
}

/**
 * top-level class that allows access to models, inputs and concepts
 * @class
 */
class App {
  constructor(arg1, arg2, arg3) {
    let optionsObj = arg1;
    if (typeof arg1 !== 'object' || arg1 === null) {
      optionsObj = arg3 || {};
      optionsObj.clientId = arg1;
      optionsObj.clientSecret = arg2;
    }
    this._validate(optionsObj);
    this._init(optionsObj);

  }

  /**
   * Gets a token from the API using client credentials
   * @return {Promise(token, error)} A Promise that is fulfilled with the token string or rejected with an error
   *
   * @deprecated Please switch to using the API key.
   */
  getToken() {
    return this._config.token();
  }

  /**
   * Sets the token to use for the API
   * @param {String}         _token    The token you are setting
   * @return {Boolean}                 true if token has valid fields, false if not
   *
   * @deprecated Please switch to using the API key.
   */
  setToken(_token) {
    let token = _token;
    let now = new Date().getTime();
    if (typeof _token === 'string') {
      token = {
        accessToken: _token,
        expiresIn: 176400
      };
    } else {
      token = {
        accessToken: _token.access_token || _token.accessToken,
        expiresIn: _token.expires_in || _token.expiresIn
      };
    }
    if ((token.accessToken && token.expiresIn) ||
      (token.access_token && token.expires_in)) {
      if (!token.expireTime) {
        token.expireTime = now + (token.expiresIn * 1000);
      }
      this._config._token = token;
      return true;
    }
    return false;
  }

  _validate({clientId, clientSecret, token, apiKey, sessionToken}) {
    if (clientId || clientSecret) {
      console.warn('Client ID/secret has been deprecated. Please switch to using the API key. See here how to do ' +
        'the switch: https://blog.clarifai.com/introducing-api-keys-a-safer-way-to-authenticate-your-applications');
    }
    if ((!clientId || !clientSecret) && !token && !apiKey && !sessionToken) {
      throw ERRORS.paramsRequired(['apiKey']);
    }
  }

  _init(options) {
    let apiEndpoint = options.apiEndpoint ||
      (process && process.env && process.env.API_ENDPOINT) || 'https://api.clarifai.com';
    this._config = {
      apiEndpoint,
      clientId: options.clientId,
      clientSecret: options.clientSecret,
      apiKey: options.apiKey,
      sessionToken: options.sessionToken,
      basePath: getBasePath(apiEndpoint, options.userId, options.appId),
      token: () => {
        return new Promise((resolve, reject) => {
          let now = new Date().getTime();
          if (checkType(/Object/, this._config._token) && this._config._token.expireTime > now) {
            resolve(this._config._token);
          } else {
            this._getToken(resolve, reject);
          }
        });
      }
    };
    if (options.token) {
      this.setToken(options.token);
    }
    this.models = new Models(this._config);
    this.inputs = new Inputs(this._config);
    this.concepts = new Concepts(this._config);
    this.workflow = new Workflow(this._config);
    this.workflows = new Workflows(this._config);
    this.solutions = new Solutions(this._config);
  }

  /**
   * @deprecated Please switch to using the API key.
   */
  _getToken(resolve, reject) {
    this._requestToken().then(
      (response) => {
        if (response.status === 200) {
          this.setToken(response.data);
          resolve(this._config._token);
        } else {
          reject(response);
        }
      },
      reject
    );
  }


<!DOCTYPE html>
<html lang="en">

<head>
	<!-- Required meta tags -->
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width,
		initial-scale=1, shrink-to-fit=no" />

	<!-- Bootstrap CSS -->
	<link rel="stylesheet" href=
"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
		integrity=
"sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
		crossorigin="anonymous" />

	<title>
		How to use simple API using AJAX ?
	</title>
</head>
<body>
	<button type="button" id="fetchBtn"
		class="btn btn-primary">
		Fetch Data
	</button>

	<div class="container">
		<h1>Employee List</h1>
		<ul id="list"></ul>
	</div>

	<!-- Optional JavaScript -->
	<!-- jQuery first, then Popper.js,
		then Bootstrap JS -->
	<script src="Ajax.js"></script>
	<script src=
"https://code.jquery.com/jquery-3.2.1.slim.min.js"
		integrity=
"sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
		crossorigin="anonymous">
	</script>
	
	<script src=
"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"
		integrity=
			"sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
		crossorigin="anonymous">
	</script>
	
	<script src=
"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
		integrity=
"sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
		crossorigin="anonymous">
	</script>
</body>

</html>

  /**
   * @deprecated Please switch to using the API key.
   */
  _requestToken() {
    let url = `${this._config.basePath}${TOKEN_PATH}`;
    let clientId = this._config.clientId;
    let clientSecret = this._config.clientSecret;
    return axios({
      'url': url,
      'method': 'POST',
      'auth': {
        'username': clientId,
        'password': clientSecret
      }
    });
  }
}

module.exports = App;
