import { registerRootComponent } from "expo";

import App from "./App";

import { en, registerTranslation } from "react-native-paper-dates";
registerTranslation("en", en);

registerRootComponent(App);
