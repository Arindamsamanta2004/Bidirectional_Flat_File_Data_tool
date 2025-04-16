from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
import pandas as pd
from clickhouse_driver import Client
import jwt
import json

app = FastAPI(title="Bidirectional Data Ingestion Tool")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ClickHouseConfig(BaseModel):
    host: str
    port: int
    database: str
    user: str
    jwt_token: str

class ColumnSelection(BaseModel):
    table_name: str
    columns: List[str]
    join_conditions: Optional[dict] = None

@app.post("/api/clickhouse/connect")
async def connect_clickhouse(config: ClickHouseConfig):
    try:
        client = Client(
            host=config.host,
            port=config.port,
            database=config.database,
            user=config.user,
            password=config.jwt_token
        )
        # Test connection
        client.execute('SELECT 1')
        return {"status": "success", "message": "Connected to ClickHouse successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/clickhouse/tables")
async def get_tables(config: ClickHouseConfig):
    try:
        client = Client(
            host=config.host,
            port=config.port,
            database=config.database,
            user=config.user,
            password=config.jwt_token
        )
        tables = client.execute('SHOW TABLES')
        return {"tables": [table[0] for table in tables]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/clickhouse/columns")
async def get_columns(config: ClickHouseConfig, table_name: str):
    try:
        client = Client(
            host=config.host,
            port=config.port,
            database=config.database,
            user=config.user,
            password=config.jwt_token
        )
        columns = client.execute(f'DESCRIBE TABLE {table_name}')
        return {"columns": [{
            "name": col[0],
            "type": col[1]
        } for col in columns]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/clickhouse/preview")
async def preview_data(config: ClickHouseConfig, selection: ColumnSelection):
    try:
        client = Client(
            host=config.host,
            port=config.port,
            database=config.database,
            user=config.user,
            password=config.jwt_token
        )
        
        query = f"SELECT {', '.join(selection.columns)} FROM {selection.table_name} LIMIT 100"
        if selection.join_conditions:
            # Handle JOIN conditions here
            pass
            
        data = client.execute(query)
        return {"preview": data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/file/preview")
async def preview_file(file: UploadFile = File(...), delimiter: str = Form(default=",")):
    try:
        contents = await file.read()
        df = pd.read_csv(file.file, delimiter=delimiter, nrows=100)
        return {
            "columns": df.columns.tolist(),
            "preview": df.to_dict(orient='records')
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/transfer/clickhouse-to-file")
async def transfer_to_file(config: ClickHouseConfig, selection: ColumnSelection):
    try:
        client = Client(
            host=config.host,
            port=config.port,
            database=config.database,
            user=config.user,
            password=config.jwt_token
        )
        
        query = f"SELECT {', '.join(selection.columns)} FROM {selection.table_name}"
        data = client.execute(query)
        
        df = pd.DataFrame(data, columns=selection.columns)
        result = df.to_csv(index=False)
        
        return {
            "status": "success",
            "record_count": len(df),
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/transfer/file-to-clickhouse")
async def transfer_to_clickhouse(
    config: ClickHouseConfig,
    file: UploadFile = File(...),
    table_name: str = Form(...),
    delimiter: str = Form(default=",")
):
    try:
        df = pd.read_csv(file.file, delimiter=delimiter)
        
        client = Client(
            host=config.host,
            port=config.port,
            database=config.database,
            user=config.user,
            password=config.jwt_token
        )
        
        # Create table if not exists
        columns_def = ", ".join([f"{col} String" for col in df.columns])
        create_table_query = f"CREATE TABLE IF NOT EXISTS {table_name} ({columns_def}) ENGINE = MergeTree() ORDER BY tuple()"
        client.execute(create_table_query)
        
        # Insert data
        client.insert_dataframe(f'INSERT INTO {table_name} VALUES', df)
        
        return {
            "status": "success",
            "record_count": len(df)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))