import { Stack, useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { ScrollView } from "react-native";

import { useFolge } from "@/api/use-folge";

import { FolgeDetails } from "./components/folgen-details";
import { BlurBackground } from "./components/folgen-details-background";

export function FolgenDetailsScreen() {
  const { folgeId } = useLocalSearchParams<{ folgeId: string }>();
  const folgeQuery = useFolge(folgeId);

  if (folgeQuery.isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!folgeQuery.data || folgeQuery.isError) {
    return <Text>Error loading folge.</Text>;
  }

  const folge = folgeQuery.data;
  const backgroundImage = folge.artwork;

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          title: "",
        }}
      />

      {backgroundImage && (
        <BlurBackground folgeId={String(folge.id)} imageUrl={backgroundImage} />
      )}

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-8 pb-20 relative"
        contentInsetAdjustmentBehavior="automatic"
      >
        <FolgeDetails folge={folge} />
      </ScrollView>
    </>
  );
}
