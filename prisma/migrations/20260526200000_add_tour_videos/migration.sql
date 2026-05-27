-- Add videos column to Tour table
ALTER TABLE "Tour" ADD COLUMN "videos" JSONB NOT NULL DEFAULT '[]';
