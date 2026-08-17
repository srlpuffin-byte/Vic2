export interface CustomPhotosMap {
  [key: string]: string; // key -> base64 dataUrl or image url
}

const STORAGE_KEY = 'vic_custom_photos_map';

export const CustomPhotoStorage = {
  getPhotos: (): CustomPhotosMap => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading custom photos from localStorage', e);
    }
    return {};
  },

  getPhoto: (id: string, fallbackUrl: string): string => {
    try {
      const photos = CustomPhotoStorage.getPhotos();
      if (photos[id]) {
        return photos[id];
      }
    } catch {
      // fallback
    }
    return fallbackUrl;
  },

  savePhoto: (id: string, dataUrl: string): void => {
    try {
      const current = CustomPhotoStorage.getPhotos();
      current[id] = dataUrl;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      window.dispatchEvent(new Event('vic_custom_photos_updated'));
    } catch (e) {
      console.error('Error saving custom photo', e);
    }
  },

  removePhoto: (id: string): void => {
    try {
      const current = CustomPhotoStorage.getPhotos();
      delete current[id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      window.dispatchEvent(new Event('vic_custom_photos_updated'));
    } catch (e) {
      console.error('Error deleting custom photo', e);
    }
  },

  resetAll: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event('vic_custom_photos_updated'));
    } catch (e) {
      console.error('Error resetting custom photos', e);
    }
  }
};
