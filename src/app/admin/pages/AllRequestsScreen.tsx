/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Divider } from "react-native-paper";

import { Data } from "../helpers/Data";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ClientList, FlushReq, SmallTextButton } from "../../../ui";
import { flushreq, user } from "../../../types";
import { Utils } from "../../../utils";
import { Backend } from "../../../backend";
import { Cards } from "../../../ui/Cards";
import { Avatar } from "../../../ui/Avatar";

const wait = (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export function AllRequestsScreen({ route, navigation }: any) {
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

  const client = route.params.client;

  const [refreshing, setRefreshing] = React.useState(false);

  const [isLoading, setisLoading] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Data.updateReqs(client.indicator).then((req) => {
      return req ? setReqHistory(req) : null;
    });
    wait(1000).then(() => setRefreshing(false));
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setisLoading(true);
      setReqHistory([] as unknown as [any]);
      Data.updateReqs(client.indicator).then((req) => {
        setisLoading(false);
        return req ? setReqHistory(req) : null;
      });
      console.log(reqHistory);
    });
    return unsubscribe;
  }, [navigation, indicator]);

  const [reqHistory, setReqHistory] = useState(Data.reqs);

  const [exRates, setExRates] = useState(Utils.exRates);
  const [dataClients, setDataClients] = useState(Data.clients);

  return (
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
        $balance={client.$balance}
        රුbalance={client.රුbalance}
      />

      <View style={styles.flushview}>
        <Text style={styles.flushhistext}>All Clients</Text>

        <View>
          <TouchableOpacity
            style={styles.flushreload}
            onPress={() => {
              Data.updateAgents(indicator).then((req) => {
                req ? setDataClients(req) : null;
              });
            }}
          >
            <Icon name="reload" color="#8A8A8A" size={22} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.agentlist}>
        {(() => {
          return isLoading ? (
            <Text style={{ textAlign: "center", paddingTop: 40 }}>
              Loading...
            </Text>
          ) : reqHistory.length > 0 ? (
            reqHistory.reverse().map((req) => {
              return (
                <FlushReq
                  key={req.id}
                  status={
                    req.status === "In progress"
                      ? "pending"
                      : req.status === "Accepted"
                      ? "success"
                      : "error"
                  }
                  id={req.id.replace(/-/g, " ")}
                  value={{
                    valIn$: req.amountInUSD,
                    valInLKR: req.amountInLKR,
                  }}
                  lgdtime={new Date(req.lodgedDate)}
                  tbdtime={new Date(req.tobeflushedDate)}
                />
              );
            })
          ) : (
            <Text style={{ textAlign: "center", paddingTop: 40 }}>
              No Requests
            </Text>
          );
        })()}
      </ScrollView>
      <View style={styles.bottomNav}>
        <Divider style={styles.div} />
        <SmallTextButton
          textStyle={styles.gbth}
          onPress={() => {
            navigation.goBack();
          }}
        >
          Go back
        </SmallTextButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chipview: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  chip: {
    margin: 20,
  },
  currentbalancecard: {
    backgroundColor: "#ECFAF6",
    elevation: 0,
    borderRadius: 20,
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 20,
  },
  currentbalancecardcontent: {
    alignItems: "center",
    justifyContent: "center",
  },
  currentbalanceheading: {
    fontFamily: "Poppins-Medium",
    color: "#2DC897",
  },
  currentbalancebalanceInLKR: {
    fontFamily: "Poppins-SemiBold",
    color: "#2DC897",
    fontSize: 40,
    paddingTop: 25,
  },
  currentbalancebalanceIn$: {
    fontFamily: "Poppins-Medium",
    fontSize: 15,
    color: "#8A8A8A",
  },
  history: {
    marginRight: 20,
    marginLeft: 20,
    height: "50%",
  },
  bottomNav: {
    marginRight: 20,
    marginLeft: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  flushview: {
    flexDirection: "row",
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 20,
  },
  flushhistext: {
    fontFamily: "Poppins-SemiBold",
    color: "black",
    textAlign: "left",
    flex: 1,
  },
  flushreload: {
    marginRight: 5,
    flex: 1,
  },
  div: {
    height: 1,
    width: "100%",
    marginTop: 15,
  },
  gbth: {
    fontFamily: "Poppins-Regular",
    color: "#B9BAC8",
    marginTop: 15,
  },
  agentlist: {
    marginRight: 30,
    marginLeft: 30,
  },
});
