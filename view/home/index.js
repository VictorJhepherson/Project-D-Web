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

        if(json.success) {
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
        } else if(path == '../subScreens/manga/index.html') {
            var mangaList = document.getElementById('mangaList');
            var data = listMangas();
            data.then((response) => {
                if(response.data == null || response.data == undefined) {
                    mangaList.innerHTML += 
                    `
                        <span class="material-icons" style="font-size: 30px; color: red;" >do_disturb</span>
                        <label>Busca não encontrada<label>
                    `;
                } else {
                    var list = [];
                    list.push(response.data);

                    list.map((item, k) => {
                        mangaList.innerHTML += 
                        `
                            <div class="mangaItem" >
                                <img src="https://www.ferramentastenace.com.br/wp-content/uploads/2017/11/sem-foto.jpg" >
                                <div class="mangaData" > 
                                    <label>${item.MG_TITLE}</label>
                                    <label>Qtd. Capítulos: ${item.CHAPTERS}</label>
                                </div>
                            </div>
                        `;
                    });
                }
            }).catch((err) => {
                alert(err);
            });
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

        if(json.success) 
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

        if(json.success) {
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

            if(json.success) {
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

const listMangaById = async (MG_ID) => {
    const token = window.localStorage.getItem('token');
    try {
        const req = await fetch(`${BASE_API}/manga/` + MG_ID, {
            headers: {
                "Authorization": 'Baerer ' + token
            }
        });
        const json = await req.json();

        if(json.success) 
            return json.data[0];
        else
            alert(json.error);
    } catch(err) {
        alert(err);
    }
}

const listMangas = async () => {
    const token = window.localStorage.getItem('token');
    try {
        const req = await fetch(`${BASE_API}/manga`, {
            headers: {
                "Authorization": 'Baerer ' + token
            }
        });
        const json = await req.json();

        if(json.success)
            return json
        else
            return json.success
    } catch(err) {
        alert(err);
    }
}

function definePages () {
    const path = document.getElementById('combo-type');

    if(path.options[path.selectedIndex].value == 'manga') {
        $('.pageAdd').load('../subScreens/manga/subPages/forMangas.html');
    } else if(path.options[path.selectedIndex].value == 'chapter') {
        $('.pageAdd').load('../subScreens/manga/subPages/forChapters.html', function() {
            var data = listMangas();
            data.then((response) => {
                if(response.data == null || response.data == undefined) {
                    var myForm = document.getElementById('myForm');

                    myForm.innerHTML += 
                    `
                        <span class="material-icons" style="font-size: 30px; color: red;" >do_disturb</span>
                        <label>Não encontrado mangás para o cadastro de novos capítulos<label>
                    `;
                } else {
                    var selectArea = document.getElementById('area-cb-manga');
                    var select = document.createElement('select');
                    select.id = 'combo-manga';
                    selectArea.appendChild(select);
                    var list = [];
                    list.push(response.data);

                    list.map((item, k) => {
                        select.options.add(new Option(item.MG_TITLE, item.MG_ID));
                    });
                }
            }).catch((err) => {
                alert(err);
            });
        });
    } 
}

function defineManga() {
    const manga = document.getElementById('combo-manga');
    var id = manga.options[manga.selectedIndex].value;

    var data = listMangaById(id);
    data.then((response) => {
        const mangaChapter = document.getElementById('mangaChapter');

        mangaChapter.innerHTML =
        `
            <div id="avatar-area" >
                <img src="${response.MGP_PATH == '' ? 'https://www.ferramentastenace.com.br/wp-content/uploads/2017/11/sem-foto.jpg' : response.MGP_PATH}" >
                <label style="color: white" >underline</label>
            </div>
            <div class="input-field" style="width: 100%" >
                <input type="text" value="${response.MG_TITLE}" disabled>
                <div class="underline"></div>
            </div>
            <div class="input-field" style="width: 100%" >
                <input type="text" id="chapter" value="${response.CHAPTERS}" disabled>
                <div class="underline"></div>
            </div>
            <div class="input-field" style="width: 100%">
                <input type="file" name="img" id="img" accept="image/png, image/jpeg" multiple>
                <div class="underline"></div>
            </div>
            <input type="button" id="register" value="Cadastrar" onclick="return registerChapters(${id}, chapter.value)" >
        `;
    }).catch((err) => {
        alert(err);
    });
}

function setImage(img) {
    const preview = document.getElementById('preview');
    const imagePreview = img.files[0];
    if (imagePreview) {
        preview.src = URL.createObjectURL(imagePreview)
    }
}

function encodeBase64(files) {
    var base64 = new Array;
    var myArray = Array.from(files);
    var promise;

    myArray.sort(function(a, b) {
        return a.name > b.name;
    });

    for(var i = 0; i < myArray.length; i++ ) {
        promise = new Promise((resolve, reject) => {
            (function(file) {
                var reader = new FileReader();
                    reader.onloadend = function(e) { 
                        base64.push(e.target.result);

                        resolve(base64);
                    };
                    reader.readAsDataURL(file);
            })(myArray[i]);
        });
    }

    return promise;
}

const registerMangas = async () => {
    const token = window.localStorage.getItem('token');
    const photo = document.getElementById('photo').files;
    const image = await encodeBase64(photo);
    const MG_TITLE = document.getElementById('title').value;
    const MG_PHOTO = image[0];

    try {
        const req = await fetch(`${BASE_API}/manga/manga`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                "Authorization": 'Baerer ' + token
            },
            body: JSON.stringify({MG_TITLE, MG_PHOTO})
        });
        const json = await req.json();

        if(json.success) {
            alert('Mangá cadastrado com sucesso');
        } else {
            console.log(json.error);
        }
    } catch (err) {
        alert(err);
    }
}

const registerChapters = async (MG_ID, MGC_SEQCHAPTER) => {
    const token = window.localStorage.getItem('token');
    const files = document.getElementById('img').files;
    const images = await encodeBase64(files);

    //TODO: for para cada imagem selecionada no input

    try {
        const req = await fetch(`${BASE_API}/manga/chapters`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                "Authorization": 'Baerer ' + token
            },
            body: JSON.stringify({ MG_ID, MGF_ARCHIVE, MGC_SEQCHAPTER })
        });
        const json = await req.json();

        if(json.success) {
            alert('Capítulo cadastrado com sucesso');
        } else {
            alert(json.error);
        }
    } catch (err) {
        alert(err);
    }
}
