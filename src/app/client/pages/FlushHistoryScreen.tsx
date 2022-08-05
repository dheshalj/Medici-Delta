/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  Text,
  View,
  BackHandler,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Chip, Card, Title, Paragraph, Divider } from "react-native-paper";
import vars, { useIsLoggingInGlobal } from "src/vars";

import { SmallTextButton, FlushReq } from "src/ui";

import { Data } from "../helpers/Data";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Cards } from "src/ui/Cards";
import { Avatar } from "src/ui/Avatar";

export function FlushHistoryScreen({ route, navigation }: any) {
  const {
    nameOfUser,
    NIC,
    businessName,
    BRNumber,
    mobileNumber,
    domain,
    indicator,
    syndicate,
    $balance,
    රුbalance,
  } = JSON.parse(route.params.details);

  React.useEffect(() => {
    Data.updateReqs(indicator).then((req) => {
      return req ? setReqHistory(req) : null;
    });
  }, [indicator]);

  const [reqHistory, setReqHistory] = useState(Data.reqs);

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
        greenview
        $balance={$balance}
        රුbalance={රුbalance}
      />

      <View style={styles.flushview}>
        <Text style={styles.flushhistext}>Flush History</Text>

        <View>
          <TouchableOpacity
            style={styles.flushreload}
            onPress={async () => {
              setReqHistory(await Data.updateReqs(indicator));
            }}
          >
            <Icon name="reload" color="#8A8A8A" size={22} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.history}>
        {(() => {
          return reqHistory.length > 0 ? (
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
          Go back to Home
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
    paddingRight: 10,
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
});
