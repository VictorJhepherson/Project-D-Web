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

function redirectScreen (id) {
    var div = document.getElementById('screen');

    div.load('../' + id);
}