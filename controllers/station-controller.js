import { readingStore } from "../models/reading-store.js";
import { stationStore } from "../models/station-store.js";
import { getWindBeaufort, getStatusForCode, getTemperatureFahrenheit, getCompassDirection, getWindChill, getTempTrend, getWindTrend, getPressureTrend } from "../utils/station-utils.js";

export const stationController = {
    async index(request, response) {
        const station = await stationStore.getStationById(request.params.id);
        const readings = await readingStore.getReadingsByStationId(station._id);
        const latestReading = await readingStore.getLatestReadingByStationId(station._id);
        const maxTemperature = await readingStore.getMaxTemperatureByStationId(station._id);
        const minTemperature = await readingStore.getMinTemperatureByStationId(station._id);
        const maxWind = await readingStore.getMaxWindByStationId(station._id);
        const minWind = await readingStore.getMinWindByStationId(station._id);
        const maxPressure = await readingStore.getMaxPressureByStationId(station._id);
        const minPressure = await readingStore.getMinPressureByStationId(station._id);
        if (latestReading !== undefined) {
            latestReading.windBeaufort = getWindBeaufort(latestReading.windSpeed);
            latestReading.status = getStatusForCode(latestReading.code);
            latestReading.temperatureFahrenheit = getTemperatureFahrenheit(latestReading.temperature);
            latestReading.compassDirection = getCompassDirection(latestReading.windDirection);
            latestReading.windChill = getWindChill(latestReading.windSpeed, latestReading.temperature);
            console.log("Readings", readings);
            console.log("Latest Reading", latestReading);
            station.readings = readings;
            station.latestReading = latestReading;
            station.maxTemperature = maxTemperature;
            station.minTemperature = minTemperature;
            station.maxWind = maxWind;
            station.minWind = minWind;
            station.maxPressure = maxPressure;
            station.minPressure = minPressure;
            station.tempTrend = getTempTrend(readings);
            station.windTrend = getWindTrend(readings);
            station.pressureTrend = getPressureTrend(readings);
        }
        
        const viewData = {
            station: station,
        };
        console.log("station rendering", viewData);
        response.render("station-view", viewData);
    },

    async addReading(request, response) {
        var timestamp = Date.now();
        var dateTime = new Date(timestamp);
        const station = await stationStore.getStationById(request.params.id);
        const newReading = {
            dateTime: dateTime,
            code: Number(request.body.code),
            temperature: Number(request.body.temperature),
            windSpeed: Number(request.body.windSpeed),
            windDirection: Number(request.body.windDirection),
            pressure: Number(request.body.pressure),
        };
        console.log(`adding reading ${newReading}`);
        await readingStore.addReading(station._id, newReading);
        response.redirect("/station/" + station._id);
    },

    async deleteReading(request, response) {
        const stationId = request.params.stationid;
        const readingId = request.params.readingid;
        console.log(`Deleting Reading ${readingId} from Station ${stationId}`);
        await readingStore.deleteReadingById(readingId);
        response.redirect("/station/" + stationId);
      },
}