import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router";

// Placeholder image if both imageUrl and imageBase64 fail
const PLACEHOLDER = require("../../assets/images/placeholder.png");

export default function BusinessListCard({ business }) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  // Determine image source
  let imageSource = PLACEHOLDER;

  try {
    if (business?.imageBase64 && business.imageBase64.length > 50) {
      imageSource = { uri: `data:image/jpeg;base64,${business.imageBase64}` };
    } else if (business?.imageUrl) {
      imageSource = { uri: business.imageUrl };
    }
  } catch (error) {
    console.warn("Error processing image source");
  }

  return (
    <TouchableOpacity
      style={{
        padding: 10,
        margin: 10,
        borderRadius: 15,
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "row",
        gap: 10,
      }}
      onPress={() => router.push("/businessdetail/" + (business?.id || ""))}>
      <Image
        source={imageError ? PLACEHOLDER : imageSource}
        style={{
          width: 120,
          height: 120,
          borderRadius: 15,
          backgroundColor: "#eee",
        }}
        onError={() => {
          console.warn("Image failed to load, using placeholder");
          setImageError(true);
        }}
      />
      <View
        style={{
          flex: 1,
          gap: 7,
        }}>
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 18,
          }}
          numberOfLines={1}>
          {business?.name || "Unnamed Business"}
        </Text>
        <Text
          style={{
            fontFamily: "outfit",
            color: Colors.GRAY,
            fontSize: 15,
          }}
          numberOfLines={2}>
          {business?.address || "No address provided"}
        </Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <Image
            source={require("./../../assets/images/star.png")}
            style={{
              width: 15,
              height: 15,
            }}
          />
          <Text style={{ fontFamily: "outfit" }}>
            {business?.rating || "4.5"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
