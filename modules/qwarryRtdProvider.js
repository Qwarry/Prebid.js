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
  return true;
}

function alterBidRequests(reqBidsConfigObj, callback, config, userConsent) {
  // put data in AdUnit.fpd.* or rtd.RTDPROVIDERCODE.*
  const adUnits = reqBidsConfigObj.adUnits || getGlobal().adUnits;

  /* eslint-disable no-console */
  console.log(reqBidsConfigObj);
  console.log('module config : ', config);
  console.log('adunit 1 : ', adUnits);
  var actualUrl = config.params.actualUrl || getRefererInfo().referer;

  console.log('url : ', actualUrl);
  console.log('credentials : ', credentials);

  ajax(`https://api.semantic.qwarry.co/semantic?url=${encodeURIComponent(actualUrl)}`, {
    success: function (response, req) {
      if (req.status === 200) {
        try {
          const data = JSON.parse(response);
          if (data) {
            console.log('data : ', data);
            addData(adUnits, data, config, callback);
          } else {
            callback();
          }
        } catch (e) {
          callback();
          utils.logError('unable to parse Qwarry data' + e);
        }
      } else if (req.status === 204) {
        callback();
      }
    },
    error: function () {
      callback();
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

  callback();
}

export function addData(adUnits, data, moduleConfig, callback) {
  // Google targeting
  if (typeof window.googletag !== 'undefined' && (moduleConfig.params.setGptKeyValues || !moduleConfig.params.hasOwnProperty('setGptKeyValues'))) {
    try {
      window.googletag.pubads().getSlots().forEach(function(n) {
        if (typeof n.setTargeting !== 'undefined') {
          let newData = [];
          Object.keys(data).forEach(key => {
            if (data[key] >= 500) {
              newData.push(key);
            }
          })

          n.setTargeting('qwarry_data', newData);
        }
      })
    } catch (e) { utils.logError(e); }
  }

  adUnits.forEach(adUnit => {
    adUnit.hasOwnProperty('bids') && adUnit.bids.forEach(bid => {
      try {
        switch (bid.bidder) {
          case 'appnexus':
          case 'appnexusAst':
            utils.deepSetValue(bid, 'params.keywords.qwarry_data', data);

            console.log('================ augmented bid APPNEXUS =====================', bid);
            break;
          case 'smartadserver':
          case 'smart':
            var target = [];
            if (bid.hasOwnProperty('params') && bid.params.hasOwnProperty('target')) {
              target.push(bid.params.target);
            }

            Object.keys(data).forEach(function(key) {
              console.log('================ index Of =====================', target.indexOf(key + '=' + data[key]) === -1);
              if (target.indexOf(key + '=' + data[key]) === -1) {
                target.push(key + '=' + data[key]);
              }
            });

            utils.deepSetValue(bid, 'params.target', target.join(';'));
            console.log('================ augmented bid SMART =====================', bid);
            break;
          default:
            if (!utils.deepAccess(adUnit, 'ortb2Imp.ext.data.qwarry_data')) {
              utils.deepSetValue(adUnit, 'ortb2Imp.ext.data.qwarry_data', [
                data
              ]);
            }
        }
      } catch (e) { utils.logError(e) }
    });
  });

  console.log('================ augmented adunits =====================', adUnits);

  callback();
  return adUnits;
}

submodule(MODULE_NAME, subModuleObj);
