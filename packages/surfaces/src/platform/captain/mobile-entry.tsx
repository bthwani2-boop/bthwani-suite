import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';

export default function CaptainShell() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B1220' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '700', marginBottom: 12 }}>BThwani Captain</Text>
        <Text style={{ color: '#94A3B8', fontSize: 14, textAlign: 'center' }}>Clean mobile shell is active. Broken legacy entry chain was removed.</Text>
      </View>
    </SafeAreaView>
  );
}
