import React from 'react';

import PlaceholderScreen from '@/components/PlaceholderScreen';

import styles from './styles';

export default function Tutorial() {
  return (
    <PlaceholderScreen
      title="Tutorial"
      subtitle="Funcionalidade em desenvolvimento."
      edges={['left', 'right']}
      containerStyle={styles.container}
      titleStyle={styles.title}
      subtitleStyle={styles.subtitle}
    />
  );
}
