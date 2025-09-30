import React from 'react';

import PlaceholderScreen from '@/components/PlaceholderScreen';

import styles from './styles';

export default function ServicosNaoAutorizados() {
  return (
    <PlaceholderScreen
      title="Serviços não autorizados"
      subtitle="Funcionalidade em desenvolvimento."
      edges={['left', 'right']}
      containerStyle={styles.container}
      titleStyle={styles.title}
      subtitleStyle={styles.subtitle}
    />
  );
}
