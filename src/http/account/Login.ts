import { FastifyReply, FastifyRequest } from "fastify";
import IHttpResponseHandler from "src/common/IHttpResponseHandler";

export default class AccountLoginHandler implements IHttpResponseHandler {
  handle(req: FastifyRequest, res: FastifyReply): void {
    res.send(JSON.stringify({
      retcode: 0,
      message: "OK",
      data: {
        uid: 3939,
        token: "FLEEINGLEGACY",
      },
      signInInfoList: [
        {
          scheduleId: 1,
          configId: 1,
          beginTime: 10,
          endTime: 10000,
          isCondSatisfied: true,
          signInCount: 1,
          lastSignInTime: 1,
          rewardDayList: [1],
        },
      ],
    }));
  }
}