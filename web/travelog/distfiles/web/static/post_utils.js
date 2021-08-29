let bar = document.getElementById('progress');

UIkit.upload('.js-upload', {
    url: '/upload',
    multiple: true,
    allow: '*.(jpg|jpeg)',
    mime: 'image/jpeg',
    method: 'POST',
    name: 'images[]',

    loadStart: (e) => {
        bar.removeAttribute('hidden');
        bar.max = e.total;
        bar.value = e.loaded;
    },

    progress: (e) => {
        bar.value = e.loaded;
    },

    error: (e) => {
        UIkit.notification({
            message: 'Faild to upload the file',
            status: 'danger'
        });
        bar.style.hidden = 'hidden';
    },

    fail: (e) => {
        UIkit.notification({
            message: 'Invalid file type (JPEG is supported)',
            status: 'danger'
        });
        bar.style.hidden = 'hidden';
    },

    completeAll: () => {
        setTimeout(() => {
            bar.style.hidden = 'hidden';
        }, 1000);
        UIkit.notification({
            message: 'Upload complete!',
            status: 'primary'
        });
    }
});
