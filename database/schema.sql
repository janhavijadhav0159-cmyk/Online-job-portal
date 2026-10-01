-- =========================================================
-- ONLINE JOB PORTAL
-- DATABASE SCHEMA
-- PostgreSQL
-- =========================================================

-- =========================================================
-- 1. USERS TABLE
-- =========================================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    phone VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 2. EMPLOYERS TABLE
-- =========================================================

CREATE TABLE IF NOT EXISTS employers (
    id SERIAL PRIMARY KEY,

    company_name VARCHAR(150) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    phone VARCHAR(20),

    location VARCHAR(150),

    website VARCHAR(255),

    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 3. ADMINS TABLE
-- =========================================================

CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    phone VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 4. CATEGORIES TABLE
-- =========================================================

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,

    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 5. JOBS TABLE
-- =========================================================

CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,

    employer_id INTEGER NOT NULL,

    category_id INTEGER,

    title VARCHAR(200) NOT NULL,

    description TEXT NOT NULL,

    location VARCHAR(150) NOT NULL,

    type VARCHAR(50) NOT NULL,

    salary VARCHAR(100),

    experience VARCHAR(100),

    skills TEXT,

    deadline DATE,

    status VARCHAR(30) DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_jobs_employer
        FOREIGN KEY (employer_id)
        REFERENCES employers(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_jobs_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL,

    CONSTRAINT check_job_status
        CHECK (
            status IN (
                'active',
                'closed',
                'draft'
            )
        )
);


-- =========================================================
-- 6. RESUMES TABLE
-- =========================================================

CREATE TABLE IF NOT EXISTS resumes (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    title VARCHAR(150) NOT NULL,

    summary TEXT,

    education TEXT,

    skills TEXT,

    experience TEXT,

    projects TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_resumes_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- =========================================================
-- 7. APPLICATIONS TABLE
-- =========================================================

CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,

    job_id INTEGER NOT NULL,

    user_id INTEGER NOT NULL,

    resume_id INTEGER,

    cover_letter TEXT,

    status VARCHAR(30) DEFAULT 'pending',

    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_applications_job
        FOREIGN KEY (job_id)
        REFERENCES jobs(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_applications_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_applications_resume
        FOREIGN KEY (resume_id)
        REFERENCES resumes(id)
        ON DELETE SET NULL,

    CONSTRAINT unique_job_application
        UNIQUE (job_id, user_id),

    CONSTRAINT check_application_status
        CHECK (
            status IN (
                'pending',
                'reviewing',
                'shortlisted',
                'rejected',
                'selected'
            )
        )
);


-- =========================================================
-- 8. SAVED JOBS TABLE
-- =========================================================

CREATE TABLE IF NOT EXISTS saved_jobs (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    job_id INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_saved_jobs_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_saved_jobs_job
        FOREIGN KEY (job_id)
        REFERENCES jobs(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_saved_job
        UNIQUE (user_id, job_id)
);


-- =========================================================
-- 9. CONTACTS TABLE
-- =========================================================

CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL,

    message TEXT NOT NULL,

    status VARCHAR(30) DEFAULT 'unread',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT check_contact_status
        CHECK (
            status IN (
                'unread',
                'read',
                'replied'
            )
        )
);


-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_users_email
ON users(email);


CREATE INDEX IF NOT EXISTS idx_employers_email
ON employers(email);


CREATE INDEX IF NOT EXISTS idx_jobs_employer
ON jobs(employer_id);


CREATE INDEX IF NOT EXISTS idx_jobs_category
ON jobs(category_id);


CREATE INDEX IF NOT EXISTS idx_jobs_status
ON jobs(status);


CREATE INDEX IF NOT EXISTS idx_jobs_location
ON jobs(location);


CREATE INDEX IF NOT EXISTS idx_applications_user
ON applications(user_id);


CREATE INDEX IF NOT EXISTS idx_applications_job
ON applications(job_id);


CREATE INDEX IF NOT EXISTS idx_applications_status
ON applications(status);


CREATE INDEX IF NOT EXISTS idx_saved_jobs_user
ON saved_jobs(user_id);


CREATE INDEX IF NOT EXISTS idx_saved_jobs_job
ON saved_jobs(job_id);


CREATE INDEX IF NOT EXISTS idx_contacts_status
ON contacts(status);


-- =========================================================
-- DONE
-- =========================================================

SELECT 'Online Job Portal database schema created successfully.'
AS message;