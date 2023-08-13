import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";

const db = initStore("readings");

export const readingStore = {
    async getAllReadings() {
      await db.read();
      return db.data.readings;
    },
  
    async addReading(stationId, reading) {
      await db.read();
      reading._id = v4();
      reading.stationId = stationId;
      db.data.readings.push(reading);
      await db.write();
      return reading;
    },

    async getReadingsByStationId(stationId) {
        await db.read();
        return db.data.readings.filter((reading) => reading.stationId === stationId);
    },

    async getLatestReadingByStationId(stationId) {
        await db.read();
        return db.data.readings.findLast((reading) => reading.stationId === stationId);
    },
  
    async getReadingById(id) {
      await db.read();
      const list = db.data.readings.find((reading) => reading._id === id);
      return list;
    },
  
    async deleteReadingById(id) {
      await db.read();
      const index = db.data.readings.findIndex((reading) => reading._id === id);
      db.data.readings.splice(index, 1);
      await db.write();
    },
  
    async deleteAllReadings() {
      db.data.readings = [];
      await db.write();
    },

    async updateReading(reading, updatedReading) {
        reading.code = updatedReading.code;
        reading.temperature = updatedReading.temperature;
        reading.windSpeed = updatedReading.windSpeed;
        reading.windDirection = updatedReading.windDirection;
        reading.pressure = updatedReading.pressure;
        await db.write;
    },
  };