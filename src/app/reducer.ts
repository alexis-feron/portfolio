export interface AppState {
  menuOpen: boolean;
  theme?: string;
}

export interface AppAction {
  type: string;
  value?: string;
}

export const initialState: AppState = {
  menuOpen: false,
};

export function reducer(state: AppState, action: AppAction): AppState {
  const { type, value } = action;

  switch (type) {
    case 'setTheme':
      return { ...state, theme: value };
    case 'toggleTheme': {
      const newThemeId = state.theme === 'dark' ? 'light' : 'dark';
      return { ...state, theme: newThemeId };
    }
    case 'toggleMenu':
      return { ...state, menuOpen: !state.menuOpen };
    default:
      throw new Error();
  }
}
