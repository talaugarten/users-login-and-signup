(() => {
    let userNameAvailable = false;
    const form = document.getElementById('sign-up-form');

    function getQueryString(obj) {
        return Object.keys(obj).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`).join('&')
    }

    form.addEventListener('submit', (e) => {
        if (userNameAvailable) {
            userNameAvailable = false;
            return;
        };
        e.preventDefault();

        fetch(`/isAvailable?${getQueryString({userName: form.userName.value})}`).then((res) => {
            res.json().then((res) => {
                if (res.isAvailable) {
                    userNameAvailable = true;
                    form.submit.click()
                } else {
                    const p = document.createElement('p');
                    const message = document.createTextNode('User name ' + form.userName.value + ' is already taken');
                    p.setAttribute('id', 'message');
                    p.appendChild(message);
                    form.appendChild(p)
                }
            })
        })
    });

    form.userName.addEventListener('change', (e) => {
        const message = document.getElementById('message');
        message && form.removeChild(message);
    })
})();
