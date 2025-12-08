import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@app/api/client';

// API: DELETE /ramps with body { ids: number[] }
export async function deleteRampsApi(ids: number[]): Promise<unknown> {
  const res = await api.delete('ramps', { json: { ids } });

  // res is a Response-like object from ky
  if (!('ok' in res) || !(res as Response).ok) {
    let parsed: unknown = null;
    try {
      parsed = await (res as Response).json();
    } catch {
      // ignore parse errors
    }

    // extract message safely
    let message = '삭제에 실패했습니다';
    if (parsed && typeof parsed === 'object' && 'message' in parsed) {
      const p = parsed as Record<string, unknown>;
      if (typeof p.message === 'string') message = p.message;
    }

    throw new Error(message);
  }

  try {
    return await (res as Response).json();
  } catch {
    return null;
  }
}

export function useDeleteRamps() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => deleteRampsApi(ids),
    onSuccess: () => {
      // invalidate ramps list so UI refreshes
      qc.invalidateQueries({ queryKey: ['ramps'] });
    },
  });
}

// --- create ramp + presigned upload helpers ---
export type CreateRampDto = {
  district: string;
  type: string;
  address: string;
  tradeName: string;
  width: number;
  latitude: number | null;
  longitude: number | null;
  imagesKeys: string[];
};

export type PresignedResponse = {
  key: string;
  uploadUrl: string;
  publicUrl: string;
  expiresIn: number;
};

// request a presigned URL for a single file
async function requestPresigned(fileName: string, contentType: string): Promise<PresignedResponse> {
  console.debug('[upload] request presigned', { fileName, contentType });
  const res = await api.post('uploads/presigned', { json: { fileName, contentType } });

  if (!('ok' in res) || !(res as Response).ok) {
    let parsed: unknown = null;
    try {
      parsed = await (res as Response).json();
    } catch {
      // ignore
    }
    let message = '업로드용 presigned URL을 가져오지 못했습니다.';
    if (parsed && typeof parsed === 'object' && 'message' in parsed) {
      const p = parsed as Record<string, unknown>;
      if (typeof p.message === 'string') message = p.message;
    }
    throw new Error(message);
  }

  const parsed = (await (res as Response).json()) as PresignedResponse;
  console.debug('[upload] presigned parsed', {
    key: parsed.key,
    uploadUrlPreview: parsed.uploadUrl?.slice(0, 200),
  });
  return parsed;
}

// upload file to presigned PUT URL
async function uploadFileToPresignedUrl(uploadUrl: string, file: File): Promise<void> {
  // Use fetch to PUT directly to S3 presigned URL. Ensure CORS mode and no credentials are sent.
  try {
    console.debug('[upload] PUT', {
      uploadUrl: uploadUrl.slice(0, 200),
      fileName: file.name,
      fileType: file.type,
    });
    const putRes = await fetch(uploadUrl, {
      method: 'PUT',
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
      },
      body: file,
    });

    if (!putRes.ok) {
      let text = '';
      try {
        text = await putRes.text();
      } catch {
        // ignore
      }
      console.error('[upload] PUT failed', {
        status: putRes.status,
        statusText: putRes.statusText,
        bodyPreview: text.slice(0, 500),
      });
      throw new Error(
        `파일 업로드에 실패했습니다. status=${putRes.status} ${putRes.statusText} ${text}`,
      );
    }

    console.debug('[upload] PUT succeeded', { fileName: file.name });
  } catch (_err) {
    console.error('[upload] PUT exception', _err);
    throw _err;
  }
}

// high-level uploader: accept File[] and return array of keys (to send to /ramps)
export async function uploadFilesPresigned(files: File[]): Promise<PresignedResponse[]> {
  if (!files || files.length === 0) return [];

  // perform presign + upload for each file sequentially (easier to debug and avoids client overload)
  const uploads: PresignedResponse[] = [];
  for (const file of files) {
    const presigned = await requestPresigned(file.name, file.type || 'application/octet-stream');
    console.debug('[upload] presigned response', {
      key: presigned.key,
      publicUrl: presigned.publicUrl,
      expiresIn: presigned.expiresIn,
    });
    await uploadFileToPresignedUrl(presigned.uploadUrl, file);
    uploads.push(presigned);
  }

  return uploads;
}

// create ramp api
export async function createRampApi(body: CreateRampDto): Promise<unknown> {
  const res = await api.post('ramps', { json: body });

  if (!('ok' in res) || !(res as Response).ok) {
    let parsed: unknown = null;
    try {
      parsed = await (res as Response).json();
    } catch {
      // ignore parse errors
    }

    // extract message safely
    let message = '경사로 생성에 실패했습니다';
    if (parsed && typeof parsed === 'object' && 'message' in parsed) {
      const p = parsed as Record<string, unknown>;
      if (typeof p.message === 'string') message = p.message;
    }

    throw new Error(message);
  }

  try {
    return await (res as Response).json();
  } catch {
    return null;
  }
}

export function useCreateRamp() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRampDto) => createRampApi(payload),
    onSuccess: () => {
      // invalidate ramps list so UI refreshes
      qc.invalidateQueries({ queryKey: ['ramps'] });
    },
  });
}

// --- Excel upload (bulk) ---
export async function uploadExcelApi(file: File): Promise<unknown> {
  const form = new FormData();
  form.append('file', file);

  const res = await api.post('ramps/upload-excel', { body: form });

  if (!('ok' in res) || !(res as Response).ok) {
    let parsed: unknown = null;
    try {
      parsed = await (res as Response).text();
    } catch {
      // ignore
    }
    throw new Error(
      `엑셀 업로드 실패: ${(res as Response).status} ${(res as Response).statusText} ${String(parsed || '')}`,
    );
  }

  try {
    return await (res as Response).json();
  } catch {
    return null;
  }
}

export function useUploadExcel() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadExcelApi(file),
    onSuccess: () => {
      // invalidate ramps list so UI refreshes
      qc.invalidateQueries({ queryKey: ['ramps'] });
    },
  });
}
