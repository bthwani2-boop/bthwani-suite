/**
 * ESF Filtering & Sorting Utilities
 * §UX-SUPREME-001: Match-only display, distance-based sorting
 * 
 * Rules:
 * - Donors see ONLY requests matching their blood type
 * - Sort by: Distance (closest first) → Priority → Time
 * - Filter by: Blood type match (mandatory), Distance range, Priority
 */

import type { EsfRequest, EsfUserProfile } from '../../../uiTypes';

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Filter requests by blood type match (MANDATORY for donors)
 */
export function filterByBloodType(
  requests: EsfRequest[],
  userBloodType?: string
): EsfRequest[] {
  if (!userBloodType) return requests;
  
  // Donors see ONLY matching blood type requests
  return requests.filter((req) => req.bloodType === userBloodType);
}

/**
 * Filter requests by distance range
 */
export function filterByDistance(
  requests: EsfRequest[],
  userLocation?: { lat: number; lng: number },
  maxDistance: number = 10
): EsfRequest[] {
  if (!userLocation) return requests;

  return requests
    .map((req) => {
      if (!req.locationCoords) return { ...req, distance: undefined };
      
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        req.locationCoords.lat,
        req.locationCoords.lng
      );
      
      return { ...req, distance };
    })
    .filter((req) => req.distance === undefined || req.distance <= maxDistance);
}

/**
 * Sort requests by priority:
 * 1. Distance (closest first)
 * 2. Urgency (critical > high > medium > low)
 * 3. Time (newest first)
 */
export function sortRequests(requests: EsfRequest[]): EsfRequest[] {
  const urgencyOrder: Record<string, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  return [...requests].sort((a, b) => {
    // 1. Distance (closest first)
    if (a.distance !== undefined && b.distance !== undefined) {
      if (a.distance !== b.distance) {
        return a.distance - b.distance;
      }
    } else if (a.distance !== undefined) {
      return -1; // a has distance, b doesn't - a comes first
    } else if (b.distance !== undefined) {
      return 1; // b has distance, a doesn't - b comes first
    }

    // 2. Urgency (higher urgency first)
    const urgencyDiff = urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
    if (urgencyDiff !== 0) return urgencyDiff;

    // 3. Time (newest first) - simplified: assume timestamp is sortable
    return 0; // For now, keep original order if distance and urgency are equal
  });
}

/**
 * Main filter function: Apply all filters and sorting
 */
export function filterAndSortRequests(
  requests: EsfRequest[],
  userProfile: EsfUserProfile,
  mode: 'donor' | 'requester'
): EsfRequest[] {
  let filtered = [...requests];

  // For donors: ONLY show matching blood type
  if (mode === 'donor' && userProfile.bloodType) {
    filtered = filterByBloodType(filtered, userProfile.bloodType);
  }

  // Filter by distance if user location is available
  if (userProfile.location) {
    filtered = filterByDistance(
      filtered,
      userProfile.location,
      userProfile.maxDistance || 10
    );
  }

  // Sort by priority
  filtered = sortRequests(filtered);

  return filtered;
}
