import { colors } from "@/constants/Colors";
import useAuth from "@/src/hooks/useAuth";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Linking, Platform } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from "expo-router";

import { useSecrets } from "@/src/hooks/useSecrets";

export default function HomeScreen() {
    const {accountInfo} = useAuth();
    const router = useRouter();
    const {secrets} = useSecrets();

    return (
        <LinearGradient
            colors={[colors.primary, '#3a3a6a', '#222240']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.6 }}
            style={styles.headerGradient}
        >
            <Stack.Screen options={{
                headerRight:() => 
                    <TouchableOpacity 
                        style={{marginRight:12}}
                        onPress={() => {
                            const url = `whatsapp://send?phone=${secrets?.WHATSAPP}&text=${encodeURIComponent(`Hello team, I need help with...`)}`;
                            Linking.openURL(url);
                        }}
                    >
                        <Ionicons name="logo-whatsapp" size={36} color={colors.green} />
                    </TouchableOpacity>
            }} />
            
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    headerGradient: {
        flex: 1,
    },
    welcomeSection: {
        padding: 10,
        paddingTop: 20,
        paddingBottom: 0,
    },
    welcomeTitle: {
        fontSize: 28,
        fontFamily: 'fontBold',
        marginBottom: 8,
        color: colors.white,
    },
    welcomeSubtitle: {
        fontSize: 16,
        fontFamily: 'fontBold',
        color: colors.white,
        opacity: 0.9,
        maxWidth: '80%',
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white + '20',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        height: 48,
        color: colors.white,
        fontSize: 16,
    },
    quickActionsContainer: {
        paddingRight: 20,
    },
    quickActionCard: {
        width: 130,
        padding: 16,
        borderRadius: 10,
        marginRight: 12,
        alignItems:'center',
        justifyContent:'center',
        paddingVertical:20
    },
    actionIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    actionTitle: {
        fontSize: 12,
        fontFamily: 'fontBold',
        color: colors.white,
        marginBottom: 4,
        textAlign:'center',
    },
    actionSubtitle: {
        fontSize: 10,
        fontFamily: 'fontLight',
        color: colors.white,
        marginTop: 4,
        textAlign:'center'
    },
});