import React, { ReactElement, useMemo, useState } from "react";
import { cell, report, row, rowTypes } from "../types/types";
import { formatDate } from "../utils/dateTime";

type ReportProps = {
  reportData: report;
};

const XeroReport = ({ reportData }: ReportProps) => {
  

  function renderCellValue(value: unknown): string {
    if (value instanceof Error) {
      return value.message;
    } else if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    } else if (value === undefined || value === null) {
      return ""; // Handle null or undefined values
    }
    return value.toString();
  }

  const renderCells = (cells: cell[], subStyling: React.CSSProperties): ReactElement[] => 
    cells.map((cell, index) => (
      <td
        key={`row-cell-${index}`}
        style={index === 0 ? subStyling : undefined}
      >
        {renderCellValue(cell.Value)}
      </td>
    ));

  const getRow = (row: row, rowIndex: number, subSectionCount: number, parent?: row): ReactElement[] => {
    const rows: ReactElement[] = [];
    let bold = false
    if(row?.Title?.length === 0 && row?.RowType === rowTypes.Section){
      subSectionCount--
    }
    else if(parent?.RowType === rowTypes.Section && parent?.Title?.length === 0 && row?.RowType === rowTypes.Row){
      bold = true
      subSectionCount = subSectionCount -2
    }
    if(row?.RowType === rowTypes.SummaryRow || row?.RowType === rowTypes.Section){
      bold = true
    }
    const subStyling = { paddingLeft: `${subSectionCount * 15}px`, fontWeight: bold ? "bold": "normal"};

    switch (row.RowType) {
      case rowTypes.Header:
        rows.push(
          <tr key={`header-${rowIndex}`}>
            {row.Cells.map((cell, index) => (
              <th key={`header-cell-${index}`}>{renderCellValue(cell.Value)}</th>
            ))}
          </tr>
        );
        break;

      case rowTypes.Section:
        if (row.Title.length>0) {
          rows.push(
            <tr key={`section-${rowIndex}`}>
              <td colSpan={row?.Cells?.length || 3} style={subStyling}>
                {row.Title}
              </td>
            </tr>
          );
        }
        row.Rows.forEach((nestedRow, nestedIndex) => 
          rows.push(...getRow(nestedRow, nestedIndex, subSectionCount + 1, row))
        );
        break;

      case rowTypes.Row:
      case rowTypes.SummaryRow:
        rows.push(
          <tr key={`row-${rowIndex}`}>
            {renderCells(row.Cells, subStyling)}
          </tr>
        );
        break;

      default:
        break;
    }
    return rows;
  };

  const tableRows = useMemo(() => {
    let subSectionCount = 1;
    let preRow: row;
    return reportData.Rows.flatMap((row, index) => {
      if(preRow?.RowType === rowTypes.Section && preRow.Rows.length === 0)
      {
        subSectionCount = 2
      }
      if(preRow?.RowType === rowTypes.Section && preRow.Title.length === 0)
      {
        subSectionCount > 1 && subSectionCount--
      }
      preRow = row
      return getRow(row, index, subSectionCount)
    });
  }, [reportData]);

  return (
    <div className="report">
      <div className="titles">
        {reportData.ReportTitles.map((title, index) => 
          index === 0 ? (
            <h3 key={`title-${index}`}>{renderCellValue(title)}</h3>
          ) : (
            <h4 key={`title-${index}`}>{renderCellValue(title)}</h4>
          )
        )}
      </div>
      <table role="table">
        <tbody role="rowgroup">{tableRows}</tbody>
      </table>
    </div>
  );
};

export default XeroReport;
