import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { theme } from "@/theme/theme";
import { MapPinIcon } from "react-native-heroicons/solid";
import { useWeatherStoreStore } from "src/store/store";
import { useCallback, useState } from "react";
import { debounce } from "lodash";
import { fetchLocations, fetchWeatherForecast } from "src/api/weather";
import { ILocation } from "src/types";

export default function SearchBox() {
  const [showSearch, toggleSearch] = useState<boolean>(false);
  const locations: ILocation[] = useWeatherStoreStore(
    (state) => state.locations
  );

  const handleSearch = (value: string) => {
    if (value.length > 2) {
      fetchLocations({ cityName: value }).then((data: ILocation[]) => {
        if (data != null) useWeatherStoreStore.setState({ locations: data });
      });
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  const handleLocation = (location: ILocation) => {
    useWeatherStoreStore.setState({ loading: true });
    useWeatherStoreStore.setState({ locations: [] });
    toggleSearch(false);
    fetchWeatherForecast({ cityName: location.name, days: 7 }).then((data) => {
      if (data != null) useWeatherStoreStore.setState({ weather: data });
      useWeatherStoreStore.setState({ loading: false });
    });
  };

  return (
    <View style={{ height: "8%" }} className="relative z-20 mx-4">
      <View
        className="flex-row items-center justify-end rounded-full"
        style={{
          backgroundColor: showSearch ? theme.bgWhite(0.2) : "transparent",
        }}
      >
        {showSearch ? (
          <TextInput
            onChangeText={handleTextDebounce}
            placeholder="Search city..."
            placeholderTextColor={"lightgray"}
            className="flex-1 h-10 pl-6 text-base text-white"
          />
        ) : null}

        <TouchableOpacity
          onPress={() => toggleSearch(!showSearch)}
          style={{ backgroundColor: theme.bgWhite(0.3) }}
          className="p-3 m-1 rounded-full"
        >
          <MagnifyingGlassIcon size="25" color="white" />
        </TouchableOpacity>
      </View>
      {locations.length > 0 && showSearch ? (
        <View className="z-50 w-full bg-gray-300 rounded-3xl">
          {locations.map((location: ILocation, idx: number) => {
            let showBorder = idx != locations.length - 1;
            let borderClass = showBorder
              ? "border-b-[1px] border-b-gray-400"
              : "";
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => handleLocation(location)}
                className={`flex-row items-center p-3 px-4 mb-1 border-0 ${borderClass}`}
              >
                <MapPinIcon size={20} color="gray" />
                <Text className="ml-2 text-lg text-black">
                  {location.name}, {location.country}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}
