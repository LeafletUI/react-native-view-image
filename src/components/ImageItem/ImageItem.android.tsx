
import React, { useState, useCallback } from "react";

import {
  Animated,
  Dimensions,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Image, View, TouchableOpacity, Pressable
} from "react-native";

import useImageDimensions from "../../hooks/useImageDimensions";
import usePanResponder from "../../hooks/usePanResponder";

import { getImageStyles, getImageTransform } from "../../utils";
import { ImageSource } from "../../@types";
import { ImageLoading } from "./ImageLoading";

const SWIPE_CLOSE_OFFSET = 75;
const SWIPE_CLOSE_VELOCITY = 1.75;
const SCREEN = Dimensions.get("window");
const SCREEN_WIDTH = SCREEN.width;
const SCREEN_HEIGHT = SCREEN.height;

type Props = {
  navigateToVideo: (source: ImageSource) => void;
  imageSrc: ImageSource;
  onRequestClose: () => void;
  onZoom: (isZoomed: boolean) => void;
  onLongPress: (image: ImageSource) => void;
  delayLongPress: number;
  swipeToCloseEnabled?: boolean;
  doubleTapToZoomEnabled?: boolean;
};

const ImageItem = ({
  navigateToVideo,
  imageSrc,
  onZoom,
  onRequestClose,
  onLongPress,
  delayLongPress,
  swipeToCloseEnabled = true,
  doubleTapToZoomEnabled = true,
}: Props) => {
  const imageContainer = React.createRef<any>();
  const imageDimensions = useImageDimensions(imageSrc);
  const [translate, scale] = getImageTransform(imageDimensions, SCREEN);
  const scrollValueY = new Animated.Value(0);
  const [isLoaded, setLoadEnd] = useState(false);

  const onLoaded = useCallback(() => setLoadEnd(true), []);
  const onZoomPerformed = (isZoomed: boolean) => {
    onZoom(isZoomed);
    if (imageContainer?.current) {
      // @ts-ignore
      imageContainer.current.setNativeProps({
        scrollEnabled: !isZoomed,
      });
    }
  };

  const onLongPressHandler = useCallback(() => {
    onLongPress(imageSrc);
  }, [imageSrc, onLongPress]);

  const [panHandlers, scaleValue, translateValue] = usePanResponder({
    initialScale: scale || 1,
    initialTranslate: translate || { x: 0, y: 0 },
    onZoom: onZoomPerformed,
    doubleTapToZoomEnabled,
    onLongPress: onLongPressHandler,
    delayLongPress,
  });

  const imagesStyles = getImageStyles(
    imageDimensions,
    translateValue,
    scaleValue
  );
  const imageOpacity = scrollValueY.interpolate({
    inputRange: [-SWIPE_CLOSE_OFFSET, 0, SWIPE_CLOSE_OFFSET],
    outputRange: [0.7, 1, 0.7],
  });
  const imageStylesWithOpacity = { ...imagesStyles, opacity: imageOpacity };

  const onScrollEndDrag = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const velocityY = nativeEvent?.velocity?.y ?? 0;
    const offsetY = nativeEvent?.contentOffset?.y ?? 0;

    if (
      (Math.abs(velocityY) > SWIPE_CLOSE_VELOCITY &&
        offsetY > SWIPE_CLOSE_OFFSET) ||
      offsetY > SCREEN_HEIGHT / 2
    ) {
      onRequestClose();
    }
  };

  const onScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = nativeEvent?.contentOffset?.y ?? 0;

    scrollValueY.setValue(offsetY);
  };

  return (
    <View>
      <Animated.ScrollView
        ref={imageContainer}
        style={styles.listItem}
        pagingEnabled
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.imageScrollContainer}
        scrollEnabled={swipeToCloseEnabled}
        {...(swipeToCloseEnabled && {
          onScroll,
          onScrollEndDrag,
        })}
      >
        {(!isLoaded || !imageDimensions) && <ImageLoading />}
        <Pressable style={{
          flex: 1,
          margin: 2,
        }} onPress={() => imageSrc.type === "video" ? navigateToVideo(imageSrc.videoUrl) : null}>
          <Animated.Image
            {...panHandlers}
            source={imageSrc}
            style={imageStylesWithOpacity}
            onLoad={onLoaded}
          />
          {imageSrc.type === "video" ? (
            <View
              style={{
                position: "absolute",
                top: "50%",
                left: "47%",
                alignItems: "center",
                justifyContent: "center",
                transform: [{ translateX: -20 }, { translateY: -20 }],
                borderRadius: 5000,
                borderWidth: 4,
                borderColor: "#fff",
                width: 50,
                height: 50,
              }}
            >
              {/* <Icon source={{ uri: "https://www.coollockers.co.uk/wp-content/uploads/2020/04/play-icon.png" }} size={50} /> */}
              <Image
                source={{ uri: "https://www.coollockers.co.uk/wp-content/uploads/2020/04/play-icon.png" }}
                style={[{ width: 50, height: 50, borderWidth: 0 }, {}]}
                resizeMode={"contain"}
              />
            </View>
          ) : null}
        </Pressable>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  imageScrollContainer: {
    height: SCREEN_HEIGHT,
  },
});

export default React.memo(ImageItem);
