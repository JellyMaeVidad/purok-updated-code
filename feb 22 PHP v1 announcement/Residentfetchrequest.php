<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require_once __DIR__ . '/headers.php';
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/vendor/firebase/php-jwt/src/JWT.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/TokenGenerator.php';
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

function fetchDocuments($conn, $userId) {
    $query = "SELECT document_type, reason, is_confirmed,confirm_by_president FROM request_documents WHERE resident_id = ?";
    $statement = $conn->prepare($query);
    $statement->bind_param("i", $userId);
    $statement->execute();
    $result = $statement->get_result();

    if (!$result) {
        return ['success' => false, 'message' => 'Query failed: ' . $conn->error];
    }

    $documents = [];

    while ($row = $result->fetch_assoc()) {
        $documents[] = $row;
    }

    return ['success' => true, 'documents' => $documents];
}

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $headers = apache_request_headers();
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
        error_log('Received Authorization Header: ' . $authHeader);

        if (strpos($authHeader, 'Bearer') === 0) {
            $token = substr($authHeader, 7);

            $decoded = validateToken($token);

            if ($decoded) {
                $userId = $decoded->id; // Assuming your token contains user ID
                // Call the fetchDocuments function with the user ID
                $response = fetchDocuments($conn, $userId);

                if ($response['success']) {
                    echo json_encode($response);
                } else {
                    // If fetchDocuments returned failure, create a failure response
                    $responseData = ["success" => false, "message" => "Failed to fetch documents"];
                    echo json_encode($responseData);
                }
            } else {
                $responseData = ["success" => false, "message" => "Invalid token"];
                echo json_encode($responseData);
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
