'use client';

import { createTheme } from '@mantine/core';

export const theme = createTheme({
  // colorScheme: 'light',
  colors: {
    white: [
      '#ffffff',
      '#fdfdff',
      '#fcfcff',
      '#fbfbff',
      '#fafaff',
      '#f9f9ff',
      '#f8f8ff',
      '#f7f7ff',
      '#f6f6ff',
      '#f5f5ff',
    ],
    deepBlue: ['#E9EDFC', '#C1CCF6', '#99ABF0', '', '', '', '', '', '', ''],
    // or replace default theme color
    // blue: ['#E9EDFC', '#C1CCF6', '#99ABF0', '', '', '', '', '', '', ''],
  },
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
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
  activeClassName: "",
  components: {
    Button: {
      styles: {
        root: { ":active": { transform: "none" }, },
      },
    },
  }
});