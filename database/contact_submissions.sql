-- Vakeelsahiba Contact Form Database Setup
-- Created: July 3, 2025
-- Description: Database table for storing contact form submissions

-- Create the contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    legal_service VARCHAR(100),
    urgency VARCHAR(20) DEFAULT 'normal',
    message TEXT NOT NULL,
    privacy_consent BOOLEAN DEFAULT FALSE,
    updates_consent BOOLEAN DEFAULT FALSE,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    status ENUM('new', 'contacted', 'resolved') DEFAULT 'new',
    updated_at TIMESTAMP NULL DEFAULT NULL,
    INDEX idx_email (email),
    INDEX idx_submission_date (submission_date),
    INDEX idx_status (status),
    INDEX idx_urgency (urgency)
);

-- Insert sample form submissions for testing
INSERT INTO contact_submissions (
    first_name, 
    last_name, 
    email, 
    phone, 
    legal_service, 
    urgency, 
    message, 
    privacy_consent, 
    updates_consent, 
    ip_address, 
    user_agent, 
    status
) VALUES
(
    'Rajesh',
    'Kumar',
    'rajesh.kumar@gmail.com',
    '+91-9876543210',
    'civil-disputes',
    'urgent',
    'I need urgent legal assistance regarding a property dispute with my neighbor. They have illegally constructed a wall on my property and are refusing to remove it. I have all the property documents and need immediate legal action.',
    TRUE,
    TRUE,
    '103.25.78.142',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'new'
),
(
    'Priya',
    'Sharma',
    'priya.sharma@yahoo.com',
    '+91-8765432109',
    'matrimonial-disputes',
    'normal',
    'I am facing issues in my marriage and need legal advice regarding divorce proceedings. My husband and I have been separated for 6 months and we want to proceed with mutual consent divorce. Please guide me through the process.',
    TRUE,
    FALSE,
    '117.45.102.33',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
    'contacted'
),
(
    'Amit',
    'Singh',
    'amit.singh@outlook.com',
    '+91-7654321098',
    'criminal-cases',
    'emergency',
    'My son has been falsely accused in a theft case and has been arrested. We need immediate legal representation for his bail hearing which is scheduled for tomorrow. This is an urgent matter and we need experienced criminal lawyers.',
    TRUE,
    TRUE,
    '152.67.89.123',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'contacted'
),
(
    'Sunita',
    'Devi',
    'sunita.devi@rediffmail.com',
    '+91-6543210987',
    'corporate-matters',
    'normal',
    'I am starting a new business and need legal assistance with company registration, compliance requirements, and drafting of partnership agreements. Please provide information about your corporate law services and fee structure.',
    TRUE,
    TRUE,
    '198.23.45.67',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0',
    'new'
),
(
    'Manoj',
    'Gupta',
    'manoj.gupta@gmail.com',
    '+91-5432109876',
    'sarfaesi-bank',
    'urgent',
    'My property has been attached by the bank under SARFAESI Act for a loan default. I want to challenge this action as I believe the procedure was not followed correctly. Need immediate legal consultation to understand my options.',
    TRUE,
    FALSE,
    '74.125.224.89',
    'Mozilla/5.0 (Linux; Android 12; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Mobile Safari/537.36',
    'new'
),
(
    'Kavitha',
    'Reddy',
    'kavitha.reddy@hotmail.com',
    '+91-4321098765',
    'arbitration',
    'normal',
    'We have a commercial dispute with our business partner and the contract specifies arbitration for dispute resolution. We need an experienced arbitration lawyer to represent us in the proceedings.',
    TRUE,
    TRUE,
    '203.112.45.78',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.188',
    'resolved'
),
(
    'Vikash',
    'Yadav',
    'vikash.yadav@gmail.com',
    '+91-3210987654',
    'civil-disputes',
    'normal',
    'I have a tenant who is not paying rent for the last 8 months and is refusing to vacate the property. I need legal assistance to file an eviction case and recover the pending rent amount.',
    TRUE,
    FALSE,
    '49.32.156.78',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'contacted'
),
(
    'Anita',
    'Joshi',
    'anita.joshi@yahoo.co.in',
    '+91-2109876543',
    'other',
    'urgent',
    'I need legal advice regarding consumer rights. I purchased a defective vehicle and the dealer is refusing to provide refund or replacement. I want to file a consumer complaint and need guidance on the procedure.',
    TRUE,
    TRUE,
    '122.167.241.90',
    'Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
    'new'
),
(
    'Deepak',
    'Mishra',
    'deepak.mishra@gmail.com',
    '+91-1098765432',
    'criminal-cases',
    'emergency',
    'My brother has been arrested in a false dowry harassment case filed by his wife. We need immediate legal representation for anticipatory bail and defense. This is a very sensitive family matter.',
    TRUE,
    FALSE,
    '183.82.103.42',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'contacted'
),
(
    'Meera',
    'Agarwal',
    'meera.agarwal@rediffmail.com',
    '+91-0987654321',
    'matrimonial-disputes',
    'normal',
    'I want to file for maintenance from my husband who has abandoned me and our two children. He is not providing any financial support. Please advise on the legal procedure and required documents.',
    TRUE,
    TRUE,
    '157.45.78.123',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
    'new'
),
(
    'Test',
    'User',
    'test.user@example.com',
    '+911234567890',
    'civil-disputes',
    'urgent',
    'Test message for urgent civil dispute.',
    1,
    1,
    '127.0.0.1',
    'TestAgent',
    'new'
);

