/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Card, Modal, Paragraph } from "react-native-paper";

import {
  LargeTextButton,
  SmallTextButton,
  PendReq,
  PopUp,
  ClientList,
} from "../../../ui";

import { Utils } from "../../../utils";

import UpArrow from "imgs/up_arrow.svg";
import DownArrow from "imgs/down_arrow.svg";

import { Backend } from "../../../backend";
import { Data } from "../helpers/Data";
import { flushreq, user } from "../../../types";
import { Cards } from "../../../ui/Cards";
import { Avatar } from "../../../ui/Avatar";
import { AgentList } from "../../../ui/AgentList";

const wait = (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export function AgentDashboardScreen({ route, navigation }: any) {
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

  const agent = route.params.agent;

  const [refreshing, setRefreshing] = React.useState(false);

  const [isLoading, setisLoading] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Data.updateClients(agent.indicator).then((req) => {
      req ? setDataClients(req[0]) : null;
    });
    wait(1000).then(() => setRefreshing(false));
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setisLoading(true);
      setDataClients([] as unknown as [any]);
      Data.updateClients(agent.indicator).then((req) => {
        setisLoading(false);
        req ? setDataClients(req[0]) : null;
      });
      console.log(dataClients);
    });
    return unsubscribe;
  }, [navigation, indicator]);

  const [exRates, setExRates] = useState(Utils.exRates);
  const [dataClients, setDataClients] = useState(Data.clients);

  // Loaders
  const [isReqLoading, setReqLoading] = useState(false);

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
          name={agent.nameOfUser}
          cb={() => {
            navigation.navigate(
              "Profile" as never,
              {
                details: JSON.stringify(agent),
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
          ??????balance={
            dataClients[0]
              ? dataClients
                  .map((client) => client.??????balance)
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
          <Text style={styles.pendreq}>Client List</Text>
          {/* <SmallTextButton
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
            Show All Agents
          </SmallTextButton> */}
        </View>

        <ScrollView style={styles.agentlist}>
          {(() => {
            let arr = [].concat.apply(
              [],
              dataClients.map((client) => client) as any
            );

            return isLoading ? (
              <Text
                style={{ textAlign: "center", marginTop: 70, marginBottom: 70 }}
              >
                Loading...
              </Text>
            ) : arr.length > 0 ? (
              arr.slice(0, 3).map((cli: user) => {
                return (
                  <ClientList
                    key={cli.indicator}
                    client={cli}
                    parentID={indicator}
                    state={cli.state}
                    onPress={(state, parent) => {
                      navigation.navigate(
                        "ClientDashboard" as never,
                        {
                          details: route.params.details,
                          client: cli,
                        } as never
                      );
                    }}
                  />
                );
              })
            ) : (
              <Text
                style={{ textAlign: "center", marginTop: 70, marginBottom: 70 }}
              >
                No Clients
              </Text>
            );
          })()}
        </ScrollView>

        <View style={styles.showpendreqview}>
          <SmallTextButton
            textStyle={styles.showpendreq}
            onPress={() => {
              navigation.navigate(
                "AllClients" as never,
                {
                  details: route.params.details,
                  agent: route.params.agent,
                } as never
              );
            }}
          >
            Show All Clients
          </SmallTextButton>
        </View>

        <View style={styles.addnewclient}>
          <LargeTextButton
            title="Add New Client"
            isLoading={isReqLoading}
            style={styles.reqbutton}
            onPress={() => {
              setReqLoading(true);
              // navigation.navigate(
              //   "ClientAdd" as never,
              //   {
              //     details: route.params.details,
              //   } as never
              // );
              setReqLoading(false);
            }}
          />
          <SmallTextButton
            textStyle={styles.goback}
            onPress={() => {
              navigation.goBack();
            }}
          >
            Go Back
          </SmallTextButton>
        </View>
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
    marginTop: 10,
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
    alignItems: "center",
    justifyContent: "center",
  },
  goback: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    textAlign: "right",
    marginTop: 10,
    color: "#B9BAC8",
  },
  pendreqinput: {
    width: "100%",
  },
  reqbutton: {
    marginBottom: 0,
    fontFamily: "Poppins-Medium",
  },
  agentlist: {
    marginRight: 30,
    marginLeft: 30,
  },
});
