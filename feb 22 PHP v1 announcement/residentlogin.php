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

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"];
    $password = $_POST["password"];

    $sql = "SELECT id, firstName, role, password FROM residents WHERE email = ?";
    $stmt = mysqli_prepare($conn, $sql);

    if ($stmt) {
        mysqli_stmt_bind_param($stmt, "s", $email);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_store_result($stmt);

        if (mysqli_stmt_num_rows($stmt) === 1) {
            mysqli_stmt_bind_result($stmt, $user_id, $firstName, $role, $storedHashedPassword);
            mysqli_stmt_fetch($stmt);

            if (password_verify($password, $storedHashedPassword)) {
                $sqlRole = "SELECT role FROM residents WHERE id = ?";
                $stmtRole = mysqli_prepare($conn, $sqlRole);

                if ($stmtRole) {
                    mysqli_stmt_bind_param($stmtRole, "s", $user_id);
                    mysqli_stmt_execute($stmtRole);
                    mysqli_stmt_store_result($stmtRole);

                    if (mysqli_stmt_num_rows($stmtRole) === 1) {
                        mysqli_stmt_bind_result($stmtRole, $role);
                        mysqli_stmt_fetch($stmtRole);

                        $token = generateToken(["id" => $user_id, "firstName" => $firstName, "role" => $role]);
                        $_SESSION['token'] = $token;

                        echo json_encode(["success" => true, "user_id" => $user_id, "firstName" => $firstName, "token" => $token, "role" => $role]);
                    } else {
                        echo json_encode(["success" => false, "message" => "Failed to retrieve user's role"]);
                    }

                    mysqli_stmt_close($stmtRole);
                } else {
                    echo json_encode(["success" => false, "message" => "Failed to prepare statement for retrieving role"]);
                }
            } else {
                echo json_encode(["success" => false, "message" => "Invalid email or password"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Invalid email or password"]);
        }

        mysqli_stmt_close($stmt);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to prepare statement"]);
    }
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
                $firstName = $decoded->firstName;

                $userType = determineUserType($decoded->id);

                $userData = getUserData($conn, $userType);

                $responseData = [
                    "success" => true,
                    "firstName" => $firstName,
                    "users" => $userData,
                ];
                echo json_encode($responseData);
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
