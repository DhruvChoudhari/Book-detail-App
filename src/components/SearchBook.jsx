/* eslint-disable no-nested-ternary */
import React from 'react';
import { View, Image } from 'react-native';
import { SharedElement } from 'react-navigation-shared-element';
import { useTheme } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

import Text from './Text';

// star rating
const Rating = React.memo(({ rating }) => (
  <View style={{ width: 90, flexDirection: 'row', justifyContent: 'space-between' }}>
    {/* these are stars which are from 1 to 5 top to bottom */}
    <FontAwesome size={19} name={rating < 0.5 ? 'star-o' : rating < 0.5 ? 'star-half-o' : 'star'} color="#FFD700" />
    <FontAwesome size={19} name={rating < 1.5 ? 'star-o' : rating < 1.5 ? 'star-half-o' : 'star'} color="#FFD700" />
    <FontAwesome size={19} name={rating < 2.5 ? 'star-o' : rating < 2.5 ? 'star-half-o' : 'star'} color="#FFD700" />
    <FontAwesome size={19} name={rating < 3.5 ? 'star-o' : rating < 3.5 ? 'star-half-o' : 'star'} color="#FFD700" />
    <FontAwesome size={19} name={rating < 4.5 ? 'star-o' : rating < 4.5 ? 'star-half-o' : 'star'} color="#FFD700" />
  </View>
));

// render search screen book
function Book({ book, bookList }) {
  const { margin, colors, normalize } = useTheme();
  const BOOKW = normalize(120, 150);
  const BOOKH = BOOKW * 1.5;
  const item = bookList.find((b) => b.bookId === book.bookId);

  // styles
  const styles = {
    bookBox: {// these are book and its 
      flexDirection: 'row',
      marginBottom: margin * 1.5,
    },
    imgBox: {
      borderRadius: 10,
      shadowRadius: 6,
      shadowOpacity: 0.3,
      shadowOffset: { width: 0, height: 6 },
    },
    bookImg: {
      width: BOOKW,
      height: BOOKH,
      borderRadius: 10,
    },
    bookDetails: {
      flex: 1,// so that text does not flow out of the screen
      justifyContent: 'center',
      paddingLeft: margin * 1.5,
    },
    bookAuthor: {
      marginVertical: margin / 4,
    },
  };

  // render serach book
  return (
    <View style={styles.bookBox}>
      <SharedElement id={book.bookId}>
        <View style={styles.imgBox}>
          {/* it shows book image on search screen  only */}
          <Image style={styles.bookImg} source={{ uri: book.imageUrl }} />
        </View>
      </SharedElement>

      <View style={styles.bookDetails}>
        {item?.status && (
          <Text bold color={colors.primary}>
            {item.status}
          </Text>
        )}
        <Text bold size={17} numberOfLines={2}>
          {/* book title */}
          {book.bookTitleBare}
        </Text>
        <Text style={styles.bookAuthor}>
          {book.author.name}
        </Text>
        <Rating rating={book.avgRating} />
      </View>
    </View>
  );
}

export default React.memo(Book);
