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

            if(json.success) {
                if(json.data.SU_TYPE != 1) {
                    const setMessage = document.getElementById('alerta');
                    setMessage.style.borderColor = '#E8273B';
                    setMessage.style.backgroundColor = '#ED5565';
                    setMessage.style.display = 'flex';
                    setMessage.innerHTML = `<input type="text" value="Usuário não tem permissão para acessar esse Portal!" style="background: #ED5565; color: white; font-size: 1rem;" >`;
                    setTimeout(function() {
                        setMessage.style.display = 'none';
                    }, 3000);
                } else {
                    window.localStorage.setItem('user', json.data.SU_ID.toString());
                    window.localStorage.setItem('token', json.token);
                    window.localStorage.setItem('nickname', json.data.SU_NICKNAME.toString());
                    window.location.replace('../home/index.html');
                }
            } else {
                const setMessage = document.getElementById('alerta');
                setMessage.style.borderColor = '#E8273B';
                setMessage.style.backgroundColor = '#ED5565';
                setMessage.style.display = 'flex';
                setMessage.innerHTML = `<input type="text" value="${json.mensagem}" style="background: #ED5565; color: white; font-size: 1rem;" >`;
                setTimeout(function() {
                    setMessage.style.display = 'none';
                }, 3000);
            }
        } else {
            const setMessage = document.getElementById('alerta');
            setMessage.style.borderColor = '#E8273B';
            setMessage.style.backgroundColor = '#ED5565';
            setMessage.style.display = 'flex';
            setMessage.innerHTML = `<input type="text" value="Preencha os campos!" style="background: #ED5565; color: white; font-size: 1rem;" >`;
            setTimeout(function() {
                setMessage.style.display = 'none';
            }, 3000);
        }
    } catch (err) {
        const setMessage = document.getElementById('alerta');
        setMessage.style.borderColor = '#E8273B';
        setMessage.style.backgroundColor = '#ED5565';
        setMessage.style.display = 'flex';
        setMessage.innerHTML = `<input type="text" value="${err}" style="background: #ED5565; color: white; font-size: 1rem;" >`;
        setTimeout(function() {
            setMessage.style.display = 'none';
        }, 3000);
    }
}


