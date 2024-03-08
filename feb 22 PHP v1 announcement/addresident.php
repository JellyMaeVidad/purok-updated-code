<?php


use Firebase\JWT\JWT;
use Firebase\JWT\Key;
require_once __DIR__ . '/headers.php';
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/vendor/firebase/php-jwt/src/JWT.php';
require_once __DIR__ . '/db.php';

session_start();

function addNewResident($newStudentData, $conn) {
    $sql = "INSERT INTO residents (
        email,
        password,
        firstName,
        lastName,
        middlename, 
        birthdate,
        parentcontactnumber,
        role
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = mysqli_prepare($conn, $sql);

    if (!$stmt) {
        $error = mysqli_error($conn);
        $sqlError = mysqli_stmt_error($stmt);
        return [
            "success" => false,
            "message" => "Failed to prepare statement. SQL error: $sqlError. PHP error: $error"
        ];
    }
    
    $email = mysqli_real_escape_string($conn, $newStudentData['email']);
    $password = mysqli_real_escape_string($conn, $newStudentData['password']);
    $firstName = mysqli_real_escape_string($conn, $newStudentData['firstname']);
    $lastName = mysqli_real_escape_string($conn, $newStudentData['lastname']);

    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    mysqli_stmt_bind_param($stmt, "ssssssss",
    $email,
    $hashedPassword,
    $firstName,
    $lastName,
    $newStudentData['middlename'],
    $newStudentData['studentbirthdate'],
    $newStudentData['studentparentcontact'],
    $newStudentData['role']
);

    $result = mysqli_stmt_execute($stmt);

    if ($result) {
        return ["success" => true, "message" => "Student added successfully"];
    } else {
        $error = mysqli_error($conn);
        return ["success" => false, "message" => "Failed to add Student: $error"];
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $newStudentData = $_POST;


    $result = addNewResident($newStudentData, $conn);


    header('Content-Type: application/json');
    echo json_encode($result);
} else {

    http_response_code(405); 
    echo json_encode(['error' => 'Invalid request method']);
}






