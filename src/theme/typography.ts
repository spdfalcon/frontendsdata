import { Platform, TextStyle } from 'react-native';

export const typography = {
  regular: {
    fontFamily: Platform.select({
      ios: 'KalamehFaNum-Regular',
      android: 'KalamehFaNum-Regular',
      default: 'KalamehFaNum-Regular',
    }),
  },
} as const;

export const createTextStyle = (style: TextStyle = {}) => ({
  ...typography.regular,
  ...style,
});

export const textStyles = {
  default: createTextStyle(),
  heading: createTextStyle({
    fontSize: 24,
    fontWeight: 'bold',
  }),
  subheading: createTextStyle({
    fontSize: 20,
  }),
  body: createTextStyle({
    fontSize: 16,
  }),
  small: createTextStyle({
    fontSize: 14,
  }),
}; 