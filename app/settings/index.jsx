import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Moon, Sun, Database, Trash2, ShieldCheck, Coffee } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { useTasks } from '../../src/hooks/useTasks';
import { AppHeader } from '../../src/components/common/AppHeader';
import { AppButton } from '../../src/components/common/AppButton';
import { ConfirmDialog } from '../../src/components/common/ConfirmDialog';
import { spacing, borderRadius } from '../../src/constants/spacing';
import { typography } from '../../src/constants/typography';

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const router = useRouter();
  const { tasks, deleteAllTasks } = useTasks();
  const [showClearModal, setShowClearModal] = useState(false);

  const handleClearAll = async () => {
    await deleteAllTasks();
    setShowClearModal(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader title="Settings" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Appearance Card */}
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
          Appearance & Theme
        </Text>

        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          {/* Light / Dark Mode Toggle */}
          <View style={styles.settingRow}>
            <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
              {isDark ? <Moon size={20} color={colors.primary} /> : <Sun size={20} color={colors.primary} />}
            </View>

            <View style={styles.settingTextGroup}>
              <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </Text>
              <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                {isDark ? 'Dark theme active' : 'Light theme active'}
              </Text>
            </View>

            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* Data & Storage Card */}
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
          Data & Persistence
        </Text>
        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={styles.settingRow}>
            <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
              <Database size={20} color={colors.primary} />
            </View>

            <View style={styles.settingTextGroup}>
              <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                Stored Tasks
              </Text>
              <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                Currently managing {(tasks || []).length} task{(tasks || []).length === 1 ? '' : 's'} in AsyncStorage
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.dangerSection}>
            <View style={styles.dangerHeaderRow}>
              <Trash2 size={18} color={colors.danger} style={{ marginRight: 6 }} />
              <Text style={[styles.settingTitle, { color: colors.danger }]}>
                Clear All Data
              </Text>
            </View>
            <Text style={[styles.settingSubtitle, { color: colors.textSecondary, marginBottom: spacing.md }]}>
              Permanently remove all task records from system memory.
            </Text>
            <AppButton
              title="Clear All Tasks"
              variant="danger"
              onPress={() => setShowClearModal(true)}
              disabled={(tasks || []).length === 0}
            />
          </View>
        </View>

        {/* App Meta Card */}
        <View style={[styles.metaCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.metaRow}>
            <ShieldCheck size={18} color={colors.success} style={{ marginRight: 6 }} />
            <Text style={[styles.metaTitle, { color: colors.textPrimary }]}>
              TaskFlow v1.0.0 — Ready
            </Text>
          </View>
          <Text style={[styles.metaSubtitle, { color: colors.textMuted }]}>
            React Native + Expo Technical Assessment Architecture
          </Text>
        </View>
      </ScrollView>

      {/* Clear All Confirmation Dialog */}
      <ConfirmDialog
        visible={showClearModal}
        title="Clear All Tasks?"
        message="Are you sure you want to delete ALL tasks? This action cannot be undone."
        confirmTitle="Clear All"
        isDanger
        onConfirm={handleClearAll}
        onCancel={() => setShowClearModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  card: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.xl,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingTextGroup: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  settingSubtitle: {
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginVertical: spacing.lg,
  },
  dangerSection: {},
  dangerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  metaSubtitle: {
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
});
