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
  'dracula',
  'gruvbox-dark',
  'monokai',
  'nord',
  'solarized-dark',
  'solarized-light',
  'tango',
] as const;

export type ThemeName = typeof THEME_NAMES[number];

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
