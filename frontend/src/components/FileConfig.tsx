import React from "react";
import { TextField, Box, Typography, Button } from '@mui/material';
import { ChangeEvent } from 'react';

interface FileConfigProps {
  config: {
    fileName: string;
    delimiter: string;
  };
  onChange: (config: any) => void;
}

export default function FileConfig({ config, onChange }: FileConfigProps) {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onChange({ ...config, fileName: file.name });
    }
  };

  const handleDelimiterChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...config, delimiter: event.target.value });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>File Configuration</Typography>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <Box sx={{ gridColumn: 'span 2' }}>
          <input
            type="file"
            accept=".csv,.txt"
            style={{ display: 'none' }}
            id="file-input"
            onChange={handleFileChange}
          />
          <label htmlFor="file-input">
            <Button
              variant="contained"
              component="span"
              fullWidth
            >
              Choose File
            </Button>
          </label>
          {config.fileName && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected file: {config.fileName}
            </Typography>
          )}
        </Box>
        <TextField
          label="Delimiter"
          value={config.delimiter}
          onChange={handleDelimiterChange}
          fullWidth
          required
          placeholder="e.g. ,"
        />
      </Box>
    </Box>
  );
}