import { StyleSheet } from 'react-native';

export const theme = {
  fonts: {
    regular: 'KalamehFaNum-Regular',
    bold: 'KalamehFaNum-Bold',
    thin: 'KalamehFaNum-Thin',
    black: 'KalamehFaNum-Black',
  },
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    text: '#000000',
    border: '#E5E5EA',
  },
};

export const globalStyles = StyleSheet.create({
  text: {
    fontFamily: theme.fonts.regular,
  },
  boldText: {
    fontFamily: theme.fonts.bold,
  },
  thinText: {
    fontFamily: theme.fonts.thin,
  },
  blackText: {
    fontFamily: theme.fonts.black,
  },
}); 