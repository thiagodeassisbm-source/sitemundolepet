<?php
session_start();
echo "<html><body style='font-family:monospace; background:#111; color:#eee; padding:20px;'>";
echo "<h2>🕵️ Debug de Sessão</h2>";

echo "Session ID: " . session_id() . "<br>";
echo "CSRF Token (from session): " . (isset($_SESSION['_token']) ? $_SESSION['_token'] : 'NOT SET') . "<br>";
echo "Request Method: " . $_SERVER['REQUEST_METHOD'] . "<br>";
echo "Secure Cookie: " . (ini_get('session.cookie_secure') ? 'YES' : 'NO') . "<br>";
echo "HTTP Only: " . (ini_get('session.cookie_httponly') ? 'YES' : 'NO') . "<br>";
echo "Cookie Domain: " . ini_get('session.cookie_domain') . "<br>";
echo "Cookie Path: " . ini_get('session.cookie_path') . "<br>";

echo "<h3>Headers</h3>";
echo "<pre>";
print_r(getallheaders());
echo "</pre>";

echo "<h3>Storage Stats</h3>";
$sessionPath = storage_path('framework/sessions');
echo "Session Path: $sessionPath<br>";
if (is_dir($sessionPath)) {
    $files = scandir($sessionPath);
    echo "Files in session dir: " . count($files) . "<br>";
} else {
    echo "Session dir NOT FOUND<br>";
}

echo "</body></html>";
