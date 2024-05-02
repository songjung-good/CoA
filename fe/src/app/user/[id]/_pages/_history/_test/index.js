import "./styles.css";
import { generateDataSets } from "./dataGenerator";
import { BarChartRace } from "./BarChartRace";

import { select as d3Select } from "d3";

const myChart = new BarChartRace("bar-chart-race");

myChart
  .setTitle("Bar Chart Race Title")
  .addDatasets(generateDataSets({ size: 5 }))
  .render();

d3Select("button").on("click", function() {
  if (this.innerHTML === "Stop") {
    this.innerHTML = "Resume";
    myChart.stop();
  } else if (this.innerHTML === "Resume") {
    this.innerHTML = "Stop";
    myChart.start();
  } else {
    this.innerHTML = "Stop";
    myChart.render();
  }
});
