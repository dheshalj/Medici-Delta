/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Divider } from "react-native-paper";

import { SmallTextButton, FlushReq } from "src/ui";

import { Data } from "../helpers/Data";
import { Utils } from "src/utils";
import { tabheader, user, flushreq } from "../../../types";
import { LargeTextButton } from "../../../ui";

export function ClientReqListScreen({ route, navigation }: any) {
  const client = {
    user: route.params.user as user,
    state: route.params.state as tabheader,
    parent: route.params.parent as string,
  };

  const [exRates, setExRates] = useState(Utils.exRates);
  const [dataClients, setDataClients] = useState(Data.clients);

  return (
    <View>
      <Text style={styles.nametext}>{client.user.nameOfUser}</Text>
      <View style={styles.flushview}>
        <Text style={styles.flushhistext}>Request History</Text>
      </View>

      <ScrollView style={styles.history}>
        {(() => {
          let arr = [].concat
            .apply([], dataClients.map((client) => client.reqs) as any)
            .filter((req: flushreq) => req.parentId === client.user.indicator);
          return arr.length > 0 ? (
            arr
              .sort((a: any, b: any) => a.lodgedDate - b.lodgedDate)
              .map((req: flushreq) => {
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
        <LargeTextButton
          title={"View Profile"}
          isLoading={false}
          style={styles.viewprofile}
          onPress={() => {
            navigation.navigate("ClientProfile", {
              user: client.user,
              state: client.state,
              parent: client.parent,
              redirect: "ClientReqList"
            });
          }}
        />
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
  nametext: {
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 20,
    textAlign: "center",
    color: "#2F394E",
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
  },
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
    fontSize: 30,
    paddingTop: 10,
  },
  currentbalancebalanceIn$: {
    fontFamily: "Poppins-Medium",
    fontSize: 15,
    color: "#8A8A8A",
  },
  history: {
    marginRight: 20,
    marginLeft: 20,
    paddingRight: 10,
    height: "60%",
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
    color: "#8F92A1",
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
  },
  viewprofile: {
    marginTop: 20,
  },
});
