-- =========================================================
-- ONLINE JOB PORTAL
-- DATABASE SEED DATA
-- PostgreSQL
-- =========================================================


-- =========================================================
-- JOB CATEGORIES
-- =========================================================

INSERT INTO categories
(name, description)
VALUES

(
    'Software Development',
    'Jobs related to software development and programming.'
),

(
    'Web Development',
    'Frontend and backend web development jobs.'
),

(
    'Data Science',
    'Jobs related to data analysis, machine learning and AI.'
),

(
    'Database',
    'Database administration and database development jobs.'
),

(
    'Networking',
    'Computer networking and network administration jobs.'
),

(
    'Cyber Security',
    'Cyber security and information security jobs.'
),

(
    'Testing',
    'Software testing and quality assurance jobs.'
),

(
    'UI/UX Design',
    'User interface and user experience design jobs.'
),

(
    'Technical Support',
    'Technical support and IT support jobs.'
),

(
    'Cloud Computing',
    'Cloud computing and cloud administration jobs.'
)

ON CONFLICT (name)
DO NOTHING;


-- =========================================================
-- FINISHED
-- =========================================================

SELECT
    'Seed data inserted successfully.'
AS message;