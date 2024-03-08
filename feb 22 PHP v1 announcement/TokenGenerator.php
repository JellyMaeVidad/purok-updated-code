
<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
require_once __DIR__ . '/headers.php';
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/vendor/firebase/php-jwt/src/JWT.php';


function generateToken($user) {
    $key = "shytmiming";
    $expTime = time() + 12600;

    try {
        $payload = [
            "id" => $user['id'],
            "firstName" => $user['firstName'],
            "role" => $user['role'],
            "exp" => $expTime,
        ];

        $token = JWT::encode($payload, $key, 'HS256');
        return $token;
    } catch (\Exception $e) {
        $response = [
            'error' => 'Token generation failed',
            'message' => $e->getMessage(),
        ];
        http_response_code(500);
        echo json_encode($response);
        exit;
    }
}