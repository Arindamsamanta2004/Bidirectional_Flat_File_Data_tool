import React from 'react';
import { useState } from 'react';
import { ThemeProvider, CssBaseline, Container, Paper, Box, Button } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createTheme } from '@mui/material/styles';
import DataSourceSelection from './components/DataSourceSelection';
import ClickHouseConfig from './components/ClickHouseConfig';
import FileConfig from './components/FileConfig';
import ColumnSelection from './components/ColumnSelection';
import TransferStatus from './components/TransferStatus';

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

type DataSource = 'clickhouse' | 'file';

export default function App() {
  const [source, setSource] = useState<DataSource>('clickhouse');
  const [target, setTarget] = useState<DataSource>('file');
  const [clickhouseConfig, setClickhouseConfig] = useState({
    host: '',
    port: 8123,
    database: '',
    user: '',
    jwt_token: '',
  });
  const [fileConfig, setFileConfig] = useState({
    fileName: '',
    delimiter: ',',
  });
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [transferStatus, setTransferStatus] = useState<{ status: 'idle' | 'loading' | 'success' | 'error'; message: string; recordCount: number; }>({
    status: 'idle',
    message: '',
    recordCount: 0,
  });

  const handleTransfer = async (direction: 'toFile' | 'toClickHouse') => {
    try {
      setTransferStatus({ status: 'loading', message: 'Starting transfer...', recordCount: 0 });
      
      if (direction === 'toFile') {
        // Implement ClickHouse to file transfer
      } else {
        // Implement file to ClickHouse transfer
      }

      setTransferStatus({ status: 'success', message: 'Transfer completed', recordCount: 1000 });
    } catch (error) {
      setTransferStatus({ status: 'error', message: (error as Error).message, recordCount: 0 });
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <DataSourceSelection
                source={source}
                target={target}
                onSourceChange={setSource}
                onTargetChange={setTarget}
              />
              {(source === 'clickhouse' || target === 'clickhouse') && (
                <ClickHouseConfig
                  config={clickhouseConfig}
                  onChange={setClickhouseConfig}
                />
              )}
              {(source === 'file' || target === 'file') && (
                <FileConfig
                  config={fileConfig}
                  onChange={setFileConfig}
                />
              )}
              <ColumnSelection
                source={source}
                clickhouseConfig={clickhouseConfig}
                fileConfig={fileConfig}
                selectedColumns={selectedColumns}
                onColumnsChange={setSelectedColumns}
              />
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  onClick={() => handleTransfer('toFile')}
                  disabled={transferStatus.status === 'loading'}
                >
                  Transfer to File
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleTransfer('toClickHouse')}
                  disabled={transferStatus.status === 'loading'}
                >
                  Transfer to ClickHouse
                </Button>
              </Box>
              <TransferStatus status={transferStatus} />
            </Box>
          </Paper>
        </Container>
      </ThemeProvider>
    </QueryClientProvider>
  );
}