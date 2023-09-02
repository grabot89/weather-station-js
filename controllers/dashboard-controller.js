import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";
import { accountController } from "./account-controller.js";
import { getWindBeaufort, getStatusForCode, getTemperatureFahrenheit, getCompassDirection, getWindChill } from "../utils/station-utils.js";

export const dashboardController = {
  async index(request, response) {
    const loggedInUser = await accountController.getLoggedInUser(request);
    const stations = await stationStore.getStationsByUserId(loggedInUser._id);
    let stationList = [];
    for (const item of stations) {
      const station = await stationStore.getStationById(item._id);
      const readings = await readingStore.getReadingsByStationId(item._id);
      const latestReading = await readingStore.getLatestReadingByStationId(item._id);
      const maxTemperature = await readingStore.getMaxTemperatureByStationId(item._id);
      const minTemperature = await readingStore.getMinTemperatureByStationId(item._id);
      const maxWind = await readingStore.getMaxWindByStationId(item._id);
      const minWind = await readingStore.getMinWindByStationId(item._id);
      const maxPressure = await readingStore.getMaxPressureByStationId(item._id);
      const minPressure = await readingStore.getMinPressureByStationId(item._id);
      if (latestReading !== undefined) {
          latestReading.windBeaufort = getWindBeaufort(latestReading.windSpeed);
          latestReading.status = getStatusForCode(latestReading.code);
          latestReading.temperatureFahrenheit = getTemperatureFahrenheit(latestReading.temperature);
          latestReading.compassDirection = getCompassDirection(latestReading.windDirection);
          latestReading.windChill = getWindChill(latestReading.windSpeed, latestReading.temperature);
          console.log("Latest Reading", latestReading);
          station.latestReading = latestReading;
          station.maxTemperature = maxTemperature;
          station.minTemperature = minTemperature;
          station.maxWind = maxWind;
          station.minWind = minWind;
          station.maxPressure = maxPressure;
          station.minPressure = minPressure;
      }
      stationList.push(station);
      console.log("Station List", stationList);
    }
    const viewData = {
      title: "Weather Station Dashboard",
      stations: stationList,
    };
    console.log("dashboard rendering");
    response.render("dashboard-view", viewData);
  },

  async addStation(request, response) {
    const loggedInUser = await accountController.getLoggedInUser(request);
    const newStation = {
      name: request.body.name,
      latitude: request.body.latitude,
      longitude: request.body.longitude,
      userid: loggedInUser._id,
    };
    console.log(`adding station ${newStation.name}`);
    await stationStore.addStation(newStation);
    response.redirect("/dashboard");
  },

  async deleteStation(request, response) {
    const stationId = request.params.id;
    console.log(`Deleting Station ${stationId}`);
    await stationStore.deleteStationById(stationId);
    response.redirect("/dashboard");
  },
};
