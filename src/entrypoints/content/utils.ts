import { ExportSetting } from "../../types";

const TABLE_SELECTOR = "table.target-audience-table";
const CHECKBOX_SELECTOR = "td:first-child input.routeChex";
const ROW_SELECTOR = "tr.list-items";

export function getRowsToExport(setting: ExportSetting): HTMLTableRowElement[] {
  const tbody = document.querySelector(`${TABLE_SELECTOR} tbody`);
  if (!tbody) {
    throw new Error("Table not found. Try reloading the page.");
  }
  const allRows = Array.from(tbody.querySelectorAll<HTMLTableRowElement>(ROW_SELECTOR));
  console.log(allRows);
  if (allRows.length === 0) {
    throw new Error("Now rows found in the table. Try to search routes again.");
  }

  if (setting === "SELECTED") {
    const selectedRows = allRows.filter(row => {
      const checkbox = row.querySelector<HTMLInputElement>(CHECKBOX_SELECTOR);
      return checkbox && checkbox.checked;
    });

    if (selectedRows.length === 0) {
      throw new Error("No rows have been selected.");
    }
    return selectedRows;
  }
  return allRows;
}

export function extractDataFromRows(rows: HTMLTableRowElement[]): string[][] {
  const table = document.querySelector<HTMLTableElement>(TABLE_SELECTOR);
  if (!table) {
    return [];
  }
  const headerCells = Array.from(table.querySelectorAll("thead th")) as HTMLTableCellElement[];
  const validIndices: number[] = [];
  const headers = headerCells.map((th, index) => {
    if (th.style.display === "none") {
      // handling for business routes exclusion
      return null;
    }
    const text = th.innerHTML.trim();
    if (!text) {
      return null;
    }

    validIndices.push(index);
    return text;
  }).filter((text): text is string => text != null);

  const result: string[][] = [headers];
  rows.forEach(row => {
    const cells = row.querySelectorAll("td");
    const rowData = validIndices.map(index => {
      const cell = cells[index];
      return cell ? cell.innerHTML.trim() : "";
    });
    result.push(rowData);
  });
  return result;
}

export function convertToCSV(data: string[][]): string {
  return data.map(row => {
    row.map(cell => {
      if (/["\n,]/.test(cell)) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    }).join(",");
  }).join("\n");
}
