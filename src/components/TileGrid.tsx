import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import Icon from '@/components/Icon';
import styles, { CARD_GRADIENT } from '../screens/HomeFiscalizacao/styles';
import type { DrawerParamList } from '@/types/types';

type Item = { key: keyof DrawerParamList; title: string; icon: string };

type Props = {
    items: Item[];
    navigation: DrawerNavigationProp<DrawerParamList>;
};

export default function TileGrid({ items, navigation }: Props) {
    return (
        <View style={styles.grid}>
            {items.map((item) => (
                <TouchableOpacity
                    key={item.key as string}
                    onPress={() => navigation.navigate(item.key as any)}
                    accessibilityRole="button"
                    accessibilityLabel={`Abrir ${item.title}`}
                    activeOpacity={0.9}
                    style={styles.tileWrapper}
                    hitSlop={8}
                    testID={`tile-${item.key as string}`}
                >
                    <LinearGradient
                        colors={CARD_GRADIENT}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={styles.tile}
                    >
                        <View style={styles.tileIconWrap}>
                            <Icon name={item.icon as any} size={44} color="#fff" />
                        </View>
                        <Text style={styles.tileText}>{item.title}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            ))}
        </View>
    );
}
