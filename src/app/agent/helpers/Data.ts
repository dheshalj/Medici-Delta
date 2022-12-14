import { Backend } from "../../../backend";
import { user, flushreq } from "../../../types";
import { Utils } from "../../../utils";

export class Data {
  static clients: [user | never] = [] as never;
  static allClients: [user | never] = [] as never;

  static async updateClients(indicator: string): Promise<[[user], [user]]> {
    this.clients = [] as never;
    this.allClients = [] as never;

    return (async () => {
      await Utils.asyncForEach(
        await Backend.Agent.getAllUsers(),
        async (el: any) => {
          let reqs: [flushreq] = [] as never;
          await Utils.asyncForEach(
            await Backend.Client.getAllReqsOfUser(el.data.indicator),
            async (el_: any) => {
              reqs.push({
                id: el_.data.id,
                parentId: el_.data.parentId,
                amountInLKR: el_.data.amountInLKR,
                amountInUSD: el_.data.amountInUSD,
                lodgedDate: el_.data.lodgedDate,
                status: el_.data.status,
                changedDate: el_.data.changedDate,
                tobeflushedDate: el_.data.tobeflushedDate,
              });
            }
          );

          const datatobepushed = {
            nameOfUser: el.data.nameOfUser,
            NIC: el.data.NIC,
            businessName: el.data.businessName,
            BRNumber: el.data.BRNumber,
            mobileNumber: el.data.mobileNumber,
            domain: el.data.domain,
            indicator: el.data.indicator,
            syndicate: el.data.syndicate,
            $balance: el.data.$balance,
            රුbalance: el.data.රුbalance,
            type: el.data.type,
            reqs: reqs,
            parent: el.data.parent,
            state: el.data.state,
          }
          this.allClients.push(datatobepushed);
          if (el.data.parent === indicator) {
            this.clients.push(datatobepushed);
          }
        }
      );
      return [this.clients, this.allClients];
    })();
  }
}
