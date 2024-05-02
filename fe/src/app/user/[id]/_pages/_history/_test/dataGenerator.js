import { timeFormat } from "d3";

const brands = [
  "Alcatel",
  "Apple",
  "Google",
  "Huawei",
  "LG",
  "Motorola",
  "Nokia",
  "Razer",
  "Samsung",
  "Xiaomi",
  "HTC",
  "Sony",
  "BlackBerry",
  "Palm",
  "ZTE",
  "Oppo",
  "Lenovo"
];

export function generateDataSets({ size = 1 }) {
  const dataSets = [];
  const currentYear = +timeFormat("%Y")(new Date());
  const maxLimitForValue = 2000;
  const minLimitForValue = 200;
  const maximumModelCount = 10;

  for (let i = 0; i < size; i++) {
    dataSets.push({
      date: currentYear - (size - (i + 1)),
      dataSet: brands
        .sort(function() {
          return Math.random() - 0.5;
        })
        .slice(0, maximumModelCount)
        .map(brand => ({
          name: brand,
          value:
            Math.random() * (maxLimitForValue - minLimitForValue) +
            minLimitForValue
        }))
    });
  }

  return dataSets;
}
