# Qwarry Real-Time Data Submodule

Module Name: Qwarry RTD Provider
Module Type: Rtd Provider
Maintainer: @qwarry.com

# Description

Qwarry provides a technologie that will help the DSP's to bid with a creative matching the context of your pages

### Publisher Usage

Compile the Qwarry RTD module into your Prebid build:

`gulp build --modules=rtdModule,qwarryRtdProvider`

Add the Qwarry RTD provider to your Prebid config.

```
pbjs.setConfig(
    ...
    realTimeData: {
      auctionDelay: 100,     // REQUIRED: applies to all RTD modules
      dataProviders: [{
        name: "QwarryRTDModule",
        waitForIt: true,   // OPTIONAL: flag this module as important
      }]
    },
    ...
}
```

### Parameter Descriptions for the Sirdata Configuration Section

| Name  |Type | Description   | Notes  |
| :------------ | :------------ | :------------ |:------------ |
| name | String | Real time data module name | Mandatory. Always 'QwarryRTDModule' |
| waitForIt | Boolean | Mandatory. Required to ensure that the auction is delayed until prefetch is complete | Optional. Defaults to false but recommended to true |
| params | Object | | Optional |
| params.partnerId | Integer | Partner ID, required to get results and provided by Qwarry. Use 1 for tests and get one running at @qwarry.com | Mandatory. Defaults 1. |

No params for Bidders...

### Testing

To view an example of available segments returned by Sirdata's backends:

`gulp serve --modules=rtdModule,qwarryRtdProvider`

and then point your browser at:

`http://localhost:9999/integrationExamples/gpt/sirdataRtdProvider_example.html`
