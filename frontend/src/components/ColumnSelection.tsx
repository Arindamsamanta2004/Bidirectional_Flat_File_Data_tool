import React from "react";
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from 'axios';

interface ColumnSelectionProps {
  source: 'clickhouse' | 'file';
  clickhouseConfig: {
    host: string;
    port: number;
    database: string;
    user: string;
    jwt_token: string;
  };
  fileConfig: {
    fileName: string;
    delimiter: string;
  };
  selectedColumns: string[];
  onColumnsChange: (columns: string[]) => void;
}

interface Column {
  name: string;
  type?: string;
}

export default function ColumnSelection({
  source,
  clickhouseConfig,
  fileConfig,
  selectedColumns,
  onColumnsChange,
}: ColumnSelectionProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableColumns, setAvailableColumns] = useState<Column[]>([]);
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');

  const fetchClickHouseTables = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/api/clickhouse/tables', clickhouseConfig);
      setTables(response.data.tables);
    } catch (err) {
      setError('Failed to fetch tables: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchClickHouseColumns = async (tableName: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/api/clickhouse/columns', {
        ...clickhouseConfig,
        table_name: tableName,
      });
      setAvailableColumns(response.data.columns);
    } catch (err) {
      setError('Failed to fetch columns: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFileColumns = async () => {
    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      const fileInput = document.querySelector('#file-input') as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formData.append('file', fileInput.files[0]);
        formData.append('delimiter', fileConfig.delimiter);
        const response = await axios.post('/api/file/preview', formData);
        setAvailableColumns(response.data.columns.map((col: string) => ({ name: col })));
      }
    } catch (err) {
      setError('Failed to read file columns: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (source === 'clickhouse' && clickhouseConfig.host && clickhouseConfig.database) {
      fetchClickHouseTables();
    } else if (source === 'file' && fileConfig.fileName) {
      fetchFileColumns();
    }
  }, [source, clickhouseConfig, fileConfig]);

  const handleColumnToggle = (columnName: string) => {
    const newSelection = selectedColumns.includes(columnName)
      ? selectedColumns.filter(col => col !== columnName)
      : [...selectedColumns, columnName];
    onColumnsChange(newSelection);
  };

  const handleSelectAll = () => {
    onColumnsChange(availableColumns.map(col => col.name));
  };

  const handleUnselectAll = () => {
    onColumnsChange([]);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Column Selection</Typography>
      {source === 'clickhouse' && (
        <Box sx={{ mb: 2 }}>
          <select
            value={selectedTable}
            onChange={(e) => {
              setSelectedTable(e.target.value);
              fetchClickHouseColumns(e.target.value);
            }}
          >
            <option value="">Select a table</option>
            {tables.map(table => (
              <option key={table} value={table}>{table}</option>
            ))}
            </select>
          </Box>
        )}
        <Box sx={{ mb: 2 }}>
          <Button onClick={handleSelectAll} sx={{ mr: 1 }}>Select All</Button>
          <Button onClick={handleUnselectAll}>Unselect All</Button>
        </Box>
        <FormGroup>
          {availableColumns.map(column => (
            <FormControlLabel
              key={column.name}
              control={
                <Checkbox
                  checked={selectedColumns.includes(column.name)}
                  onChange={() => handleColumnToggle(column.name)}
                />
              }
              label={`${column.name}${column.type ? ` (${column.type})` : ''}`}
            />
          ))}
        </FormGroup>
    </Box>
  );
}