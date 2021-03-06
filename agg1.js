var data = [];
module.exports = {
  poll (args) {
    // TODO: [x] collate all the readings and retuen them on the aggregator channel
    // TODO: [x] compute min, max, mean and count
    // NOTE: need to implement a light workflow here, to ensure that sensor readings are synced up with the aggregator
    var readings = [];
    var min = 0;
    var i=0;
    var max = 0;
    var mean = 0;
    var count = 0;
    var sensorReadings = [];
    for ( i = 0; i < args.topics.length; i++) {
      if (data[args.topics[i]]) {
        sensorReadings = data[args.topics[i]];
        readings.push(sensorReadings);
        for (var j = 0; j < sensorReadings.length; j++) {
          if (count === 0) {
            min = max = mean = sensorReadings[j].reading;
          }
          min = Math.min(sensorReadings[j].reading, min);
          max = Math.max(sensorReadings[j].reading, max);
          mean = ((count * mean) + sensorReadings[j].reading) / (count + 1);
          count++;
        }
      }
    }
    var resp = JSON.stringify({
      date: Date.now(),
      min,
      max,
      count,
      mean,
      readings
    });
    // clear data for this aggregator
    for ( i = 0; i < args.topics.length; i++) {
      data[args.topics[i]] = [];
    }
    return resp;
  },

  handleMessage (topic, message) {
    if (!data[topic]) {
      data[topic] = []
    }
    data[topic].push({
      reading: message.reading,
      sensor_id: message.sensor_id,
      date: message.date

    });
  }

}


