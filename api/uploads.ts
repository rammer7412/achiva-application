import { httpGet } from '@/utils/http';

export type PresignedPair = { uploadUrl: string; accessUrl: string };

export async function getProfilePresignedUrl(contentType: string): Promise<PresignedPair> {
  const res = await httpGet<Partial<PresignedPair & { url?: string }>>(
    '/api/members/presigned-url',
    { params: { contentType } }
  );
  const d = res?.data ?? {};
  const uploadUrl = d.uploadUrl ?? d.url;
  const accessUrl = d.accessUrl ?? (d.url ? d.url.split('?')[0] : undefined);
  if (!uploadUrl || !accessUrl) throw new Error('presigned URL 응답 누락');
  return { uploadUrl, accessUrl };
}

export async function uploadToS3(uploadUrl: string, fileUri: string, contentType: string): Promise<void> {
  const blob = await (await fetch(fileUri)).blob();
  const put = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: blob,
  });
  if (!put.ok) throw new Error(`S3 업로드 실패: ${put.status}`);
}
