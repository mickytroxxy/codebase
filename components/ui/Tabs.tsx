import { colors } from "@/constants/Colors"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Icon from "./Icon"
import { useState } from "react";

export const Tabs = () => {
    const [activeTab, setActiveTab] = useState<'schedule' | 'venues'>('schedule');
    return(
        <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'schedule' && styles.activeTab]}
              onPress={() => setActiveTab('schedule')}
            >
              <Icon name="calendar-plus-o" type="FontAwesome" size={16} color={activeTab === 'schedule' ? colors.white : colors.grey} />
              <Text style={[styles.tabText, activeTab === 'schedule' && styles.activeTabText]}>Schedule</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'venues' && styles.activeTab]}
              onPress={() => setActiveTab('venues')}
            >
              <Icon name="map-marker" type="FontAwesome" size={16} color={activeTab === 'venues' ? colors.white : colors.grey} />
              <Text style={[styles.tabText, activeTab === 'venues' && styles.activeTabText]}>My Venues</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        padding: 4,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    activeTab: {
        backgroundColor: colors.orange,
    },
    tabText: {
        fontSize: 12,
        fontFamily: 'fontBold',
        color: colors.grey,
        marginLeft: 6,
    },
    activeTabText: {
        color: colors.white,
    },
})