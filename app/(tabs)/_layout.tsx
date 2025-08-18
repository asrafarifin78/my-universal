// app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        //headerShown: true,
      }}
    >
        <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false, // hide header only for Home
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
             <Image
              source={require('../../assets/images/outline-account.png')} // your custom icon
              style={{
                width: size,
                height: size,
                tintColor: color, // makes it adapt to active/inactive colors
                resizeMode: 'contain',
              }}
            />
          ),
        }}
      />
       <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
             <Image
              source={require('../../assets/images/outline-account.png')} // your custom icon
              style={{
                width: size,
                height: size,
                tintColor: color, // makes it adapt to active/inactive colors
                resizeMode: 'contain',
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
             <Image
              source={require('../../assets/images/outline-inbox.png')} // your custom icon
              style={{
                width: size,
                height: size,
                tintColor: color, // makes it adapt to active/inactive colors
                resizeMode: 'contain',
              }}
      />
          ),
        }}
      />
    </Tabs>
  );
}
