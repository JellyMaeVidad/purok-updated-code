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
            'error' => 'Token has expired',
            'message' => $e->getMessage(),
        ];
        http_response_code(401);
        echo json_encode($response);
        return null;
    } catch (\Firebase\JWT\SignatureInvalidException $e) {
        $response = [
            'error' => 'Invalid JWT Signature',
            'message' => $e->getMessage(),
        ];
        http_response_code(401);
        echo json_encode($response);
        return null;
    } catch (Exception $e) {
        $response = [
            'error' => 'Token validation failed',
            'message' => $e->getMessage(),
        ];
        http_response_code(401);
        echo json_encode($response);
        return null;
    }
}

function fetchUnreadAnnouncementsCount($conn) {
    // Replace this with your actual logic to fetch the count from the database
    // For demonstration purposes, let's count the number of new records in the request_documents table
    $sql = "SELECT COUNT(*) AS unreadAnnouncementsCount FROM request_documents WHERE visibility_flag = 'requestvisible' AND is_confirmed = 'unconfirm'";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return $row['unreadAnnouncementsCount'];
    } else {
        return 0;
    }
}

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $headers = apache_request_headers();
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
        error_log('Received Authorization Header: ' . $authHeader);

        if (strpos($authHeader, 'Bearer') === 0) {
            $token = substr($authHeader, 7);
            $key = "shytmiming";
            $decoded = validateToken($token);

            if ($decoded) {
                $unreadAnnouncementsCount = fetchUnreadAnnouncementsCount($conn);

                $responseData = [
                    "success" => true,
                    "unreadAnnouncements" => $unreadAnnouncementsCount,
                ];
                echo json_encode($responseData);
            } else {
                // validateToken function will handle invalid token responses
            }
        } else {
            $responseData = ["success" => false, "message" => "Invalid token format"];
            echo json_encode($responseData);
        }
    } else {
        $responseData = ["success" => false, "message" => "Authorization header missing"];
        echo json_encode($responseData);
    }
}

$conn->close();
?>
