import type { SortOption } from '@/types/ApiTypes';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  total: number;
  sort: SortOption;
  onChangeSort: (v: SortOption) => void;
};

type Anchor = { x: number; y: number; width: number; height: number };

export default function ArticleHeader({ total, sort, onChangeSort }: Props) {
  const { scaleWidth, scaleHeight, scaleFont } = useResponsiveSize();
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null>(null);

  // ✅ TouchableOpacity가 아닌 View에 ref를 달아 측정 (TS2749 방지)
  const sortBtnAnchorRef = useRef<View>(null);

  const sortLabel = useMemo(
    () => (sort === 'createdAt,DESC' ? '최신순' : '오래된순'),
    [sort],
  );

  const openMenu = () => {
    // ✅ 콜백 파라미터에 number 타입 명시 (TS7006 방지)
    sortBtnAnchorRef.current?.measureInWindow(
      (x: number, y: number, width: number, height: number) => {
        setAnchor({ x, y, width, height });
        setOpen(true);
      },
    );
  };

  const menuPos = (() => {
    if (!anchor) return { top: 0, right: 0 };
    const winW = Dimensions.get('window').width;
    const gap = scaleHeight(6);
    const right = Math.max(scaleWidth(8), winW - (anchor.x + anchor.width));
    const top = anchor.y + anchor.height + gap;
    return { top, right };
  })();

  return (
    <View
      style={[
        styles.row,
        {
          paddingHorizontal: scaleWidth(16),
          paddingBottom: scaleHeight(8),
        },
      ]}
    >
      <Text
        style={[
          styles.count,
          {
            fontSize: scaleFont(14),
            fontFamily: 'Pretendard-Medium',
          },
        ]}
      >
        게시글 {total}
      </Text>

      {/* ✅ View로 감싸 ref 부착 */}
      <View ref={sortBtnAnchorRef} collapsable={false}>
        <TouchableOpacity
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.sortRow}
          onPress={openMenu}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.sortText,
              {
                fontSize: scaleFont(13),
              },
            ]}
          >
            {sortLabel}
          </Text>
          <Ionicons
            name="chevron-down"
            size={scaleFont(14)}
            color="#2B1E19"
            style={{ marginLeft: scaleWidth(4) }}
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={[styles.menu, { position: 'absolute', ...menuPos }]}>
            <TouchableOpacity
              style={styles.menuItemWrap}
              onPress={() => {
                onChangeSort('createdAt,DESC');
                setOpen(false);
              }}
            >
              <Text style={styles.menuItem}>최신순</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItemWrap}
              onPress={() => {
                onChangeSort('createdAt,ASC');
                setOpen(false);
              }}
            >
              <Text style={styles.menuItem}>오래된순</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  count: {
    color: '#B7B0AC',
    letterSpacing: -0.2,
  },
  sortText: {
    color: '#2B1E19',
    letterSpacing: -0.2,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  menu: {
    backgroundColor: '#222',
    borderRadius: 12,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    minWidth: 120,
  },
  menuItemWrap: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  menuItem: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});
