import React from "react";
import { TextField, Box, Typography } from '@mui/material';

interface ClickHouseConfigProps {
  config: {
    host: string;
    port: number;
    database: string;
    user: string;
    jwt_token: string;
  };
  onChange: (config: any) => void;
}

export default function ClickHouseConfig({ config, onChange }: ClickHouseConfigProps) {
  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === 'port' ? parseInt(event.target.value, 10) : event.target.value;
    onChange({ ...config, [field]: value });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>ClickHouse Configuration</Typography>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <TextField
          label="Host"
          value={config.host}
          onChange={handleChange('host')}
          fullWidth
          required
        />
        <TextField
          label="Port"
          type="number"
          value={config.port}
          onChange={handleChange('port')}
          fullWidth
          required
        />
        <TextField
          label="Database"
          value={config.database}
          onChange={handleChange('database')}
          fullWidth
          required
        />
        <TextField
          label="User"
          value={config.user}
          onChange={handleChange('user')}
          fullWidth
          required
        />
        <TextField
          label="JWT Token"
          value={config.jwt_token}
          onChange={handleChange('jwt_token')}
          type="password"
          fullWidth
          required
          sx={{ gridColumn: 'span 2' }}
        />
      </Box>
    </Box>
  );
}