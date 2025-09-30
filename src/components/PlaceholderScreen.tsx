import React from 'react';
import type { ReactNode } from 'react';
import { Text, StyleSheet, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});

type Props = {
  title: string;
  subtitle?: ReactNode;
  edges?: Edge[];
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
};

const DEFAULT_EDGES: Edge[] = ['left', 'right'];

export default function PlaceholderScreen({
  title,
  subtitle,
  edges = DEFAULT_EDGES,
  containerStyle,
  titleStyle,
  subtitleStyle,
}: Props) {
  return (
    <SafeAreaView style={[baseStyles.container, containerStyle]} edges={edges}>
      <Text style={[baseStyles.title, titleStyle]}>{title}</Text>
      {subtitle ? <Text style={[baseStyles.subtitle, subtitleStyle]}>{subtitle}</Text> : null}
    </SafeAreaView>
  );
}
