const BASE_API = 'https://project-d-api.herokuapp.com';

/* HOME */

// UpdateUserInfo
// const token = window.localStorage.getItem('token');
// const user = window.localStorage.getItem('user');

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

// const UpdateUserInfo = async(SU_NICKNAME, SU_LOGINNAME, SU_PASSWORD, SU_PHONENUMBER) =>
// {
//     try
//     {
//         if(SU_NICKNAME == '' && SU_LOGINNAME == '' && SU_PASSWORD == '' && SU_PHONENUMBER == '')
//         {
//             alert("Preencha os campos!!");
//             return;
//         }

//         const req = await fetch(`${BASE_API}/user/edit`, {
//             method: 'POST',
//             headers: {
//                 Accept: 'application/json',
//                 'Content-Type': 'application/json',
//                 'Authorization': 'Baerer ' + token
//             },
//             body: JSON.stringify({user, SU_LOGINNAME, /*SU_PASSWORD,*/ SU_NICKNAME, SU_PHONENUMBER})
//         });
//         const json = await req.json();

//         if(json.data)
//         {
//             alert("Json.data is not empty.");
//             // json.data.SU_NICKNAME is UNDEFINED? ?????????????????
//         }
//         else
//         {
//             alert('Não vou possível obter os dados do usuários');
//         }

//     } catch (err) {
//         alert(err);
//     }
// }

function redirectScreen (path) {
    // Quebra os botões no firefox
    // Uncaught ReferenceError: Register is not defined
    // Não acha os metodos
    $('#screen').load(path);

    // Funciona devidamente
    // window.location.href = path;
}


/* MANGAADD */

function definePages () {
    const path = document.getElementById('combo-type');
    console.log(path.options[path.selectedIndex].value);
    if(path.options[path.selectedIndex].value == 'manga') {
        $('.page').load('../subScreens/manga/subPages/forMangas.html');
    } else if(path.options[path.selectedIndex].value == 'chapter') {
        $('.page').load('../subScreens/manga/subPages/forChapters.html');
    } 
} 