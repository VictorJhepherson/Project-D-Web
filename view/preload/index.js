const BASE_API = 'https://project-d-api.herokuapp.com';

const refreshToken = async () => {
    const token = window.localStorage.getItem('token');
    const user = window.localStorage.getItem('user');

    try {
        if(token) {
            const req = await fetch(`${BASE_API}/auth/refresh`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": 'Baerer ' + token
                },
                body: JSON.stringify({token, user})
            });
            const json = await req.json();

            if(json.success) {
                window.localStorage.setItem('user', json.data.SU_ID.toString());
                window.localStorage.setItem('token', json.token);
                setTimeout(function() {
                    window.location.replace('../home/index.html');
                }, 2000);
            } else {
                setTimeout(function() {
                    window.location.replace('../signIn/index.html');
                }, 2000);
            }
        } else {
            setTimeout(function() {
                window.location.replace('../signIn/index.html');
            }, 2000);
        }
    } catch (err) {
        alert(err);
    }
}