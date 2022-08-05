/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Card, Paragraph } from "react-native-paper";

import { LargeTextButton, SmallTextButton, PendReq, PopUp } from "src/ui";

import { Utils } from "../../../utils";

import UpArrow from "imgs/up_arrow.svg";
import DownArrow from "imgs/down_arrow.svg";

import { Backend } from "src/backend";
import { Data } from "../helpers/Data";
import { flushreq } from "src/types";
import { Cards } from "src/ui/Cards";
import { Avatar } from "src/ui/Avatar";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export function DashboardScreen({ route, navigation }: any) {
  const {
    nameOfUser,
    NIC,
    businessName,
    BRNumber,
    mobileNumber,
    domain,
    indicator,
    syndicate,
  } = JSON.parse(route.params.details);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  React.useEffect(() => {
    Data.updateClients(indicator).then((users) => {
      users[0] ? setDataClients(users[0]) : null;
    });
  }, [indicator]);

  const todaysDate = new Date();

  const [getDate, setDate] = useState(
    new Date(todaysDate.getTime() + 3 * 24 * 60 * 60 * 1000)
  );
  const [open, setOpen] = useState(false);

  const [isReqLoading, setReqLoading] = useState(false);

  const [exRates, setExRates] = useState(Utils.exRates);
  const [dataClients, setDataClients] = useState(Data.clients);

  return (
    <ScrollView
      alwaysBounceHorizontal={false}
      alwaysBounceVertical={false}
      bounces={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View>
        <Avatar
          img={require("imgs/avatar.jpg")}
          name={nameOfUser}
          cb={() => {
            navigation.navigate(
              "Profile" as never,
              {
                details: route.params.details,
              } as never
            );
          }}
        />

        <Cards.CurrentBalance
          $balance={
            dataClients[0]
              ? dataClients
                  .map((client) => client.$balance)
                  .reduce((acc, cur) => (acc ? acc : 0) + (cur ? cur : 0))
              : 0
          }
          රුbalance={
            dataClients[0]
              ? dataClients
                  .map((client) => client.රුbalance)
                  .reduce((acc, cur) => (acc ? acc : 0) + (cur ? cur : 0))
              : 0
          }
        />

        <View style={styles.moneyview}>
          <Card style={styles.moneycard_in}>
            <Card.Content>
              <Paragraph style={styles.moneyheading}>
                Money In <UpArrow width="15" />
              </Paragraph>
              <Paragraph style={styles.moneyInUSD_in}>30567.25 USD</Paragraph>
            </Card.Content>
          </Card>
          <Card style={styles.moneycard_out}>
            <Card.Content>
              <Paragraph style={styles.moneyheading}>
                Money Out <DownArrow width="15" />
              </Paragraph>
              <Paragraph style={styles.moneyInUSD_out}>567.25 USD</Paragraph>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.pendview}>
          <Text style={styles.pendreq}>Pending Request</Text>
          <SmallTextButton
            textStyle={styles.pendhis}
            onPress={() => {
              navigation.navigate(
                "RequestHistory" as never,
                {
                  details: route.params.details,
                } as never
              );
            }}
          >
            Request History
          </SmallTextButton>
        </View>

        {(() => {
          let arr = [].concat
            .apply([], dataClients.map((client) => client.reqs) as any)
            .filter((req: flushreq) => req.status === "In progress");
          return arr.length > 0 ? (
            arr
              .sort((a: flushreq, b: flushreq) => a.lodgedDate - b.lodgedDate)
              .slice(0, 2)
              .map((req: flushreq) => {
                return (
                  <PendReq
                    key={req.id}
                    id={req.id}
                    value={{
                      valIn$: req.amountInUSD,
                      valInLKR: req.amountInLKR,
                    }}
                    lgdtime={new Date(req.lodgedDate)}
                    tbdtime={new Date(req.tobeflushedDate)}
                    onAccept={() => {
                      Backend.Client.updateReq(
                        req.id,
                        req.parentId,
                        {
                          status: "Accepted",
                        },
                        (err) => {
                          if (err) {
                            console.log("Error at DashboardScreen.tsx:188", err);
                            return;
                          }
                          // TODO: Open Popup here
                          console.warn(`Request ${req.id} has been Accepted`);
                          Data.updateClients(indicator).then((users) => {
                            return users ? setDataClients(users[0]) : null;
                          });
                        }
                      );
                    }}
                    onDecline={() => {
                      Backend.Client.updateReq(
                        req.id,
                        req.parentId,
                        {
                          status: "Declined",
                        },
                        (err) => {
                          if (err) {
                            console.log("Error at DashboardScreen.tsx:208", err);
                            return;
                          }
                          // TODO: Open Popup here
                          console.warn(`Request ${req.id} has been Declined`);
                          Data.updateClients(indicator).then((users) => {
                            return users ? setDataClients(users[0]) : null;
                          });
                        }
                      );
                    }}
                  />
                );
              })
          ) : (
            <Text
              style={{ textAlign: "center", marginTop: 70, marginBottom: 70 }}
            >
              No Pending Requests
            </Text>
          );
        })()}

        <View style={styles.showpendreqview}>
          <SmallTextButton
            textStyle={styles.showpendreq}
            onPress={() => {
              navigation.navigate(
                "PendingRequest" as never,
                {
                  details: route.params.details,
                } as never
              );
            }}
          >
            Show All Pending Requests
          </SmallTextButton>
        </View>

        <View style={styles.addnewclient}>
          <LargeTextButton
            title="Add New Client"
            isLoading={isReqLoading}
            style={styles.reqbutton}
            onPress={() => {
              setReqLoading(true);

              // TODO: Add client here

              setReqLoading(false);
            }}
          />
          <SmallTextButton
            textStyle={styles.clientlist}
            onPress={() => {
              navigation.navigate(
                "ClientList" as never,
                {
                  details: route.params.details,
                } as never
              );
            }}
          >
            Client List
          </SmallTextButton>
        </View>

        <PopUp.DatePickerModal
          methods={[open, setOpen, getDate, setDate]}
          minimumDate={getDate}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  linechartview: {
    paddingVertical: 30,
    paddingRight: 20,
    width: "100%",
  },
  chipview: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  chip: {
    margin: 20,
  },
  chipname: {
    fontFamily: "Poppins-Medium",
  },
  currentbalancecard: {
    backgroundColor: "#E7F3FF",
    elevation: 0,
    borderRadius: 20,
    marginRight: 20,
    marginLeft: 20,
  },
  currentbalancecardcontent: {
    alignItems: "center",
    justifyContent: "center",
  },
  currentbalanceheading: {
    fontFamily: "Poppins-Medium",
    color: "#608EE9",
  },
  currentbalancebalanceIn$: {
    fontFamily: "Poppins-SemiBold",
    color: "#608EE9",
    fontSize: 40,
    paddingTop: 25,
  },
  currentbalancebalanceInLKR: {
    fontFamily: "Poppins-Medium",
    fontSize: 15,
    color: "#8A8A8A",
  },

  moneyview: {
    flexDirection: "row",
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "space-between",
  },
  moneycard_in: {
    elevation: 0,
    borderRadius: 13,
    width: "47.5%",
    backgroundColor: "rgba(236, 250, 246, 1)",
  },
  moneycard_out: {
    elevation: 0,
    borderRadius: 13,
    width: "47.5%",
    backgroundColor: "rgba(255, 187, 207, 0.36)",
  },
  moneyheading: {
    fontFamily: "Poppins-Regular",
    color: "#333333",
    fontSize: 13,
    marginBottom: 5,
    marginTop: 0,
  },
  moneyInUSD_in: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: "#2DC897",
    marginBottom: 0,
  },
  moneyInUSD_out: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: "#F25475",
    marginBottom: 0,
  },

  exchangerate: {
    alignItems: "center",
    justifyContent: "center",
    elevation: 0,
    borderRadius: 30,
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 20,
    backgroundColor: "#f5f5f5",
  },
  exchangeratepara: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
  },
  pendview: {
    flexDirection: "row",
    marginRight: 30,
    marginLeft: 30,
    marginTop: 10,
    marginBottom: 15,
  },
  pendreq: {
    fontFamily: "Poppins-SemiBold",
    color: "#2F394E",
    fontSize: 16,
    textAlign: "left",
    flex: 1,
  },
  pendhis: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    textAlign: "right",
    flex: 1,
    textDecorationLine: "underline",
  },
  showpendreqview: {
    marginRight: 20,
    marginBottom: 15,
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  showpendreq: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    color: "#2F394E",
    textDecorationLine: "underline",
  },
  addnewclient: {
    marginRight: 20,
    marginLeft: 20,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  clientlist: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    textAlign: "right",
    flex: 1,
    marginTop: 10,
    color: "#2F394E",
  },
  pendreqinput: {
    width: "100%",
  },
  reqbutton: {
    marginBottom: 0,
  },
});
