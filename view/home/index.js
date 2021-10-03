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
            window.localStorage.setItem('user', '');
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
                    const setMessage = document.getElementById('msg-profile-edit');
                    setMessage.style.display = 'flex';
                    setMessage.innerHTML = `<input type="text" value="Usuário não encontrado" style="background-color: white; text-align: center; color: #ED5565; font-size: 14px; width: 100%;" disabled>`;
                    setTimeout(function() {
                        setMessage.style.display = 'none';
                    }, 3000);
                } else {
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
                                <button type="button" style="background: transparent; margin-left: 10px;" onclick="return openModal();" >
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
                        <div class="c-loader" id="c-loader" ></div>
                        <div class="messages" id="msg-profile-edit" ></div> 
                        
                        <input type="button" id="update" value="Atualizar" style="display: none;" onclick="return UpdateUserInfo(edit_nickname.value, edit_email.value, edit_phone.value)">
                    `;
                }
            }).catch((err) => {
                const setMessage = document.getElementById('msg-profile-edit');
                setMessage.style.display = 'flex';
                setMessage.innerHTML = `<input type="text" value="${err}" style="background-color: white; text-align: center; color: #ED5565; font-size: 14px; width: 100%;" disabled>`;
                setTimeout(function() {
                    setMessage.style.display = 'none';
                }, 3000);
            })
        } else if(path == '../subScreens/manga/index.html') {
            var mangaList = document.getElementById('mangaList');
            var data = listMangas();
            data.then((response) => {
                if(response.data.length <= 0) {
                    mangaList.innerHTML += 
                    `
                        <span class="material-icons" style="font-size: 30px; color: red;" >do_disturb</span>
                        <label>Busca não encontrada<label>
                    `;
                } else {
                    var list = [];
                    list.push(response.data);

                    mangaList.innerHTML = `<div class="messages" id="msg-list" ></div>`;

                    list[0].forEach((item, k) => {
                        mangaList.innerHTML += 
                        `
                            <div class="mangaItem" >
                                <img src="${item.MGP_PATH == '' ? 'https://www.ferramentastenace.com.br/wp-content/uploads/2017/11/sem-foto.jpg' : item.MGP_PATH}" >
                                <div class="mangaData" > 
                                    <label>${item.MG_TITLE}</label>
                                    <label>Qtd. Capítulos: ${item.MGC_SEQCHAPTER == null ? 0 : item.MGC_SEQCHAPTER}</label>
                                </div>
                            </div>
                        `;
                    });
                }
            }).catch((err) => {
                const setMessage = document.getElementById('msg-list');
                setMessage.style.display = 'flex';
                setMessage.innerHTML = `<input type="text" value="${err}" style="background-color: white; text-align: center; color: #ED5565; font-size: 14px; width: 100%;" disabled>`;
                setTimeout(function() {
                    setMessage.style.display = 'none';
                }, 3000);
            });
        }
    });
}

function onlynumber(evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode( key );
    //var regex = /^[0-9.,]+$/;
    var regex = /^[0-9.]+$/;
    if( !regex.test(key) ) {
       theEvent.returnValue = false;
       if(theEvent.preventDefault) theEvent.preventDefault();
    }
 }

function openModal () {
    const modal = document.getElementById('dv-modal');

    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('dv-modal');

    modal.style.display = 'none';
}

var validateResult = {
    success: true,
    error: ''
};

const clearResult = () => {
    validateResult.error = '';
    validateResult.success = true;
}

const emailValidate = (loginname) => {
    var usuario = loginname.substring(0, loginname.indexOf("@"));
    var dominio = loginname.substring(loginname.indexOf("@") + 1, loginname.length);

    if ((usuario.length >= 1) &&
        (dominio.length >= 3) &&
        (usuario.search("@") == -1) &&
        (dominio.search("@") == -1) &&
        (usuario.search(" ") == -1) &&
        (dominio.search(" ") == -1) &&
        (dominio.search(".") != -1) &&
        (dominio.indexOf(".") >= 1) &&
        (dominio.lastIndexOf(".") < dominio.length - 1)) 
    {
        return true;
    } else {
        return false;
    }
};

const dateValidate = (datebirthday) => {
    var regex = /^\d{4}-\d\d-\d\d$/;
    if(regex.test(datebirthday))
        return true;
    else 
        return false;
};

const telValidate = (phonenumber) => {
    var phoneAjustado = '';

    const ddd = phonenumber.slice(0, 2);
    const parte1 = phonenumber.slice(2, 7); //19 98834-2924
    const parte2 = phonenumber.slice(7, 11);

    return phoneAjustado = `(${ddd}) ${parte1}-${parte2}`;
}

const validateFields = (loginname, password, datebirthday, phonenumber) => {
    console.log(datebirthday);
    clearResult();
    if(!emailValidate(loginname)) {
        validateResult.error = 'O EMAIL é inválido!',
        validateResult.success = false;
        return validateResult;
    } else if(password.length < 6 || password.length > 10) {
        validateResult.error = 'A SENHA deve ter de 6 a 10 caracteres!',
        validateResult.success = false;
        return validateResult;
    } else if(datebirthday.length < 10) {
        validateResult.error = 'A DATA foi preenchida incorretamente!',
        validateResult.success = false;
        return validateResult;
    } else if(!dateValidate(datebirthday)) {
        validateResult.error = 'A DATA não é válida!',
        validateResult.success = false;
        return validateResult;
    } else if(phonenumber.length < 11) {
        validateResult.error = 'O TELEFONE foi preenchido incorretamente!',
        validateResult.success = false;
        return validateResult;
    }

    return validateResult;
}

function reloadSite() {
    document.location.reload(true);
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
        else {
            const setMessage = document.getElementById('msg-profile-edit');
            setMessage.style.display = 'flex';
            setMessage.innerHTML = `<input type="text" value="Realize alguma alteração" style="background-color: white; text-align: center; color: #ED5565; font-size: 14px; width: 100%;" disabled>`;
            setTimeout(function() {
                setMessage.style.display = 'none';
            }, 3000);
        }
    } catch(err) {
        const setMessage = document.getElementById('msg-profile-edit');
        setMessage.style.display = 'flex';
        setMessage.innerHTML = `<input type="text" value="Realize alguma alteração" style="background-color: white; text-align: center; color: #ED5565; font-size: 14px; width: 100%;" disabled>`;
        setTimeout(function() {
            setMessage.style.display = 'none';
        }, 3000);
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

const updatePassword = async (SU_PASSWORD) => {
    try {
        const token = window.localStorage.getItem('token');

        if(SU_PASSWORD.length < 6 || SU_PASSWORD.length > 10) {
            const setMessage = document.getElementById('msg-profile-pass');
            setMessage.style.display = 'flex';
            setMessage.innerHTML = `<input type="text" value="A senha deve ter de 6 a 10 caracteres!" style="background-color: white; text-align: center; color: #ED5565; font-size: 14px; width: 100%;" disabled>`;
            setTimeout(function() {
                setMessage.style.display = 'none';
            }, 3000);
        } else {
            const req = await fetch(`${BASE_API}/user/editPass`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Baerer ' + token
                },
                body: JSON.stringify({ SU_PASSWORD })
            });
            const json = await req.json();
    
            if(json.success) {
                const setMessage = document.getElementById('msg-profile-pass');
                setMessage.style.display = 'flex';
                setMessage.innerHTML = `<input type="text" value="${json.mensagem}" style="background-color: white; text-align: center; color: #008000; font-size: 14px; width: 100%;" disabled>`;
                setTimeout(function() {
                    setMessage.style.display = 'none';
                    closeModal();
                }, 3000);
            } else {
                const setMessage = document.getElementById('msg-profile-pass');
                setMessage.style.display = 'flex';
                setMessage.innerHTML = `<input type="text" value="${json.mensagem}" style="background-color: white; text-align: center; color: #ED5565; font-size: 14px; width: 100%;" disabled>`;
                setTimeout(function() {
                    setMessage.style.display = 'none';
                }, 3000);
            }
        }
    } catch(err) {
        const setMessage = document.getElementById('msg-profile-pass');
        setMessage.style.display = 'flex';
        setMessage.innerHTML = `<input type="text" value="${err}" style="background-color: white; text-align: center; color: #ED5565; font-size: 14px; width: 100%;" disabled>`;
        setTimeout(function() {
            setMessage.style.display = 'none';
        }, 3000);
    }
}

const UpdateUserInfo = async (SU_NICKNAME, SU_LOGINNAME, SU_PHONENUMBER) => {
    try {
        const token = window.localStorage.getItem('token');
        const SU_ID = window.localStorage.getItem('user');

        var loader = document.getElementById('c-loader');
        loader.style.display = 'block';

        if(SU_NICKNAME == '' || SU_LOGINNAME == '' || SU_PHONENUMBER == '') {
            const setMessage = document.getElementById('msg-profile-edit');
            setMessage.style.display = 'flex';
            setMessage.innerHTML = `<input type="text" value="Realize alguma alteração" style="text-align: center; color: #ED5565; font-size: 14px; width: 100%;" disabled>`;
            setTimeout(function() {
                setMessage.style.display = 'none';
            }, 3000);
            return;
        }

        const req = await fetch(`${BASE_API}/user/edit`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Baerer ' + token
            },
            body: JSON.stringify({ SU_ID, SU_LOGINNAME, SU_NICKNAME, SU_PHONENUMBER })
        });
        const json = await req.json();

        if(json.success) {
            loader.style.display = 'none';
            const setMessage = document.getElementById('msg-profile-edit');
            setMessage.style.display = 'flex';
            setMessage.innerHTML = `<input type="text" value="${json.mensagem}" style="background-color: white; text-align: center; color: #008000; font-size: 14px; width: 100%;" disabled>`;
            setTimeout(function() {
                setMessage.style.display = 'none';
                redirectScreen('../subScreens/profile/index.html');
            }, 3000);
        } else {
            loader.style.display = 'none';
            const setMessage = document.getElementById('msg-profile-edit');
            setMessage.style.display = 'flex';
            setMessage.innerHTML = `<input type="text" value="${json.mensagem}" style="background-color: white; text-align: center; color: #ED5565; font-size: 14px; width: 100%;" disabled>`;
            setTimeout(function() {
                setMessage.style.display = 'none';
            }, 3000);
        }
    } catch (err) {
        loader.style.display = 'none';
        const setMessage = document.getElementById('msg-profile-edit');
        setMessage.style.display = 'flex';
        setMessage.innerHTML = `<input type="text" value="${err}" style="background-color: white; text-align: center; color: #ED5565; font-size: 14px; width: 100%;" disabled>`;
        setTimeout(function() {
            setMessage.style.display = 'none';
        }, 3000);
    }
}

const Register = async (SU_NICKNAME, SU_LOGINNAME, SU_PASSWORD, phonenumber, SU_DATEBIRTHDAY, SU_TYPE) => {
    try {
        var loader = document.getElementById('c-loader');
        loader.style.display = 'block';

        const SU_PHOTO = setAvatar();

        if(SU_NICKNAME != '' && SU_LOGINNAME != '' && SU_PASSWORD != '' && phonenumber != '' && SU_DATEBIRTHDAY != '') {
            let result = validateFields(SU_LOGINNAME, SU_PASSWORD, SU_DATEBIRTHDAY, phonenumber);

            let SU_PHONENUMBER = telValidate(phonenumber);

            if(result.success) {
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
                    loader.style.display = 'none';
                    const setMessage = document.getElementById('msg-profile-add');
                    setMessage.style.display = 'flex';
                    setMessage.innerHTML = `<input type="text" value="${json.mensagem}" style="background-color: white; text-align: center; color: #008000; font-size: 14px; width: 100%;" disabled>`;
                    setTimeout(function() {
                        setMessage.style.display = 'none';
                        redirectScreen('../subScreens/profile/index.html');
                    }, 3000);
                } else {
                    loader.style.display = 'none';
                    const setMessage = document.getElementById('msg-profile-add');
                    setMessage.style.display = 'flex';
                    setMessage.innerHTML = `<input type="text" value="${json.mensagem}" style="background-color: white; text-align: center; color: #ED5565; font-size: 14px; width: 100%;" disabled>`;
                    setTimeout(function() {
                        setMessage.style.display = 'none';
                    }, 3000);
                }
            } else {
                loader.style.display = 'none';
                const setMessage = document.getElementById('msg-profile-add');
                setMessage.style.display = 'flex';
                setMessage.innerHTML = `<input type="text" value="${result.error}" style="background-color: white; text-align: center; color: #ED5565; font-size: 14px; width: 100%;" disabled>`;
                setTimeout(function() {
                    setMessage.style.display = 'none';
                }, 3000);
            }
        } else {
            loader.style.display = 'none';
            const setMessage = document.getElementById('msg-profile-add');
            setMessage.style.display = 'flex';
            setMessage.innerHTML = `<input type="text" value="Preencha os campos" style="background-color: white; text-align: center; color: #ED5565; font-size: 14px; width: 100%;" disabled>`;
            setTimeout(function() {
                setMessage.style.display = 'none';
            }, 3000);
        }
    } catch (err) {
        loader.style.display = 'none';
        const setMessage = document.getElementById('msg-profile-add');
        setMessage.style.borderColor = '#E8273B'; 
        setMessage.style.backgroundColor = '#ED5565';
        setMessage.style.display = 'flex';
        setMessage.innerHTML = `<input type="text" value="${err}" style="background-color: white; text-align: center; color: #ED5565; font-size: 14px; width: 100%;" disabled>`;
        setTimeout(function() {
            setMessage.style.display = 'none';
        }, 3000);
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
        else {
            const setMessage = document.getElementById('msg-add');
            setMessage.style.display = 'flex';
            setMessage.innerHTML = `<input type="text" value="${json.mensagem}" style="background-color: white; text-align: center; color: #ED5565; font-size: 14px; width: 100%;" disabled>`;
            setTimeout(function() {
                setMessage.style.display = 'none';
            }, 3000);
        }
    } catch(err) {
        const setMessage = document.getElementById('msg-add');
        setMessage.style.display = 'flex';
        setMessage.innerHTML = `<input type="text" value="${err}" style="background-color: white; text-align: center; color: #ED5565; font-size: 14px; width: 100%;" disabled>`;
        setTimeout(function() {
            setMessage.style.display = 'none';
        }, 3000);
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
            return json;
        else {
            const setMessage = document.getElementById('msg-list');
            setMessage.style.display = 'flex';
            setMessage.innerHTML = `<input type="text" value="${json.mensagem}" style="background-color: white; text-align: center; color: #ED5565; font-size: 14px; width: 100%;" disabled>`;
            setTimeout(function() {
                setMessage.style.display = 'none';
            }, 3000);
        }
    } catch(err) {
        const setMessage = document.getElementById('msg-list');
        setMessage.style.display = 'flex';
        setMessage.innerHTML = `<input type="text" value="${err}" style="background-color: white; text-align: center; color: #ED5565; font-size: 14px; width: 100%;" disabled>`;
        setTimeout(function() {
            setMessage.style.display = 'none';
        }, 3000);
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
                if(response.data.length <= 0) {
                    var mangaChapter = document.getElementById('mangaChapter');

                    mangaChapter.innerHTML += 
                    `
                        <div class="notFound">
                            <span class="material-icons" style="font-size: 30px; color: red;" >do_disturb</span>
                            <label>Não encontrado mangás para o cadastro de novos capítulos<label>
                        </div>
                    `;
                } else {
                    var select = document.getElementById('combo-manga');
                    var list = [];
                    list.push(response.data);

                    list[0].forEach((item, k) => {
                        select.options.add(new Option(item.MG_TITLE, item.MG_ID));
                    });
                }
            }).catch((err) => {
                const setMessage = document.getElementById('msg-add');
                setMessage.style.display = 'flex';
                setMessage.innerHTML = `<input type="text" value="${err}" style="background-color: white; text-align: center; color: #ED5565; font-size: 14px; width: 100%;" disabled>`;
                setTimeout(function() {
                    setMessage.style.display = 'none';
                }, 3000);
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
            <div class="avatar-area" >
                <div id="avatar-area" >
                    <img src="${response.MGP_PATH == '' ? 'https://www.ferramentastenace.com.br/wp-content/uploads/2017/11/sem-foto.jpg' : response.MGP_PATH}" >
                    <label style="color: white" >underline</label>
                </div>
            </div>
            <div class="input-field" style="width: 100%" >
                <input type="text" value="${response.MG_TITLE}" disabled>
                <div class="underline"></div>
            </div>
            <div class="input-field" style="width: 100%" >
                <input type="text" id="chapter" value="${response.MGC_SEQCHAPTER == null ? 0 : response.MGC_SEQCHAPTER }" disabled>
                <div class="underline"></div>
            </div>
            <div class="input-field" style="width: 100%">
                <input type="file" name="pdf" id="pdf" accept="application/pdf" >
                <div class="underline"></div>
            </div>
            <div class="messages" id="msg-add" ></div> 
            <input type="button" id="register" value="Cadastrar" onclick="return registerChapters(${id}, chapter.value)" >
        `;
    }).catch((err) => {
        const setMessage = document.getElementById('msg-add');
        setMessage.style.display = 'flex';
        setMessage.innerHTML = `<input type="text" value="${err}" style="background-color: white; text-align: center; color: #ED5565; font-size: 14px; width: 100%;" disabled>`;
        setTimeout(function() {
            setMessage.style.display = 'none';
        }, 3000);
    });
}