-- Create additional indexes for better performance
CREATE INDEX idx_legal_service ON contact_submissions(legal_service);
CREATE INDEX idx_phone ON contact_submissions(phone);

-- Create a view for quick access to recent submissions
CREATE VIEW recent_submissions AS
SELECT 
    id,
    CONCAT(first_name, ' ', last_name) AS full_name,
    email,
    phone,
    legal_service,
    urgency,
    LEFT(message, 100) AS message_preview,
    status,
    submission_date
FROM contact_submissions
WHERE submission_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY submission_date DESC;

-- Create a view for urgent submissions that need immediate attention
CREATE VIEW urgent_submissions AS
SELECT 
    id,
    CONCAT(first_name, ' ', last_name) AS full_name,
    email,
    phone,
    legal_service,
    urgency,
    message,
    submission_date,
    TIMESTAMPDIFF(HOUR, submission_date, NOW()) AS hours_since_submission
FROM contact_submissions
WHERE status = 'new' AND urgency IN ('urgent', 'emergency')
ORDER BY 
    CASE urgency
        WHEN 'emergency' THEN 1
        WHEN 'urgent' THEN 2
        ELSE 3
    END,
    submission_date ASC;

-- Query to get submission statistics
SELECT 
    'Total Submissions' AS metric,
    COUNT(*) AS count
FROM contact_submissions

UNION ALL

SELECT 
    'New Submissions',
    COUNT(*)
FROM contact_submissions
WHERE status = 'new'

UNION ALL

SELECT 
    'Contacted Submissions',
    COUNT(*)
FROM contact_submissions
WHERE status = 'contacted'

UNION ALL

SELECT 
    'Resolved Submissions',
    COUNT(*)
FROM contact_submissions
WHERE status = 'resolved'

UNION ALL

SELECT 
    'Emergency Cases',
    COUNT(*)
FROM contact_submissions
WHERE urgency = 'emergency'

UNION ALL

SELECT 
    'This Week Submissions',
    COUNT(*)
FROM contact_submissions
WHERE submission_date >= DATE_SUB(NOW(), INTERVAL 7 DAY);

-- Query to get service-wise breakdown
SELECT 
    CASE 
        WHEN legal_service = 'civil-disputes' THEN 'Civil Disputes'
        WHEN legal_service = 'criminal-cases' THEN 'Criminal Cases'
        WHEN legal_service = 'corporate-matters' THEN 'Corporate Matters'
        WHEN legal_service = 'matrimonial-disputes' THEN 'Matrimonial Disputes'
        WHEN legal_service = 'sarfaesi-bank' THEN 'SARFAESI & Bank Matters'
        WHEN legal_service = 'arbitration' THEN 'Arbitration'
        WHEN legal_service = 'other' THEN 'Other Services'
        ELSE 'Not Specified'
    END AS service_type,
    COUNT(*) AS submission_count,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM contact_submissions)), 2) AS percentage
FROM contact_submissions
GROUP BY legal_service
ORDER BY submission_count DESC;