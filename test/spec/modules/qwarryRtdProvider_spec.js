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
      expect(adUnits[0].ortb2Imp.ext.data).to.have.deep.property('sd_rtd', [{
        'young_mid': 647,
        '28-02': 453,
        'male': 532,
        '31-10': 515,
        '20-05': 310,
        '31-07': 337
      }]);
    });
  });

  // describe('Get Segments And Categories', function () {
  //   it('gets data from async request and adds segment data', function () {
  //     const config = {
  //       params: {
  //         setGptKeyValues: false,
  //         contextualMinRelevancyScore: 50,
  //         bidders: [{
  //           bidder: 'appnexus'
  //         }, {
  //           bidder: 'other'
  //         }]
  //       }
  //     };

  //     let reqBidsConfigObj = {
  //       adUnits: [{
  //         bids: [{
  //           bidder: 'appnexus',
  //           params: {
  //             placementId: 13144370
  //           }
  //         }, {
  //           bidder: 'other'
  //         }]
  //       }]
  //     };

  //     let data = {
  //       segments: [111111, 222222],
  //       contextual_categories: { '333333': 100 }
  //     };

  //     getSegmentsAndCategories(reqBidsConfigObj, () => { }, config, {});

  //     let request = server.requests[0];
  //     request.respond(200, responseHeader, JSON.stringify(data));

  //     expect(reqBidsConfigObj.adUnits[0].bids[0].params.keywords).to.have.deep.property('sd_rtd', ['111111', '222222', '333333']);
  //     expect(reqBidsConfigObj.adUnits[0].bids[1].ortb2.site.ext.data).to.have.deep.property('sd_rtd', ['333333']);
  //     expect(reqBidsConfigObj.adUnits[0].bids[1].ortb2.user.ext.data).to.have.deep.property('sd_rtd', ['111111', '222222']);
  //   });
  // });
});
