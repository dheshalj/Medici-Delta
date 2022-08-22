import { Backend } from "../../../backend";
import { user, flushreq } from "../../../types";
import { Utils } from "../../../utils";

export class Data {
  static agents: [user | never] = [] as never;
  static clients: [user | never] = [] as never;
  static allClients: [user | never] = [] as never;
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
                // requestCurrency: el_.data.requestCurrency,
                // TODO: Add this later
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
      console.log([this.clients, this.allClients])
      return [this.clients, this.allClients];
    })();

  }
  

  static async updateAgents(indicator: string): Promise<[user]> {
    this.agents = [] as never;

    return (async () => {
      await Utils.asyncForEach(
        await Backend.Admin.getAllUsers(),
        async (el: any) => {
          if (el.data.parent === indicator) {
            this.agents.push({
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
              parent: el.data.parent,
              state: el.data.state,
            });
          }
        }
      );
      return this.agents;
    })();
  }
}
