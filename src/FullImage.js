import React, {useEffect, useState, useRef} from 'react';
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
import Share from 'react-native-share';
import ViewShot, {captureRef} from 'react-native-view-shot';
import LottieView from 'lottie-react-native';

const FullImage = ({navigation, route}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const {uri} = route.params;
  const ref = useRef();
  const callback = res => {
    console.log('Response: ', res);
  };

  const shareImage = async () => {
    try {
      const uri = await captureRef(ref, {
        format: 'png',
        quality: 1,
      });
      console.log('uri', uri);
      await Share.open({url: uri});
    } catch (e) {
      console.log(e);
    }
  };

  const WallpaperModal = ({isVisible, onBackdropPress}) => {
    const setWallpaper = type => {
      ImagePicker.openCropper({
        path: uri,
        width: 280,
        height: 520,
      }).then(image => {
        console.log(uri, '=====url=========');
        console.log(image.path, '=====res=========');
        ManageWallpaper.setWallpaper({uri: image.path}, callback, type);
      });

      setModalVisible(false);
    };

    return (
      <Modal isVisible={isVisible} onBackdropPress={onBackdropPress}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setWallpaper(TYPE.LOCK)}>
            <Text style={styles.optionText}>Set Lock Screen Wallpaper</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setWallpaper(TYPE.HOME)}>
            <Text style={styles.optionText}>Set Home Screen Wallpaper</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setWallpaper(TYPE.BOTH)}>
            <Text style={styles.optionText}>Set Both Wallpapers</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  // download image
  const checkPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'App needs access to your storage to download Photos',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Once user grant the permission start downloading
        console.log('Storage Permission Granted.');
        downloadImage();
      } else {
        // If permission denied then show alert
        alert('Storage Permission Not Granted');
      }
    } catch (err) {
      // To handle permission related exception
      console.warn(err);
    }
  };

  const downloadImage = () => {
    // Main function to download the image

    // To add the time suffix in filename
    let date = new Date();
    // Image URL which we want to download
    let image_URL = uri;
    // Getting the extention of the file
    let ext = getExtention(image_URL);
    ext = '.' + ext[0];
    // Get config and fs from RNFetchBlob
    // config: To pass the downloading related options
    // fs: Directory path where we want our image to download
    const {config, fs} = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/image_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'Image',
      },
    };
    config(options)
      .fetch('GET', image_URL)
      .then(res => {
        // Showing alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        alert('Image Downloaded Successfully.');
      });
  };

  const getExtention = filename => {
    // To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  return (
    <View style={styles.contaner}>
      <ViewShot
        ref={ref}
        style={{
          flex: 1,
          backgroundColor: 'red',
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}>
        <FastImage source={{uri: uri}} style={styles.fastImage} />
      </ViewShot>
{/* 
<View style={{flex:1, aspectRatio:1}}>

      <LottieView 
      style={{width:200, height:200,flex:1}} 
      onAnimationLoaded={()=> console.log( "==loaded")} 
      onAnimationFailure={(e) => console.log(e, "==error")}
      source={require('../assets/downloadAni.json')} 
      autoPlay
      loop />
</View> */}

      <View style={styles.iconsView}>
        <TouchableOpacity onPress={checkPermission} style={styles.iconStyle}>
          <FastImage
            source={require('../imges/download.png')}
            style={styles.iconImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.iconStyle}>
          <FastImage
            source={require('../imges/gallery.png')}
            style={styles.iconImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={shareImage} style={styles.iconStyle}>
          <FastImage
            source={require('../imges/share.png')}
            style={styles.iconImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <WallpaperModal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
      />
    </View>
  );
};

export default FullImage;

const styles = StyleSheet.create({
  contaner: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  fastImage: {width: '100%', height: '100%', position: 'absolute'},
  iconsView: {
    flexDirection: 'row',
    backgroundColor: 'rgba(66,65,65,1)',
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '90%',
    borderRadius: 10,
    padding: 5,
  },
  iconStyle: {backgroundColor: 'rgba(66,65,65,1)', borderRadius: 20},
  iconImage: {width: width * 0.1, height: 50, resizeMode: 'center'},
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
