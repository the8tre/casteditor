import type { CastTheme } from '../types/asciicast';

type RGB = [number, number, number];

export interface SvgTermTheme {
  0: RGB; 1: RGB; 2: RGB; 3: RGB;
  4: RGB; 5: RGB; 6: RGB; 7: RGB;
  8: RGB; 9: RGB; 10: RGB; 11: RGB;
  12: RGB; 13: RGB; 14: RGB; 15: RGB;
  background: RGB;
  text: RGB;
  bold: RGB;
  cursor: RGB;
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
}

export const THEME_NAMES = [
  'asciinema',
  'catppuccin-latte',
  'catppuccin-frappe',
  'catppuccin-macchiato',
  'catppuccin-mocha',
  'dracula',
  'gruvbox-dark',
  'monokai',
  'nord',
  'solarized-dark',
  'solarized-light',
  'tango',
] as const;

export type ThemeName = typeof THEME_NAMES[number];

const BUILTIN_PLAYER_THEMES = new Set([
  'asciinema', 'dracula', 'gruvbox-dark', 'monokai',
  'nord', 'solarized-dark', 'solarized-light', 'tango',
]);

function cssTheme(name: string, bg: string, fg: string, palette: string): string {
  const colors = palette.split(':');
  const vars = colors.map((c, i) => `  --term-color-${i}: ${c};`).join('\n');
  return `.asciinema-player-theme-${name} {\n  --term-color-background: ${bg};\n  --term-color-foreground: ${fg};\n${vars}\n}`;
}

const CUSTOM_PLAYER_CSS: Partial<Record<ThemeName, string>> = {
  'catppuccin-latte': cssTheme('catppuccin-latte', '#eff1f5', '#4c4f69',
    '#5c5f77:#d20f39:#40a02b:#df8e1d:#1e66f5:#ea76cb:#179299:#acb0be:#6c6f85:#d20f39:#40a02b:#df8e1d:#1e66f5:#ea76cb:#179299:#bcc0cc'),
  'catppuccin-frappe': cssTheme('catppuccin-frappe', '#303446', '#c6d0f5',
    '#51576d:#e78284:#a6d189:#e5c890:#8caaee:#f4b8e4:#81c8be:#b5bfe2:#626880:#e78284:#a6d189:#e5c890:#8caaee:#f4b8e4:#81c8be:#a5adce'),
  'catppuccin-macchiato': cssTheme('catppuccin-macchiato', '#24273a', '#cad3f5',
    '#494d64:#ed8796:#a6da95:#eed49f:#8aadf4:#f5bde6:#8bd5ca:#b8c0e0:#5b6078:#ed8796:#a6da95:#eed49f:#8aadf4:#f5bde6:#8bd5ca:#a5adcb'),
  'catppuccin-mocha': cssTheme('catppuccin-mocha', '#1e1e2e', '#cdd6f4',
    '#45475a:#f38ba8:#a6e3a1:#f9e2af:#89b4fa:#f5c2e7:#94e2d5:#bac2de:#585b70:#f38ba8:#a6e3a1:#f9e2af:#89b4fa:#f5c2e7:#94e2d5:#a6adc8'),
};

export function ensurePlayerTheme(name: string, castTheme?: CastTheme): string {
  if (name === 'default') {
    if (!castTheme) return 'asciinema';
    const id = 'player-theme-custom-cast';
    const existing = document.getElementById(id);
    const css = cssTheme('custom-cast', castTheme.bg, castTheme.fg, castTheme.palette);
    if (existing) {
      existing.textContent = css;
    } else {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = css;
      document.head.appendChild(style);
    }
    return 'custom-cast';
  }
  if (BUILTIN_PLAYER_THEMES.has(name)) return name;
  const id = `player-theme-${name}`;
  if (document.getElementById(id)) return name;
  const css = CUSTOM_PLAYER_CSS[name as ThemeName];
  if (!css) return name;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = css;
  document.head.appendChild(style);
  return name;
}

