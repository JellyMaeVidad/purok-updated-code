<?php
// Ensure error reporting is enabled for development
error_reporting(E_ALL);
ini_set('display_errors', 1);

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require_once __DIR__ . '/headers.php';
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/vendor/firebase/php-jwt/src/JWT.php';
require_once __DIR__ . '/db.php';

session_start();

function validateToken($token) {
    // Define your secret key (keep it secret)
    $key = "shytmiming";

    try {
        $decoded = JWT::decode($token, new Key($key, 'HS256'));
        return $decoded;
    } catch (\Firebase\JWT\ExpiredException $e) {
        // Token has expired
        $response = [
            'success' => false,
            'error' => 'Token has expired',
            'message' => $e->getMessage(),
        ];
        http_response_code(401); // Set HTTP status code for unauthorized access
        echo json_encode($response);
        return null;
    } catch (\Firebase\JWT\SignatureInvalidException $e) {
        // Invalid JWT signature
        $response = [
            'success' => false,
            'error' => 'Invalid JWT Signature',
            'message' => $e->getMessage(),
        ];
        http_response_code(401); // Set HTTP status code for unauthorized access
        echo json_encode($response);
        return null;
    } catch (Exception $e) {
        // General exception
        $response = [
            'success' => false,
            'error' => 'Token validation failed',
            'message' => $e->getMessage(),
        ];
        http_response_code(401); // Set HTTP status code for unauthorized access
        echo json_encode($response);
        return null;
    }
}

function getUserDetails($conn, $id) {
    // Fetch user details from the database based on the provided id
    $query = "SELECT id, firstName, email, role FROM residents WHERE id = ?";
    $stmt = $conn->prepare($query);

    // Error handling for prepare
    if (!$stmt) {
        die(json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]));
    }

    $stmt->bind_param('i', $id);

    // Error handling for execute
    if (!$stmt->execute()) {
        die(json_encode(['success' => false, 'message' => 'Execute failed: ' . $stmt->error]));
    }

    // Get result
    $result = $stmt->get_result();

    // Fetch associative array
    $userDetails = $result->fetch_assoc();

    if ($userDetails) {
        // Return the details as a JSON response
        return json_encode(['success' => true, 'userDetails' => $userDetails]);
    } else {
        // If no user details were found
        return json_encode(['success' => false, 'message' => 'User details not found']);
    }
}




if ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Fetch user details logic
    $headers = apache_request_headers();
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
        error_log('Received Authorization Header: ' . $authHeader);

        if (strpos($authHeader, 'Bearer') === 0) {
            $token = substr($authHeader, 7);
            $key = "shytmiming";
            $decoded = validateToken($token);

            if ($decoded) {
                $id = $decoded->id;
                $userDetails = getUserDetails($conn, $id);
                $responseData = [
                    'success' => true,
                    'userDetails' => $userDetails,
                ];
                echo json_encode($responseData);
            } else {
                $responseData = ['success' => false, 'message' => 'Invalid token'];
                echo json_encode($responseData);
            }
        } else {
            $responseData = ['success' => false, 'message' => 'Invalid token format'];
            echo json_encode($responseData);
        }
    } else {
        $responseData = ['success' => false, 'message' => 'Authorization header missing'];
        echo json_encode($responseData);
    }
}

$conn->close();
?>
