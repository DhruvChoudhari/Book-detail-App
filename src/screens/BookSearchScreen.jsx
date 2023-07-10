import React, { useState, useEffect } from 'react';
import {
  View, TextInput, Alert, StyleSheet, Pressable, Keyboard,Image
} from 'react-native';
import Animated, {
  interpolate, Extrapolate, withTiming, useSharedValue, useAnimatedScrollHandler, useAnimatedStyle,
} from 'react-native-reanimated';
import { SharedElement } from 'react-navigation-shared-element';
import { useTheme } from '@react-navigation/native';
import { AntDesign ,FontAwesome5 } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import axios from 'axios';

import Text from '../components/Text';
import Book from '../components/SearchBook';
import { useBooksState } from '../BookStore';
import { setModal } from '../components/StatusModal';

const BookFlip = require('../anims/page_flipping.json');
// Default screen
function BookSearchScreen({ navigation }) {
  const {
    colors, height,width, margin, status, navbar,
  } = useTheme();
  const { books: bookList } = useBooksState();
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const scrollY = useSharedValue(0);
  const loaded = useSharedValue(0);

  // animate on screen load
  const onLayout = () => {// if we remove this then books on search will not be shown
    loaded.value = withTiming(1);
  };

  // scroll handler
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // go back
  const goBack = () => {
    loaded.value = withTiming(0);
    Haptics.selectionAsync();// for vibration
    navigation.goBack();// to go to previous screen which is decided through navigation stack
  };

  // view book details by clicking on book on search page
  const bookDetails = (book) => {
    Haptics.selectionAsync();
    navigation.push('BookDetails', { book });
  };


  // search query
  useEffect(() => {
    if (query.length > 0) {
      axios.get(`https://www.goodreads.com/book/auto_complete?format=json&q=${query}`)
        .then((resp) => {
          const bks = resp.data.map((book) => ({
            ...book,//spreadout method ... basically thorught this book data is used
            imageUrl: book.imageUrl.replace(/_..../, '_SY475_'),//"SY475" basically changes the zoom of image and initially for: Wimpy (search)
            // link will be https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1388183826i/389627._SX50_.jpg , 
            // but by replacing ""SX50" by "SY475" the photo becomes more zoomed thats why its not blurry otherwise zoomed out photo woul be blurry in app
            // new link : https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1388183826i/389627._SY475_.jpg
          }));
          setBooks(bks);
          // console.log("here is the image url ",`${query}`  ," ", bks);
        })
        .catch((error) => {
          Alert.alert('Failed to get books', error);
        });
    }
  }, [query]);

  // Other styles
  const styles = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    sharedElement: {
      flex: 1,
      height: 38,
    },
    search:{
      zIndex: 10,
      height: navbar,
      alignItems: 'flex-end',
      flexDirection: 'row',
      paddingTop: status,
      paddingBottom: 6,
      paddingHorizontal: margin / 2,
      justifyContent: 'space-between',
      backgroundColor: colors.background,
    },
    searchIcon: {
      width: 30,
      opacity: 0.3,
    },
    searchInput: {
      flex: 1,
      height: 38,
      fontSize: 15,
      borderRadius: 20,
      color: colors.text,
      paddingHorizontal: margin,
      backgroundColor: colors.card,
      flexDirection: 'row',
      alignItems: 'center',
    },
    textInput: {
      height: 38,
      width: '100%',
      fontSize: 16,
    },
    saveButton: {
      width: 60,
      height: 38,
      lineHeight: 38,
      textAlign: 'right',
      color: '#000000',
      
    },
    placeholderBox: {
      alignItems: 'center',
      marginTop: margin * 2,
      justifyContent: 'center',
    },
    placeholderImg: {
      opacity: 0.95,
      height: height / 2,
      top:-margin,
      left:-width/70,
      // marginLeft:width/1000,
      // marginBottom: margi,
    },
    placeholderText: {
      fontSize: 18,
      paddingHorizontal: margin * 3,
      top:-margin*5,
    },
    scrollContainer: {
      padding: margin,
    },
  });

  // empty screen placeholders
  // IT SHOWS THE BOOK AND CUP ANIMATION ON SEARCH SCREEN
  const PlaceHolder = () => (
    <View style={styles.placeholderBox}>
      <LottieView
        autoPlay
        loop={true}// so that  anime keeps on repeating itself
        speed={0.5}
        source={BookFlip}// it shows animation
        style={styles.placeholderImg}
      />
      
      {/* <FontAwesome5 name="book-reader" size={150} color="#000"/> */}
      <Text center style={styles.placeholderText}>
        Search by Book title or Author name .
      </Text>

    </View>
  );

  // render search page
  return (
    <View onLayout={onLayout} style={styles.screen}>
      {/* <Animated.View style={anime.search}> */}
      <Animated.View style={styles.search}>
        <SharedElement style={styles.sharedElement} id="search">
          <View size={15} style={styles.searchInput}>
            <View style={styles.searchIcon}>
              <AntDesign color={colors.text} name="search1" size={15} />
            </View>
            <TextInput
              autoFocus
              width="100%"
              value={query}
              autoCorrect={false}
              style={styles.textInput}
              onChangeText={(text) => setQuery(text)}
              placeholder="Book Name"
            />
          </View>
        </SharedElement>
        <Pressable onPress={goBack}>
        <FontAwesome5 name="arrow-alt-circle-left" size={24} color="#000" />
          {/* <Text bold style={styles.saveButton}>Back</Text> */}
        </Pressable>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={1}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContainer}
        // style={anims.scrollView}
      >
        {!books.length && <PlaceHolder />}
        {books.map((book) => (
          <Pressable
            key={book.bookId}
            onPress={() => bookDetails(book)}
            // onLongPress={() => editStatus(book)}
          >
            {/* ************IT SHOWS ALL THE BOOKS IN SEARCH PAGE********************************** */}
            <Book book={book} bookList={bookList} />
          </Pressable>
        ))}
      </Animated.ScrollView>
    </View>
  );
}

export default React.memo(BookSearchScreen);
