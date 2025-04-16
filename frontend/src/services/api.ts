import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.timeout = 5000;

// Add request/response interceptors
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

interface ClickHouseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  jwt_token: string;
}

interface ColumnSelection {
  table_name: string;
  columns: string[];
  join_conditions?: Record<string, any>;
}

export const connectClickHouse = async (config: ClickHouseConfig) => {
  const response = await axios.post('/api/clickhouse/connect', config);
  return response.data;
};

export const getClickHouseTables = async (config: ClickHouseConfig) => {
  const response = await axios.post('/api/clickhouse/tables', config);
  return response.data.tables;
};

export const getClickHouseColumns = async (config: ClickHouseConfig, tableName: string) => {
  const formData = new FormData();
  formData.append('table_name', tableName);
  const response = await axios.post('/api/clickhouse/columns', { ...config, table_name: tableName });
  return response.data.columns;
};

export const previewClickHouseData = async (config: ClickHouseConfig, selection: ColumnSelection) => {
  const response = await axios.post('/api/clickhouse/preview', { config, selection });
  return response.data.preview;
};

export const previewFileData = async (file: File, delimiter: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('delimiter', delimiter);
  const response = await axios.post('/api/file/preview', formData);
  return response.data;
};

export const transferClickHouseToFile = async (config: ClickHouseConfig, selection: ColumnSelection) => {
  const response = await axios.post('/api/transfer/clickhouse-to-file', { config, selection });
  return response.data;
};

export const transferFileToClickHouse = async (
  config: ClickHouseConfig,
  file: File,
  tableName: string,
  delimiter: string
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('table_name', tableName);
  formData.append('delimiter', delimiter);
  
  const response = await axios.post('/api/transfer/file-to-clickhouse', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};