<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

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

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

switch ($action) {
    case 'login':
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';

        if (empty($username) || empty($password)) {
            echo json_encode(['success' => false, 'message' => 'Username and password required']);
            break;
        }

        $stmt = $pdo->prepare("SELECT id, username, password_hash FROM admin_users WHERE username = ? AND is_active = 1");
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password_hash'])) {
            $_SESSION['admin_user'] = [
                'id' => $user['id'],
                'username' => $user['username']
            ];

            $pdo->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = ?")->execute([$user['id']]);

            // Generate a simple session token (for demo, use session_id)
            $token = session_id();

            echo json_encode([
                'success' => true,
                'user' => $_SESSION['admin_user'],
                'token' => $token
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        }
        break;

    case 'check_session':
        if (isset($_SESSION['admin_user'])) {
            echo json_encode(['success' => true, 'user' => $_SESSION['admin_user']]);
        } else {
            echo json_encode(['success' => false]);
        }
        break;

    case 'logout':
        session_destroy();
        echo json_encode(['success' => true]);
        break;

    case 'get_submissions':
        // Pagination and filtering
        $page = isset($input['page']) ? (int)$input['page'] : 1;
        $limit = isset($input['limit']) ? (int)$input['limit'] : 10;
        $offset = ($page - 1) * $limit;
        $status = $input['status'] ?? '';
        $urgency = $input['urgency'] ?? '';
        $service = $input['service'] ?? '';
        $search = $input['search'] ?? '';

        $where = [];
        $params = [];
        if ($status) {
            $where[] = 'status = ?';
            $params[] = $status;
        }
        if ($urgency) {
            $where[] = 'urgency = ?';
            $params[] = $urgency;
        }
        if ($service) {
            $where[] = 'service = ?';
            $params[] = $service;
        }
        if ($search) {
            $where[] = '(name LIKE ? OR email LIKE ? OR phone LIKE ? OR message LIKE ?)';
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }
        $whereSql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';

        // Get total count
        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM contact_submissions $whereSql");
        $countStmt->execute($params);
        $total = (int)$countStmt->fetchColumn();

        // Get submissions
        $sql = "SELECT * FROM contact_submissions $whereSql ORDER BY submission_date DESC LIMIT $limit OFFSET $offset";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $submissions = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Format name field for frontend
        foreach ($submissions as &$row) {
            $row['name'] = trim(($row['first_name'] ?? '') . ' ' . ($row['last_name'] ?? ''));
        }

        echo json_encode([
            'success' => true,
            'data' => $submissions,
            'total' => $total
        ]);
        break;

    case 'get_submission':
        $id = $input['id'] ?? 0;
        $stmt = $pdo->prepare("SELECT * FROM contact_submissions WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            $row['name'] = trim(($row['first_name'] ?? '') . ' ' . ($row['last_name'] ?? ''));
            echo json_encode(['success' => true, 'data' => $row]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Submission not found']);
        }
        break;

    case 'update_submission_status':
        $id = $input['id'] ?? 0;
        $status = $input['status'] ?? '';
        if (!$id || !$status) {
            echo json_encode(['success' => false, 'message' => 'ID and status required']);
            break;
        }
        $stmt = $pdo->prepare("UPDATE contact_submissions SET status = ? WHERE id = ?");
        $success = $stmt->execute([$status, $id]);
        echo json_encode(['success' => $success]);
        break;

    case 'get_recent_submissions':
        $limit = isset($input['limit']) ? (int)$input['limit'] : 5;
        $stmt = $pdo->prepare("SELECT *, CONCAT(first_name, ' ', last_name) AS name FROM contact_submissions ORDER BY submission_date DESC LIMIT ?");
        $stmt->bindValue(1, $limit, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $rows]);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
?>
