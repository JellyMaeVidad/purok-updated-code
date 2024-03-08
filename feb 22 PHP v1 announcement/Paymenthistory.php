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

function getDocumentsData($conn) {
    $sql = "SELECT id, resident_id, document_type, reason, Payment, created_at,Paid_at FROM request_documents WHERE Payment = 'Paid'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $documents = $result->fetch_all(MYSQLI_ASSOC);
        return $documents;
    } else {
        return array();
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
                $firstName = $decoded->firstName;
                $documentsData = getDocumentsData($conn); // assuming you have a function to retrieve documents
                $responseData = [
                    "success" => true,
                    "firstName" => $firstName,
                    "documents" => $documentsData,
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
