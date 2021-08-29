<?php
require_once 'utils.php';

function ziperatops() {
    /* Upload files */
    list($dname, $err) = setup('zipfile');
    if ($err) {
        cleanup($dname);
        return array(null, $err);
    }

    /* List files in the zip archives */
    $results = array();
    foreach (glob("temp/$dname/*") as $path) {
        $zip = new ZipArchive;
        $zip->open($path);
        for ($i = 0; $i < $zip->count(); $i++) {
            array_push($results, $zip->getNameIndex($i));
        }
    }

    /* Cleanup */
    cleanup($dname);
    return array($results, null);
}

list($results, $err) = ziperatops();
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>ziperatops</title>
    </head>
    <body>
        <h1>Ziperatops</h1>
        <p>Zip Listing as a Service</p>
        <form action="/" method="post" enctype="multipart/form-data">
            <input type="file" multiple name="zipfile[]">
            <input type="submit" value="Submit">
        </form>
        <?php if ($err) { ?>
            <p style="color:red;">Error: <?= htmlspecialchars($err); ?></p>
        <?php } ?>
        <?php if ($results) { ?>
            <hr>
            <ul>
                <?php foreach ($results as $name) { ?>
                    <li><?= htmlspecialchars($name); ?></li>
                <?php } ?>
            </ul>
        <?php } ?>
    </body>
</html>
