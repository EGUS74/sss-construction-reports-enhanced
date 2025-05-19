// 🔧 MOCK FIREBASE (for local demo only)

export const auth = {
    currentUser: null,
  };
  
  export const db = {
    collection: () => ({
      doc: () => ({
        get: async () => ({ exists: false }),
      }),
    }),
  };
  
  export const storage = {
    ref: () => ({
      put: async () => null,
    }),
  };
  