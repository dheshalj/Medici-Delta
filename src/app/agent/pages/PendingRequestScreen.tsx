/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Divider} from 'react-native-paper';

import {Data} from '../helpers/Data';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {PendReq, SmallTextButton} from 'src/ui';
import {flushreq} from 'src/types';
import {Utils} from 'src/utils';
import {Backend} from 'src/backend';
import {Cards} from 'src/ui/Cards';
import {Avatar} from 'src/ui/Avatar';

export function PendingRequestScreen({route, navigation}: any) {
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

  const [exRates, setExRates] = useState(Utils.exRates);
  const [dataClients, setDataClients] = useState(Data.clients);

  return (
    <View>
      <Avatar
        img={require('imgs/avatar.jpg')}
        name={nameOfUser}
        cb={() => {
          navigation.navigate(
            'Profile' as never,
            {
              details: route.params.details,
            } as never,
          );
        }}
      />

      <Cards.CurrentBalance
        greenview
        $balance={
          dataClients[0]
            ? dataClients
                .map(client => client.$balance)
                .reduce((acc, cur) => (acc ? acc : 0) + (cur ? cur : 0))
            : 0
        }
        රුbalance={
          dataClients[0]
            ? dataClients
                .map(client => client.රුbalance)
                .reduce((acc, cur) => (acc ? acc : 0) + (cur ? cur : 0))
            : 0
        }
      />

      <View style={styles.flushview}>
        <Text style={styles.flushhistext}>Pending Requests</Text>

        <View>
          <TouchableOpacity
            style={styles.flushreload}
            onPress={() => {
              Data.updateClients(indicator).then(req => {
                req ? setDataClients(req[0]) : null;
              });
            }}>
            <Icon name="reload" color="#8A8A8A" size={22} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.history}>
        {(() => {
          let arr = [].concat
            .apply([], dataClients.map(client => client.reqs) as any)
            .filter((req: flushreq) => req.status === 'In progress');
          return arr.length > 0 ? (
            arr
              .sort((a: any, b: any) => a.lodgedDate - b.lodgedDate)
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
                          status: 'Accepted',
                        },
                        err => {
                          if (err) {
                            console.log("Error at PendingRequestScreen.tsx:136", err);
                            return;
                          }
                          // TODO: Open Popup here
                          console.warn(`Request ${req.id} has been Accepted`);
                          Data.updateClients(indicator).then(users => {
                            return users ? setDataClients(users[0]) : null;
                          });
                        },
                      );
                    }}
                    onDecline={() => {
                      Backend.Client.updateReq(
                        req.id,
                        req.parentId,
                        {
                          status: 'Declined',
                        },
                        err => {
                          if (err) {
                            console.log("Error at PendingRequestScreen.tsx:156", err);
                            return;
                          }
                          // TODO: Open Popup here
                          console.warn(`Request ${req.id} has been Declined`);
                          Data.updateClients(indicator).then(users => {
                            return users ? setDataClients(users[0]) : null;
                          });
                        },
                      );
                    }}
                  />
                );
              })
          ) : (
            <Text style={{textAlign: 'center', marginTop: 40}}>
              No Pending Requests
            </Text>
          );
        })()}
      </ScrollView>
      <View style={styles.bottomNav}>
        <Divider style={styles.div} />
        <SmallTextButton
          textStyle={styles.gbth}
          onPress={() => {
            navigation.navigate(
              'Dashboard' as never,
              {
                details: route.params.details,
              } as never,
            );
          }}>
          Go back to Home
        </SmallTextButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chipview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  chip: {
    margin: 20,
  },
  currentbalancecard: {
    backgroundColor: '#ECFAF6',
    elevation: 0,
    borderRadius: 20,
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 20,
  },
  currentbalancecardcontent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentbalanceheading: {
    fontFamily: 'Poppins-Medium',
    color: '#2DC897',
  },
  currentbalancebalanceInLKR: {
    fontFamily: 'Poppins-SemiBold',
    color: '#2DC897',
    fontSize: 40,
    paddingTop: 25,
  },
  currentbalancebalanceIn$: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: '#8A8A8A',
  },
  history: {
    paddingRight: 10,
    height: '50%',
  },
  bottomNav: {
    marginRight: 20,
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flushview: {
    flexDirection: 'row',
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 20,
  },
  flushhistext: {
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
    textAlign: 'left',
    flex: 1,
  },
  flushreload: {
    marginRight: 5,
    flex: 1,
  },
  div: {
    height: 1,
    width: '100%',
    marginTop: 15,
  },
  gbth: {
    fontFamily: 'Poppins-Regular',
    color: '#B9BAC8',
    marginTop: 15,
  },
});
