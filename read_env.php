<?php
header('Content-Type: text/plain');
if (file_exists('.env')) {
    echo file_get_contents('.env');
} else {
    echo ".env not found";
}
