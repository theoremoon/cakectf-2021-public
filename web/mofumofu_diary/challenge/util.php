<?php
function img2b64($image) {
    return 'data:jpg;base64,'.base64_encode(file_get_contents($image));
}

function get_cached_contents() {
    $results = [];

    if (empty($_COOKIE['cache'])) {

        $images = glob('images/*.jpg');
        $expiry = time() + 60*60*24*7;

        foreach($images as $image) {
            $text = preg_replace('/\\.[^.\\s]{3,4}$/', '.txt', $image);
            $description = trim(file_get_contents($text));
            array_push($results, array(
                'name' => $image,
                'description' => $description
            ));
            $_SESSION[$image] = img2b64($image);
        }

        $cookie = array('data' => $results, 'expiry' => $expiry);
        setcookie('cache', json_encode($cookie), $expiry);

    } else {

        $cache = json_decode($_COOKIE['cache'], true);
        if ($cache['expiry'] <= time()) {

            $expiry = time() + 60*60*24*7;
            for($i = 0; $i < count($cache['data']); $i++) {
                $result = $cache['data'][$i];
                $_SESSION[$result['name']] = img2b64($result['name']);
            }

            $cookie = array('data' => $cache['data'], 'expiry' => $expiry);
            setcookie('cache', json_encode($cookie), $expiry);

        }

        return $cache['data'];

    }

    return $results;
}
?>
