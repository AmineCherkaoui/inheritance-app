export const serializeState = (state) => {
  try {
    const json = JSON.stringify(state);
    return btoa(unescape(encodeURIComponent(json)));
  } catch (e) {
    console.error("Failed to serialize state:", e);
    return "";
  }
};

export const deserializeState = (str) => {
  try {
    const json = decodeURIComponent(escape(atob(str)));
    return JSON.parse(json);
  } catch (e) {
    console.error("Failed to deserialize state:", e);
    return null;
  }
};
