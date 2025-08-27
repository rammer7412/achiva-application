// components/icons/EmptyProfileIcon.tsx
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = {
  /** base px size before responsive scaling (both width & height). default: 125 */
  size?: number;
  /** outer circle color. default: '#D9D9D9' */
  bgColor?: string;
  /** face/shoulders color. default: '#FFFFFF' */
  fgColor?: string;
  /** optional shoulders color override. default: fgColor */
  shouldersColor?: string;
};

export default function EmptyProfileIcon({
  size = 125,
  bgColor = '#D9D9D9',
  fgColor = '#FFFFFF',
  shouldersColor,
}: Props) {
  const { scaleWidth, scaleHeight } = useResponsiveSize();
  const shouldersFill = shouldersColor ?? fgColor;

  return (
    <Svg
      width={scaleWidth(size)}
      height={scaleHeight(size)}
      viewBox="0 0 125 125"
      fill="none"
    >
      <Path
        d="M125 62.5C125 97.0178 97.0178 125 62.5 125C27.9822 125 0 97.0178 0 62.5C0 27.9822 27.9822 0 62.5 0C97.0178 0 125 27.9822 125 62.5Z"
        fill={bgColor}
      />
      <Path
        d="M23.0769 111.001C26.4591 94.3557 42.823 81.7308 62.5 81.7308C82.177 81.7308 98.5409 94.3557 101.923 111.001C91.1685 119.753 77.447 125 62.5 125C47.553 125 33.8315 119.753 23.0769 111.001Z"
        fill={shouldersFill}
      />
      <Path
        d="M81.7308 54.0865C81.7308 64.9287 72.9415 73.7179 62.0994 73.7179C51.2572 73.7179 42.4679 64.9287 42.4679 54.0865C42.4679 43.2444 51.2572 34.4551 62.0994 34.4551C72.9415 34.4551 81.7308 43.2444 81.7308 54.0865Z"
        fill={fgColor}
      />
    </Svg>
  );
}
