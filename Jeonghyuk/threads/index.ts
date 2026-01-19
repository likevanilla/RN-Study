import "expo-router/entry";
import * as Device from "expo-device";

import { createServer, Response, Server } from "miragejs";

declare global {
  interface Window {
    server: Server;
  }
}

if (__DEV__ && typeof window !== "undefined" && !Device.isDevice) {
  if (window.server) {
    window.server.shutdown();
  }

  window.server = createServer({
    routes() {
      this.post("/login", (schema, request) => {
        const { username, password } = JSON.parse(request.requestBody);

        if (username === "zerocho" && password === "1234") {
          return {
            accessToken: "access-token",
            refreshToken: "refresh-token",
            user: {
              id: "zerocho",
              name: "LikeVanilla",
              description: "programmer",
              profileImageUrl:
                "https://avartaras.githubusercontent.com/u/885857?v=4",
            },
          };
        } else {
          return new Response(401, {}, { message: "Invalid credentials" });
        }
      });
    },
  });
}
