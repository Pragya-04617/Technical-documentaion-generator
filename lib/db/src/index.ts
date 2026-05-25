// Database module - stateless app, no database needed
// This file exists to satisfy the workspace structure

export const DB_VERSION = "1.0.0";

export interface DocGeneration {
  id: string;
  input: string;
  output: string;
  format: string;
  createdAt: Date;
}