function setImage(img) {
    const preview = document.getElementById('preview');
    const imagePreview = img.files[0];
    if (imagePreview) {
        preview.src = URL.createObjectURL(imagePreview)
    }
}

const registerMangas = async () => {
    try {
        const token = window.localStorage.getItem('token');
        const MG_PHOTO = document.getElementById('photo').files[0];
        const MG_TITLE = document.getElementById('title').value;

        var loader = document.getElementById('c-loader');
        loader.style.display = 'block';

        var formData = new FormData();
        formData.append('MG_TITLE', MG_TITLE);
        formData.append('MG_PHOTO', MG_PHOTO);

        const req = await fetch(`${BASE_API}/manga/title`, {
            method: 'POST',
            headers: {
                Accept: '*/*',
                "Authorization": 'Baerer ' + token
            },
            body: formData
        });
        const json = await req.json();

        if(json.success) {
            loader.style.display = 'none';
            const setMessage = document.getElementById('msg-add');
            setMessage.style.display = 'flex';
            setMessage.innerHTML = `<input type="text" value="${json.mensagem}" style="background-color: white; text-align: center; color: #008000; font-size: 14px; width: 100%;" disabled>`;
            setTimeout(function() {
                setMessage.style.display = 'none';
                redirectScreen('../subScreens/manga/index.html');
            }, 3000);
        } else {
            loader.style.display = 'none';
            const setMessage = document.getElementById('msg-add');
            setMessage.style.display = 'flex';
            setMessage.innerHTML = `<input type="text" value="${json.mensagem}" style="background-color: white; text-align: center; color: #ED5565; font-size: 14px; width: 100%;" disabled>`;
            setTimeout(function() {
                setMessage.style.display = 'none';
            }, 3000);
        }
    } catch (err) {
        loader.style.display = 'none';
        const setMessage = document.getElementById('msg-add');
        setMessage.style.display = 'flex';
        setMessage.innerHTML = `<input type="text" value="${err}" style="background-color: white; text-align: center; color: #ED5565; font-size: 14px; width: 100%;" disabled>`;
        setTimeout(function() {
            setMessage.style.display = 'none';
        }, 3000);
    }
}

