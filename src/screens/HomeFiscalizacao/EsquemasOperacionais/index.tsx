import React from 'react';

import PlaceholderScreen from '@/components/PlaceholderScreen';

import styles from './styles';

export default function EsquemasOperacionais() {
  return (
    <PlaceholderScreen
      title="Esquemas operacionais"
      subtitle="Funcionalidade em desenvolvimento."
      edges={['left', 'right']}
      containerStyle={styles.container}
      titleStyle={styles.title}
      subtitleStyle={styles.subtitle}
    />
  );
}
