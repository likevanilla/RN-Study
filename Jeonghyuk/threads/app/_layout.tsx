import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, router } from "expo-router";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  View,
  StyleSheet,
  Image,
  Animated,
  Linking,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { Asset } from "expo-asset";
import Constants from "expo-constants";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

// First, set the handler that will cause the notification
// to show the alert
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

export interface User {
  id: string;
  name: string;
  profileImageUrl: string;
  description: string;
  link?: string;
  showInstagramBadge?: boolean;
  isPrivate?: boolean;
}

export const AuthContext = createContext<{
  user: User | null;
  login?: () => Promise<any>;
  logout?: () => Promise<any>;
  updateUser?: (user: User) => void;
}>({
  user: null,
});

function AnimatedAppLoader({
  children,
  image,
}: {
  children: React.ReactNode;
  image: number;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isSplashReady, setSplashReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await Asset.loadAsync(image);
      setSplashReady(true);
    }
    prepare();
  }, [image]);

  const login = () => {
    console.log("login");
    return fetch("/login", {
      method: "POST",
      body: JSON.stringify({
        username: "zerocho",
        password: "1234",
      }),
    })
      .then((res) => {
        console.log("res", res, res.status);
        if (res.status >= 400) {
          return Alert.alert("Error", "Invalid credentials");
        }
        return res.json();
      })
      .then((data) => {
        console.log("data", data);
        setUser(data.user);
        return Promise.all([
          SecureStore.setItemAsync("accessToken", data.accessToken),
          SecureStore.setItemAsync("refreshToken", data.refreshToken),
          AsyncStorage.setItem("user", JSON.stringify(data.user)),
        ]);
      })
      .catch(console.error);
  };

  const logout = () => {
    setUser(null);
    return Promise.all([
      SecureStore.deleteItemAsync("accessToken"),
      SecureStore.deleteItemAsync("refreshToken"),
      AsyncStorage.removeItem("user"),
    ]);
  };

  const updateUser = (user: User | null) => {
    setUser(user);
    if (user) {
      AsyncStorage.setItem("user", JSON.stringify(user));
    } else {
      AsyncStorage.removeItem("user");
    }
  };

  if (!isSplashReady) {
    return null;
  }

  return (
    <AuthContext value={{ user, login, logout, updateUser }}>
      <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>
    </AuthContext>
  );
}

async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Original title",
    body: "And here is the body",
    data: { someData: "goes here" },
  };

  await fetch("https://expo.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Concept-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

function AnimatedSplashScreen({
  children,
  image,
}: {
  children: React.ReactNode;
  image: number;
}) {
  const [isAppReady, setAppReady] = useState(false);
  const [isSplashAnimationComplete, setAnimationComplete] = useState(false);
  const animation = useRef(new Animated.Value(1)).current;
  const { updateUser } = useContext(AuthContext);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    if (isAppReady) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => setAnimationComplete(true));
    }
  }, [isAppReady]);

  const onImageLoaded = async () => {
    try {
      // 데이터 준비
      await Promise.all([
        AsyncStorage.getItem("user").then((user) => {
          updateUser?.(user ? JSON.parse(user) : null);
        }),
        // TODO: validating access token
      ]);
      await SplashScreen.hideAsync();
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        return Linking.openSettings();
      }
      const token = await Notifications.getExpoPushTokenAsync({
        projectId:
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId,
      });
      console.log("token", token);
      setExpoPushToken(token.data);
    } catch (e) {
      console.error(e);
    } finally {
      setAppReady(true);
    }
  };

  useEffect(() => {
    if (expoPushToken && Device.isDevice) {
      sendPushNotification(expoPushToken);
    }
  }, [expoPushToken]);

  const rotateValue = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={{ flex: 1 }}>
      {isAppReady && children}
      {!isSplashAnimationComplete && (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              ...StyleSheet.absoluteFillObject,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                Constants.expoConfig?.splash?.backgroundColor || "#ffffff",
              opacity: animation,
            },
          ]}
        >
          <Animated.Image
            source={image}
            style={{
              resizeMode: Constants.expoConfig?.splash?.resizeMode || "contain",
              width: Constants.expoConfig?.splash?.imageWidth || 200,
              transform: [{ scale: animation }, { rotate: rotateValue }],
            }}
            onLoadEnd={onImageLoaded}
            fadeDuration={0}
          />
        </Animated.View>
      )}
    </View>
  );
}

function useNotificationObserver() {
  useEffect(() => {
    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url as string;
      if (url && url.startsWith("threadc://")) {
        Alert.alert("redirect to url", url);
        router.push(url.replace("threadc://", "/") as Href); // threadc://@zerocho -> /@zerocho
        // Linking.openURL(url);
      }
    }

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response?.notification) {
        return;
      }
      redirect(response?.notification);
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        redirect(response.notification);
      },
    );

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}

export default function RootLayout() {
  useNotificationObserver();
  return (
    <AnimatedAppLoader image={require("../assets/images/react-logo.png")}>
      <StatusBar style="auto" animated hidden={false} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </AnimatedAppLoader>
  );
}
