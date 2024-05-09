import { StatusBar as SB } from "expo-status-bar";
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";

import { CalendarDaysIcon } from "react-native-heroicons/solid";
import { SearchBox } from "./src/components";
import { useWeatherStoreStore } from "src/store/store";
import { weatherImages } from "src/constants/constants";
import { theme } from "@/theme/theme";
import { useEffect } from "react";
import { fetchWeatherForecast } from "src/api/weather";
import * as Progress from "react-native-progress";

export default function App() {
  const loading = useWeatherStoreStore((state) => state.loading);
  const weather = useWeatherStoreStore((state) => state.weather);
  const { current, location } = weather || "";

  // useEffect(() => {
  //   useWeatherStoreStore.setState({ loading: true });
  //   fetchWeatherForecast({ cityName: "Harare", days: 7 }).then((data) => {
  //     if (data != null) useWeatherStoreStore.setState({ weather: data });
  //     useWeatherStoreStore.setState({ loading: false });
  //   });
  // }, []);

  return (
    <View className="relative flex-1">
      <SB style="light" />
      <Image
        blurRadius={70}
        className="absolute w-full h-full"
        source={require("./assets/images/bg.png")}
      />

      {loading ? (
        <View className="items-center justify-center flex-1">
          <Progress.CircleSnail
            thickness={8}
            size={130}
            direction="clockwise"
            color="#0bb3b2"
          />
        </View>
      ) : (
        <SafeAreaView
          style={{
            paddingTop:
              Platform.OS == "android" ? StatusBar.currentHeight! + 10 : 0,
          }}
        >
          <SearchBox />
          <View className="space-y-12 top-20">
            <Text className="text-2xl font-bold text-center text-white">
              {location?.name},{" "}
              <Text className="text-lg font-semibold text-gray-300">
                {location?.country}
              </Text>
            </Text>
            <View className="flex items-center">
              <Image
                source={weatherImages[current?.condition.text]}
                className="h-52 w-52"
              />
            </View>
            <View className="space-y-2">
              <Text className="ml-5 text-6xl font-bold text-center text-white">
                {current?.temp_c}&#176;
              </Text>
              <Text className="text-xl tracking-widest text-center text-white">
                {current?.condition.text}
              </Text>
            </View>
            <View className="flex-row w-full justify-evenly">
              <X
                icon={require("./assets/icons/wind.png")}
                text={current?.wind_kph + "km"}
              />
              <X
                icon={require("./assets/icons/drop.png")}
                text={current?.humidity + "%"}
              />
              <X
                icon={require("./assets/icons/sun.png")}
                text={weather?.forecast.forecastday[0].astro.sunrise}
              />
            </View>
            <View>
              <View className="flex-row items-center mx-5 mb-4 space-x-2">
                <CalendarDaysIcon size={22} color="white" />
                <Text className="text-base text-white">Daily forecast</Text>
              </View>
              <ScrollView
                horizontal
                contentContainerStyle={{ paddingHorizontal: 15 }}
                showsHorizontalScrollIndicator={false}
              >
                {weather?.forecast.forecastday?.map(
                  (item: any, idx: number) => {
                    let date = new Date(item.date);
                    let options: Object = { weekday: "long" };
                    let dayName = date.toLocaleDateString("en-US", options);
                    return (
                      <View
                        key={idx}
                        className="flex items-center justify-center w-24 py-3 mr-4 space-y-1 rounded-3xl"
                        style={{ backgroundColor: theme.bgWhite(0.15) }}
                      >
                        <Image
                          source={weatherImages[current.condition.text]}
                          className="h-11 w-11"
                        />
                        <Text className="text-white">{dayName}</Text>
                        <Text className="text-xl font-semibold text-white">
                          {item.day.avgtemp_c}&#176;
                        </Text>
                      </View>
                    );
                  }
                )}
              </ScrollView>
            </View>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}

const X = ({ icon, text }: { icon: any; text: string }) => {
  return (
    <View className="flex-row items-center space-x-2">
      <Image source={icon} className="w-6 h-6" />
      <Text className="text-base font-semibold text-white">{text}</Text>
    </View>
  );
};
