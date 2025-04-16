import React from "react";
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Grid } from '@mui/material';

type DataSource = 'clickhouse' | 'file';

interface DataSourceSelectionProps {
  source: DataSource;
  target: DataSource;
  onSourceChange: (value: DataSource) => void;
  onTargetChange: (value: DataSource) => void;
}

export default function DataSourceSelection({
  source,
  target,
  onSourceChange,
  onTargetChange,
}: DataSourceSelectionProps) {
  return (
    <Grid container spacing={4}>
      <Grid item xs={6}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Source</FormLabel>
          <RadioGroup
            value={source}
            onChange={(e) => onSourceChange(e.target.value as DataSource)}
          >
            <FormControlLabel
              value="clickhouse"
              control={<Radio />}
              label="ClickHouse"
            />
            <FormControlLabel
              value="file"
              control={<Radio />}
              label="Flat File"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Target</FormLabel>
          <RadioGroup
            value={target}
            onChange={(e) => onTargetChange(e.target.value as DataSource)}
          >
            <FormControlLabel
              value="clickhouse"
              control={<Radio />}
              label="ClickHouse"
              disabled={source === 'clickhouse'}
            />
            <FormControlLabel
              value="file"
              control={<Radio />}
              label="Flat File"
              disabled={source === 'file'}
            />
          </RadioGroup>
        </FormControl>
      </Grid>
    </Grid>
  );
}