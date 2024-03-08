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

function getResidentData($conn) {
    error_log('getResidentData function called');
    $sql = "SELECT id, firstName, lastName, email, middlename, birthdate, parentcontactnumber, role FROM residents";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $residents = $result->fetch_all(MYSQLI_ASSOC);
        $response = array('residents' => $residents);
        return json_encode($response); 
    } else {
        return json_encode(array('residents' => array()));
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
                $residentsData = getResidentData($conn);
                $responseData = [
                    "success" => true,
                    "firstName" => $firstName,
                    "residents" => $residentsData,
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
