export interface TableData {
  headers: string[];
  rows: string[][];
}

export function parseMarkdownTable(content: string): TableData | null {
  // Check if content contains a markdown table
  const tableRegex = /\|(.+)\|\n\|[\s\-\|:]+\|\n((?:\|.+\|\n?)+)/g;
  const match = tableRegex.exec(content);
  
  if (!match) return null;
  
  const [, headerRow, bodyRows] = match;
  
  // Parse headers
  const headers = headerRow
    .split('|')
    .map(cell => cell.trim())
    .filter(cell => cell.length > 0);
  
  // Parse data rows
  const rows = bodyRows
    .trim()
    .split('\n')
    .map(row => 
      row
        .split('|')
        .map(cell => cell.trim())
        .filter(cell => cell.length > 0)
    )
    .filter(row => row.length > 0);
  
  return { headers, rows };
}

export function hasMarkdownTable(content: string): boolean {
  const tableRegex = /\|(.+)\|\n\|[\s\-\|:]+\|\n((?:\|.+\|\n?)+)/g;
  return tableRegex.test(content);
}