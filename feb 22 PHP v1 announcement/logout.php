<?php
require_once __DIR__ . '/headers.php';

if (isset($_SESSION['token'])) {
    session_destroy();
    session_unset();

    if (isset($_COOKIE[session_name()])) {
        setcookie(session_name(), '', time() - 3600, '/');
    }


    setcookie('token', '', time() - 3600, '/', '', true, true);

    echo json_encode(['success' => true, 'message' => 'Logout successful', 'redirect' => '/']);
} else {
    echo json_encode(['success' => false, 'message' => 'You are not logged in']);
}
?>
