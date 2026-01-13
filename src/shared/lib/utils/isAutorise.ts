import { useLocalStorage } from '@vueuse/core';

export const accessTokenLocalStorage = useLocalStorage <string>('token', null);
export const refreshTokenLocalStorage = useLocalStorage <string>('refreshToken', null);
export const isAuthenticated = computed(() => !!accessTokenLocalStorage.value && !!refreshTokenLocalStorage.value);
