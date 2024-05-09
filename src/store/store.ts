import { ILocation } from "src/types";
import { create } from "zustand";

type WeatherStore = {
  location: ILocation | null;
  locations: ILocation[];
  weather: any;
  loading: boolean;
  setLoading: () => void;
  setLocations: () => void;
  setWeather: () => void;
};

export const useWeatherStoreStore = create<WeatherStore>((set) => ({
  location: null,
  locations: [],
  weather: null,
  loading: false,
  setLoading: () => set((state) => ({ loading: state.loading })),
  setLocations: () => set((state) => ({ locations: state.locations })),
  setWeather: () => set((state) => ({ weather: state.weather })),
}));
