import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  fonts: {
    ...DefaultTheme.fonts,
    default: {
      fontFamily: 'KalamehFaNum-Regular',
    },
    regular: {
      fontFamily: 'KalamehFaNum-Regular',
    },
    medium: {
      fontFamily: 'KalamehFaNum-Regular',
    },
    light: {
      fontFamily: 'KalamehFaNum-Regular',
    },
    thin: {
      fontFamily: 'KalamehFaNum-Regular',
    }
  },
  // اضافه کردن تنظیمات RTL
  isRTL: true,
  // تنظیمات Typography
  typography: {
    fontFamily: 'KalamehFaNum-Regular',
  }
}; 