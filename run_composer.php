<?php
echo "Downloading composer.phar...\n";
if (!file_exists('composer.phar')) {
    copy('https://getcomposer.org/installer', 'composer-setup.php');
    exec('php composer-setup.php');
    unlink('composer-setup.php');
}

echo "Running composer dump-autoload...\n";
exec('php composer.phar dump-autoload -o', $output, $return_var);
print_r($output);
echo "Return var: $return_var\n";
