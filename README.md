# Bidirectional ClickHouse & Flat File Data Ingestion Tool

A web-based application that facilitates data ingestion between ClickHouse database and Flat File platform with bidirectional data flow support.

## Features

- Bidirectional data flow between ClickHouse and Flat File
- JWT token-based authentication for ClickHouse
- Column selection for targeted data ingestion
- Record count reporting
- User-friendly web interface
- Progress tracking
- Data preview capability

## Tech Stack

### Backend
- Python 3.8+
- FastAPI
- clickhouse-driver
- pandas

### Frontend
- React
- Material-UI
- Axios

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── services/
│   │   └── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml
```

## Setup Instructions

1. Clone the repository
```bash
git clone <repository-url>
cd Bidirectional_Flat_File_Data_tool
```

2. Set up the backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up the frontend
```bash
cd frontend
npm install
```

4. Start the development servers

Backend:
```bash
cd backend
uvicorn app.main:app --reload
```

Frontend:
```bash
cd frontend
npm start
```

5. Access the application at http://localhost:3000

## Configuration

### ClickHouse Configuration
- Host: The ClickHouse server host
- Port: 8123 for HTTP, 9000 for native protocol
- Database: Target database name
- User: Username for authentication
- JWT Token: Authentication token

### Flat File Configuration
- Supported formats: CSV, TSV
- Configurable delimiters
- UTF-8 encoding recommended

## Usage Guide

1. Select Source/Target
   - Choose between ClickHouse and Flat File as source/target

2. Configure Connection
   - For ClickHouse: Enter connection details and JWT token
   - For Flat File: Select file and configure delimiter

3. Select Data
   - Choose tables (ClickHouse)
   - Select columns for transfer
   - Configure JOIN conditions (if applicable)

4. Preview Data
   - View sample records before transfer

5. Start Transfer
   - Monitor progress
   - View completion status and record count

## Error Handling

The application handles various error scenarios:
- Connection failures
- Authentication errors
- Invalid data formats
- Transfer interruptions

## Testing

Test cases cover:
1. ClickHouse to Flat File transfer
2. Flat File to ClickHouse transfer
3. Multi-table joins
4. Error scenarios
5. Data preview functionality

## License

MIT
=======
# Bidirectional_Flat_File_Data_tool
>>>>>>> 2d6abf031ad79f53188021703d37f3fbe5f2a58f