const registerChapters = async (MG_ID, SEQ) => {
    try {
        const token = window.localStorage.getItem('token');
        const MGC_ARCHIVE = document.getElementById('pdf').files[0];
        const MGC_SEQCHAPTER = parseInt(SEQ, 10) + 1;

        var loader = document.getElementById('c-loader');
        loader.style.display = 'block';

        var formData = new FormData();
        formData.append('MG_ID', MG_ID);
        formData.append('MGC_ARCHIVE', MGC_ARCHIVE);
        formData.append('MGC_SEQCHAPTER', MGC_SEQCHAPTER);

        const req = await fetch(`${BASE_API}/manga/chapters`, {
            method: 'POST',
            headers: {
                Accept: '*/*',
                "Authorization": 'Baerer ' + token
            },
            body: formData
        });
        const json = await req.json();

        if(json.success) {
            loader.style.display = 'none';
            const setMessage = document.getElementById('msg-add');
            setMessage.style.display = 'flex';
            setMessage.innerHTML = `<input type="text" value="${json.mensagem}" style="background-color: white; text-align: center; color: #008000; font-size: 14px; width: 100%;" disabled>`;
            setTimeout(function() {
                setMessage.style.display = 'none';
                redirectScreen('../subScreens/manga/index.html');
            }, 3000);
        } else {
            loader.style.display = 'none';
            const setMessage = document.getElementById('msg-add');
            setMessage.style.display = 'flex';
            setMessage.innerHTML = `<input type="text" value="${json.mensagem}" style="background-color: white; text-align: center; color: #ED5565; font-size: 14px; width: 100%;" disabled>`;
            setTimeout(function() {
                setMessage.style.display = 'none';
            }, 3000);
        }
    } catch (err) {
        loader.style.display = 'none';
        const setMessage = document.getElementById('msg-add');
        setMessage.style.display = 'flex';
        setMessage.innerHTML = `<input type="text" value="${err}" style="background-color: white; text-align: center; color: #ED5565; font-size: 14px; width: 100%;" disabled>`;
        setTimeout(function() {
            setMessage.style.display = 'none';
        }, 3000);
    }
}

