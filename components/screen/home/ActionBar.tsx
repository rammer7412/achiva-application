import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ActionBar() {
  const actions = ['최고예요', '수고했어요', '응원해요', '동기부여'];
  return (
    <View style={styles.container}>
      {actions.map((a) => (
        <TouchableOpacity key={a} style={styles.btn}>
          <Text style={styles.text}>{a}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-around' },
  btn: { padding: 8, borderRadius: 16, backgroundColor: '#222' },
  text: { color: '#fff', fontSize: 12 },
});
