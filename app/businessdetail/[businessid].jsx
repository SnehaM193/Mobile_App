import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../configs/FirebaseConfig";
import { Colors } from "../../constants/Colors";
import Intro from "../../components/BusinessDetail/Intro";
import ActionButton from "../../components/BusinessDetail/ActionButton";
import About from "../../components/BusinessDetail/About";
import Reviews from "../../components/BusinessDetail/Reviews";

export default function BusinessDetail() {
  const { businessid } = useLocalSearchParams();
  const [business, setBusiness] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetBusinessDetailsById();
  }, []);

  // Used to get BusinessDetails by Id
  const GetBusinessDetailsById = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "BusinessList", businessid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const businessData = docSnap.data();

        // Process image data (supporting both URL and base64)
        let imageData = businessData.imageUrl || null;

        // If we have base64 data, format it properly
        if (businessData.imageBase64 && businessData.imageBase64.length > 50) {
          imageData = `data:image/jpeg;base64,${businessData.imageBase64}`;
        }

        // Set the business data with processed image
        setBusiness({
          id: docSnap.id,
          ...businessData,
          // If we processed a base64 image, use it as imageUrl as well
          imageUrl: imageData || businessData.imageUrl,
        });
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching business details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      {loading ? (
        <ActivityIndicator
          style={{
            marginTop: "70%",
          }}
          size={"large"}
          color={Colors.PRIMARY}
        />
      ) : (
        <View>
          {/* Intro */}
          <Intro business={business} />
          {/* Action Buttons */}
          <ActionButton business={business} />
          {/* About Section */}
          <About business={business} />
          {/* Reviews Section */}
          <Reviews business={business} />
        </View>
      )}
    </ScrollView>
  );
}
