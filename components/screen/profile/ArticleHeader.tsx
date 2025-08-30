import type { SortOption } from '@/types/ApiTypes';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  total: number;
  sort: SortOption;
  onChangeSort: (v: SortOption) => void;
};

export default function ArticleHeader({ total, sort, onChangeSort }: Props) {
  const { scaleWidth, scaleHeight, scaleFont } = useResponsiveSize();
  const [open, setOpen] = useState(false);

  const sortLabel = useMemo(
    () => (sort === 'createdAt,DESC' ? '최신순' : '오래된순'),
    [sort],
  );

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

      <TouchableOpacity
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={styles.sortRow}
        onPress={() => setOpen(true)}
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

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={[styles.menu]}>
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
    justifyContent: 'flex-start',
  },
  menu: {
    marginTop: 80,
    marginHorizontal: 16,
    backgroundColor: '#222',
    borderRadius: 12,
    paddingVertical: 4,
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
