<?php
// Set CORS headers to allow requests from your React app's origin
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST , PUT , DELETE");
header("Access-Control-Allow-Headers: Content-Type, Accept,  X-Auth-Token, Origin,  Authorization,  Client-Security-Token, Accept-Encoding, X-Requested-With");
// header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require 'vendor/autoload.php'; // Include your JWT library or the necessary JWT-related code

// Get the token from the POST request
$token = $_POST['token'];

// Your secret key for JWT (make sure it matches the one used to create tokens)
$secretKey = 'shytmiming';

try {
    // Verify and decode the token using your JWT library
    $decoded = \Firebase\JWT\JWT::decode($token, $secretKey, ['HS256']);

    // Check if the token is valid and unexpired
    if ($decoded && $decoded->exp > time()) {
        // Token is valid
        $response = [
            'valid' => true,
            'message' => 'Token is valid.'
        ];
        http_response_code(200); // Set an appropriate HTTP status code
    } else {
        // Token is invalid or expired
        $response = [
            'valid' => false,
            'message' => 'Token is invalid or expired.'
        ];
        http_response_code(401); // Unauthorized status code
    }
} catch (\Firebase\JWT\ExpiredException $e) {
    // Handle token expiration
    $response = [
        'valid' => false,
        'message' => 'Token has expired: ' . $e->getMessage()
    ];
    http_response_code(401); // Unauthorized status code
} catch (\Firebase\JWT\SignatureInvalidException $e) {
    // Handle signature verification failure
    $response = [
        'valid' => false,
        'message' => 'Token signature is invalid: ' . $e->getMessage()
    ];
    http_response_code(401); // Unauthorized status code
} catch (\Exception $e) {
    // Handle other exceptions
    $response = [
        'valid' => false,
        'message' => 'Token validation failed: ' . $e->getMessage()
    ];
    http_response_code(401); // Unauthorized status code
}

