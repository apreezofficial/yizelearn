// The signed-in session: access and refresh tokens, kept in memory and mirrored to a pluggable storage.
// The app has no secure-storage library installed yet, so the default storage is in memory and a sign-in lasts until
// the app closes. To remember the login, install react-native-keychain and pass an adapter to session.use(), e.g.
//   session.use({get: async () => (await Keychain.getGenericPassword())?.password ?? null,
//                set: v => Keychain.setGenericPassword('yz', v).then(() => {}), remove: () => Keychain.resetGenericPassword().then(() => {})})

export type SessionTokens = {accessToken: string; refreshToken: string; expiresAt: number};

export interface SessionStorage {
  get(): Promise<string | null>;
  set(value: string): Promise<void>;
  remove(): Promise<void>;
}

const memoryStorage = (): SessionStorage => {
  let value: string | null = null;
  return {get: async () => value, set: async v => { value = v; }, remove: async () => { value = null; }};
};

let storage: SessionStorage = memoryStorage();
let tokens: SessionTokens | null = null;
const listeners = new Set<(signedIn: boolean) => void>();

const valid = (t: unknown): t is SessionTokens => !!t && typeof (t as SessionTokens).accessToken === 'string' && typeof (t as SessionTokens).refreshToken === 'string' && typeof (t as SessionTokens).expiresAt === 'number';

export const session = {
  /** Swap the storage (for example to the keychain). Call before restore(). */
  use(next: SessionStorage) { storage = next; },
  /** Load a saved session at app start. Returns the tokens, or null when nobody is signed in. */
  async restore(): Promise<SessionTokens | null> {
    try {
      const raw = await storage.get();
      const parsed = raw ? JSON.parse(raw) : null;
      tokens = valid(parsed) ? parsed : null;
    } catch { tokens = null; }
    return tokens;
  },
  get: () => tokens,
  isSignedIn: () => tokens !== null,
  /** Store tokens from a login, verification or refresh answer. `expiresIn` is in seconds. */
  async set(t: {accessToken: string; refreshToken: string; expiresIn: number}) {
    tokens = {accessToken: t.accessToken, refreshToken: t.refreshToken, expiresAt: Date.now() + t.expiresIn * 1000};
    try { await storage.set(JSON.stringify(tokens)); } catch { /* the session still works until the app closes */ }
    listeners.forEach(fn => fn(true));
  },
  async clear() {
    tokens = null;
    try { await storage.remove(); } catch { /* nothing stored */ }
    listeners.forEach(fn => fn(false));
  },
  /** Called with true on sign-in and false on sign-out or when a refresh fails. */
  subscribe(fn: (signedIn: boolean) => void) { listeners.add(fn); return () => { listeners.delete(fn); }; },
};
