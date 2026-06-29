import { Tabs } from 'expo-router';
import { Image, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export { ErrorBoundary } from 'expo-router';

const HOME_ICON = require('@/assets/images/tabIcons/home.png');
const BROWSE_ICON = require('@/assets/images/tabIcons/explore.png');

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          headerShown: false,
          sceneStyle: styles.scene,
          tabBarActiveTintColor: '#F76532',
          tabBarInactiveTintColor: '#8B8B91',
          tabBarLabelStyle: styles.tabLabel,
          tabBarStyle: styles.tabBar,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <Image source={HOME_ICON} style={[styles.tabIcon, { tintColor: color }]} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Browse',
            tabBarIcon: ({ color }) => (
              <Image source={BROWSE_ICON} style={[styles.tabIcon, { tintColor: color }]} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  scene: { backgroundColor: '#FBFAF8' },
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#ECE9E4',
    height: 84,
    paddingTop: 9,
    paddingBottom: 10,
  },
  tabLabel: { fontSize: 11, fontWeight: '700' },
  tabIcon: { width: 23, height: 23 },
});
