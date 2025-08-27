import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = {
  focused: boolean;
};

export default function MegaphoneIcon({ focused }: Props) {
  const { scaleWidth, scaleHeight } = useResponsiveSize();
  const strokeColor = focused ? '#412A2A' : '#343330';

  return (
    <Svg
      width={scaleWidth(36)}
      height={scaleHeight(36)}
      viewBox="0 0 36 36"
      fill="none"
    >
      <Path
        d="M22.375 10.9375V27.4354C22.3751 27.6152 22.4196 27.7923 22.5045 27.9509C22.5894 28.1095 22.7121 28.2447 22.8617 28.3445L24.3656 29.3467C24.5115 29.4439 24.6786 29.5047 24.8529 29.5239C25.0272 29.543 25.2035 29.52 25.367 29.4567C25.5305 29.3935 25.6764 29.2918 25.7924 29.1604C25.9085 29.0289 25.9912 28.8715 26.0336 28.7014L27.8438 21.875"
        stroke={strokeColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.96875 27.3436C5.9688 27.5519 6.02833 27.7558 6.14033 27.9315C6.25233 28.1071 6.41216 28.2471 6.601 28.335C6.78985 28.4228 6.99986 28.455 7.20635 28.4276C7.41284 28.4002 7.60721 28.3144 7.7666 28.1803C14.9307 22.1702 22.375 21.8748 22.375 21.8748H27.8438C29.2942 21.8748 30.6852 21.2987 31.7107 20.2731C32.7363 19.2475 33.3125 17.8565 33.3125 16.4061C33.3125 14.9557 32.7363 13.5647 31.7107 12.5391C30.6852 11.5135 29.2942 10.9373 27.8438 10.9373H22.375C22.375 10.9373 14.9307 10.642 7.7666 4.63324C7.6073 4.49922 7.41305 4.41346 7.20669 4.38601C7.00032 4.35857 6.79042 4.39059 6.60162 4.47831C6.41282 4.56603 6.25299 4.70581 6.14088 4.88123C6.02877 5.05664 5.96906 5.26041 5.96875 5.46859V27.3436Z"
        stroke={strokeColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
