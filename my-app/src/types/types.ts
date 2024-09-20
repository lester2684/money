import { Attributes } from "react";

export interface balanceSheetData {
  Status: string;
  Reports: report[];
}

export interface report {
  ReportID: string;
  ReportName: string;
  ReportType: string;
  ReportTitles: string[];
  ReportDate: string;
  UpdatedDateUTC: string;
  Rows: row[];
}

export interface row {
  RowType: rowTypes;
  Title: string;
  Cells: cell[];
  Rows: row[];
}

export enum rowTypes {
  Section = "Section",
  Header = "Header",
  Row = "Row",
  SummaryRow = "SummaryRow",
}

export interface cell {
  Value: string;
  Attributes: attributes[];
}

export interface attributes {
  Id: string;
  Value: string;
}
