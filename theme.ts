'use client';

import { createTheme } from '@mantine/core';

export const theme = createTheme({
  // colorScheme: 'light',
  colors: {
    deepBlue: ['#E9EDFC', '#C1CCF6', '#99ABF0', '', '', '', '', '', '', ''],
    // or replace default theme color
    // blue: ['#E9EDFC', '#C1CCF6', '#99ABF0', '', '', '', '', '', '', ''],
  },

  shadows: {
    xs: '1px 1px 3px rgba(0, 0, 0, .25)',
    sm: '3px 3px 3px rgba(0, 0, 0, .25)',
    md: '5px 5px 5px rgba(0, 0, 0, .25)',
    lg: '7px 7px 7px rgba(0, 0, 0, .25)',
    xl: '10px 10px 10px rgba(0, 0, 0, .25)',
  },

  headings: {
    fontFamily: 'Roboto, sans-serif',
    sizes: {
      h1: { fontSize: '2rem' },
    },
  },
  radius: {
    none: '0',
    xs: '5px',
    sm: '10px',
    md: '15px',
    lg: '20px',
    xl: '25px',
  },
  defaultRadius: 'none',
  spacing: {
    none: '0',
    xs: '5px',
    sm: '10px',
    md: '15px',
    lg: '20px',
    xl: '25px',
  },
});
