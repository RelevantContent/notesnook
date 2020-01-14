import React, {useState} from 'react';
import {View, Text, Platform} from 'react-native';
import {SIZE, WEIGHT} from '../../common/common';
import {Header} from '../../components/header';
import {NotebookItem} from '../../components/NotebookItem';
import {Search} from '../../components/SearchInput';
import {AddTopicDialog} from '../../components/AddTopicDialog';
import * as Animatable from 'react-native-animatable';
import {useAppContext} from '../../provider/useAppContext';
import {useIsFocused} from 'react-navigation-hooks';
import Container from '../../components/Container';

export const Notebook = ({navigation}) => {
  const {colors} = useAppContext();
  const params = navigation.state.params;
  const [hideHeader, setHideHeader] = useState(false);
  const [buttonHide, setButtonHide] = useState(false);
  const [addTopic, setAddTopic] = useState(false);

  let isFocused = useIsFocused();

  if (!isFocused) {
    console.log('block rerender');
    return <></>;
  } else {
    // State

    // Variables
    let offsetY = 0;
    let countUp = 0;
    let countDown = 0;

    // Effects

    // Functions

    // Render
    return (
      <Container
        bottomButtonText="Add new topic"
        bottomButtonOnPress={() => {
          setAddTopic(true);
        }}>
        <AddTopicDialog
          visible={addTopic}
          notebookID={params.notebook.dateCreated}
          close={() => {
            setAddTopic(false);
          }}
        />
        <Animatable.View
          transition="backgroundColor"
          duration={300}
          style={{
            position: 'absolute',
            backgroundColor: colors.bg,
            zIndex: 10,
            width: '100%',
          }}>
          <Header
            hide={hideHeader}
            showSearch={() => {
              setHideHeader(false);
              countUp = 0;
              countDown = 0;
            }}
            colors={colors}
            heading={params.title}
            canGoBack={true}
          />

          <Search placeholder={`Search in ${params.title}`} hide={hideHeader} />
        </Animatable.View>

        <FlatList
          style={{
            width: '100%',
          }}
          data={params.notebook.topics}
          onScroll={event => {
            y = event.nativeEvent.contentOffset.y;
            if (y < 30) setHideHeader(false);
            if (buttonHide) return;
            if (y > offsetY) {
              if (y - offsetY < 150 || countDown > 0) return;
              countDown = 1;
              countUp = 0;
              setHideHeader(true);
            } else {
              if (offsetY - y < 150 || countUp > 0) return;
              countDown = 0;
              countUp = 1;
              setHideHeader(false);
            }
            offsetY = y;
          }}
          ListHeaderComponent={
            <View
              style={{
                marginTop:
                  Platform.OS == 'ios'
                    ? notebooks[0] && !selectionMode
                      ? 135
                      : 135 - 60
                    : notebooks[0] && !selectionMode
                    ? 155
                    : 155 - 60,
              }}
            />
          }
          ListFooterComponent={
            <View
              style={{
                height: 150,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: colors.navbg,
                  fontSize: SIZE.sm,
                  fontFamily: WEIGHT.regular,
                }}>
                - End -
              </Text>
            </View>
          }
          renderItem={({item, index}) => (
            <NotebookItem
              hideMore={params.hideMore}
              isTopic={true}
              noteToMove={params.note}
              notebookID={params.notebook.dateCreated}
              isMove={params.isMove}
              refresh={() => {
                //forceUpdate();
              }}
              item={item}
              index={index}
              colors={colors}
            />
          )}
        />
      </Container>
    );
  }
};

Notebook.navigationOptions = {
  header: null,
};

export default Notebook;
