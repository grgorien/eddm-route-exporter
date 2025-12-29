export type ExportSetting = "ALL" | "SELECTED";
export interface AudienceTableRowData {
  [key: string]: string;
}
export interface AutoSelectRequest {
  action: "AUTO_SELECT";
  routes: string;
}
export interface ScrapeRequest {
  action: "SCRAPE";
  setting: ExportSetting;
}
export type Request = ScrapeRequest | AutoSelectRequest;
export interface AutoSelectStats {
  found: number;
  newlyChecked: number;
  alreadyChecked: number;
}
export interface Response {
  success: boolean;
  data?: string[][];
  stats?: AutoSelectStats;
  error?: string;
}
export interface ThemePreference {
  "theme-preference": string;
}
