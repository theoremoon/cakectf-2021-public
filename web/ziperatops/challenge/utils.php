<?php
/**
 * Upload files
 */
function setup($name) {
    /* Create a working directory */
    $dname = sha1(uniqid());
    @mkdir("temp/$dname");

    /* Check if files are uploaded */
    if (empty($_FILES[$name]) || !is_array($_FILES[$name]['name']))
        return array($dname, null);

    /* Validation */
    for ($i = 0; $i < count($_FILES[$name]['name']); $i++) {
        $tmpfile = $_FILES[$name]['tmp_name'][$i];
        $filename = $_FILES[$name]['name'][$i];
        if (!is_uploaded_file($tmpfile))
            continue;

        /* Check the uploaded zip file */
        $zip = new ZipArchive;
        if ($zip->open($tmpfile) !== TRUE)
            return array($dname, "Invalid file format");

        /* Check filename */
        if (preg_match('/^[-_a-zA-Z0-9\.]+$/', $filename, $result) !== 1)
            return array($dname, "Invalid file name: $filename");

        /* Detect hacking attempt (This is not necessary but just in case) */
        if (strstr($filename, "..") !== FALSE)
            return array($dname, "Do not include '..' in file name");

        /* Check extension */
        if (preg_match('/^.+\.zip/', $filename, $result) !== 1)
            return array($dname, "Invalid extension (Only .zip is allowed)");

        /* Move the files */
        if (@move_uploaded_file($tmpfile, "temp/$dname/$filename") !== TRUE)
            return array($dname, "Failed to upload the file: $dname/$filename");
    }

    return array($dname, null);
}

/**
 * Remove a directory and its contents
 */
function cleanup($dname) {
    foreach (glob("temp/$dname/*") as $file) {
        @unlink($file);
    }
    @rmdir("temp/$dname");
}
?>