const searchManga = () => {
    const title = document.getElementById('title').value;
    var mangaList = document.getElementById('mangaList');
    if(title == '' || title == null) {
        const setMessage = document.getElementById('msg-list');
        setMessage.style.borderColor = '#E8273B'; 
        setMessage.style.backgroundColor = '#ED5565';
        setMessage.style.display = 'flex';
        setMessage.innerHTML = `<input type="text" value="Digite algum título antes de pesquisar" style="background-color: white; text-align: center; color: #ED5565; font-size: 14px; width: 100%;" disabled>`;
        setTimeout(function() {
            setMessage.style.display = 'none';
            redirectScreen('../subScreens/manga/index.html');
        }, 3000);
    } else {
        var data = listMangaByName(title);
        data.then((response) => {
            if(response.data[0].length < 0) {
    
                mangaList.innerHTML += 
                `
                    <div class="notFound">
                        <span class="material-icons" style="font-size: 30px; color: red;" >do_disturb</span>
                        <label>Não encontrado Mangás com esse Título<label>
                    </div>
                `;
            } else {
                var list = [];
                list.push(response.data);
    
                list[0].forEach((item, k) => {
                    mangaList.innerHTML = 
                    `
                        <div class="messages" id="msg-list" ></div> 
                        <div class="mangaItem" >
                            <img src="${item.MGP_PATH == '' ? 'https://www.ferramentastenace.com.br/wp-content/uploads/2017/11/sem-foto.jpg' : item.MGP_PATH}" >
                            <div class="mangaData" > 
                                <label>${item.MG_TITLE}</label>
                                <label>Qtd. Capítulos: ${item.MGC_SEQCHAPTER == null ? 0 : item.MGC_SEQCHAPTER}</label>
                            </div>
                        </div>
                    `;
                });
            }
        }).catch((err) => {
            const setMessage = document.getElementById('msg-list');
            setMessage.style.display = 'flex';
            setMessage.innerHTML = `<input type="text" value="${err}" style="background-color: white; text-align: center; color: #ED5565; font-size: 14px; width: 100%;" disabled>`;
            setTimeout(function() {
                setMessage.style.display = 'none';
            }, 3000);
        });
    }
}

const listMangaByName = async (MG_TITLE) => {
    try {
        const token = window.localStorage.getItem('token');

        const req = await fetch(`${BASE_API}/manga/byName`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                "Authorization": 'Baerer ' + token
            },
            body: JSON.stringify({ MG_TITLE })
        });
        const json = await req.json();

        if(json.success)
            return json;
        else {
            const setMessage = document.getElementById('msg-list');
            setMessage.style.display = 'flex';
            setMessage.innerHTML = `<input type="text" value="${json.mensagem}" style="background-color: white; text-align: center; color: #ED5565; font-size: 14px; width: 100%;" disabled>`;
            setTimeout(function() {
                setMessage.style.display = 'none';
            }, 3000);
        }
    } catch(err) {
        const setMessage = document.getElementById('msg-list');
        setMessage.style.display = 'flex';
        setMessage.innerHTML = `<input type="text" value="${err}" style="background-color: white; text-align: center; color: #ED5565; font-size: 14px; width: 100%;" disabled>`;
        setTimeout(function() {
            setMessage.style.display = 'none';
        }, 3000);
    }
}
