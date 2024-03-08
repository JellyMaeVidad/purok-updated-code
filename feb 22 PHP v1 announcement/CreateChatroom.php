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

function createChatroom($conn, $chatCode) {
    $sql = "INSERT INTO Chatrooms (chat_code) VALUES (?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $chatCode);
    $result = $stmt->execute();

    if ($result) {
        $response = ["success" => true, "message" => "Chatroom created successfully"];
    } else {
        $response = ["success" => false, "message" => "Failed to create chatroom: " . $stmt->error];
    }

    return $response;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
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

                // Handle creating the chatroom with the generated code
                $chatCode = $_POST['chat_code'] ?? null;
                if ($chatCode) {
                    $createChatroomResponse = createChatroom($conn, $chatCode);
                    echo json_encode($createChatroomResponse);
                    return;
                } else {
                    $responseData = ["success" => false, "message" => "Chat code is missing"];
                    echo json_encode($responseData);
                    return;
                }
            } else {
                // validateToken function will handle invalid token responses
            }
        } else {
            $responseData = ["success" => false, "message" => "Invalid token format"];
            echo json_encode($responseData);
            return;
        }
    } else {
        $responseData = ["success" => false, "message" => "Authorization header missing"];
        echo json_encode($responseData);
        return;
    }
}

$conn->close();
?>