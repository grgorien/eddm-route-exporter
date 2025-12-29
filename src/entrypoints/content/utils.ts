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
  const headers = headerCells
  .filter((th, index) => {
    if (index === 0) {
      return false;
    }
    if (th.style.display === "none") {
      return false;
    }
    return !!th.textContent?.trim();
  })
  .map(th => {
    return th.textContent?.trim() || "Unknown";
  });
  const result: string[][] = [headers];
  rows.forEach(row => {
    const cells = Array.from(row.querySelectorAll("td"));
    if (cells.length > 1) {
      const rowData = cells
      .slice(1, 1 + headers.length)
      .map(cell => cell.textContent?.trim() || "");
      result.push(rowData);
    }
  });
  return result;
}

export function convertToCSV(data: string[][]): string {
  return data.map(row =>
    row.map(cell => {
      const cellText = cell.replace(/"/g, '""');
      if (cellText.includes(',') || cellText.includes('"') || cellText.includes('\n')) {
        return `"${cellText}"`;
      }
      return cellText;
    }).join(',')
  ).join('\n');
}

export function normalizeRouteInput(rawData: string): string[] {
  const regex = /(\d{5})?[\s-]*([a-zA-Z])[\s-]*(\d{3})/g;
  const matches = [...rawData.matchAll(regex)];
  const cleanRoutes = matches.map(r => {
    const zip = r[1] || "";
    const type = r[2].toUpperCase();
    const id = r[3];
    return `${zip}${type}${id}`;
  })
  return [...new Set(cleanRoutes)];
}

export function autoSelectRoutes(routeList: string[]) {
  let foundCount = 0;
  let checkedCount = 0;
  routeList.forEach(route => {
    const isFullID = /^\d/.test(route);
    const checkbox = document.querySelector<HTMLInputElement>(`input.routeChex[data-route-info="${route}"]`);
    if (checkbox && isFullID) {
      foundCount++;
      if (!checkbox.checked) {
        checkbox.checked = true;
        checkedCount++;
        checkbox.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  });

  return {
    found: foundCount,
    newlyChecked: checkedCount,
    alreadyChecked: foundCount - checkedCount
  };
}
