<?php
require_once 'util.php';

session_start();
$results = get_cached_contents();
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>MofuMofuDiary</title>
        <link rel="stylesheet" href="https://fonts.xz.style/serve/inter.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@exampledev/new.css@1.1.2/new.min.css">
    </head>
    <body>
        <h1>MofuMofuDiary</h1>
        <p>Check out the fluffiest pictures I've taken!</p>
        <?php foreach($results as $result) { ?>
            <details>
                <summary><?= $result['description'] ?></summary>
                <img src="<?= $_SESSION[$result['name']] ?>" alt="image">
            </details>
        <?php } ?>
    </body>
</html>
