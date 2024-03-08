<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require_once __DIR__ . '/headers.php';
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/vendor/firebase/php-jwt/src/JWT.php';
require_once __DIR__ . '/db.php';

session_start();

function validateToken($token) {
    $key = "shytmiming";
    try {
        $decoded = JWT::decode($token, new Key($key, 'HS256'));
        return $decoded;
    } catch (\Firebase\JWT\ExpiredException $e) {
        $response = [
            'success' => false,
            'error' => 'Token has expired',
            'message' => $e->getMessage(),
        ];
        http_response_code(401);
        echo json_encode($response);
        return null;
    } catch (\Firebase\JWT\SignatureInvalidException $e) {
        $response = [
            'success' => false,
            'error' => 'Invalid JWT Signature',
            'message' => $e->getMessage(),
        ];
        http_response_code(401);
        echo json_encode($response);
        return null;
    } catch (Exception $e) {
        $response = [
            'success' => false,
            'error' => 'Token validation failed',
            'message' => $e->getMessage(),
        ];
        http_response_code(401);
        echo json_encode($response);
        return null;
    }
}

function sendRequest($conn, $userId) {
    // Check if payment is pending before sending the request
    $checkPaymentStatusSql = "SELECT Payment FROM request_documents WHERE id = ?";
    $checkStmt = $conn->prepare($checkPaymentStatusSql);
    $checkStmt->bind_param("i", $userId);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    $row = $checkResult->fetch_assoc();
    
    if ($row['Payment'] === 'Pending') {
        // Payment is pending, return error response
        return ['success' => false, 'message' => 'Cannot send request because payment is pending'];
    }

    // Use prepared statements to prevent SQL injection
    $sql = "UPDATE request_documents SET visibility_flag = 'requestvisible' WHERE id = ? AND is_confirmed = 'unconfirm'";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $userId);
    $result = $stmt->execute();

    if ($result) {
        $response = ["success" => true];
    } else {
        $response = ["success" => false, "message" => "Failed to send request: " . $stmt->error];
    }

    // Return a JSON-encoded string
    return $response;
}



if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $headers = apache_request_headers();
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
        error_log('Received Authorization Header: ' . $authHeader);

        if (strpos($authHeader, 'Bearer') === 0) {
            $token = substr($authHeader, 7);

            // Extract user_id and visibility_flag directly from the form data
            $userId = $_POST['user_id'] ?? null;
            $visibilityFlag = $_POST['visibility_flag'] ?? 'requestvisible'; // Set default if not provided
            // Set default if not provided

            if ($userId !== null) {
                sendRequest($conn, $userId, $visibilityFlag);
            } else {
                $response = ["success" => false, "message" => "Invalid or missing user_id"];
                echo json_encode($response);
            }
        } else {
            $response = ["success" => false, "message" => "Invalid token format"];
            echo json_encode($response);
        }
    } else {
        $response = ["success" => false, "message" => "Authorization header missing"];
        echo json_encode($response);
    }
}

$conn->close();
?>

