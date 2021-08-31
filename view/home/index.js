const BASE_API = 'https://project-d-api.herokuapp.com';

/* HOME */

function seeSideBar () {
    var sideBar = document.getElementById('sidebar');
    var button = document.getElementById('options');
    if(sideBar.style.display == 'flex') {
        sideBar.style.display = 'none';
        button.style.marginRight = '20px';
    }
    else {
        sideBar.style.display = 'flex';
        button.style.marginRight = '320px';
    }
}

const signOut = async () => {
    const token = window.localStorage.getItem('token');

    try {
        const req = await fetch(`${BASE_API}/auth/logout`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                "Authorization": 'Baerer ' + token
            },
            body: JSON.stringify({token})
        });
        const json = await req.json();

        if(json.token == null) {
            window.localStorage.setItem('token', '');
            window.location.replace('../signIn/index.html');
        } else {
            alert('Não foi possível fazer o logout!');
        }
    } catch (err) {
        alert(err);
    }
}

function redirectScreen (path) {
    $('#screen').load(path);
}


/* MANGAADD */

function definePages () {
    const path = document.getElementById('combo-type');
    console.log(path.options[path.selectedIndex].value);
    if(path.options[path.selectedIndex].value == 'manga') {
        $('.page').load('../subPages/forMangas.html');
    } else if(path.options[path.selectedIndex].value == 'chapter') {
        $('.page').load('../subPages/forChapters.html');
    } 
} 