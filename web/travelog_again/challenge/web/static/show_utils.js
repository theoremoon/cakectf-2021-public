let share = document.getElementById('share');

share.onclick = () => {
    let url = document.querySelector('#url');
    url.select();
    document.execCommand('copy');
    UIkit.notification({
        message: 'URL is copied to clipboard!',
        status: 'success'
    });
};

function onSubmit() {
    document.getElementById("report").submit();
}
