import React from "react";
import { Box, Typography, LinearProgress, Alert } from '@mui/material';

interface TransferStatusProps {
  status: {
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
    recordCount: number;
  };
}

export default function TransferStatus({ status }: TransferStatusProps) {
  if (status.status === 'idle') {
    return null;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Transfer Status</Typography>
      {status.status === 'loading' && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Transferring data...
          </Typography>
        </Box>
      )}
      {status.status === 'success' && (
        <Alert severity="success">
          Transfer completed successfully! {status.recordCount} records processed.
          {status.message && <Typography variant="body2">{status.message}</Typography>}
        </Alert>
      )}
      {status.status === 'error' && (
        <Alert severity="error">
          {status.message || 'An error occurred during transfer.'}
        </Alert>
      )}
    </Box>
  );
}