interface LanguageData {
  language: string;
  value: number;
}

interface MonthData {
  date: string;
  languages: LanguageData[];
}

interface LanguageStats {
  [language: string]: number;
}

export function mergeLanguageData(data: MonthData[]): MonthData[] {
  const mergedData: { [date: string]: LanguageStats } = {};

  data.forEach((month) => {
    const date = month.date;
    const languages = month.languages;

    if (!mergedData[date]) {
      mergedData[date] = {};
    }

    languages.forEach((langData) => {
      const language = langData.language;
      const value = langData.value;

      if (!mergedData[date][language]) {
        mergedData[date][language] = value;
      } else {
        mergedData[date][language] += value;
      }
    });
  });

  const result: MonthData[] = [];

  for (const date in mergedData) {
    if (Object.prototype.hasOwnProperty.call(mergedData, date)) {
      const languageStats = mergedData[date];
      const languages: LanguageData[] = [];

      for (const language in languageStats) {
        if (Object.prototype.hasOwnProperty.call(languageStats, language)) {
          languages.push({ language, value: languageStats[language] });
        }
      }
      languages.sort((a, b) => b.value - a.value);
      result.push({ date, languages });
    }
  }
  result.sort((a, b) => {
    const dateA = Date.parse(a.date);
    const dateB = Date.parse(b.date);
    return dateA - dateB;
  });
  return result;
}
