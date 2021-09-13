const BASE_API = 'https://project-d-api.herokuapp.com';

const Register = async (SU_NICKNAME, SU_LOGINNAME, SU_PASSWORD, SU_PHONENUMBER, SU_DATEBIRTHDAY, SU_PHOTO) => {
    try {
        if(SU_NICKNAME != '' && SU_LOGINNAME != '' && SU_PASSWORD != '' && SU_PHONENUMBER != '' && SU_DATEBIRTHDAY != '') {
            if( document.getElementById('isAdmin').checked )
                SU_TYPE = 1;
            else
                SU_TYPE = 2;
            
            const req = await fetch(`${BASE_API}/auth/register`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({SU_NICKNAME, SU_LOGINNAME, SU_PASSWORD, SU_PHONENUMBER, SU_DATEBIRTHDAY, SU_PHOTO, SU_TYPE})
            });
            const json = await req.json();

            if(json.token) {
                alert("Usuário cadastrado.");

                console.log(json.data.SU_ID + "" + json.data.SU_NICKNAME);

                window.localStorage.setItem('user', json.data.SU_ID.toString());
                window.localStorage.setItem('token', json.token);
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
            setMessage.innerHTML = `<p style="background: #ed5565; color: white; font-size: 1rem;" > Reveja os campos. </p>`;
            setTimeout(function() {
                setMessage.style.display = 'none';
            }, 3000);
        }
    } catch (err) {
        alert(err);
    }
}


