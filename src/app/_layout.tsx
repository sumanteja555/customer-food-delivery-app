import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { AddressProvider } from "@/context/address-context";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";

export { ErrorBoundary } from "expo-router";

const HOME_ICON = require("@/assets/images/tabIcons/home.png");
const BROWSE_ICON = require("@/assets/images/tabIcons/explore.png");

function AccountGlyph({ color }: { color: string }) {
  return (
    <View style={styles.accountGlyph}>
      <View style={[styles.accountGlyphHead, { borderColor: color }]} />
      <View style={[styles.accountGlyphBody, { borderColor: color }]} />
    </View>
  );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  const { width } = useWindowDimensions();
  const navWidth = width * 0.7;

  const visibleRoutes = state.routes.filter((route: any) =>
    ["home", "explore", "login"].includes(route.name),
  );

  return (
    <View pointerEvents="box-none" style={styles.tabBarWrapper}>
      <View style={[styles.tabBar, { width: navWidth }]}>
        <View style={styles.navHighlight} />

        {visibleRoutes.map((route: any) => {
          const routeIndex = state.routes.findIndex(
            (r: any) => r.key === route.key,
          );

          const isFocused = state.index === routeIndex;
          const options = descriptors[route.key]?.options || {};

          const label =
            options.title !== undefined ? options.title : route.name;

          const color = isFocused ? "#FFFFFF" : "#AAA8AF";

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
              onPress={onPress}
              style={styles.tabItem}>
              <View
                style={[styles.iconPill, isFocused && styles.iconPillActive]}
              >
                {route.name === "home" && (
                  <Image
                    source={HOME_ICON}
                    style={[styles.tabIcon, { tintColor: color }]}
                  />
                )}

                {route.name === "explore" && (
                  <Image
                    source={BROWSE_ICON}
                    style={[styles.tabIcon, { tintColor: color }]}
                  />
                )}

                {route.name === "login" && <AccountGlyph color={color} />}
              </View>

              <Text style={styles.tabLabel}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function AppTabs() {
  const { user } = useAuth();

  return (
    <>
      <StatusBar style="dark" />

      <Tabs
        backBehavior="history"
        safeAreaInsets={{ bottom: 0 }}
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: styles.scene,
        }}
      >
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="address-details" options={{ href: null }} />
        <Tabs.Screen name="restaurant/[id]" options={{ href: null }} />
        <Tabs.Screen name="offers" options={{ href: null }} />
        <Tabs.Screen name="cart" options={{ href: null }} />
        <Tabs.Screen name="signup" options={{ href: null }} />
        <Tabs.Screen name="order-confirmation" options={{ href: null }} />
        <Tabs.Screen name="saved-addresses" options={{ href: null }} />
        <Tabs.Screen name="order-history" options={{ href: null }} />

        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
          }}
        />

        <Tabs.Screen
          name="explore"
          options={{
            title: "Browse",
          }}
        />

        <Tabs.Screen
          name="login"
          options={{
            title: user ? "Account" : "Login",
          }}
        />
      </Tabs>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <AddressProvider>
          <AppTabs />
        </AddressProvider>
      </CartProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  scene: {
    backgroundColor: "#FBFAF8",
  },

  tabBarWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 22,
    alignItems: "center",
  },

  tabBar: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(27, 35, 48, 0.65)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.15)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    overflow: "hidden",

    shadowColor: "#1D1712",
    shadowOpacity: 0.15,
    shadowRadius: 25,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 10,
  },

  navHighlight: {
    position: "absolute",
    top: 0,
    left: 16,
    right: 16,
    height: 1.5,
    backgroundColor: "rgba(255, 255, 255, 0.35)",
    opacity: 1,
  },

  tabItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  tabLabel: {
    fontSize: 10,
    marginTop: 1,
    fontWeight: "600",
    color: "#AAA8AF",
  },

  iconPill: {
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  iconPillActive: {
    backgroundColor: "#FF7A3D",
    shadowColor: "#FF7A3D",
    shadowOpacity: 0.22,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  tabIcon: {
    width: 16,
    height: 16,
  },

  accountGlyph: {
    width: 16,
    height: 17,
    alignItems: "center",
  },

  accountGlyphHead: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1.5,
  },

  accountGlyphBody: {
    position: "absolute",
    bottom: 0,
    width: 14,
    height: 8,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderWidth: 1.5,
    borderBottomWidth: 0,
  },
});
