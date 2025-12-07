import ky from 'ky';
import type { Options } from 'ky';
import { useAuthStore } from '@app/stores/authStore';

// separate instance for auth refresh (include cookies)
const authApi = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL,
  credentials: 'include',
  throwHttpErrors: false,
});

const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL,
  credentials: 'include', // include cookies (like axios withCredentials = true)
  headers: {
    'Content-Type': 'application/json',
  },
  throwHttpErrors: false,
  hooks: {
    beforeRequest: [
      (request) => {
        const token = useAuthStore.getState().accessToken;
        // 개발 환경에서만 토큰 존재 여부를 로깅 (실제 토큰 값은 노출하지 않음)
        try {
          // import.meta may not exist in all environments; guard it
          if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
            console.debug('[api] beforeRequest', { url: request.url, hasToken: !!token });
          }
        } catch (e) {
          console.error('[api] beforeRequest', e);
        }

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        // if unauthorized, try refresh once
        if (response.status === 401) {
          try {
            const refreshRes = await authApi.post('auth/refresh');
            const refreshBody = (await refreshRes.json().catch(() => null)) as unknown;
            if (refreshRes.ok) {
              const rb = refreshBody as { token?: string } | null;
              if (rb && rb.token) {
                // save new access token
                useAuthStore.getState().setAccessToken(rb.token);

                // rebuild headers for retry
                const newHeaders = new Headers(options.headers || {});
                newHeaders.set('Authorization', `Bearer ${rb.token}`);

                // rebuild retry options using ky Options type
                const originalOptions = options as unknown as Options | undefined;
                const retryOptions: Options = {
                  ...(originalOptions || {}),
                  headers: newHeaders,
                  throwHttpErrors: false,
                };

                // perform retry using api(url, options)
                return await api(request.url, retryOptions);
              }
            }
          } catch {
            // ignore and fallthrough to return original response
          }
        }

        return response;
      },
    ],
  },
});

export default api;
