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

if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    $headers = apache_request_headers();
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
        error_log('Received Authorization Header: ' . $authHeader);

        if (strpos($authHeader, 'Bearer') === 0) {
            $token = substr($authHeader, 7);
            $key = "shytmiming";
            $decoded = validateToken($token);

            if ($decoded) {
                // Check if resident_id parameter is provided in the URL
                if (isset($_GET['residentId'])) {
                    $residentId = $_GET['residentId'];

                    $sql = "DELETE FROM residents WHERE id = ?";
                    $stmt = $conn->prepare($sql);
                    $stmt->bind_param("i", $residentId); // Use "i" for integer binding
                    
                    if ($stmt->execute()) {
                        $responseData = [
                            "success" => true,
                            "message" => "Resident deleted successfully",
                        ];
                        echo json_encode($responseData);
                    } else {
                        $responseData = [
                            "success" => false,
                            "message" => "Failed to delete resident",
                        ];
                        echo json_encode($responseData);
                    }
                    
                    $stmt->close();
                    
                } else {
                    $responseData = [
                        "success" => false,
                        "message" => "Missing 'residentId' parameter",
                    ];
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
