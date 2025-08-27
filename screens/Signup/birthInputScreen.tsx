import ConfirmButton from '@/components/buttons/ConfirmButton';
import HeaderWithBack from '@/components/HeaderWithBack';
import ScreenContainer from '@/components/ScreenContainer';
import NoticeMessageTitle from '@/components/text/NoticeMessageTitle';
import { useUserSignupStore } from '@/stores/useUserSignupStore';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, View } from 'react-native';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export default function BirthInputScreen() {
  const router = useRouter();
  const { setBirth } = useUserSignupStore();
  const { scaleWidth, scaleHeight } = useResponsiveSize();

  const [year, setYear] = useState(currentYear - 20);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);

  const days = Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1);

  const handlePress = () => {
    const birthStr = `${year}-${month.toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`;
    setBirth(birthStr);
    router.push('/usernameinput');
  };

  return (
    <ScreenContainer>
      <View
        style={{
          flex: 1,
          paddingHorizontal: scaleWidth(24),
          backgroundColor: '#fff',
        }}
      >
        <HeaderWithBack total={6} current={4} />

        <NoticeMessageTitle
          message="생일을 입력해주세요"
          subtitle="연령 확인은 계정 보호 및 서비스 이용을 위한 절차이며, 입력하신 생년월일은 다른 사용자에게 공개되지 않습니다."
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Picker
            selectedValue={year}
            onValueChange={(itemValue) => setYear(itemValue)}
            style={{
              flex: 1,
              height: Platform.OS === 'ios' ? scaleHeight(180) : scaleHeight(150),
            }}
          >
            {years.map((y) => (
              <Picker.Item key={y} label={`${y}년`} value={y} />
            ))}
          </Picker>

          <Picker
            selectedValue={month}
            onValueChange={(itemValue) => setMonth(itemValue)}
            style={{
              flex: 1,
              height: Platform.OS === 'ios' ? scaleHeight(180) : scaleHeight(150),
            }}
          >
            {months.map((m) => (
              <Picker.Item key={m} label={`${m}월`} value={m} />
            ))}
          </Picker>

          <Picker
            selectedValue={day}
            onValueChange={(itemValue) => setDay(itemValue)}
            style={{
              flex: 1,
              height: Platform.OS === 'ios' ? scaleHeight(180) : scaleHeight(150),
            }}
          >
            {days.map((d) => (
              <Picker.Item key={d} label={`${d}일`} value={d} />
            ))}
          </Picker>
        </View>

        <View style={{ marginTop: scaleHeight(48) }}>
          <ConfirmButton text="다음" onPress={handlePress} />
        </View>
      </View>
    </ScreenContainer>
  );
}
