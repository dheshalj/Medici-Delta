import axios from "axios";

import vars, { setIsLoggingInGlobalValue } from "./vars";
import { Utils } from "./utils";

const baseUrl = "http://13.213.172.95";

export function shuffle(str: string): string {
  return [...str].sort(() => Math.random() - 0.5).join("");
}

export const Backend = {
  Common: {
    async JWT(type: "login" | "logout" | "refresh"): Promise<{
      accessToken?: string;
      refreshToken?: string;
      err?: boolean;
    }> {
      let det = await axios({
        method: type == "logout" ? "delete" : "post",
        url: `${baseUrl}/auth/${type}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${vars.tokens.accessToken}`,
        },
        data: {
          token: type == "refresh" ? vars.tokens.refreshToken : null,
        },
      })
        .then((response) => {
          return {
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          };
        })
        .catch((error) => {
          console.log(error);
        });

      try {
        det = det as { accessToken: any; refreshToken: any };
        vars.tokens = {
          accessToken: det.accessToken,
          refreshToken: det.refreshToken,
        };
        return det;
      } catch {
        return {
          err: true,
        };
      }
    },

    async Login(
      type: "client" | "agent" | "admin",
      indicator: string,
      syndicate: string,
      cb: (err?: string) => void,
      navigation: any
    ) {
      let token = await this.JWT("login");
      if (token.err) {
        cb("failed to acquire token");
        return;
      }

      console.log(token);

      const loginDetails = await (
        await fetch(
          `${baseUrl}/knwy/${type}s/${indicator.replace(/ /g, "-")}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token.accessToken}`,
            },
          }
        )
      ).text();

      console.log(loginDetails);

      if (
        !loginDetails.includes("Failed Error:") &&
        JSON.parse(loginDetails).type === type
      ) {
        if (JSON.parse(loginDetails).syndicate === syndicate) {
          setIsLoggingInGlobalValue(false);
          cb();
          navigation.navigate("Dashboard", {
            details: loginDetails,
          });
          return;
        } else {
          cb("synd incorrect");
          return;
        }
      } else {
        cb("user not found");
        return;
      }
    },

    async Register(
      data: {
        nameOfUser: string;
        NIC: string;
        businessName: string;
        BRNumber: string;
        mobileNumber: string;
        domain: string;
        indicator: string;
        syndicate: string;
        $balance?: number;
        රුbalance?: number;
        type: "client" | "agent" | "admin";
        parent?: string;
        state?: "active" | "pending";
      },
      cb: (err?: string) => void
    ) {
      let token = await this.JWT("login");
      if (token.err) {
        cb("failed to acquire token");
        return;
      }

      const registerDetails = await (
        await fetch(
          `${baseUrl}/knwy/${data.type}s/${data.indicator.replace(/ /g, "-")}`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.accessToken}`,
            },
            body: JSON.stringify({
              nameOfUser: data.nameOfUser,
              NIC: data.NIC,
              businessName: data.businessName,
              BRNumber: data.BRNumber,
              mobileNumber: data.mobileNumber,
              domain: data.domain,
              indicator: data.indicator,
              syndicate: data.syndicate,
              $balance: data.$balance,
              රුbalance: data.රුbalance,
              type: data.type,
              parent: data.parent ? data.parent : "ND",
              state: data.state,
              bankAccDetails: {
                AccountNo: "",
                BankName: "",
                BankBranch: "",
                SWIFTBICCode: "",
              },
            }),
          }
        )
      ).text();
      if (
        registerDetails.includes(
          `Done: Document <${data.indicator.replace(
            / /g,
            "-"
          )}> was created using data provided`
        )
      ) {
        cb(undefined);
      } else {
        cb("error");
      }
    },
  },
  Client: {
    async addReq(
      amount: number,
      currency: "USD" | "LKR",
      lodgedDate: number,
      tobeflushedDate: Date,
      indicator: string,
      cb: (err?: string) => void
    ): Promise<any> {
      var gendId = (() => {
        var txt = shuffle(Date.now().toString().substring(0, 11));
        return (
          txt.substring(0, 3) +
          " " +
          txt.substring(3, 6) +
          " " +
          txt.substring(6, 11)
        ).trim();
      })();

      const reqDetails = await (
        await fetch(
          `${baseUrl}/knwy/clients/${indicator.replace(
            / /g,
            "-"
          )}/requests/${gendId.replace(/ /g, "-")}`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${vars.tokens.accessToken}`,
            },
            body: JSON.stringify({
              status: "In progress",
              changedDate: null,
              id: gendId,
              parentId: indicator,
              lodgedDate: lodgedDate,
              tobeflushedDate: tobeflushedDate.getTime(),
              requestCurrency: currency,
              amountInUSD:
                currency === "USD"
                  ? amount
                  : parseFloat(
                      (
                        amount / Utils.exRates[Utils.exRates.length - 1].rate
                      ).toFixed(2)
                    ),
              amountInLKR:
                currency === "LKR"
                  ? amount
                  : parseFloat(
                      (
                        amount * Utils.exRates[Utils.exRates.length - 1].rate
                      ).toFixed(2)
                    ),
            }),
          }
        )
      ).text();

      if (reqDetails === "Forbidden") {
        let token = await Backend.Common.JWT("refresh");
        console.log(token);
        if (!token.err) {
          vars.tokens.accessToken = token.accessToken as string;
        }
        return this.addReq(
          amount,
          currency,
          lodgedDate,
          tobeflushedDate,
          indicator,
          cb
        );
      }

      if (
        reqDetails.includes(
          `Done: Document <${gendId.replace(
            / /g,
            "-"
          )}> was created using data provided`
        )
      ) {
        cb(undefined);
      } else {
        cb("error");
      }
    },

    async getAllReqsOfUser(indicator: string): Promise<any[]> {
      const requests = await (
        await fetch(
          `${baseUrl}/knwy/clients/${indicator.replace(/ /g, "-")}/requests`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${vars.tokens.accessToken}`,
            },
          }
        )
      ).text();

      if (requests === "Forbidden") {
        let token = await Backend.Common.JWT("refresh");
        if (!token.err) {
          vars.tokens.accessToken = token.accessToken as string;
        }
        return this.getAllReqsOfUser(indicator);
      }

      try {
        return JSON.parse(requests);
      } catch (err) {
        return [];
      }
    },

    async updateReq(
      reqId: string,
      indicator: string,
      body: any,
      cb: (err?: string) => void
    ): Promise<any> {
      const reqDetails = await (
        await fetch(
          `${baseUrl}/knwy/clients/${indicator.replace(
            / /g,
            "-"
          )}/requests/${reqId.replace(/ /g, "-")}`,
          {
            method: "PATCH",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${vars.tokens.accessToken}`,
            },
            body: JSON.stringify(body),
          }
        )
      ).text();

      console.log(reqDetails);

      if (reqDetails === "Forbidden") {
        let token = await Backend.Common.JWT("refresh");
        if (!token.err) {
          vars.tokens.accessToken = token.accessToken as string;
        }
        return this.updateReq(reqId, indicator, body, cb);
      }

      if (
        reqDetails.includes(
          `Done: Document <${reqId.replace(
            / /g,
            "-"
          )}> was merged with the contents`
        )
      ) {
        cb(undefined);
      } else {
        cb("error");
      }
    },

    async updateUser(indicator: string, body: any, cb: (err?: string) => void) {
      const reqDetails = await (
        await fetch(`${baseUrl}/knwy/clients/${indicator.replace(/ /g, "-")}`, {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${vars.tokens.accessToken}`,
          },
          body: JSON.stringify(body),
        })
      ).text();

      if (
        reqDetails.includes(
          `Done: Document <${indicator.replace(
            / /g,
            "-"
          )}> was merged with the contents`
        )
      ) {
        cb(undefined);
      } else {
        cb("error");
      }
    },
  },
  Agent: {
    async getAllUsers(): Promise<any[]> {
      const requests = await (
        await fetch(`${baseUrl}/knwy/clients`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${vars.tokens.accessToken}`,
          },
        })
      ).text();

      if (requests === "Forbidden") {
        let token = await Backend.Common.JWT("refresh");
        if (!token.err) {
          vars.tokens.accessToken = token.accessToken as string;
        }
        return this.getAllUsers();
      }

      try {
        return JSON.parse(requests);
      } catch (err) {
        console.log("Error at backend.ts:292", err);
        return [];
      }
    },
  },
};
