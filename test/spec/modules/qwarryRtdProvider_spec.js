import { addData, getSegmentsAndCategories, subModuleObj } from 'modules/qwarryRtdProvider.js';

const responseHeader = { 'Content-Type': 'application/json' };

describe('qwarryRtdProvider', function () {
  describe('qwarrySubmodule', function () {
    it('successfully instantiates', function () {
      const moduleConfig = {
        name: 'QwarryRTDModule',
        waitForIt: true, // OPTIONAL: flag this module as important
        params: {
        }
      }

      expect(subModuleObj.init(moduleConfig)).to.equal(true);
    });
  });

  describe('Add Segment Data', function () {
    it('adds segment data', function () {
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
  });
});
