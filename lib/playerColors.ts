/**
 * lib/playerColors.ts
 * 플레이어 색상 팔레트 — 인덱스 기반 일관된 색상 반환
 */

export const PLAYER_COLORS = ["#7C6FE0", "#34C89A", "#E8855A", "#5BAADC"] as const;

/** 플레이어 인덱스로 색상 반환 */
export function getPlayerColor(idx: number): string {
  return PLAYER_COLORS[idx % PLAYER_COLORS.length];
}

/** entityId → 색상 매핑 생성 (컴포넌트 최상단에서 한 번만 계산) */
export function buildColorMap(entityIds: number[]): Record<number, string> {
  return Object.fromEntries(entityIds.map((id, idx) => [id, getPlayerColor(idx)]));
}
