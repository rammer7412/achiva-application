import { Dimensions, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BASE_WIDTH = 430; // iPhone 15 Pro Max 기준
const BASE_HEIGHT = 932;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function getResponsiveWidth(px: number) {
  return (SCREEN_WIDTH / BASE_WIDTH) * px;
}

export function useResponsiveSize() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const safeHeight = height - insets.top - insets.bottom;

  const scaleWidth = (size: number) => (width / BASE_WIDTH) * size;
  const scaleHeight = (size: number) => (safeHeight / BASE_HEIGHT) * size;
  const scaleFont = (size: number) =>
    Math.sqrt(width * safeHeight) / Math.sqrt(BASE_WIDTH * BASE_HEIGHT) * size;
  const smartScale = (base: number, max: number) => {
    return Math.min(scaleWidth(base), max);
  };
  return {
    scaleWidth,
    scaleHeight,
    scaleFont,
    smartScale,
    safeArea: insets,
    usableHeight: safeHeight,
    usableWidth: width,
  };
}
