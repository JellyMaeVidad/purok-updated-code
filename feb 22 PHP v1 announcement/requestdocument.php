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

function requestDocument($conn, $userId, $documentType, $reason) {
    if (!$userId) {
        return ['success' => false, 'message' => 'Invalid resident ID'];
    }

    // Set the time zone to Philippines
    date_default_timezone_set('Asia/Manila');
    
    // Format the timestamp in 12-hour format without leading zeroes and without seconds
    $formattedTimestamp = date('Y-m-d g:i A'); // Format as 'YYYY-MM-DD h:i AM/PM'

    // Modified query to include formatted timestamp
    $query = "INSERT INTO request_documents (resident_id, document_type, reason, is_confirmed, requested_at) VALUES (?, ?, ?, 'unconfirm', ?)";
    $stmt = $conn->prepare($query);

    if (!$stmt) {
        return ['success' => false, 'message' => 'Prepare failed: ' . $conn->error];
    }

    $bindResult = $stmt->bind_param('isss', $userId, $documentType, $reason, $formattedTimestamp);
    if (!$bindResult) {
        return ['success' => false, 'message' => 'Binding parameters failed: ' . $stmt->error];
    }

    $executeResult = $stmt->execute();
    if (!$executeResult) {
        return ['success' => false, 'message' => 'Execute failed: ' . $stmt->error];
    }

    $stmt->close(); 

    // Debugging info
    return ['success' => true, 'message' => 'Request submitted successfully', 'requested_at' => $formattedTimestamp];
}






if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $headers = apache_request_headers();
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
        error_log('Received Authorization Header: ' . $authHeader);

        if (strpos($authHeader, 'Bearer') === 0) {
            $token = substr($authHeader, 7);

            $decoded = JWT::decode($token, new Key("shytmiming", 'HS256'));

            if ($decoded) {
               // Debugging statement to log received POST data
                error_log("Received POST data: " . file_get_contents("php://input"));
                $rawPostData = file_get_contents("php://input");

                // Decode JSON data
                $requestData = json_decode($rawPostData, true);
                // Get the reason, documentType, and userId data from the POST request
                $reason = $requestData['reason'] ?? null;
                $documentType = $requestData['documentType'] ?? null;
                $userId = $requestData['userId'] ?? null;

                // Debugging statements to log the received parameters
                error_log("Reason: $reason, DocumentType: $documentType, UserID: $userId");

                // Ensure all required data is provided
                if ($reason !== null && $documentType !== null && $userId !== null) {
                    // Call the requestDocument function
                    $response = requestDocument($conn, $userId, $documentType, $reason);

                    echo json_encode($response);
                } else {
                    $responseData = ["success" => false, "message" => "Missing required data"];
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
