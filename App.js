import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import ManageWallpaper, {TYPE} from 'react-native-manage-wallpaper';
import ImageEditor from '@react-native-community/image-editor';
// import ImageCropPicker from 'react-native-image-crop-picker';
import ImagePicker from 'react-native-image-crop-picker';
const {width, height} = Dimensions.get('screen');
import RNFetchBlob from 'rn-fetch-blob';
import FastImage from 'react-native-fast-image';

const App = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [datas, setdats] = useState([]);
  const [photoUrl, setphotoUrl] = useState([]);

  const WallpaperModal = ({isVisible, onBackdropPress}) => {
    const setWallpaper = type => {
  
      console.log(width, '===', height);

      ImagePicker.openCropper({
        path: photoUrl,
        width: 280,
        height: 520,
         }).then(image => {
        console.log(photoUrl, "=====url=========");
        console.log(image.path, "=====res=========");
        ManageWallpaper.setWallpaper(
          { uri: image.path },
          callback,
          type,
        );
      });
  
      setModalVisible(false);
    };

    return (
      <Modal isVisible={isVisible} onBackdropPress={onBackdropPress}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setWallpaper(TYPE.LOCK)}>
            <Text style={styles.optionText}>Set Lock Screen Wallpaper</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => checkPermission()}>
          {/* <TouchableOpacity onPress={() => setWallpaper(TYPE.HOME)}> */}
            <Text style={styles.optionText}>Set Home Screen Wallpaper</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setWallpaper(TYPE.BOTH)}>
            <Text style={styles.optionText}>Set Both Wallpapers</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  const callback = res => {
    console.log('Response: ', res);
  };

  useEffect(() => {
    getWalpep();
  }, []);

  const getWalpep = () => {
    fetch(
      'https://www.googleapis.com/drive/v3/files?q="1cs7fsHIBrVXOEhn_07OD04edXieljuXx"+in+parents&key=AIzaSyBphS8vaXHgqwTHbl0jaIFudSahl2DjQHQ',
    )
      .then(res => res.json())
      .then(res => {
        setdats(res.files);
      })
      .catch(err => {
        console.log(err, '==here data');
      });
  };

  const renderItem = (item, index) => {
    let url = `https://drive.usercontent.google.com/download?id=${item.id}`
    return (
      <TouchableOpacity
        onPress={() => {
          // setModalVisible(true);
          console.log(url, "===============00");
          navigation.navigate("FullImage", {uri :url})
          setphotoUrl(
            url,
          );
        }}
        style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        {item.mimeType == 'image/jpeg' ? (
          <FastImage
            source={{
              uri:url,
            }}
            style={{
              width: width * 0.4,
              height: height * 0.4,
              alignContent: 'center',
              margin: 10,
              borderRadius: 10,
            }}
          />
        ) : null}
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      <FlatList
        numColumns={2}
        data={datas}
        renderItem={({item, index}) => renderItem(item, index)}
        style={{width: '100%', backgroundColor: '#rgba(46,35,17,1)'}}
      />
      <WallpaperModal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}

      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  optionText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default App;
