import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router";

// Placeholder image if imageUrl is broken
const PLACEHOLDER = require("../../assets/images/placeholder.png");

export default function BusinessListCard({ business }) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  // Default image source (placeholder)
  let imageSource = PLACEHOLDER;

  // Try to use the business image if available
  if (business?.imageUrl) {
    imageSource = { uri: business.imageUrl };
  } else if (business?.imageBase64) {
    imageSource = { uri: `data:image/jpeg;base64,${business.imageBase64}` };
  }

  return (
    <TouchableOpacity
      onPress={() => router.push("/businessdetail/" + business?.id)}
      style={{
        backgroundColor: "#fff",
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        marginTop: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
      }}>
      <Image
        source={imageError ? PLACEHOLDER : imageSource}
        style={{
          width: "100%",
          height: 150,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          backgroundColor: "#eee",
        }}
        onError={() => {
          console.warn("Image failed to load, using placeholder");
          setImageError(true);
        }}
      />
      <View
        style={{
          padding: 10,
        }}>
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 20,
          }}>
          {business?.name || "Unnamed Business"}
        </Text>
        <Text
          style={{
            fontFamily: "outfit",
            color: Colors.GRAY,
          }}>
          {business?.address || "No address provided"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
