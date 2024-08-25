import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Audio } from "expo-av";

type Track = {
  id: string;
  name: string;
  uri: string;
};

export default function App() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playingTrack, setPlayingTrack] = useState<Track | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    const loadTracks = async () => {
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission required",
            "Please grant permission to access media files."
          );
          return;
        }

        // Adjusted the query to retrieve up to 1000 audio files
        const { assets } = await MediaLibrary.getAssetsAsync({
          mediaType: MediaLibrary.MediaType.audio,
          first: 1000, // Increased the limit to retrieve more files
        });

        console.log(
          "Detected files:",
          assets.map((asset) => asset.uri)
        );

        const trackList = assets.map((asset, index) => ({
          id: index.toString(),
          name: asset.filename,
          uri: asset.uri,
        }));

        setTracks(trackList);
      } catch (error) {
        Alert.alert("Error", "Unable to access media files: " + error.message);
      }
    };

    loadTracks();
  }, []);

  const playPauseTrack = async (track: Track) => {
    if (sound) {
      await sound.unloadAsync();
    }

    if (playingTrack && playingTrack.id === track.id) {
      setPlayingTrack(null);
    } else {
      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: track.uri,
      });
      setSound(newSound);
      await newSound.playAsync();
      setPlayingTrack(track);
    }
  };

  const renderTrackItem = ({ item }: { item: Track }) => (
    <TouchableOpacity
      style={styles.trackItem}
      onPress={() => playPauseTrack(item)}
    >
      <Text style={styles.trackName}>{item.name}</Text>
      {playingTrack && playingTrack.id === item.id && (
        <Text style={styles.playingIndicator}>Playing</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track List</Text>
      <FlatList
        data={tracks}
        renderItem={renderTrackItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  trackItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  trackName: {
    fontSize: 18,
  },
  playingIndicator: {
    fontSize: 18,
    color: "green",
  },
});

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from "react-native";
// import * as MediaLibrary from "expo-media-library";
// import { Audio } from "expo-av";

// // Define a type for the track item
// type Track = {
//   id: string;
//   name: string;
//   uri: string;
// };

// export default function App() {
//   const [tracks, setTracks] = useState<Track[]>([]);
//   const [playingTrack, setPlayingTrack] = useState<Track | null>(null);
//   const [sound, setSound] = useState<Audio.Sound | null>(null);

//   useEffect(() => {
//     // Function to load MP3 files from the media library
//     const loadTracks = async () => {
//       try {
//         // Request permission to access the media library
//         const { status } = await MediaLibrary.requestPermissionsAsync();
//         if (status !== "granted") {
//           Alert.alert(
//             "Permission required",
//             "Please grant permission to access media files."
//           );
//           return;
//         }

//         // Get media assets (audio files)
//         const { assets } = await MediaLibrary.getAssetsAsync({
//           mediaType: MediaLibrary.MediaType.audio,
//         });

//         // Log URIs of detected files for debugging
//         console.log(
//           "Detected files:",
//           assets.map((asset) => asset.uri)
//         );

//         // Map media assets to track list
//         const trackList = assets.map((asset, index) => ({
//           id: index.toString(),
//           name: asset.filename,
//           uri: asset.uri,
//         }));

//         setTracks(trackList);
//       } catch (error) {
//         Alert.alert("Error", "Unable to access media files: " + error.message);
//       }
//     };

//     loadTracks();
//   }, []);

//   const playPauseTrack = async (track: Track) => {
//     // Stop and unload current sound if playing another track
//     if (sound) {
//       await sound.unloadAsync();
//     }

//     if (playingTrack && playingTrack.id === track.id) {
//       // Pause if the same track is clicked again
//       setPlayingTrack(null);
//     } else {
//       // Play the selected track
//       const { sound: newSound } = await Audio.Sound.createAsync({
//         uri: track.uri,
//       });
//       setSound(newSound);
//       await newSound.playAsync();
//       setPlayingTrack(track);
//     }
//   };

//   const renderTrackItem = ({ item }: { item: Track }) => (
//     <TouchableOpacity
//       style={styles.trackItem}
//       onPress={() => playPauseTrack(item)}
//     >
//       <Text style={styles.trackName}>{item.name}</Text>
//       {playingTrack && playingTrack.id === item.id && (
//         <Text style={styles.playingIndicator}>Playing</Text>
//       )}
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Track List</Text>
//       <FlatList
//         data={tracks}
//         renderItem={renderTrackItem}
//         keyExtractor={(item) => item.id}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingTop: 50,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   trackItem: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   trackName: {
//     fontSize: 18,
//   },
//   playingIndicator: {
//     fontSize: 18,
//     color: "green",
//   },
// });

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from "react-native";
// import * as MediaLibrary from "expo-media-library";
// import { Audio } from "expo-av";

// // Define a type for the track item
// type Track = {
//   id: string;
//   name: string;
//   uri: string;
// };

// export default function App() {
//   const [tracks, setTracks] = useState<Track[]>([]);
//   const [playingTrack, setPlayingTrack] = useState<Track | null>(null);
//   const [sound, setSound] = useState<Audio.Sound | null>(null);

//   useEffect(() => {
//     // Function to load MP3 files from the media library
//     const loadTracks = async () => {
//       try {
//         // Request permission to access media library
//         const { status } = await MediaLibrary.requestPermissionsAsync();
//         if (status !== "granted") {
//           Alert.alert(
//             "Permission required",
//             "Please grant permission to access media files."
//           );
//           return;
//         }

//         // Get media assets (audio files)
//         const { assets } = await MediaLibrary.getAssetsAsync({
//           mediaType: MediaLibrary.MediaType.audio,
//         });

//         // Map media assets to track list
//         const trackList = assets.map((asset, index) => ({
//           id: index.toString(),
//           name: asset.filename,
//           uri: asset.uri,
//         }));

//         setTracks(trackList);
//       } catch (error) {
//         Alert.alert("Error", "Unable to access media files: " + error.message);
//       }
//     };

//     loadTracks();
//   }, []);

//   const playPauseTrack = async (track: Track) => {
//     // Stop and unload current sound if playing another track
//     if (sound) {
//       await sound.unloadAsync();
//     }

//     if (playingTrack && playingTrack.id === track.id) {
//       // Pause if the same track is clicked again
//       setPlayingTrack(null);
//     } else {
//       // Play the selected track
//       const { sound: newSound } = await Audio.Sound.createAsync({
//         uri: track.uri,
//       });
//       setSound(newSound);
//       await newSound.playAsync();
//       setPlayingTrack(track);
//     }
//   };

//   const renderTrackItem = ({ item }: { item: Track }) => (
//     <TouchableOpacity
//       style={styles.trackItem}
//       onPress={() => playPauseTrack(item)}
//     >
//       <Text style={styles.trackName}>{item.name}</Text>
//       {playingTrack && playingTrack.id === item.id && (
//         <Text style={styles.playingIndicator}>Playing</Text>
//       )}
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Track List</Text>
//       <FlatList
//         data={tracks}
//         renderItem={renderTrackItem}
//         keyExtractor={(item) => item.id}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingTop: 50,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   trackItem: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   trackName: {
//     fontSize: 18,
//   },
//   playingIndicator: {
//     fontSize: 18,
//     color: "green",
//   },
// });
