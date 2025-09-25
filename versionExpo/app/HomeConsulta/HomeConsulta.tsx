import { Link } from 'expo-router';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';

export default function HomeConsulta() {
    return (
        <SafeAreaView style={styles.container} edges={['left', 'right']}>
            <Text style={styles.title}>SFISMobile</Text>
            <Link href="/Login">Ir para Login</Link>
        </SafeAreaView>
    );
}

