export type ExportSetting = "ALL" | "SELECTED";
export interface AudienceTableRowData {
  [key: string]: string;
}
export interface Request {
  action: "SCRAPE";
  setting: ExportSetting;
}
export interface Response {
  success: boolean;
  data?: string[][];
  error?: string;
}
export interface ThemePreference {
  "theme-preference": string;
}
