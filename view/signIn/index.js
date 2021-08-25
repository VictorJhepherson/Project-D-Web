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
                window.location.replace('../home/index.html', { json });
            } else {
                const setMessage = document.getElementById('alerta');
                setMessage.style.display = 'flex';
                setMessage.innerHTML = `<input type="text" value="${json.mensagem}" style="background: #ed5565; color: white; font-size: 1rem;" >`;
                setTimeout(function() {
                    setMessage.style.display = 'none';
                }, 3000);
            }
        } else {
            const setMessage = document.getElementById('alerta');
            setMessage.style.display = 'flex';
            setMessage.innerHTML = `<input type="text" value="Preencha os campos!" style="background: #ed5565; color: white; font-size: 1rem;" >`;
            setTimeout(function() {
                setMessage.style.display = 'none';
            }, 3000);
        }
    } catch (err) {
        alert(err);
    }
}


