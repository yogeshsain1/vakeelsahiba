<?php
// Admin API Handler
// ===================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database configuration
$host = 'auth-db1281.hstgr.io';
$dbname = 'u922176020_vakeelsahiba';
$username = 'u922176020_yogesh2';
$password = '6g7#n2;x[Ta';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// Get request data
$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

// Authentication class
class AdminAuth {
    private $pdo;
    private $secretKey = 'vakeelsahiba_admin_secret_2025'; // Change in production
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    public function login($username, $password) {
        try {
            $stmt = $this->pdo->prepare("SELECT id, username, password_hash FROM admin_users WHERE username = ? AND is_active = 1");
            $stmt->execute([$username]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user && password_verify($password, $user['password_hash'])) {
                // Update last login
                $updateStmt = $this->pdo->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = ?");
                $updateStmt->execute([$user['id']]);
                
                // Generate JWT token
                $token = $this->generateToken($user);
                
                return [
                    'success' => true,
                    'token' => $token,
                    'user' => [
                        'id' => $user['id'],
                        'username' => $user['username']
                    ]
                ];
            }
            
            return ['success' => false, 'message' => 'Invalid credentials'];
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Authentication failed'];
        }
    }
    
    public function validateToken($token) {
        try {
            $parts = explode('.', $token);
            if (count($parts) !== 3) {
                return false;
            }
            
            $header = json_decode(base64_decode($parts[0]), true);
            $payload = json_decode(base64_decode($parts[1]), true);
            $signature = $parts[2];
            
            // Verify signature
            $expectedSignature = base64_encode(hash_hmac('sha256', $parts[0] . '.' . $parts[1], $this->secretKey, true));
            if ($signature !== $expectedSignature) {
                return false;
            }
            
            // Check expiration
            if ($payload['exp'] < time()) {
                return false;
            }
            
            return $payload;
        } catch (Exception $e) {
            return false;
        }
    }
    
    private function generateToken($user) {
        $header = ['typ' => 'JWT', 'alg' => 'HS256'];
        $payload = [
            'user_id' => $user['id'],
            'username' => $user['username'],
            'iat' => time(),
            'exp' => time() + (24 * 60 * 60) // 24 hours
        ];
        
        $headerEncoded = base64_encode(json_encode($header));
        $payloadEncoded = base64_encode(json_encode($payload));
        $signature = base64_encode(hash_hmac('sha256', $headerEncoded . '.' . $payloadEncoded, $this->secretKey, true));
        
        return $headerEncoded . '.' . $payloadEncoded . '.' . $signature;
    }
}

