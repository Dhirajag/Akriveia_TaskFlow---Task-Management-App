import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '../../theme/ThemeContext';
import { AppButton } from '../common/AppButton';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export const FilePicker = ({
  selectedFileName,
  onFilePicked,
  onLoadSampleCsv,
  onClearFile,
}) => {
  const { colors } = useTheme();
  const [showFormatGuide, setShowFormatGuide] = useState(false);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'text/csv',
          'text/comma-separated-values',
          'application/csv',
          'application/vnd.ms-excel',
          '*/*',
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const response = await fetch(asset.uri);
        const text = await response.text();
        onFilePicked(text, asset.name || 'uploaded_tasks.csv');
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <View
        style={[
          styles.container,
          { backgroundColor: colors.cardBackground, borderColor: colors.border },
        ]}
      >
        <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
          <Text style={styles.icon}>📄</Text>
        </View>

        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Import Tasks from CSV / Excel
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Upload your task spreadsheet (.csv) to import multiple tasks instantly.
        </Text>

        {selectedFileName ? (
          <View style={[styles.activeFileBadge, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
            <View style={styles.fileInfoRow}>
              <Text style={styles.fileIcon}>📌</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fileBadgeTitle, { color: colors.primary }]}>
                  {selectedFileName}
                </Text>
                <Text style={[styles.fileBadgeSub, { color: colors.textSecondary }]}>
                  Ready for validation
                </Text>
              </View>
              {onClearFile && (
                <TouchableOpacity
                  onPress={onClearFile}
                  style={[styles.clearBtn, { backgroundColor: colors.dangerBg }]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.clearBtnText, { color: colors.danger }]}>✕ Remove</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : null}

        <View style={styles.buttonRow}>
          <AppButton
            title={selectedFileName ? "Change File" : "Browse CSV File"}
            onPress={handlePickDocument}
            style={{ flex: 1 }}
          />
          <AppButton
            title="Load Sample CSV"
            variant="secondary"
            onPress={onLoadSampleCsv}
            style={{ flex: 1 }}
          />
        </View>

        <TouchableOpacity
          onPress={() => setShowFormatGuide(!showFormatGuide)}
          style={styles.guideToggleBtn}
          activeOpacity={0.7}
        >
          <Text style={[styles.guideToggleText, { color: colors.primary }]}>
            {showFormatGuide ? '▼ Hide CSV Format Guide' : '▶ View Recommended CSV Headers & Structure'}
          </Text>
        </TouchableOpacity>

        {showFormatGuide && (
          <View style={[styles.guideBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.guideHeader, { color: colors.textPrimary }]}>
              Standard CSV Headers Supported:
            </Text>
            <Text style={[styles.guideCode, { color: colors.primary, backgroundColor: colors.background }]}>
              id, title, description, category, priority, start_date, due_date, status
            </Text>
            <View style={styles.guideList}>
              <Text style={[styles.guideItem, { color: colors.textSecondary }]}>
                • <Text style={{ fontWeight: 'bold' }}>Title</Text>: Task name (Required)
              </Text>
              <Text style={[styles.guideItem, { color: colors.textSecondary }]}>
                • <Text style={{ fontWeight: 'bold' }}>Priority</Text>: High / Medium / Low
              </Text>
              <Text style={[styles.guideItem, { color: colors.textSecondary }]}>
                • <Text style={{ fontWeight: 'bold' }}>Status</Text>: Pending / Completed
              </Text>
              <Text style={[styles.guideItem, { color: colors.textSecondary }]}>
                • <Text style={{ fontWeight: 'bold' }}>Dates</Text>: YYYY-MM-DD, DD/MM/YYYY, or MM/DD/YYYY
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: spacing.lg,
  },
  container: {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    alignItems: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 18,
  },
  activeFileBadge: {
    width: '100%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  fileInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  fileIcon: {
    fontSize: 22,
  },
  fileBadgeTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  fileBadgeSub: {
    fontSize: typography.fontSize.xs,
  },
  clearBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  clearBtnText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  guideToggleBtn: {
    marginTop: spacing.md,
    paddingVertical: spacing.xs,
  },
  guideToggleText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  guideBox: {
    width: '100%',
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  guideHeader: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  guideCode: {
    fontSize: typography.fontSize.xs - 1,
    fontFamily: 'monospace',
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  guideList: {
    gap: 4,
  },
  guideItem: {
    fontSize: typography.fontSize.xs - 1,
  },
});
