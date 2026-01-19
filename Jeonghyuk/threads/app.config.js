export default {
  expo: {
    name: "threads-clone",
    slug: "threads-clone",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "threadc",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.likevanilla.threads",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      useAppleSignIn: true,
    },
    android: {
      package: "com.likevanilla.threads",
      googleServicesFile: "./google-services.json",
      adaptiveIcon: {
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.RECORD_AUDIO",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.ACCESS_MEDIA_LOCATION",
      ],
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    splash: {
      image: "./assets/images/react-logo.png",
      imageWidth: 200,
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/react-logo.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow $(PRODUCT_NAME) to use your location.",
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app accesses your photos to let you share them in your threads.",
          cameraPermission:
            "The app accesses your camera to let you share photos in your threads.",
        },
      ],
      [
        "expo-media-library",
        {
          photosPermission: "Allow $(PRODUCT_NAME) to access your photos.",
          savePhotosPermission: "Allow $(PRODUCT_NAME) to save photos.",
          isAccessMediaLocationEnabled: true,
        },
      ],
      "expo-secure-store",
      "expo-font",
      "expo-web-browser",
      [
        "expo-build-properties",
        {
          android: {
            extraMavenRepos: [
              "https://devrepo.kakao.com/nexus/content/groups/public/",
            ],
          },
        },
      ],
      [
        "@react-native-kakao/core",
        {
          nativeAppKey: process.env.KAKAO_APP_KEY,
          android: {
            authCodeHandlerActivity: true,
          },
          ios: {
            handleKakaoOpenUrl: true,
          },
        },
      ],
      "expo-apple-authentication",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      kakaoAppKey: process.env.KAKAO_APP_KEY,
      router: {},
      eas: {
        projectId: "a4f57aba-20f6-437b-85da-5b1217981be9",
      },
    },
    owner: "likevanilla",
  },
};
