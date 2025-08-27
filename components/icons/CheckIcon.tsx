// components/icons/CheckIcon.tsx
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = {
  focused?: boolean;
  /** base px size before responsive scaling (both width & height). default: 30 */
  size?: number;
};

export default function CheckIcon({ focused = false, size = 30 }: Props) {
  const { scaleWidth, scaleHeight } = useResponsiveSize();

  return (
    <Svg
      width={scaleWidth(size)}
      height={scaleHeight(size)}
      viewBox="0 0 30 30"
      fill="none"
    >
      <Path
        d="M27.2446 9.43271L12.2446 24.4327C12.114 24.5638 11.9587 24.6678 11.7878 24.7388C11.6169 24.8098 11.4336 24.8463 11.2485 24.8463C11.0634 24.8463 10.8802 24.8098 10.7093 24.7388C10.5383 24.6678 10.3831 24.5638 10.2524 24.4327L3.68994 17.8702C3.55913 17.7394 3.45537 17.5841 3.38457 17.4132C3.31378 17.2423 3.27734 17.0591 3.27734 16.8741C3.27734 16.6891 3.31378 16.5059 3.38457 16.335C3.45537 16.1641 3.55913 16.0088 3.68994 15.878C3.82075 15.7472 3.97604 15.6435 4.14695 15.5727C4.31786 15.5019 4.50104 15.4654 4.68603 15.4654C4.87102 15.4654 5.05421 15.5019 5.22512 15.5727C5.39603 15.6435 5.55132 15.7472 5.68213 15.878L11.2497 21.4456L25.2548 7.44287C25.519 7.17869 25.8773 7.03027 26.2509 7.03027C26.6245 7.03027 26.9828 7.17869 27.247 7.44287C27.5111 7.70705 27.6596 8.06536 27.6596 8.43896C27.6596 8.81257 27.5111 9.17088 27.247 9.43506L27.2446 9.43271Z"
        fill={focused ? '#412A2A' : '#B3B3B3'}
      />
    </Svg>
  );
}
