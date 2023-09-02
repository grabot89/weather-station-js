const weatherCodes = new Map([
    [100, "Clear"],
    [200, "Partial Clouds"],
    [300, "Cloudy"],
    [400, "Light Showers"],
    [500, "Heavy Showers"],
    [600, "Rain"],
    [700, "Snow"],
    [800, "Thunder"],
  ]);

export function getWindBeaufort(windSpeed) {
    if (windSpeed == 1)
      return 0;
    else if (windSpeed <= 5)
      return 1;
    else if (windSpeed <= 11)
      return 2;
    else if (windSpeed <= 19)
      return 3;
    else if (windSpeed <= 28)
      return 4;
    else if (windSpeed <= 38)
      return 5;
    else if (windSpeed <= 49)
      return 6;
    else if (windSpeed <= 61)
      return 7;
    else if (windSpeed <= 74)
      return 8;
    else if (windSpeed <= 88)
      return 9;
    else if (windSpeed <= 102)
      return 10;
    else return 11;
}

export function getTemperatureFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

export function getStatusForCode(code) {
    return weatherCodes.get(code);
}

export function getCompassDirection(windDirection) {
    if (windDirection >= 348.75 && windDirection < 11.25)
      return "North";
    if (windDirection >= 11.25 && windDirection < 33.75)
      return "North North East";
    if (windDirection >= 33.75 && windDirection < 56.25)
      return "North East";
    if (windDirection >= 56.25 && windDirection < 78.75)
      return "East North East";
    if (windDirection >= 78.75 && windDirection < 101.25)
      return "East";
    if (windDirection >= 101.25 && windDirection < 123.75)
      return "East South East";
    if (windDirection >= 123.75 && windDirection < 146.25)
      return "South East";
    if (windDirection >= 146.25 && windDirection < 168.75)
      return "South South East";
    if (windDirection >= 168.75 && windDirection < 191.25)
      return "South";
    if (windDirection >= 191.25 && windDirection < 213.75)
      return "South South West";
    if (windDirection >= 213.75 && windDirection < 236.25)
      return "South West";
    if (windDirection >= 236.25 && windDirection < 258.75)
      return "West South West";
    if (windDirection >= 258.75 && windDirection < 281.25)
      return "West";
    if (windDirection >= 281.25 && windDirection < 303.75)
      return "West North West";
    if (windDirection >= 303.75 && windDirection < 326.25)
      return "North West";
    if (windDirection >= 326.25 && windDirection < 348.75)
      return "North North West";

    // Return north to stop error, should never be hit
    return "North";
}

export function getWindChill( windSpeed, celsius) {
    let chill = 13.12 + 0.6215 * celsius - 11.37 * windSpeed ** 0.16 + 0.3965 * celsius * windSpeed ** 0.16;
    return Math.round(chill * 10) / 10;
  }

  export function getTempTrend(readings) {
    if (readings.length < 3) {
      return "Steady";
    }

    const latest = readings[readings.length-1];
    const secondLatest = readings[readings.length-2];
    const thirdLatest = readings[readings.length-3];

    if (latest.temperature > secondLatest.temperature
        && secondLatest.temperature > thirdLatest.temperature) {
      return "Rising";
    }

    if (latest.temperature < secondLatest.temperature
        && secondLatest.temperature < thirdLatest.temperature) {
      return "Falling";
    }
    return "Steady";
  }

  export function getWindTrend(readings) {
    if (readings.length < 3) {
      return "Steady";
    }

    const latest = readings[readings.length-1];
    const secondLatest = readings[readings.length-2];
    const thirdLatest = readings[readings.length-3];

    if (latest.windSpeed > secondLatest.windSpeed
        && secondLatest.windSpeed > thirdLatest.windSpeed) {
      return "Rising";
    }

    if (latest.windSpeed < secondLatest.windSpeed
        && secondLatest.windSpeed < thirdLatest.windSpeed) {
      return "Falling";
    }
    return "Steady";
  }

  export function getPressureTrend(readings) {
    if (readings.length < 3) {
      return "Steady";
    }

    const latest = readings[readings.length-1];
    const secondLatest = readings[readings.length-2];
    const thirdLatest = readings[readings.length-3];

    if (latest.pressure > secondLatest.pressure
        && secondLatest.pressure > thirdLatest.pressure) {
      return "Rising";
    }

    if (latest.pressure < secondLatest.pressure
        && secondLatest.pressure < thirdLatest.pressure) {
      return "Falling";
    }
    return "Steady";
  }