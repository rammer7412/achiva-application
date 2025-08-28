// @/components/space/CategorySpace.tsx
import CategoryBox from '@/components/boxes/CategoryBox';
import PencilSimple from '@/components/icons/PencilSimple';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type Props = {
  selected: string[];
  suggestions?: string[];
  editable?: boolean;
  onToggle: (label: string, nextSelected: boolean) => void;
  onPressEdit?: () => void;  // 연필로 편집 모드 토글 (부모에서 state 토글)
  placeholder?: string;
  size?: 'sm' | 'md';
  maxSelected?: number;
  minSelected?: number;
  onMaxReached?: () => void;
};

export default function CategorySpace({
  selected,
  suggestions = [],
  editable = false,
  onToggle,
  onPressEdit,
  placeholder = '관심 카테고리를 선택해 주세요.',
  size = 'sm',
}: Props) {
  const { scaleWidth, scaleHeight, scaleFont } = useResponsiveSize();
  const gap = scaleWidth(8);

  return (
    <View
      style={{
        backgroundColor: '#F2F0EF',
        borderRadius: 10,
        paddingHorizontal: scaleWidth(12),
        paddingVertical: scaleHeight(12),
      }}
    >
      {/* 상단: 선택된 카테고리 + 연필 */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          {selected.length ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>
              {selected.map((label) => (
                <CategoryBox
                  key={`sel-${label}`}
                  label={label}
                  selected
                  editable={editable}                 // 편집 중에만 X 노출
                  // ▼ 텍스트 탭으로는 해제 불가, 오직 X 클릭으로만 제거
                  onRemove={() => onToggle(label, false)}
                  size={size}
                />
              ))}
            </View>
          ) : (
            <Text style={{ color: '#8D7B77', fontSize: scaleFont(13) }}>{placeholder}</Text>
          )}
        </View>

        {/* 연필 아이콘: 부모에서 편집 모드 토글 처리 */}
        <TouchableOpacity
          onPress={onPressEdit}
          accessibilityLabel="카테고리 편집"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ marginLeft: scaleWidth(8), marginTop: scaleHeight(2) }}
        >
          <PencilSimple focused={false} />
        </TouchableOpacity>
      </View>

      {/* 편집 모드일 때만 전체 후보 노출 (여기서는 탭으로 '추가'만 가능) */}
      {editable && suggestions.length > 0 && (
        <View style={{ marginTop: scaleHeight(10) }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>
            {suggestions.map((label) => (
              <CategoryBox
                key={`sug-${label}`}
                label={label}
                selected={false}
                editable={true}                       // 편집 중에는 탭으로 추가 허용
                onToggle={(next) => next && onToggle(label, true)} // 추가만
                size={size}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