function hex(h: string): RGB {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

function theme(
  bg: string, fg: string,
  c0: string, c1: string, c2: string, c3: string,
  c4: string, c5: string, c6: string, c7: string,
  c8: string, c9: string, c10: string, c11: string,
  c12: string, c13: string, c14: string, c15: string,
): SvgTermTheme {
  return {
    0: hex(c0), 1: hex(c1), 2: hex(c2), 3: hex(c3),
    4: hex(c4), 5: hex(c5), 6: hex(c6), 7: hex(c7),
    8: hex(c8), 9: hex(c9), 10: hex(c10), 11: hex(c11),
    12: hex(c12), 13: hex(c13), 14: hex(c14), 15: hex(c15),
    background: hex(bg),
    text: hex(fg),
    bold: hex(fg),
    cursor: hex(fg),
    fontSize: 1.67,
    lineHeight: 1.3,
    fontFamily: 'Monaco, Consolas, Menlo, "Bitstream Vera Sans Mono", "PowerlineSymbols", monospace',
  };
}

export const svgTermThemes: Record<ThemeName, SvgTermTheme> = {
  asciinema: theme(
    '#121314', '#cccccc',
    '#000000', '#dd3c69', '#4ebf22', '#ddaf3c',
    '#26b0d7', '#b954e1', '#54e1b9', '#d9d9d9',
    '#4d4d4d', '#dd3c69', '#4ebf22', '#ddaf3c',
    '#26b0d7', '#b954e1', '#54e1b9', '#ffffff',
  ),

  'catppuccin-latte': theme(
    '#eff1f5', '#4c4f69',
    '#5c5f77', '#d20f39', '#40a02b', '#df8e1d',
    '#1e66f5', '#ea76cb', '#179299', '#acb0be',
    '#6c6f85', '#d20f39', '#40a02b', '#df8e1d',
    '#1e66f5', '#ea76cb', '#179299', '#bcc0cc',
  ),

  'catppuccin-frappe': theme(
    '#303446', '#c6d0f5',
    '#51576d', '#e78284', '#a6d189', '#e5c890',
    '#8caaee', '#f4b8e4', '#81c8be', '#b5bfe2',
    '#626880', '#e78284', '#a6d189', '#e5c890',
    '#8caaee', '#f4b8e4', '#81c8be', '#a5adce',
  ),

  'catppuccin-macchiato': theme(
    '#24273a', '#cad3f5',
    '#494d64', '#ed8796', '#a6da95', '#eed49f',
    '#8aadf4', '#f5bde6', '#8bd5ca', '#b8c0e0',
    '#5b6078', '#ed8796', '#a6da95', '#eed49f',
    '#8aadf4', '#f5bde6', '#8bd5ca', '#a5adcb',
  ),

  'catppuccin-mocha': theme(
    '#1e1e2e', '#cdd6f4',
    '#45475a', '#f38ba8', '#a6e3a1', '#f9e2af',
    '#89b4fa', '#f5c2e7', '#94e2d5', '#bac2de',
    '#585b70', '#f38ba8', '#a6e3a1', '#f9e2af',
    '#89b4fa', '#f5c2e7', '#94e2d5', '#a6adc8',
  ),

  dracula: theme(
    '#282a36', '#f8f8f2',
    '#21222c', '#ff5555', '#50fa7b', '#f1fa8c',
    '#bd93f9', '#ff79c6', '#8be9fd', '#f8f8f2',
    '#6272a4', '#ff6e6e', '#69ff94', '#ffffa5',
    '#d6acff', '#ff92df', '#a4ffff', '#ffffff',
  ),

  'gruvbox-dark': theme(
    '#282828', '#fbf1c7',
    '#282828', '#cc241d', '#98971a', '#d79921',
    '#458588', '#b16286', '#689d6a', '#a89984',
    '#7c6f65', '#fb4934', '#b8bb26', '#fabd2f',
    '#83a598', '#d3869b', '#8ec07c', '#fbf1c7',
  ),

  monokai: theme(
    '#272822', '#f8f8f2',
    '#272822', '#f92672', '#a6e22e', '#f4bf75',
    '#66d9ef', '#ae81ff', '#a1efe4', '#f8f8f2',
    '#75715e', '#f92672', '#a6e22e', '#f4bf75',
    '#66d9ef', '#ae81ff', '#a1efe4', '#f9f8f5',
  ),

  nord: theme(
    '#2e3440', '#eceff4',
    '#3b4252', '#bf616a', '#a3be8c', '#ebcb8b',
    '#81a1c1', '#b48ead', '#88c0d0', '#eceff4',
    '#4c566a', '#bf616a', '#a3be8c', '#ebcb8b',
    '#81a1c1', '#b48ead', '#8fbcbb', '#eceff4',
  ),

  'solarized-dark': theme(
    '#002b36', '#839496',
    '#073642', '#dc322f', '#859900', '#b58900',
    '#268bd2', '#d33682', '#2aa198', '#eee8d5',
    '#002b36', '#cb4b16', '#586e75', '#657b83',
    '#839496', '#6c71c4', '#93a1a1', '#fdf6e3',
  ),

  'solarized-light': theme(
    '#fdf6e3', '#657b83',
    '#073642', '#dc322f', '#859900', '#b58900',
    '#268bd2', '#d33682', '#2aa198', '#eee8d5',
    '#002b36', '#cb4b16', '#586e75', '#657c83',
    '#839496', '#6c71c4', '#93a1a1', '#fdf6e3',
  ),

  tango: theme(
    '#121314', '#cccccc',
    '#000000', '#cc0000', '#4e9a06', '#c4a000',
    '#3465a4', '#75507b', '#06989a', '#d3d7cf',
    '#555753', '#ef2929', '#8ae234', '#fce94f',
    '#729fcf', '#ad7fa8', '#34e2e2', '#eeeeec',
  ),
};

function rgbToHex(rgb: RGB): string {
  return '#' + rgb.map(v => v.toString(16).padStart(2, '0')).join('');
}

export function themeToHeader(name: string): CastTheme {
  const t = svgTermThemes[name as ThemeName] ?? svgTermThemes['asciinema'];
  const palette = Array.from({ length: 16 }, (_, i) => rgbToHex(t[i as keyof typeof t] as RGB)).join(':');
  return { fg: rgbToHex(t.text), bg: rgbToHex(t.background), palette };
}

export function headerToThemeName(castTheme: CastTheme | undefined): string {
  if (!castTheme) return 'default';
  for (const name of THEME_NAMES) {
    const h = themeToHeader(name);
    if (h.fg === castTheme.fg && h.bg === castTheme.bg && h.palette === castTheme.palette) {
      return name;
    }
  }
  return 'default';
}

export function castThemeToSvgTerm(castTheme: CastTheme | undefined): SvgTermTheme {
  if (!castTheme) return svgTermThemes['asciinema'];
  const colors = castTheme.palette.split(':');
  const toRgb = (h: string): RGB => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]; };
  return {
    0: toRgb(colors[0] ?? '#000000'), 1: toRgb(colors[1] ?? '#000000'),
    2: toRgb(colors[2] ?? '#000000'), 3: toRgb(colors[3] ?? '#000000'),
    4: toRgb(colors[4] ?? '#000000'), 5: toRgb(colors[5] ?? '#000000'),
    6: toRgb(colors[6] ?? '#000000'), 7: toRgb(colors[7] ?? '#000000'),
    8: toRgb(colors[8] ?? '#000000'), 9: toRgb(colors[9] ?? '#000000'),
    10: toRgb(colors[10] ?? '#000000'), 11: toRgb(colors[11] ?? '#000000'),
    12: toRgb(colors[12] ?? '#000000'), 13: toRgb(colors[13] ?? '#000000'),
    14: toRgb(colors[14] ?? '#000000'), 15: toRgb(colors[15] ?? '#000000'),
    background: toRgb(castTheme.bg),
    text: toRgb(castTheme.fg),
    bold: toRgb(castTheme.fg),
    cursor: toRgb(castTheme.fg),
    fontSize: 1.67,
    lineHeight: 1.3,
    fontFamily: 'Monaco, Consolas, Menlo, "Bitstream Vera Sans Mono", "PowerlineSymbols", monospace',
  };
}
