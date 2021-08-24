const BASE_API = 'https://project-d-api.herokuapp.com';

const SignIn = async (SU_NICKNAME, SU_PASSWORD) => {
    try {
        if(SU_NICKNAME != '' && SU_PASSWORD != '') {
            const req = await fetch(`${BASE_API}/auth/login`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({SU_NICKNAME, SU_PASSWORD})
            });

            const json = await req.json();

            if(json.token) {
                window.location.replace('../home/index.html');
            } else {
                alert('Seu nickname/senha estão incorretos. Por favor, tente novamente!');
            }
        } else {
            alert('Preencha os campos!');
        }
    } catch (err) {
        alert(err);
    }
}




