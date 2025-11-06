import { StyleSheet } from 'react-native';

import theme from '@/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  formulario: { marginBottom: theme.spacing.md },
  titulo: { ...theme.typography.heading, textAlign: 'center', marginBottom: theme.spacing.md },
  botao: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  botaoPressionado: { opacity: 0.85 },
  botaoDesabilitado: { opacity: 0.5 },
  botaoTexto: { ...theme.typography.button },
  contador: { ...theme.typography.caption, color: theme.colors.muted, marginBottom: theme.spacing.sm },
  nenhumResultado: { textAlign: 'center', color: theme.colors.muted, marginTop: theme.spacing.md },
  listaVazia: { flexGrow: 1 },
});

export default styles;
