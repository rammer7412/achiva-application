import type { SortOption } from '@/types/ApiTypes';
import { useResponsiveSize } from '@/utils/ResponsiveSize';
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
    <View style={[styles.row]}>
      <Text style={[styles.count, { fontSize: scaleFont(14) }]}>게시글 {total}</Text>

      <TouchableOpacity
        style={[styles.sortBtn, { paddingHorizontal: scaleWidth(8), paddingVertical: scaleHeight(6) }]}
        onPress={() => setOpen(true)}
      >
        <Text style={{ fontSize: scaleFont(13) }}>{sortLabel} ▾</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={[styles.menu]}>
            <TouchableOpacity onPress={() => { onChangeSort('createdAt,DESC'); setOpen(false); }}>
              <Text style={styles.menuItem}>최신순</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { onChangeSort('createdAt,ASC'); setOpen(false); }}>
              <Text style={styles.menuItem}>오래된순</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  count: { color: '#CFCFCF' },
  sortBtn: { borderRadius: 8, backgroundColor: '#2B2B2B' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-start' },
  menu: { marginTop: 80, marginHorizontal: 16, backgroundColor: '#222', borderRadius: 12, padding: 8 },
  menuItem: { color: 'white', paddingVertical: 10, paddingHorizontal: 8, fontSize: 14 },
});
