import { getGlobal } from '../src/prebidGlobal.js';
import * as utils from '../src/utils.js';
import { submodule } from '../src/hook.js';
import { ajax } from '../src/ajax.js';
// import findIndex from 'core-js-pure/features/array/find-index.js';
import { getRefererInfo } from '../src/refererDetection.js';
// import { config } from '../src/config.js';
import credentials from '../cred.json';

const MODULE_NAME = 'realTimeData';
const SUBMODULE_NAME = 'QwarryRTDModule';

export const subModuleObj = {
  name: SUBMODULE_NAME,
  init: init,
  getBidRequestData: alterBidRequests
};

function init(moduleConfig, userConsent) {
  const params = moduleConfig.params;
  /* eslint-disable no-console */

  console.log(params);
  // console.log(userConsent);
  // if (params && params.publisherMemberId) {
  //   // _moduleParams = Object.assign({}, DEFAULT_PARAMS, params);
  //   // initListeners();
  // } else {
  //   utils.logError('missing params for Reconciliation provider');
  // }
  return true;
}

function alterBidRequests(reqBidsConfigObj, callback, config, userConsent) {
  // do stuff
  // put data in AdUnit.fpd.* or rtd.RTDPROVIDERCODE.*
  const adUnits = reqBidsConfigObj.adUnits || getGlobal().adUnits;

  /* eslint-disable no-console */
  console.log(reqBidsConfigObj);
  console.log('module config : ', config);
  console.log('adunit 1 : ', adUnits);
  var actualUrl = config.params.actualUrl || getRefererInfo().referer;

  console.log('url : ', actualUrl);

  console.log('credentials : ', credentials);
  ajax('https://api.semantic.qwarry.co/oauth2/token', {
    success: function (response, req) {
      if (req.status === 200) {
        try {
          const data = JSON.parse(response);
          if (data && data) {
            console.log('data : ', data);
            // addSegmentData(adUnits, data, moduleConfig, onDone);
          } else {
            console.log('else ...');
            // onDone();
          }
        } catch (e) {
          // onDone();
          utils.logError('unable to parse Qwarry data' + e);
        }
      } else if (req.status === 204) {
        // onDone();
      }
    },
    error: function () {
      // onDone();
      utils.logError('unable to get Sirdata data');
    }
  },
  null,
  {
    contentType: 'multipart/form-data',
    method: 'POST',
    withCredentials: true,
    referrerPolicy: 'unsafe-url',
    crossOrigin: true,
    customHeaders: {
      'grant_type': 'client_credentials',
      'Connection': 'keep-alive',
      'CLIENT_ID': credentials.CLIENT_ID,
      'CLIENT_SECRET': credentials.CLIENT_SECRET,
      'x-api-key': credentials.api_key
    }
  });

  ajax(`https://api.semantic.qwarry.co/semantic?url=${encodeURIComponent(actualUrl)}`, {
    success: function (response, req) {
      if (req.status === 200) {
        try {
          const data = JSON.parse(response);
          if (data && data) {
            console.log('data : ', data);
            // addSegmentData(adUnits, data, moduleConfig, onDone);
          } else {
            console.log('else ...');
            // onDone();
          }
        } catch (e) {
          // onDone();
          utils.logError('unable to parse Qwarry data' + e);
        }
      } else if (req.status === 204) {
        // onDone();
      }
    },
    error: function () {
      // onDone();
      utils.logError('unable to get url scoring');
    }
  },
  null,
  {
    method: 'GET',
    withCredentials: true,
    referrerPolicy: 'unsafe-url',
    crossOrigin: true,
    customHeaders: {
      'grant_type': 'client_credentials',
      'Connection': 'keep-alive',
      'Authorization': `Bearer ${credentials.TOKEN}`,
      'x-api-key': credentials.api_key
    }
  });

  const data = {
    'young_mid': 647,
    '28-02': 453,
    'male': 532,
    '31-10': 515,
    '20-05': 310,
    '31-07': 337
  }

  addData(adUnits, data, config, callback)

  console.log('adunits 2 : ', adUnits);

  callback();
}

export function addData(adUnits, data, moduleConfig, callback) {
  adUnits.forEach(adUnit => {
    console.log(utils.deepAccess(adUnit, 'ortb2Imp.ext.data.sd_rtd'));
    if (!utils.deepAccess(adUnit, 'ortb2Imp.ext.data.sd_rtd')) {
      utils.deepSetValue(adUnit, 'ortb2Imp.ext.data.sd_rtd', [
        // put the data here !!!!
        data
      ]);
    }
  });

  callback();
  return adUnits;
}

submodule(MODULE_NAME, subModuleObj);
