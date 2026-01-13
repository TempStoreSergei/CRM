import { useWebNotification } from '@vueuse/core';

/**
 * Creates a customizable web notification.
 * @param {Object} options - Custom notification options.
 * @returns {Object} - Web notification methods and properties.
 */
export const useCustomWebNotification = (options = {}) => {
  const defaultOptions = {
    title: 'Hello, VueUse world!',
    dir: 'auto',
    lang: 'en',
    renotify: true,
    tag: 'test'
  };

  const {
    isSupported,
    notification,
    show,
    close,
    onClick,
    onShow,
    onError,
    onClose,
    ensurePermissions,
    permissionGranted
  } = useWebNotification({ ...defaultOptions, ...options });

  return {
    isSupported,
    notification,
    show,
    close,
    onClick,
    ensurePermissions,
    permissionGranted,
    onShow,
    onError,
    onClose
  };
};
