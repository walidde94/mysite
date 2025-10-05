import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/progress/dashboard');
      setDashboard(response.data.dashboard);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboard();
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back, {user?.name}! 👋</Text>
        <Text style={styles.subheading}>Here's your eco-impact today</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🏆</Text>
          <Text style={styles.statValue}>{dashboard?.user?.level || 1}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>⭐</Text>
          <Text style={styles.statValue}>{dashboard?.user?.points || 0}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🔥</Text>
          <Text style={styles.statValue}>{dashboard?.user?.streak?.current || 0}</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🌍</Text>
          <Text style={styles.statValue}>
            {dashboard?.today?.carbonFootprint?.toFixed(1) || 0}
          </Text>
          <Text style={styles.statLabel}>CO₂ (kg)</Text>
        </View>
      </View>

      {/* This Week */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Week's Progress</Text>
        <View style={styles.card}>
          <View style={styles.weeklyItem}>
            <Text style={styles.weeklyLabel}>Challenges Completed</Text>
            <Text style={styles.weeklyValue}>
              {dashboard?.thisWeek?.challengesCompleted || 0}
            </Text>
          </View>
          <View style={styles.weeklyItem}>
            <Text style={styles.weeklyLabel}>Points Earned</Text>
            <Text style={styles.weeklyValue}>
              {dashboard?.thisWeek?.totalPoints || 0}
            </Text>
          </View>
          <View style={styles.weeklyItem}>
            <Text style={styles.weeklyLabel}>Avg Daily CO₂</Text>
            <Text style={styles.weeklyValue}>
              {dashboard?.thisWeek?.averageDaily?.toFixed(1) || 0} kg
            </Text>
          </View>
        </View>
      </View>

      {/* Daily Challenges */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Challenges</Text>
        {dashboard?.dailyChallenges?.map((challenge) => (
          <TouchableOpacity
            key={challenge._id}
            style={styles.challengeCard}
            onPress={() =>
              navigation.navigate('ChallengeDetail', { id: challenge._id })
            }
          >
            <Text style={styles.challengeEmoji}>{challenge.icon}</Text>
            <View style={styles.challengeContent}>
              <Text style={styles.challengeTitle}>{challenge.title}</Text>
              <Text style={styles.challengePoints}>
                +{challenge.points} pts • {challenge.carbonSaved}kg CO₂
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subheading: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    margin: '1%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weeklyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  weeklyLabel: {
    fontSize: 14,
    color: '#666',
  },
  weeklyValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  challengeCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  challengeEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  challengeContent: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  challengePoints: {
    fontSize: 12,
    color: '#666',
  },
});
