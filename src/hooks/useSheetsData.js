import { SHEETS, SPREADSHEET_ID } from '../data/sheets';

const parseGvizJson = (text) => {
  const json = JSON.parse(text.substring(47).slice(0, -2));
  const rows = json.table.rows.slice(2).map(r => ({
    id: r.c[0]?.v,
    scenario: r.c[1]?.v,
    testType: r.c[2]?.v,
    caseType: r.c[3]?.v,
    result: r.c[6]?.v,
  }));
  return rows;
};

export const useSheetsData = () => {
  const loadAllSheets = async () => {
    const results = [];

    for (const sheet of SHEETS) {
      const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&gid=${sheet.gid}`;
      const response = await fetch(url);
      const text = await response.text();
      const parsed = parseGvizJson(text);
      results.push({ name: sheet.name, data: parsed });
    }

    return results;
  };

  return { loadAllSheets };
};
