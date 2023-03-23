import { FastifyReply, FastifyRequest } from "fastify";
import IHttpResponseHandler from "src/common/IHttpResponseHandler";

export default class QueryRegionListHandler implements IHttpResponseHandler {
  handle(req: FastifyRequest, res: FastifyReply): void {
    res.send(JSON.stringify({
      retcode: 0,
      regionList: [
        {
          name: "fleeinglegacy",
          title: "FleeingLegacy",
          type: "DEV_PUBLIC",
          dispatchUrl: "http://fleeinglegacy.local/query_cur_region",
        },
      ],
      clientCustomConfig: "{\"sdkenv\":\"2\",\"checkdevice\":\"false\",\"loadPatch\":\"false\",\"showexception\":\"false\",\"regionConfig\":\"pm|fk|add\",\"downloadMode\":\"0\"}",
    }));
  }
}