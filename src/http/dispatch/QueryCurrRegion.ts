/* ... */
/*
  Decrypted custom configs for reference
    - XOR, using dispatchKey.bin key file got from Grasscutter's repository
  
  GI v1.6 regionCustomConfigEncrypted
    => {
      "codeSwitch": [10],
      "coverSwitch": [8],
      "perf_report_config_url": "http://log-upload-os.mihoyo.com/perf/config/verify",
      "perf_report_record_url": "http://log-upload-os.mihoyo.com/perf/dataUpload",
      "homeDotPattern": true,
      "homeItemFilter": 20,
      "cdnNameEnable": "false"
    }
  
  GI v1.4 regionCustomConfigEncrypted
    => same with v1.6 data, without "homeDotPattern", "homeItemFilter", "cdnNameEnable" property
*/

import { FastifyReply, FastifyRequest } from "fastify";
import IHttpResponseHandler from "src/common/IHttpResponseHandler";

export default class QueryCurrRegionHandler implements IHttpResponseHandler {
  handle(req: FastifyRequest, res: FastifyReply): void {
    if(new URLSearchParams(req.url.split("?")[1]).get("version")) {
      const clientCustomConfig = {
        sdkenv: 2,    // Not sure but reference: MiHoYoSDKConfigManager.EnvType
        checkdevice: false,
        loadPatch: false,
        showexception: true,
        regionConfig: "pm|fk|add",
        downloadMode: 0,
      };

      const regionCustomConfig = {
        codeSwitch: [10],
        coverSwitch: [8],
        perf_report_config_url: "http://fleeinglegacy.local/nonexistence",
        perf_report_record_url: "http://fleeinglegacy.local/nonexistence",
      };

      res.send(JSON.stringify({
        retcode: 0,
        msg: "OK",
        // forceUdpate: {   // `Udpate` is right, seriously. (See proto file)
        //   forceUpdateUrl: "fleeinglegacy.local/checkupdate",
        //   clientCustomConfig: "{\"sdkenv\":\"2\",\"checkdevice\":\"false\",\"loadPatch\":\"false\",\"showexception\":\"false\",\"regionConfig\":\"pm|fk|add\",\"downloadMode\":\"0\"}",
        // },
        // stopServer: {
        //   stopBeginTime: 0,
        //   stopEndTime: 0,
        // },
        regionInfo: {
          gateserverIp: "127.0.0.1",
          gateserverPort: 22102,
          clientCustomConfig: JSON.stringify(clientCustomConfig),
          regionCustomConfig: JSON.stringify(regionCustomConfig),
          accountUrl: "http://127.0.0.1:39000",
          accountUrlBak: "cb1_live",
          payCallbackUrl: "http://127.0.0.1:39000",
          resourceUrl: "http://127.0.0.1:39000/resource",
          dataUrl: "http://127.0.0.1:39000/data",
          feedbackUrl: "http://127.0.0.1:39000",
          bulletinUrl: "http://127.0.0.1:39000",
          resourceUrlBak: "cb1_live",
          dataUrlBak: "cb1_live",
          dataVersion: 138541,
          resVersion: 138541,
          handbookUrl: "http://127.0.0.1:39000",
        },
      }));
    } else {
      res.send(JSON.stringify({
        retcode: 1,
        msg: "Not found version config"
      }));
    }
  }
}