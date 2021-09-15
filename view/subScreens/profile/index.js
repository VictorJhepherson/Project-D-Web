const BASE_API = 'https://project-d-api.herokuapp.com';

const token = window.localStorage.getItem('token');
const user = window.localStorage.getItem('user');

const UpdateUserInfo = async(SU_NICKNAME, SU_LOGINNAME, SU_PASSWORD, SU_PHONENUMBER) =>
{
    try
    {
        if(SU_NICKNAME == '' && SU_LOGINNAME == '' && SU_PASSWORD == '' && SU_PHONENUMBER == '')
        {
            alert("Preencha os campos!!");
            return;
        }

        const req = await fetch(`${BASE_API}/user/edit`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Baerer ' + token
            },
            body: JSON.stringify({user, SU_LOGINNAME, /*SU_PASSWORD,*/ SU_NICKNAME, SU_PHONENUMBER})
        });
        const json = await req.json();

        if(json.data)
        {
            alert("Json.data is not empty.");
            // json.data.SU_NICKNAME is UNDEFINED? ?????????????????
        }
        else
        {
            alert('Não vou possível obter os dados do usuários');
        }

    } catch (err) {
        alert(err);
    }
}
const Register = async (SU_NICKNAME, SU_LOGINNAME, SU_PASSWORD, SU_PHONENUMBER, SU_DATEBIRTHDAY, SU_PHOTO, SU_TYPE) => {
    try {
        if(SU_NICKNAME != '' && SU_LOGINNAME != '' && SU_PASSWORD != '' && SU_PHONENUMBER != '' && SU_DATEBIRTHDAY != '') {
            
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

                //Limpar inputs
                document.getElementById('nickname').value = "";
                document.getElementById('login').value = "";
                document.getElementById('password').value = "";
                document.getElementById('phone').value = "";
                document.getElementById('bday').value = "";

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


