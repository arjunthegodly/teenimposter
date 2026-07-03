export function haptic(pattern: number | number[] = 10) {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate(pattern) } catch (_) {}
  }
}

export const haptics = {
  tap:     () => haptic(8),
  confirm: () => haptic([30, 10, 30]),
  success: () => haptic([20, 30, 60]),
  error:   () => haptic([80, 30, 80]),
  flip:    () => haptic(15),
}
