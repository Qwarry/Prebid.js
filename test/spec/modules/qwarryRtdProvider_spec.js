import { addData, setgobalOrtb2, subModuleObj } from 'modules/qwarryRtdProvider.js';
import { getGlobal } from '../../../src/prebidGlobal.js';

const responseHeader = { 'Content-Type': 'application/json' };

/* eslint-disable no-console */

describe('qwarryRtdProvider', function () {
  describe('qwarrySubmodule', function () {
    it('should successfully instantiates', function () {
      const moduleConfig = {
        name: 'QwarryRTDModule',
        waitForIt: true, // OPTIONAL: flag this module as important
        params: {
        }
      }

      expect(subModuleObj.init(moduleConfig)).to.equal(true);
    });

    it('should successfully alter the bid request', function () {
      const moduleConfig = {
        name: 'QwarryRTDModule',
        waitForIt: true, // OPTIONAL: flag this module as important
        params: {
        }
      }

      let adUnits = [
        {
          bids: [
            {
              bidder: 'qwarry',
              params: {
                placementId: 13144370,
                zoneToken: '4db342ef-af99-41c3-b454-9459dcc22d81',
                code: '/22369861681/qwarry-iab',
              },
            },
            {
              bidder: 'appnexus',
              params: {
                placementId: 13144370
              }
            }
          ],
          mediaTypes: {
            banner: {
              sizes: [
                [300, 250],
                [212, 212]
              ]
            }
          }
        }
      ];

      subModuleObj.getBidRequestData(adUnits, function () { return true }, moduleConfig)

      expect(adUnits).to.not.equal(getGlobal().adUnits);
    });
  });

  describe('addData method', function () {
    const moduleConfig = {
      name: 'QwarryRTDModule',
      waitForIt: true, // OPTIONAL: flag this module as important
      params: {
      }
    }

    let adUnits = [
      {
        bids: [
          {
            bidder: 'qwarry',
            params: {
              placementId: 13144370,
              zoneToken: '4db342ef-af99-41c3-b454-9459dcc22d81',
              code: '/22369861681/qwarry-iab',
            },
          },
          {
            bidder: 'appnexus',
            params: {
              placementId: 13144370
            }
          }
        ],
        mediaTypes: {
          banner: {
            sizes: [
              [300, 250],
              [212, 212]
            ]
          }
        }
      }
    ];

    const data = {
      'young_mid': 647,
      '28-02': 453,
      'male': 532,
      '31-10': 515,
      '20-05': 310,
      '31-07': 337
    }

    it('should add segment data to ortb2Imp', function () {
      addData(adUnits, data, moduleConfig, () => {});
      expect(adUnits[0].ortb2Imp.ext.data).to.have.deep.property('qwarry_data', [{
        'young_mid': 647,
        '28-02': 453,
        'male': 532,
        '31-10': 515,
        '20-05': 310,
        '31-07': 337
      }]);
    });

    it('should add segment data to appnexus', function () {
      addData(adUnits, data, moduleConfig, () => {});
      expect(adUnits[0].bids[1].params.keywords).to.have.deep.property('qwarryData', [
        'young_mid',
        '28-02',
        'male',
        '31-10',
        '20-05',
        '31-07'
      ]);
    });

    it('should add segment data to smart', function () {
      adUnits[0].bids.push({
        bidder: 'smartadserver',
        params: {
          siteId: 207435,
          pageId: 896536,
          formatId: 62913
        }
      })
      addData(adUnits, data, moduleConfig, () => {});

      should.exist(adUnits[0].bids[2].params.target);
      expect(adUnits[0].bids[2].params.target).to.equal('qwarry_data=young_mid;qwarry_data=28-02;qwarry_data=male;qwarry_data=31-10;qwarry_data=20-05;qwarry_data=31-07');
    });
  });

  describe('Set Ortb2 data', function () {
    it('Set Ortb2 data', function () {
      const data = {
        'young_mid': 647,
        '28-02': 453,
        'male': 532,
        '31-10': 515,
        '20-05': 310,
        '31-07': 337
      }
      setgobalOrtb2(data);

      should.exist(getGlobal().getConfig('ortb2'));
  });
});
