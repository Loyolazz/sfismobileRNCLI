import React from 'react';

import PlaceholderScreen from '@/components/PlaceholderScreen';

import styles from './styles';

export default function SituacaoServico() {
  return (
    <PlaceholderScreen
      title="Situação do serviço"
      subtitle="Funcionalidade em desenvolvimento."
      edges={['left', 'right']}
      containerStyle={styles.container}
      titleStyle={styles.title}
      subtitleStyle={styles.subtitle}
    />
  );
}
