import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TableData } from '@/utils/tableParser';

interface TableRendererProps {
  data: TableData;
}

export const TableRenderer: React.FC<TableRendererProps> = ({ data }) => {
  return (
    <div className="my-4 rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {data.headers.map((header, index) => (
              <TableHead key={index} className="font-semibold">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex} className="py-3">
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};