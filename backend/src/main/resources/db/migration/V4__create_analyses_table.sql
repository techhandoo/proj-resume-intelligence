-- Analyses table (AI-generated resume analysis results)
CREATE TABLE analyses (
    id UUID PRIMARY KEY,
    resume_id UUID NOT NULL UNIQUE REFERENCES resumes(id) ON DELETE CASCADE,
    summary TEXT,
    skills TEXT,
    experience_years INTEGER,
    education TEXT,
    recommendations TEXT,
    analyzed_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analyses_resume_id ON analyses(resume_id);
