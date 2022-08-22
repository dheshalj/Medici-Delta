import {Backend} from '../../../backend';
import {flushreq} from '../../../types';
import {Utils} from '../../../utils';

export class Data {
  static reqs: [flushreq | never] = [] as never;

  static async updateReqs(indicator: string): Promise<[flushreq]> {
    this.reqs = [] as never;
    await Utils.asyncForEach(
      await Backend.Client.getAllReqsOfUser(indicator),
      async (el: any) => {
        this.reqs.push({
          id: el.data.id,
          parentId: el.data.parentId,
          amountInLKR: el.data.amountInLKR,
          amountInUSD: el.data.amountInUSD,
          lodgedDate: el.data.lodgedDate,
          status: el.data.status,
          tobeflushedDate: el.data.tobeflushedDate,
          changedDate: el.data.changedDate
        });
      },
    );
    return this.reqs;
  }
}
