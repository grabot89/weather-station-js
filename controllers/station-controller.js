import { readingStore } from "../models/reading-store.js";
import { stationStore } from "../models/station-store.js";
import { getWindBeaufort, getStatusForCode, getTemperatureFahrenheit, getCompassDirection, getWindChill } from "../utils/station-utils.js";

export const stationController = {
    async index(request, response) {
        const station = await stationStore.getStationById(request.params.id);
        const readings = await readingStore.getReadingsByStationId(station._id);
        const latestReading = await readingStore.getLatestReadingByStationId(station._id);
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
        }
        
        const viewData = {
            station: station,
        };
        console.log("station rendering", viewData);
        response.render("station-view", viewData);
    },

    async addReading(request, response) {
        const station = await stationStore.getStationById(request.params.id);
        const newReading = {
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