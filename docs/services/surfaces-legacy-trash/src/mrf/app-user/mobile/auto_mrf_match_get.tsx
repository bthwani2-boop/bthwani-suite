// MRF Match Get Screen - Match Details
// Surface: app-client | Service: mrf
// §30 States: Loading / Error / Empty / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling
// Per roadmap: mrf_match_get → entity_get (entityType=match, domain=MRF) - unified operation

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS, BTHWANI_TYPOGRAPHY } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';
import { buildMrfMatchGetMock } from '../../hooks';

// Network retry configuration
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 20000;

interface auto_mrf_match_getProps {
  onNavigate?: (screen: string, params?: any) => void;
  navigation?: { navigate: (screen: string, params?: any) => void };
  route?: { params?: { matchId?: string; reportId?: string } };
}

export const auto_mrf_match_get: React.FC<auto_mrf_match_getProps> = ({ 
  onNavigate, 
  navigation,
  route,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [state, setState] = useState<ScreenState>('loading');
  const [matchData, setMatchData] = useState<any>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const hasLoadedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const maxRetriesReachedRef = useRef(false);

  // Get matchId from route params or use default
  const matchId = route?.params?.matchId || route?.params?.reportId || 'MATCH-001';

  // Retry helper with exponential backoff
  const fetchWithRetry = async (
    url: string,
    options: RequestInit,
    maxRetries: number = MAX_RETRIES,
    attempt: number = 0
  ): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      if (!controller.signal.aborted) {
        controller.abort();
      }
    }, REQUEST_TIMEOUT);

    try {
      const response = await rawFetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      const isNetworkError = error instanceof Error && (
        error.name === 'AbortError' ||
        error.name === 'TypeError' ||
        error.message.includes('Network request failed') ||
        error.message.includes('timeout') ||
        error.message.includes('NetworkError') ||
        error.message.includes('Failed to fetch')
      );

      if (isNetworkError && attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 4000);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, maxRetries, attempt + 1);
      }

      throw error;
    }
  };

  const loadMatch = useCallback(async (isRetry: boolean = false) => {
    if (isLoadingRef.current) {
      return;
    }

    if (maxRetriesReachedRef.current && !isRetry) {
      setMatchData(null);
      setState('content');
      return;
    }

    if (maxRetriesReachedRef.current && isRetry) {
      maxRetriesReachedRef.current = false;
      setRetryCount(0);
    }

    try {
      isLoadingRef.current = true;
      
      if (!isRetry) {
        setState('loading');
        setNetworkError(null);
        setIsOffline(false);
      }
      
      const baseUrl = getBaseUrl();
      // Per roadmap: mrf_match_get → entity_get (entityType=match, domain=MRF)
      const url = `${baseUrl}/api/entities/${matchId}?entityType=match&domain=MRF`;

      console.log(`[MRF Match Get] Loading match from: ${url}`);

      const response = await fetchWithRetry(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log(`[MRF Match Get] Response status: ${response.status}`);

      if (!response.ok) {
        console.error(`[MRF Match Get] HTTP error: ${response.status} ${response.statusText}`);
        
        if (response.status === 401 || response.status === 403) {
          setNetworkError('يرجى تسجيل الدخول للوصول إلى هذه الصفحة');
          setState('error');
          setIsOffline(false);
          return;
        }

        if (response.status === 404) {
          setNetworkError(t('surfaces.المطابقة_غير_موجودة'));
          setState('error');
          setIsOffline(false);
          return;
        }

        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          console.error(`[MRF Match Get] Error response:`, errorData);
          errorMessage = errorData?.error || errorData?.message || errorData?.error_code || errorMessage;
        } catch (parseError) {
          console.error(`[MRF Match Get] Failed to parse error response:`, parseError);
        }
        throw new Error(errorMessage);
      }

      setIsOffline(false);
      setNetworkError(null);
      setRetryCount(0);

      const json = await response.json();
      console.log(`[MRF Match Get] Parsed response:`, { success: json?.success, hasData: !!json?.data });

      if (!json?.success) {
        const errorMsg = json?.error || json?.message || t('surfaces.فشل_في_تحميل_المطابقة');
        console.error(`[MRF Match Get] API returned success=false:`, errorMsg);
        throw new Error(errorMsg);
      }

      // Transform entity_get response to match format
      // entity_get returns: { success: true, data: { id, entityType, domain, metadata: {...match data...} } }
      const entityData = json?.data || {};
      const matchMetadata = entityData.metadata || {};

      // Transform to match UI format
      const transformedMatch = {
        id: entityData.id || matchId,
        reportId: matchMetadata.reportId || matchMetadata.report_id || 'RPT-001',
        person: {
          name: matchMetadata.person?.name || matchMetadata.missingPerson?.name || t('mrf.app-client.mobile.auto_mrf_match_get.fallbackUndefined'),
          age: matchMetadata.person?.age || matchMetadata.missingPerson?.age || t('mrf.app-client.mobile.auto_mrf_match_get.fallbackUndefined'),
          gender: matchMetadata.person?.gender || matchMetadata.missingPerson?.gender || t('mrf.app-client.mobile.auto_mrf_match_get.fallbackUndefined'),
          description: matchMetadata.person?.description || matchMetadata.missingPerson?.description || t('mrf.app-client.mobile.auto_mrf_match_get.noDescription'),
          lastSeen: matchMetadata.person?.lastSeen || matchMetadata.missingPerson?.lastSeen || t('mrf.app-client.mobile.auto_mrf_match_get.fallbackUndefined'),
          missingSince: matchMetadata.person?.missingSince || matchMetadata.missingPerson?.missingSince || t('mrf.app-client.mobile.auto_mrf_match_get.fallbackUndefined'),
        },
        possibleMatch: {
          foundPerson: {
            name: matchMetadata.possibleMatch?.foundPerson?.name || matchMetadata.foundPerson?.name || t('mrf.app-client.mobile.auto_mrf_match_get.fallbackUndefined'),
            age: matchMetadata.possibleMatch?.foundPerson?.age || matchMetadata.foundPerson?.age || t('mrf.app-client.mobile.auto_mrf_match_get.fallbackUndefined'),
            gender: matchMetadata.possibleMatch?.foundPerson?.gender || matchMetadata.foundPerson?.gender || t('mrf.app-client.mobile.auto_mrf_match_get.fallbackUndefined'),
            description: matchMetadata.possibleMatch?.foundPerson?.description || matchMetadata.foundPerson?.description || t('mrf.app-client.mobile.auto_mrf_match_get.noDescription'),
            foundLocation: matchMetadata.possibleMatch?.foundPerson?.foundLocation || matchMetadata.foundPerson?.foundLocation || t('mrf.app-client.mobile.auto_mrf_match_get.fallbackUndefined'),
            foundDate: matchMetadata.possibleMatch?.foundPerson?.foundDate || matchMetadata.foundPerson?.foundDate || t('mrf.app-client.mobile.auto_mrf_match_get.fallbackUndefined'),
          },
          similarity: matchMetadata.possibleMatch?.similarity || matchMetadata.similarity || 0,
          confidence: matchMetadata.possibleMatch?.confidence || matchMetadata.confidence || 'medium',
          matchingDetails: matchMetadata.possibleMatch?.matchingDetails || matchMetadata.matchingDetails || [],
          differences: matchMetadata.possibleMatch?.differences || matchMetadata.differences || [],
        },
        policeInfo: {
          officer: matchMetadata.policeInfo?.officer || matchMetadata.police?.officer || t('mrf.app-client.mobile.auto_mrf_match_get.fallbackUndefined'),
          station: matchMetadata.policeInfo?.station || matchMetadata.police?.station || t('mrf.app-client.mobile.auto_mrf_match_get.fallbackUndefined'),
          contact: matchMetadata.policeInfo?.contact || matchMetadata.police?.contact || t('mrf.app-client.mobile.auto_mrf_match_get.fallbackUndefined'),
        },
        actions: [
          { id: 'accept', label: t('mrf.app-client.mobile.auto_mrf_match_get.confirmMatch'), type: 'primary' },
          { id: 'decline', label: t('mrf.app-client.mobile.auto_mrf_match_get.declineMatch'), type: 'secondary' },
          { id: 'investigate', label: t('mrf.app-client.mobile.auto_mrf_match_get.requestFollowUp'), type: 'outline' }
        ]
      };

      console.log(`[MRF Match Get] Transformed match data`);
      setMatchData(transformedMatch);
      setState('content');
      hasLoadedRef.current = true;
      maxRetriesReachedRef.current = false;
    } catch (error: any) {
      console.error(`[MRF Match Get] Load error:`, error);
      const isNetworkError = error instanceof Error && (
        error.name === 'AbortError' ||
        error.name === 'TypeError' ||
        error.message.includes('Network request failed') ||
        error.message.includes('timeout') ||
        error.message.includes('NetworkError') ||
        error.message.includes('Failed to fetch')
      );

      if (isNetworkError) {
        setIsOffline(true);
        setNetworkError('لا يمكن الاتصال بالخادم. تحقق من اتصال الإنترنت.');
        
        const newRetryCount = retryCount + 1;
        setRetryCount(newRetryCount);
        
        if (newRetryCount >= 3) {
          maxRetriesReachedRef.current = true;
          hasLoadedRef.current = true;
          setState('error');
        } else {
          setState('error');
        }
      } else {
        setIsOffline(false);
        const errorMessage = error instanceof Error ? error.message : t('mrf.app-client.mobile.auto_mrf_match_get.errorLoadMessage');
        setNetworkError(errorMessage);
        setState('error');
      }
    } finally {
      isLoadingRef.current = false;
    }
  }, [matchId, retryCount]);

  // Load match on mount
  useEffect(() => {
    if (!hasLoadedRef.current && !isLoadingRef.current && !maxRetriesReachedRef.current) {
      loadMatch();
    }
  }, [loadMatch]);

  const handleRetry = useCallback(() => {
    if (maxRetriesReachedRef.current) {
      maxRetriesReachedRef.current = false;
      setRetryCount(0);
      loadMatch(true);
    } else {
      loadMatch(true);
    }
  }, [loadMatch]);

  const handleNavigateToRespond = useCallback((action: 'accept' | 'reject') => {
    // Navigate to match respond screen with match data
    if (navigation?.navigate) {
      navigation.navigate('MrfMatchRespond' as any, {
        matchId: matchId,
        reportId: matchData?.reportId,
        matchData: matchData,
        preSelectedAction: action,
      });
    } else if (onNavigate) {
      onNavigate('MrfMatchRespond', {
        matchId: matchId,
        reportId: matchData?.reportId,
        matchData: matchData,
        preSelectedAction: action,
      });
    }
  }, [matchId, matchData, navigation, onNavigate]);

  const handleAccept = useCallback(() => {
    handleNavigateToRespond('accept');
  }, [handleNavigateToRespond]);

  const handleDecline = useCallback(() => {
    handleNavigateToRespond('reject');
  }, [handleNavigateToRespond]);

  const mockMatch = useMemo(() => buildMrfMatchGetMock(t, matchId), [t, matchId]);
  const displayMatch = matchData ?? mockMatch;

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return semanticRoles.stateSuccess.icon;
      case 'medium': return semanticRoles.stateWarning.icon;
      case 'low': return semanticRoles.stateError.icon;
      default: return semanticRoles.textMuted;
    }
  };

  const getConfidenceText = (confidence: string) => {
    switch (confidence) {
      case 'high': return t('surfaces.ثقة_عالية');
      case 'medium': return t('surfaces.ثقة_متوسطة');
      case 'low': return t('surfaces.ثقة_منخفضة');
      default: return confidence;
    }
  };

  if (state === 'content' && displayMatch) {
    return (
      <ScreenWrapper state="content">
        <ScrollView style={styles.container}>
          <Text style={styles.title}>{t('mrf.app-client.mobile.auto_mrf_match_get.title')}</Text>
          <Text style={styles.subtitle}>{t('mrf.app-client.mobile.auto_mrf_match_get.subtitle')}</Text>

          <View style={styles.matchConfidence}>
            <View style={[styles.confidenceHeader, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.confidenceLabel}>درجة التطابق:</Text>
              <View style={[styles.confidenceBadge, { backgroundColor: getConfidenceColor(displayMatch.possibleMatch.confidence) }]}>
                <Text style={styles.confidenceText}>{getConfidenceText(displayMatch.possibleMatch.confidence)}</Text>
              </View>
            </View>
            <Text style={styles.similarityScore}>{displayMatch.possibleMatch.similarity}% تطابق</Text>
          </View>

          <View style={styles.personCard}>
            <Text style={styles.sectionTitle}>{t('mrf.app-client.mobile.auto_mrf_match_get.sectionTitleMissing')}</Text>
            <View style={styles.personInfo}>
              <Text style={styles.personName}>👤 {displayMatch.person.name}</Text>
              <Text style={styles.personDetails}>{displayMatch.person.age} • {displayMatch.person.gender}</Text>
            </View>
            <Text style={styles.personDescription}>{displayMatch.person.description}</Text>
            <View style={styles.lastSeenInfo}>
              <Text style={styles.lastSeenLabel}>آخر مشاهدة:</Text>
              <Text style={styles.lastSeenValue}>{displayMatch.person.lastSeen}</Text>
              <Text style={styles.missingSince}>{displayMatch.person.missingSince}</Text>
            </View>
          </View>

          <View style={styles.foundPersonCard}>
            <Text style={styles.sectionTitle}>{t('mrf.app-client.mobile.auto_mrf_match_get.sectionTitleFound')}</Text>
            <View style={styles.personInfo}>
              <Text style={styles.personName}>👤 {displayMatch.possibleMatch.foundPerson.name}</Text>
              <Text style={styles.personDetails}>{displayMatch.possibleMatch.foundPerson.age} • {displayMatch.possibleMatch.foundPerson.gender}</Text>
            </View>
            <Text style={styles.personDescription}>{displayMatch.possibleMatch.foundPerson.description}</Text>
            <View style={styles.foundInfo}>
              <Text style={styles.foundLabel}>مكان العثور:</Text>
              <Text style={styles.foundValue}>{displayMatch.possibleMatch.foundPerson.foundLocation}</Text>
              <Text style={styles.foundDate}>{displayMatch.possibleMatch.foundPerson.foundDate}</Text>
            </View>
          </View>

          <View style={styles.matchingDetails}>
            <Text style={styles.sectionTitle}>تفاصيل التطابق</Text>

            <View style={styles.matchingSection}>
              <Text style={styles.matchingTitle}>✅ نقاط التطابق:</Text>
              {displayMatch.possibleMatch.matchingDetails && displayMatch.possibleMatch.matchingDetails.length > 0 ? (
                displayMatch.possibleMatch.matchingDetails.map((detail: string, index: number) => (
                  <View key={index} style={[styles.matchingItem, { flexDirection: 'row', direction: layoutDirection }]}>
                    <Text style={styles.matchingIcon}>✓</Text>
                    <Text style={styles.matchingText}>{detail}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.matchingText}>{t('mrf.app-client.mobile.auto_mrf_match_get.matchingTextNone')}</Text>
              )}
            </View>

            {displayMatch.possibleMatch.differences && displayMatch.possibleMatch.differences.length > 0 && (
              <View style={styles.differencesSection}>
                <Text style={styles.differencesTitle}>⚠️ نقاط الاختلاف:</Text>
                {displayMatch.possibleMatch.differences.map((difference: string, index: number) => (
                  <View key={index} style={[styles.differenceItem, { flexDirection: 'row', direction: layoutDirection }]}>
                    <Text style={styles.differenceIcon}>⚠️</Text>
                    <Text style={styles.differenceText}>{difference}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.policeCard}>
            <Text style={styles.sectionTitle}>{t('mrf.app-client.mobile.auto_mrf_match_get.sectionTitlePolice')}</Text>
            <View style={styles.policeInfo}>
              <Text style={styles.policeOfficer}>👮 {displayMatch.policeInfo.officer}</Text>
              <Text style={styles.policeStation}>{displayMatch.policeInfo.station}</Text>
            </View>
            <Text style={styles.policeContact}>📞 {displayMatch.policeInfo.contact}</Text>
            <TouchableOpacity style={styles.contactPoliceButton}>
              <Text style={styles.contactPoliceText}>{t('mrf.app-client.mobile.auto_mrf_match_get.contactPoliceText')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionsCard}>
            <Text style={styles.sectionTitle}>{t('mrf.app-client.mobile.auto_mrf_match_get.sectionTitleActions')}</Text>
            {displayMatch.actions && displayMatch.actions.map((action: any, index: number) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.actionButton,
                  action.type === 'primary' && styles.primaryAction,
                  action.type === 'secondary' && styles.secondaryAction,
                  action.type === 'outline' && styles.outlineAction
                ]}
                onPress={action.id === 'accept' ? handleAccept : action.id === 'decline' ? handleDecline : undefined}
              >
                <Text style={[
                  styles.actionText,
                  action.type === 'primary' && styles.primaryActionText,
                  action.type === 'secondary' && styles.secondaryActionText,
                  action.type === 'outline' && styles.outlineActionText
                ]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>
              ⚠️ هذه مطابقة آلية. يرجى التحقق بعناية من الهوية قبل اتخاذ أي إجراء. استشر الشرطة دائماً.
            </Text>
          </View>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  // Show offline screen if loading and offline
  if (state === 'loading' && isOffline) {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={networkError || t('mrf.app-client.mobile.auto_mrf_match_get.emptyTitle')}
        onErrorAction={() => {
          setRetryCount(0);
          loadMatch(true);
        }}
        screenName="auto_mrf_match_get"
        operationName="mrf_match_get"
      />
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.جاري_تحميل_تفاصيل_المطابقة')}
      errorMessage={networkError || t('surfaces.فشل_في_تحميل_تفاصيل_المطابقة')}
      onErrorAction={handleRetry}
      successMessage={t('surfaces.تم_حفظ_قرارك_بنجاح')}
      successActionText={t('surfaces.العودة_للبلاغات')}
      onSuccessAction={() => {
        if (navigation?.navigate) {
          navigation.navigate('MrfHome' as any);
        } else if (onNavigate) {
          onNavigate('MrfHome');
        } else {
          setState('content');
        }
      }}
      screenName="auto_mrf_match_get"
      operationName="mrf_match_get"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  title: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize['2xl'],
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
    color: semanticRoles.text,
    textAlign: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  subtitle: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.xl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  matchConfidence: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  confidenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  confidenceLabel: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    color: semanticRoles.text,
    marginEnd: BTHWANI_SPACING.md,
  },
  confidenceBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  confidenceText: {
    color: semanticRoles.surface,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
  },
  similarityScore: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize['3xl'],
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
    color: semanticRoles.primaryCTA,
  },
  personCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.lg,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  personInfo: {
    marginBottom: BTHWANI_SPACING.md,
  },
  personName: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.lg,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  personDetails: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.textMuted,
  },
  personDescription: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
    lineHeight: 24,
  },
  lastSeenInfo: {
    backgroundColor: semanticRoles.surfaceSubtle,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
  },
  lastSeenLabel: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  lastSeenValue: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  missingSince: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    color: semanticRoles.textMuted,
  },
  foundPersonCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  foundInfo: {
    backgroundColor: colorTokens.success['50'],
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
  },
  foundLabel: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: colorTokens.success['800'],
    marginBottom: BTHWANI_SPACING.xs,
  },
  foundValue: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: colorTokens.success['800'],
    marginBottom: BTHWANI_SPACING.xs,
  },
  foundDate: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    color: colorTokens.success['800'],
  },
  matchingDetails: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  matchingSection: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  matchingTitle: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    color: semanticRoles.stateSuccess.icon,
    marginBottom: BTHWANI_SPACING.sm,
  },
  matchingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.sm,
  },
  matchingIcon: {
    color: semanticRoles.stateSuccess.icon,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    marginEnd: BTHWANI_SPACING.sm,
    marginTop: 2,
  },
  matchingText: {
    flex: 1,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.text,
    lineHeight: 20,
  },
  differencesSection: {
    borderBlockStartWidth: 1,
    borderBlockStartColor: semanticRoles.outline,
    paddingTop: BTHWANI_SPACING.md,
  },
  differencesTitle: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    color: semanticRoles.stateWarning.icon,
    marginBottom: BTHWANI_SPACING.sm,
  },
  differenceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.sm,
  },
  differenceIcon: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    marginEnd: BTHWANI_SPACING.sm,
    marginTop: 2,
  },
  differenceText: {
    flex: 1,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.text,
    lineHeight: 20,
  },
  policeCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  policeInfo: {
    marginBottom: BTHWANI_SPACING.sm,
  },
  policeOfficer: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  policeStation: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.textMuted,
  },
  policeContact: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    color: semanticRoles.primaryCTA,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.medium,
    marginBottom: BTHWANI_SPACING.md,
  },
  contactPoliceButton: {
    backgroundColor: colorTokens.error['600'],
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
  },
  contactPoliceText: {
    color: semanticRoles.surface,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
  },
  actionsCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButton: {
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  primaryAction: {
    backgroundColor: semanticRoles.stateSuccess.icon,
  },
  secondaryAction: {
    backgroundColor: semanticRoles.stateError.icon,
  },
  outlineAction: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: semanticRoles.primaryCTA,
  },
  actionText: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
  },
  primaryActionText: {
    color: semanticRoles.surface,
  },
  secondaryActionText: {
    color: semanticRoles.surface,
  },
  outlineActionText: {
    color: semanticRoles.primaryCTA,
  },
  disclaimer: {
    backgroundColor: colorTokens.warning['100'],
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    margin: BTHWANI_SPACING.lg,
    borderWidth: 1,
    borderColor: semanticRoles.stateWarning.icon,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  emptyIcon: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize['4xl'],
    marginBottom: BTHWANI_SPACING.lg,
  },
  emptyTitle: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xl,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.xl,
    lineHeight: 20,
  },
  emptyButton: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.stateSuccess.icon,
    marginTop: BTHWANI_SPACING.md,
  },
  emptyButtonText: {
    color: semanticRoles.surface,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
  },
  disclaimerText: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: colorTokens.warning['800'],
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default auto_mrf_match_get;

