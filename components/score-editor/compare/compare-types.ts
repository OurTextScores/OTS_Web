/**
 * Role and side vocabulary shared by every compare module.
 *
 * `CompareScoreRole` ('current' | 'proposal') is score identity and owns editing
 * state. `CompareSide` ('left' | 'right') is visual position and owns DOM refs and
 * scroll state only. Never derive one from the other.
 */
export type { CompareScoreRole } from '@/lib/compare-user-edit-diff';

export type CompareSide = 'left' | 'right';

export type CompareTransportState = {
    isPlaying: boolean;
    isPaused: boolean;
    isBusy: boolean;
};
