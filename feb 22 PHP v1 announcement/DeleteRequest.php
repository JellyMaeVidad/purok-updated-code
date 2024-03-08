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

function deleteAnnouncement($conn, $announcementId) {
    // Use prepared statements to prevent SQL injection
    $sql = "DELETE FROM request_documents WHERE id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $announcementId);
    $result = $stmt->execute();

    if ($result) {
        $response = ["success" => true];
    } else {
        $response = ["success" => false, "message" => "Failed to delete announcement: " . $stmt->error];
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

            // Retrieve the announcementId from POST data
            $announcementId = $_POST['announcementId'] ?? null;

            if ($announcementId !== null) {
                // Call the deleteAnnouncement function with the correct parameter
                deleteAnnouncement($conn, $announcementId);
            } else {
                $response = ["success" => false, "message" => "Invalid or missing announcementId"];
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

