# React Native View Image
React Native Image and Video Viewing component Library for IOS and Android. With this component, you can view multiple images and videos and slide through them. 

Support for Expo managed, Expo bare, and React Native CLI.

- 🔥Pinch zoom for both iOS and Android
- 🔥Double tap to zoom for both iOS and Android
- 🔥Supports swipe-to-close animation
- 🔥Custom header and footer components
- 🔥Video on the slide
- 🔥Uses VirtualizedList to optimize image loading and rendering

### View demo here 

https://youtu.be/lTKgSrqjMZ4

## Installation

```bash
yarn add @leafletui/react-native-view-image
```

or

```bash
npm i @leafletui/react-native-view-image
```

```js
import ImageView from "@leafletui/react-native-view-image";

const ViewImage = () => {

  const [open, setOpen] = React.useState(false);

const openImages = [
  { 
    uri: "https://images.unsplash.com/photo-1601824772624-9375c6f20701?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fHNwbGFzaHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
  }
  
  ];

return (
<ImageView
  images={openImages}
  imageIndex={0}
  visible={open}
  onRequestClose={() => setOpen(false)}
  navigateToVideo={navigateToVideo}
/>
  )
};
```