// Dashboard class
class AdminDashboard {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    public function getDashboardStats() {
        try {
            $stats = [];
            
            // Total submissions
            $stmt = $this->pdo->query("SELECT COUNT(*) as total FROM contact_submissions");
            $stats['total'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Urgent cases
            $stmt = $this->pdo->query("SELECT COUNT(*) as urgent FROM contact_submissions WHERE urgency = 'urgent'");
            $stats['urgent'] = $stmt->fetch(PDO::FETCH_ASSOC)['urgent'];
            
            // Resolved cases
            $stmt = $this->pdo->query("SELECT COUNT(*) as resolved FROM contact_submissions WHERE status = 'resolved'");
            $stats['resolved'] = $stmt->fetch(PDO::FETCH_ASSOC)['resolved'];
            
            // Today's submissions
            $stmt = $this->pdo->query("SELECT COUNT(*) as today FROM contact_submissions WHERE DATE(created_at) = CURDATE()");
            $stats['today'] = $stmt->fetch(PDO::FETCH_ASSOC)['today'];
            
            // New submissions
            $stmt = $this->pdo->query("SELECT COUNT(*) as new FROM contact_submissions WHERE status = 'new'");
            $stats['new'] = $stmt->fetch(PDO::FETCH_ASSOC)['new'];
            
            // Growth calculations (compared to last month)
            $stmt = $this->pdo->query("
                SELECT 
                    COUNT(CASE WHEN MONTH(created_at) = MONTH(NOW()) THEN 1 END) as current_month,
                    COUNT(CASE WHEN MONTH(created_at) = MONTH(NOW() - INTERVAL 1 MONTH) THEN 1 END) as last_month
                FROM contact_submissions 
                WHERE YEAR(created_at) >= YEAR(NOW() - INTERVAL 1 YEAR)
            ");
            $growth = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($growth['last_month'] > 0) {
                $stats['submissionsGrowth'] = round((($growth['current_month'] - $growth['last_month']) / $growth['last_month']) * 100);
            } else {
                $stats['submissionsGrowth'] = 0;
            }
            
            // Yesterday vs today comparison
            $stmt = $this->pdo->query("
                SELECT 
                    COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END) as today,
                    COUNT(CASE WHEN DATE(created_at) = CURDATE() - INTERVAL 1 DAY THEN 1 END) as yesterday
                FROM contact_submissions
            ");
            $daily = $stmt->fetch(PDO::FETCH_ASSOC);
            $stats['todayChange'] = $daily['today'] - $daily['yesterday'];
            
            // Urgent change (this week vs last week)
            $stmt = $this->pdo->query("
                SELECT 
                    COUNT(CASE WHEN WEEK(created_at) = WEEK(NOW()) AND urgency = 'urgent' THEN 1 END) as this_week,
                    COUNT(CASE WHEN WEEK(created_at) = WEEK(NOW()) - 1 AND urgency = 'urgent' THEN 1 END) as last_week
                FROM contact_submissions
            ");
            $urgentWeekly = $stmt->fetch(PDO::FETCH_ASSOC);
            $stats['urgentChange'] = $urgentWeekly['this_week'] - $urgentWeekly['last_week'];
            
            // Resolved growth
            $stmt = $this->pdo->query("
                SELECT 
                    COUNT(CASE WHEN MONTH(updated_at) = MONTH(NOW()) AND status = 'resolved' THEN 1 END) as current_month,
                    COUNT(CASE WHEN MONTH(updated_at) = MONTH(NOW() - INTERVAL 1 MONTH) AND status = 'resolved' THEN 1 END) as last_month
                FROM contact_submissions
            ");
            $resolvedGrowth = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($resolvedGrowth['last_month'] > 0) {
                $stats['resolvedGrowth'] = round((($resolvedGrowth['current_month'] - $resolvedGrowth['last_month']) / $resolvedGrowth['last_month']) * 100);
            } else {
                $stats['resolvedGrowth'] = 0;
            }
            
            $stats['notifications'] = $stats['new'] + $stats['urgent'];
            
            return ['success' => true, 'data' => $stats];
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Failed to load dashboard stats'];
        }
    }
    
    public function getRecentSubmissions($limit = 5) {
        try {
            $stmt = $this->pdo->prepare("
                SELECT id, name, email, phone, service, urgency, status, created_at 
                FROM contact_submissions 
                ORDER BY created_at DESC 
                LIMIT ?
            ");
            $stmt->execute([$limit]);
            $submissions = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return ['success' => true, 'data' => $submissions];
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Failed to load recent submissions'];
        }
    }
    
    public function getServiceStats() {
        try {
            $stmt = $this->pdo->query("
                SELECT service, COUNT(*) as count 
                FROM contact_submissions 
                GROUP BY service 
                ORDER BY count DESC
            ");
            $services = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return ['success' => true, 'data' => $services];
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Failed to load service stats'];
        }
    }
    
    public function getSubmissions($page = 1, $limit = 10) {
        try {
            $offset = ($page - 1) * $limit;
            
            // Get total count
            $countStmt = $this->pdo->query("SELECT COUNT(*) as total FROM contact_submissions");
            $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Get submissions
            $stmt = $this->pdo->prepare("
                SELECT * FROM contact_submissions 
                ORDER BY created_at DESC 
                LIMIT ? OFFSET ?
            ");
            $stmt->execute([$limit, $offset]);
            $submissions = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return [
                'success' => true, 
                'data' => $submissions,
                'total' => $total,
                'page' => $page,
                'limit' => $limit
            ];
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Failed to load submissions'];
        }
    }
    
    public function getSubmission($id) {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM contact_submissions WHERE id = ?");
            $stmt->execute([$id]);
            $submission = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$submission) {
                return ['success' => false, 'message' => 'Submission not found'];
            }
            
            return ['success' => true, 'data' => $submission];
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Failed to load submission'];
        }
    }
    
    public function getUrgentCases() {
        try {
            $stmt = $this->pdo->query("
                SELECT * FROM contact_submissions 
                WHERE urgency = 'urgent' AND status != 'resolved'
                ORDER BY created_at ASC
            ");
            $cases = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return ['success' => true, 'data' => $cases];
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Failed to load urgent cases'];
        }
    }
    
    public function updateSubmissionStatus($id, $status) {
        try {
            $validStatuses = ['new', 'contacted', 'resolved'];
            if (!in_array($status, $validStatuses)) {
                return ['success' => false, 'message' => 'Invalid status'];
            }
            
            $stmt = $this->pdo->prepare("
                UPDATE contact_submissions 
                SET status = ?, updated_at = NOW() 
                WHERE id = ?
            ");
            $stmt->execute([$status, $id]);
            
            if ($stmt->rowCount() > 0) {
                return ['success' => true, 'message' => 'Status updated successfully'];
            } else {
                return ['success' => false, 'message' => 'Submission not found'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Failed to update status'];
        }
    }
}

// Initialize classes
$auth = new AdminAuth($pdo);
$dashboard = new AdminDashboard($pdo);

// Handle authentication for protected routes
$protectedActions = [
    'get_dashboard_stats', 'get_recent_submissions', 'get_service_stats',
    'get_submissions', 'get_submission', 'get_urgent_cases', 'update_submission_status'
];

if (in_array($action, $protectedActions)) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (strpos($authHeader, 'Bearer ') === 0) {
        $token = substr($authHeader, 7);
        $tokenData = $auth->validateToken($token);
        
        if (!$tokenData) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid or expired token']);
            exit;
        }
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Authorization token required']);
        exit;
    }
}

// Route actions
switch ($action) {
    case 'login':
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';
        
        if (empty($username) || empty($password)) {
            echo json_encode(['success' => false, 'message' => 'Username and password required']);
            break;
        }
        
        $result = $auth->login($username, $password);
        echo json_encode($result);
        break;
        
    case 'get_dashboard_stats':
        $result = $dashboard->getDashboardStats();
        echo json_encode($result);
        break;
        
    case 'get_recent_submissions':
        $limit = $input['limit'] ?? 5;
        $result = $dashboard->getRecentSubmissions($limit);
        echo json_encode($result);
        break;
        
    case 'get_service_stats':
        $result = $dashboard->getServiceStats();
        echo json_encode($result);
        break;
        
    case 'get_submissions':
        $page = $input['page'] ?? 1;
        $limit = $input['limit'] ?? 10;
        $result = $dashboard->getSubmissions($page, $limit);
        echo json_encode($result);
        break;
        
    case 'get_submission':
        $id = $input['id'] ?? 0;
        $result = $dashboard->getSubmission($id);
        echo json_encode($result);
        break;
        
    case 'get_urgent_cases':
        $result = $dashboard->getUrgentCases();
        echo json_encode($result);
        break;
        
    case 'update_submission_status':
        $id = $input['id'] ?? 0;
        $status = $input['status'] ?? '';
        $result = $dashboard->updateSubmissionStatus($id, $status);
        echo json_encode($result);
        break;
        
    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}
?>