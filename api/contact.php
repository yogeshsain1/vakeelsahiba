<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database configuration
$host = 'auth-db1281.hstgr.io';
$dbname = 'u922176020_vakeelsahiba';
$username = 'u922176020_yogesh2';
$password = '6g7#n2;x[Ta';

// Response function
function sendResponse($success, $message, $data = null) {
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit();
}

// Validate and sanitize input
function sanitizeInput($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function validatePhone($phone) {
    $phone = preg_replace('/[^0-9+]/', '', $phone);
    return preg_match('/^[\+]?[1-9][\d]{9,14}$/', $phone);
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Only POST requests are allowed');
}

try {
    // Get JSON input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    // If JSON is invalid, try form data
    if (!$data) {
        $data = $_POST;
    }
    
    // Validate required fields
    $required_fields = ['firstName', 'lastName', 'email', 'phone', 'message'];
    foreach ($required_fields as $field) {
        if (empty($data[$field])) {
            sendResponse(false, "Field '{$field}' is required");
        }
    }
    
    // Sanitize inputs
    $firstName = sanitizeInput($data['firstName']);
    $lastName = sanitizeInput($data['lastName']);
    $email = sanitizeInput($data['email']);
    $phone = sanitizeInput($data['phone']);
    $legalService = isset($data['legalService']) ? sanitizeInput($data['legalService']) : '';
    $urgency = isset($data['urgency']) ? sanitizeInput($data['urgency']) : 'normal';
    $message = sanitizeInput($data['message']);
    $privacyConsent = isset($data['privacy']) ? (bool)$data['privacy'] : false;
    $updatesConsent = isset($data['updates']) ? (bool)$data['updates'] : false;
    
    // Validate email format
    if (!validateEmail($email)) {
        sendResponse(false, 'Please provide a valid email address');
    }
    
    // Validate phone format
    if (!validatePhone($phone)) {
        sendResponse(false, 'Please provide a valid phone number');
    }
    
    // Check privacy consent
    if (!$privacyConsent) {
        sendResponse(false, 'Privacy policy consent is required');
    }
    
    // Get client information
    $ipAddress = $_SERVER['REMOTE_ADDR'] ?? '';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    
    // Connect to database
    $dsn = "mysql:host={$host};dbname={$dbname};charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    
    $pdo = new PDO($dsn, $username, $password, $options);
    
    // Check if email already exists (prevent spam)
    $checkStmt = $pdo->prepare("
        SELECT COUNT(*) as count 
        FROM contact_submissions 
        WHERE email = ? AND submission_date > DATE_SUB(NOW(), INTERVAL 1 HOUR)
    ");
    $checkStmt->execute([$email]);
    $recentSubmissions = $checkStmt->fetch()['count'];
    
    if ($recentSubmissions >= 3) {
        sendResponse(false, 'Too many submissions from this email. Please wait before submitting again.');
    }
    
    // Insert into database
    $stmt = $pdo->prepare("
        INSERT INTO contact_submissions (
            first_name, last_name, email, phone, legal_service, urgency, 
            message, privacy_consent, updates_consent, ip_address, user_agent
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $result = $stmt->execute([
        $firstName, $lastName, $email, $phone, $legalService, $urgency,
        $message, $privacyConsent, $updatesConsent, $ipAddress, $userAgent
    ]);
    
    if ($result) {
        $submissionId = $pdo->lastInsertId();
        
        // Send email notification (optional)
        $to = 'info@vakeelsahiba.com'; // Your notification email
        $subject = 'New Contact Form Submission - ' . ucfirst($urgency);
        $emailBody = "
        New contact form submission received:
        
        Name: {$firstName} {$lastName}
        Email: {$email}
        Phone: {$phone}
        Service: {$legalService}
        Urgency: {$urgency}
        
        Message:
        {$message}
        
        Submission ID: {$submissionId}
        Time: " . date('Y-m-d H:i:s') . "
        IP: {$ipAddress}
        ";
        
        $headers = [
            'From: noreply@vakeelsahiba.com',
            'Reply-To: ' . $email,
            'Content-Type: text/plain; charset=UTF-8'
        ];
        
        mail($to, $subject, $emailBody, implode("\r\n", $headers));
        
        // Send auto-reply to user
        $userSubject = 'Thank you for contacting Vakeelsahiba';
        $userBody = "
        Dear {$firstName},
        
        Thank you for contacting Vakeelsahiba. We have received your inquiry and will respond within 24 hours.
        
        Your submission details:
        - Service: {$legalService}
        - Urgency: {$urgency}
        - Reference ID: {$submissionId}
        
        If you have an urgent matter, please call us directly at +91-7903913501.
        
        Best regards,
        Vakeelsahiba Legal Team
        ";
        
        $userHeaders = [
            'From: info@vakeelsahiba.com',
            'Content-Type: text/plain; charset=UTF-8'
        ];
        
        mail($email, $userSubject, $userBody, implode("\r\n", $userHeaders));
        
        sendResponse(true, 'Thank you for your message. We will contact you within 24 hours.', [
            'submission_id' => $submissionId,
            'urgency' => $urgency
        ]);
    } else {
        sendResponse(false, 'Failed to submit your message. Please try again.');
    }
    
} catch (PDOException $e) {
    error_log('Database Error: ' . $e->getMessage());
    sendResponse(false, 'Database connection failed. Please try again later.');
} catch (Exception $e) {
    error_log('General Error: ' . $e->getMessage());
    sendResponse(false, 'An error occurred while processing your request.');
}
?>