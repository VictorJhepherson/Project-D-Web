const BASE_API = 'https://project-d-api.herokuapp.com';

/* HOME */

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
    $('#screen').load(path, function() {
        if(path == '../subScreens/profile/index.html') {
            var data = listUserInfo();
            data.then((response) => {
                if(response.SU_ID == null || response.SU_ID == undefined) {
                    alert('Não foi possível localizar o usuário');
                } else {
                    window.localStorage.setItem('loginname', response.SU_LOGINNAME);

                    const formProfile = document.getElementById('form-profile');
                    formProfile.innerHTML = 
                    `
                        <div class="avatar-area" >
                            <div id="avatar-area" >
                                <img src="${response.AVATAR_ID == 1 ? 'https://www.ferramentastenace.com.br/wp-content/uploads/2017/11/sem-foto.jpg' : response.AVATAR_PATH}" >
                                <label style="color: white" >underline</label>
                            </div>
                            <div class="icons-area">
                                <button type="button" style="background: transparent;" onclick="return editProfile();" >
                                    <span class="material-icons" style="font-size: 30px; color: black;" >edit</span>
                                </button>
                                <button type="button" style="background: transparent; margin-left: 10px;" >
                                    <span class="material-icons" style="font-size: 30px; color: black;" >lock</span>
                                </button>
                            </div>
                        </div>

                        <div class="input-field" style="width: 100%" >
                            <input type="text" id="edit_nickname" value="${response.SU_NICKNAME}" disabled>
                            <div class="underline"></div>
                        </div>
                        <div class="input-field" style="width: 100%" >
                            <input type="text" id="edit_email" value="${response.SU_LOGINNAME}" disabled>
                            <div class="underline"></div>
                        </div>
                        <div class="input-field" style="width: 100%" >
                            <input type="text" id="edit_phone" value="${response.SU_PHONENUMBER}" disabled>
                            <div class="underline"></div>
                        </div>
                        <div class="input-field" style="width: 100%" >
                            <input type="text" value="${response.SU_DATEBIRTHDAY}" disabled>
                            <div class="underline"></div>
                        </div>
                        <div class="input-field" style="width: 100%" >
                            <input type="text" value="${response.SU_TYPE == 1 ? 'Adminstrador' : 'Comum'}" disabled>
                            <div class="underline"></div>
                        </div>           
                        <input type="button" id="update" value="Atualizar" style="display: none;" onclick="return UpdateUserInfo(edit_nickname.value, edit_email.value, edit_phone.value)">
                    `;
                }
            }).catch((err) => {
                alert(err);
            })
        }
    });
}

/* PROFILE */

const listUserInfo = async () => {
    const token = window.localStorage.getItem('token');
    const user = window.localStorage.getItem('user');
    try {
        const req = await fetch(`${BASE_API}/user/getUser/` + user, {
            headers: {
                "Authorization": 'Baerer ' + token
            }
        });
        const json = await req.json();

        if(json.data) 
            return json.data[0];
        else
            alert(json.error);
    } catch(err) {
        alert(err);
    }
}

function editProfile () {
    const nickname = document.getElementById('edit_nickname');
    nickname.disabled = false;

    const email = document.getElementById('edit_email');
    email.disabled = false;

    const phone = document.getElementById('edit_phone');
    phone.disabled = false;

    const button = document.getElementById('update');
    button.style.display = 'flex';
    button.style.justifyContent = 'center';
}

function setCheck(elem)
{
  var elems = document.getElementsByClassName("cb");
  var currentState = elem.checked;
  var elemsLength = elems.length;

  for(i = 0; i < elemsLength; i++)
  {
    if(elems[i].type === "checkbox")
    {
       elems[i].checked = false;   
    }
  }

  elem.checked = currentState;
}

function setAvatar() {
    const elems = document.getElementsByClassName('cb');
    for(i = 0; i < elems.length; i++) {
        if(elems[i].checked == true) {
            return elems[i].value;
        }
    }
}

const UpdateUserInfo = async (SU_NICKNAME, SU_LOGINNAME, SU_PHONENUMBER) => {
    const token = window.localStorage.getItem('token');
    const SU_ID = window.localStorage.getItem('user');
    const loginname = window.localStorage.getItem('loginname');
    const SU_PHOTO = null;
    try
    {
        if(SU_NICKNAME == '' || SU_LOGINNAME == '' || SU_PHONENUMBER == '') {
            alert("Realize alguma alteração!");
            return;
        }

        if(SU_LOGINNAME == loginname) 
            SU_LOGINNAME = null;

        const req = await fetch(`${BASE_API}/user/edit`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Baerer ' + token
            },
            body: JSON.stringify({ SU_ID, SU_LOGINNAME, SU_NICKNAME, SU_PHONENUMBER, SU_PHOTO })
        });
        const json = await req.json();

        if(json.token) {
            window.location.replace('../home/index.html');
        } else
            alert('Não foi possível atualizar os dados do usuário');
    } catch (err) {
        alert(err);
    }
}

const Register = async (SU_NICKNAME, SU_LOGINNAME, SU_PASSWORD, SU_PHONENUMBER, SU_DATEBIRTHDAY, SU_TYPE) => {
    const SU_PHOTO = setAvatar();
    try {
        if(SU_NICKNAME != '' && SU_LOGINNAME != '' && SU_PASSWORD != '' && SU_PHONENUMBER != '' && SU_DATEBIRTHDAY != '') {
            
            const req = await fetch(`${BASE_API}/auth/register`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ SU_NICKNAME, SU_LOGINNAME, SU_PASSWORD, SU_PHONENUMBER, SU_DATEBIRTHDAY, SU_PHOTO, SU_TYPE })
            });
            const json = await req.json();

            if(json.token) {
                window.location.replace('../home/index.html');
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

/* MANGAADD */

function definePages () {
    const path = document.getElementById('combo-type');
    console.log(path.options[path.selectedIndex].value);
    if(path.options[path.selectedIndex].value == 'manga') {
        $('.pageAdd').load('../subScreens/manga/subPages/forMangas.html');
    } else if(path.options[path.selectedIndex].value == 'chapter') {
        $('.pageAdd').load('../subScreens/manga/subPages/forChapters.html');
    } 
} 

function setImage(img) {
    const preview = document.getElementById('preview');
    const imagePreview = img.files[0];
    if (imagePreview) {
        preview.src = URL.createObjectURL(imagePreview)
      }
}

async function getAsByteArray(file) {
    return new Uint8Array(await readFile(file))
}

function readFile(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader()
  
      reader.addEventListener("loadend", e => resolve(e.target.result))
      reader.addEventListener("error", reject)
  
      reader.readAsArrayBuffer(file)
    })
}

const registerMangas = async () => {
    const token = window.localStorage.getItem('token');
    //const photo = document.getElementById('photo');
    const pdf = document.getElementById('pdf');
    const title = document.getElementById('title');

    const buffer = await getAsByteArray(pdf.files[0]);

    console.log(buffer);

    /*var formData = new FormData();
    formData.append('MG_TITLE', title.value);
    formData.append('MGC_ARCHIVE', pdf.files[0]);

    console.log(formData.get('MGC_ARCHIVE'));

    try {
        const req = await fetch(`${BASE_API}/manga`, {
            method: 'POST',
            headers: {
                Accept: '',
                'Content-Type': 'multipart/form-data; boundary=something',
                "Authorization": 'Baerer ' + token
            },
            body: formData
        });
        const json = await req.json();

        if(!json.error) {
            alert('Mangá cadastrado com sucesso');
        } else {
            alert(json.error);
        }
    } catch (err) {
        alert(err);
    }*/
}
