import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const cardWidth = width * 0.6;
// Placeholder image if both imageUrl and imageBase64 fail
const PLACEHOLDER = require("../../assets/images/placeholder.png");

export default function PopularBusinessCard({ business }) {
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
      onPress={() => router.push("/businessdetail/" + business?.id)}
      style={{
        marginLeft: 20,
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 15,
        width: cardWidth,
      }}>
      <Image
        source={imageError ? PLACEHOLDER : imageSource}
        style={{
          width: cardWidth - 20,
          height: 130,
          borderRadius: 15,
          backgroundColor: "#eee",
        }}
        onError={() => {
          console.warn("Image failed to load, using placeholder");
          setImageError(true);
        }}
      />
      <View style={{ marginTop: 7, gap: 5, flex: 1 }}>
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 17,
          }}
          numberOfLines={1}
          ellipsizeMode="tail">
          {business?.name || "Unnamed Business"}
        </Text>
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 13,
            color: Colors.GRAY,
          }}
          numberOfLines={2}
          ellipsizeMode="tail">
          {business?.address || "No address provided"}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "auto",
          }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("./../../assets/images/star.png")}
              style={{
                width: 15,
                height: 15,
                marginRight: 5,
              }}
            />
            <Text style={{ fontFamily: "outfit" }}>
              {business?.rating || "4.5"}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: Colors.PRIMARY,
              padding: 3,
              borderRadius: 5,
            }}>
            <Text
              style={{
                fontFamily: "outfit",
                color: "#fff",
                fontSize: 12,
              }}>
              {business?.category || "Other"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
