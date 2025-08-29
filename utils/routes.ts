import type { Href } from 'expo-router';

export const editorHref = (i: number): Href => ({
  pathname: '/post/editor/[index]',
  params: { index: String(i) },
});