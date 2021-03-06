import getStorage from './storage';

const storage = getStorage();

export const getAccessToken = () => storage.getItem('2tons-token');

// returns true/false if token was set or already existing
export const setAccessToken = (token) => {
  const current = getAccessToken();
  if (token && current !== token) {
    storage.removeItem('2tons-token');
    storage.setItem('2tons-token', token);
    return true;
  }
  return false;
};

export const logout = () => {
  storage.clear();
};
