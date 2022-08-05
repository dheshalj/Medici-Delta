import React, { useState } from "react";
import { useColorScheme, View } from "react-native";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { useFonts } from "expo-font";

import { Colors } from "react-native/Libraries/NewAppScreen";

import UserInactivity from "react-native-user-inactivity";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { navigationRef } from "./helpers/RootNavigation";
import { LoginScreen } from "./pages/LoginScreen";
import { RegisterScreen } from "./pages/RegisterScreen";
import { DashboardScreen } from "./pages/DashboardScreen";
import { ProfileScreen } from "./pages/ProfileScreen";
import { FlushHistoryScreen } from "./pages/FlushHistoryScreen";

import vars, { getIsLoggingInGlobalValue } from "src/vars";
import { PopUp } from "src/ui";
import { Utils } from "src/utils";
import { SafeAreaView } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "gray",
    secondary: "yellow",
    light: "white",
    background: "white",
  },
};

export function ClientScreen() {
  (async () => {
    await Utils.getExRates(
      new Date(new Date().getTime() - 6 * 864e5),
      new Date()
    );
  })();

  const [active, setActive] = useState(true);
  const [timer] = useState(vars.TimeOutDur);

  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : "white", // Colors.lighter,
  };

  const [loaded] = useFonts({
    "Poppins-Bold": require("../../../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Light": require("../../../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../../../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../../../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../../../assets/fonts/Poppins-SemiBold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, ...backgroundStyle }}>
          <UserInactivity
            isActive={active}
            timeForInactivity={timer}
            onAction={(isActive) => {
              setActive(isActive);
            }}
            style={{ flex: 1, ...backgroundStyle }}
          >
            <NavigationContainer
              theme={theme as any}
              independent={true}
              ref={navigationRef}
            >
              <Stack.Navigator initialRouteName="Login">
                <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Register"
                  component={RegisterScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Dashboard"
                  component={DashboardScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Profile"
                  component={ProfileScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="FlushHistory"
                  component={FlushHistoryScreen}
                  options={{ headerShown: false }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </UserInactivity>
          <PopUp.Info
            type="info"
            title="Session Timeout !"
            body="6 mins of inactivity elapsed"
            button={{
              text: "Login",
              onPress: () =>
                navigationRef.navigate("Login" as never, {} as never),
            }}
            exception={!getIsLoggingInGlobalValue()}
            active={[!active, setActive]}
          />
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}
