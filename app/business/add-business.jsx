import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  Alert,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { Colors } from "../../constants/Colors";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { collection, doc, getDocs, query, setDoc } from "firebase/firestore";
import { db } from "../../configs/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";

export default function AddBusiness() {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const { user } = useUser();

  const [name, setName] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [website, setWebsite] = useState();
  const [address, setAddress] = useState();
  const [about, setAbout] = useState();
  const [category, setCategory] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Add New Business",
      headerShown: true,
      headerBackTitle: "Profile",
    });
    GetCategoryList();
  }, []);

  const onImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      setImage(uri);

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setImageBase64(base64);
    }
  };

  const GetCategoryList = async () => {
    try {
      const q = query(collection(db, "Category"));
      const snapShot = await getDocs(q);
      const categories = snapShot.docs.map((doc) => {
        const data = doc.data();
        return {
          label: data.name,
          value: data.name,
        };
      });
      setCategoryList(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const onAddNewBusiness = async () => {
    try {
      setLoading(true);
      await saveBusinessDetail(imageBase64);
    } catch (error) {
      console.error("Error saving:", error);
      Alert.alert("Error", "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMessageIOS = () => {
    Alert.alert(
      "Success!",
      "New Business Added!",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: true }
    );
  };

  const saveBusinessDetail = async (imageString) => {
    await setDoc(doc(db, "BusinessList", Date.now().toString()), {
      name: name,
      phoneNumber: phoneNumber,
      website: website,
      address: address,
      about: about,
      category: category,
      username: user?.fullName,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      userImage: user?.imageUrl,
      imageBase64: imageString,
    });

    if (Platform.OS === "android") {
      ToastAndroid.show("New Business Added!", ToastAndroid.LONG);
    } else {
      showSuccessMessageIOS();
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontFamily: "outfit-bold", fontSize: 25 }}>
        Add New Business
      </Text>
      <Text style={{ fontFamily: "outfit", color: Colors.GRAY }}>
        Fill all details in order to add new business
      </Text>

      <TouchableOpacity
        style={{ marginTop: 20, marginRight: 240 }}
        onPress={() => onImagePick()}>
        {!image ? (
          <Image
            source={require("./../../assets/images/placeholder.png")}
            style={{ width: 100, height: 100 }}
          />
        ) : (
          <Image
            source={{ uri: image }}
            style={{ width: 100, height: 100, borderRadius: 15 }}
          />
        )}
      </TouchableOpacity>

      <View>
        <TextInput
          placeholder="Name"
          placeholderTextColor={Colors.GRAY}
          onChangeText={(v) => setName(v)}
          style={inputStyle}
        />
        <TextInput
          placeholder="Phone Number"
          placeholderTextColor={Colors.GRAY}
          onChangeText={(v) => setPhoneNumber(v)}
          style={inputStyle}
        />
        <TextInput
          placeholder="Website"
          placeholderTextColor={Colors.GRAY}
          onChangeText={(v) => setWebsite(v)}
          style={inputStyle}
        />
        <TextInput
          placeholder="Address"
          placeholderTextColor={Colors.GRAY}
          onChangeText={(v) => setAddress(v)}
          style={inputStyle}
        />
        <TextInput
          placeholder="About"
          placeholderTextColor={Colors.GRAY}
          onChangeText={(v) => setAbout(v)}
          multiline={true}
          numberOfLines={5}
          style={{ ...inputStyle, height: 100 }}
        />

        <View style={{ marginTop: 25 }}>
          <Text
            style={{
              fontFamily: "outfit-bold",
              fontSize: 18,
              marginBottom: 12,
              color: Colors.PRIMARY,
            }}>
            Select a Category
          </Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {categoryList.map((cat, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setCategory(cat.value)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 18,
                  backgroundColor:
                    category === cat.value ? Colors.PRIMARY : "#fff",
                  borderWidth: 1.5,
                  borderColor: Colors.PRIMARY,
                  borderRadius: 30,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                  elevation: 3,
                }}>
                <Text
                  style={{
                    fontFamily: "outfit-medium",
                    color: category === cat.value ? "#fff" : Colors.PRIMARY,
                    fontSize: 16,
                  }}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <TouchableOpacity
        disabled={loading}
        style={{
          padding: 15,
          backgroundColor: Colors.PRIMARY,
          borderRadius: 5,
          marginTop: 20,
        }}
        onPress={() => onAddNewBusiness()}>
        {loading ? (
          <ActivityIndicator size={"large"} color={"#fff"} />
        ) : (
          <Text
            style={{
              textAlign: "center",
              fontFamily: "outfit-medium",
              color: "#fff",
            }}>
            Add New Business
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const inputStyle = {
  padding: 15,
  borderWidth: 1,
  borderRadius: 5,
  fontSize: 17,
  backgroundColor: "#fff",
  marginTop: 15,
  borderColor: Colors.PRIMARY,
  fontFamily: "outfit",
};
