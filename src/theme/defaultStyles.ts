import { StyleSheet } from 'react-native';

export const defaultStyles = StyleSheet.create({
  text: {
    fontFamily: 'KalamehFaNum-Regular',
  },
  // این استایل رو به همه Text ها اعمال کنید
  defaultText: {
    fontFamily: 'KalamehFaNum-Regular',
    textAlign: 'right',
  },
  // برای RTL
  container: {
    flex: 1,
    fontFamily: 'KalamehFaNum-Regular',
  },
  rtlContainer: {
    flexDirection: 'row-reverse',
  },
  rtlText: {
    fontFamily: 'KalamehFaNum-Regular',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
}); 