/**
 * Utilitaires d'export CSV et Excel (pur JS, zero dependance).
 */

export interface ExportColumn<T> {
  header: string;
  accessor: (row: T) => string | number | boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function escapeXML(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ---------------------------------------------------------------------------
// CSV Export
// ---------------------------------------------------------------------------

export function exportToCSV<T>(
  data: T[],
  columns: ExportColumn<T>[],
  filename: string,
) {
  const header = columns.map((c) => escapeCSV(c.header)).join(',');
  const rows = data.map((row) =>
    columns.map((c) => escapeCSV(String(c.accessor(row)))).join(','),
  );

  // BOM UTF-8 pour que Excel interprete correctement les accents
  const BOM = '\uFEFF';
  const csv = BOM + [header, ...rows].join('\r\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, `${filename}.csv`);
}

// ---------------------------------------------------------------------------
// Excel Export (XML SpreadsheetML — compatible Excel, LibreOffice, Google Sheets)
// ---------------------------------------------------------------------------

export function exportToExcel<T>(
  data: T[],
  columns: ExportColumn<T>[],
  filename: string,
) {
  const headerCells = columns
    .map((c) => `<Cell><Data ss:Type="String">${escapeXML(c.header)}</Data></Cell>`)
    .join('');

  const dataRows = data
    .map((row) => {
      const cells = columns
        .map((c) => {
          const raw = c.accessor(row);
          const isNum = typeof raw === 'number';
          const type = isNum ? 'Number' : 'String';
          const val = isNum ? String(raw) : escapeXML(String(raw));
          return `<Cell><Data ss:Type="${type}">${val}</Data></Cell>`;
        })
        .join('');
      return `<Row>${cells}</Row>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="header">
      <Font ss:Bold="1"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="Export">
    <Table>
      <Row ss:StyleID="header">${headerCells}</Row>
      ${dataRows}
    </Table>
  </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], {
    type: 'application/vnd.ms-excel;charset=utf-8;',
  });
  triggerDownload(blob, `${filename}.xls`);
}
