-- V6__create_analysis_jobs_table.sql
-- Async processing queue: uploads create a job immediately and a background
-- worker runs the (slow, external) Groq analysis, so the HTTP request never
-- blocks on the LLM. Also enables retries and stale-job recovery.
CREATE TABLE IF NOT EXISTS analysis_jobs (
    id UUID PRIMARY KEY,
    resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    attempts INTEGER NOT NULL DEFAULT 0,
    last_error TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    started_at TIMESTAMP,
    finished_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_analysis_jobs_status_created ON analysis_jobs(status, created_at);
CREATE INDEX IF NOT EXISTS idx_analysis_jobs_resume_id ON analysis_jobs(resume_id);
