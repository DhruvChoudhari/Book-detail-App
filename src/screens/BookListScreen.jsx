import React from 'react';
import { View, Pressable } from 'react-native';
import Animated, {
  interpolate, withTiming,
  useAnimatedStyle, useSharedValue, useAnimatedScrollHandler, useAnimatedProps,
} from 'react-native-reanimated';
import { useTheme } from '@react-navigation/native';
import { SharedElement } from 'react-navigation-shared-element';
import { AntDesign } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
//HAPTICS IS FORTAP SENSE FEEL when pressing button

import Text from '../components/Text';
import BookList from '../components/BookList';
import { useBooksState } from '../BookStore';

const hello2 = require('../anims/hello2.json');


const LottieViewAnimated = Animated.createAnimatedComponent(LottieView);

// Get morning, afternoon, evening
const getGreeting = () => {
  const hours = (new Date()).getHours();
  if (hours < 12) {
    return 'Good Morning';
  }
  if (hours >= 12 && hours <= 17) {
    return 'Good Afternoon';
  }
  return 'Good Evening';
};

// home screen
function BookListScreen({ navigation }) {
  const {// THESE ARE TAKEN FROM NODE MODULE.
    dark, width, colors, margin, navbar, normalize, ios,
  } = useTheme();
  const HEADER = normalize(400, 400);
  // narmalize(x,y) it sets the heignt ->  x and wdith -> y of header . that is till Good morning part included
  const scrollY = useSharedValue(0);
  const loaded = useSharedValue(0);
  const { books } = useBooksState();

  // fade in screen, slowly if light mode is on
  const onLayout = () => {
    loaded.value = withTiming(1, { duration: dark ? 300 : 600 });
  };

  // scrollview handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset }) => {
      scrollY.value = contentOffset.y;
    },
  });

  // go to search screen
  const searchBooks = () => {
    Haptics.selectionAsync();// IT IS FOR TOUCH FEEL/ VIBRATION GENERATED WhEN PRESSED
    navigation.push('BookSearch', { bookList: books });//for transition to searching page, if we comment it out then it will not be able to type and page will not change
  };

  // all the styles
  const styles = {
    screen: useAnimatedStyle(() => ({
      flex: 1,
      opacity: loaded.value,
      backgroundColor: colors.card,
    })),
    header: useAnimatedStyle(() => ({
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      // paddingTop: navbar,// it sets the paddig of gif
      marginBottom:40,
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'flex-end',
      backgroundColor: colors.background,// sets the backgeound of color to a bit greyish sho that it looks more good
      // height: interpolate(scrollY.value, [-HEADER, 0], [HEADER * 2, HEADER], 'clamp'),
      // elevation: ios ? undefined : interpolate(scrollY.value, [HEADER - navbar, HEADER - navbar + 30], [0, 10], 'clamp'),
      // shadowOpacity: ios ? interpolate(scrollY.value, [HEADER - navbar, HEADER - navbar + 30], [0, 0.75], 'clamp') : undefined,
      // transform: [
      //   { translateY: interpolate(scrollY.value, [0, HEADER - navbar], [0, -HEADER + navbar], 'clamp') },
      // ],
    })),
    // logo: useAnimatedStyle(() => ({
    //   opacity: interpolate(scrollY.value, [0, HEADER - navbar], [1, 0], 'clamp'),
    //   transform: [
    //     { translateY: interpolate(scrollY.value, [-HEADER, 0], [-HEADER / 2, 0], 'clamp') },
    //   ],
    // })),
    lottie: {
      top: 5,
      paddingTop:margin*4,
      height: '98%',
      // width:'100%',
      opacity: dark ? 0.8 : 1,
    },
    lottieProps: useAnimatedProps(() => ({
      speed: 0.5,
      autoPlay: true,
    })),
    welcomeText: useAnimatedStyle(() => ({
      marginTop: margin / 2,
      marginBottom: margin / 2,
      opacity: interpolate(scrollY.value, [0, HEADER - navbar], [1, 0]),
    })),
    searchInput: useAnimatedStyle(() => ({
      borderRadius: 25,
      marginHorizontal: 20,
      paddingHorizontal: margin,
      flexDirection: 'row',// so that search button and type space occurs in same row , not on top and bellow  of one another
      alignItems: 'center',
      backgroundColor: colors.card,
      borderColor: colors.background,
      // marginBottom:-20,//self
      // marginTop:0,
      // padding:5,
      marginBottom: interpolate(scrollY.value, [HEADER - navbar, HEADER - navbar + 30], [-25, 6], 'clamp'),
      height: interpolate(scrollY.value, [HEADER - navbar, HEADER - navbar + 30], [50, 38], 'clamp'),
      width: interpolate(scrollY.value, [HEADER - navbar, HEADER - navbar + 30], [width - margin * 2, width - margin], 'clamp'),
      borderWidth: interpolate(scrollY.value, [HEADER - navbar, HEADER - navbar + 30], [1, 0], 'clamp'),
    })),
    searchIcon: {//DEALS WITH SEARCH OPTION OF MAIN SCREEN
      width: 30,
      opacity: 1,
    },
    searchText: {
      height: 38,
      width: '100%',
      opacity: 0.5,
      lineHeight: 38,
      fontSize: 15,
    },

    scrollView: {// THIS IS TO MAKE SCROLLING POSSIBLE , IF WE REMOVE IT THEN WE COULD NOT SCROLL 
      // AND ELEMENTS OF SCREEN WILL BE ONE OVER ANOTHER , THUS "READING WILL BE COVERED BY 'COMPLETED' AND "WISHLIST WILL BE THERE ALSO""
      paddingTop: HEADER,
    },
  };

  // filter books into their categories
  // const reading = books.filter((b) => b.status === 'Reading');
  // const completed = books.filter((b) => b.status === 'Completed');
  // const wishlist = books.filter((b) => b.status === 'Wishlist');

  // render all the lists
  return (
    <Animated.View onLayout={onLayout} style={styles.screen}>
      <Animated.View style={styles.header}>

        {/* THIS IS FOR THE FIRST ANIMATION THAT IS ABOVE SEARCH BAR */}
        {/* <Animated.View style={styles.logo}> */}
        <Animated.View style={styles.logo}>
          <LottieViewAnimated
            source={hello2}
            speed={15.0}
            style={styles.lottie}
            animatedProps={styles.lottieProps}
            // size={10}
          />
        </Animated.View>

        {/* THIS IS TO SHOW GOOD MORNING MESSAEGE ON HOME SCREEN */}
        <Text animated style={styles.welcomeText} center size={30}>
          {getGreeting()}
        </Text>
        
        {/* THIS IS THE SEARCH SPACE */}
        <Pressable onPress={searchBooks}>
          <SharedElement id="search">
            <Animated.View size={15} style={styles.searchInput}>
              <View style={styles.searchIcon}>
                <AntDesign color={colors.text} name="search1" size={15} />
              </View>
              <Text style={styles.searchText}>Find your next book...</Text>
            </Animated.View>
          </SharedElement>
        </Pressable>
      </Animated.View>

      <Animated.ScrollView
        scrollEventThrottle={1}// dont know its use
        onScroll={scrollHandler}// if we remove it then whole header section that is animation also will glue to top and will not move on scoll
        contentContainerStyle={styles.scrollView}
      >

        {/* IT SHOWS THESE THREE COMPONENTS */}
        {/* <BookList books={reading} title="Reading" />
        <BookList books={completed} title="Completed" />
        <BookList books={wishlist} title="Wishlist" /> */}
      </Animated.ScrollView>
    </Animated.View>
  );
}

export default React.memo(BookListScreen);
