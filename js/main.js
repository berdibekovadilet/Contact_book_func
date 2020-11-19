let btn = $('.btn');
let list = $('.contact-list');

let name = $('.name');
let lastName = $('.lastName');
let number = $('.number');

let page = 1;
let pageCount = 1;

let searchValue = '';

$('.search-inp').on('input', function (e) {
    searchValue = e.target.value;
    render();
});

function getPagination() {
    fetch(`http://localhost:8000/posts`)
        .then(res => res.json())
        .then(data => {
            pageCount = Math.ceil(data.length / 4);
            $(".pagination-page").remove();
            for (let i = pageCount; i >= 1; i--) {
                $('.prev-btn').after(`
            <span class="pagination-page"><a href="#" alt="...">${i}</a></span>`);
            }
        });
}

$('body').on('click', ".pagination-page", function (event) {
    page = event.target.innerText;
    render();
});

btn.on('click', function () {

    if (!name.val().trim() || !lastName.val().trim() || !number.val().trim()) {
        alert("Заполните данные!");
        return;
    }

    let newContact = {
        name: name.val(),
        lastName: lastName.val(),
        number: number.val(),
    };

    postNewContact(newContact);
});

function postNewContact(newContact) {
    fetch(`http://localhost:8000/posts`, {
            method: "POST",
            body: JSON.stringify(newContact),
            headers: {
                "Content-Type": "application/json; charset = utf-8"
            }
        })
        .then(() => render());
}


function render() {
    fetch(`http://localhost:8000/posts?_page=${page}&_limit=4&q=${searchValue}`)
        .then(response => response.json())
        .then(data => {
            getPagination();
            list.html('');
            data.forEach(item => {
                list.append(`
            <li id="${item.id}">
            ${item.name}
            ${item.lastName}
            ${item.number}
            <button class="btn-del">Удалить</button>
            <button class="btn-edit">Редактировать</button>
            </li>`);
            });
        });
}

$('body').on('click', '.btn-del', function (event) {
    let id = event.target.parentNode.id;
    fetch(`http://localhost:8000/posts/${id}`, {
            method: "DELETE"
        })
        .then(() => render());

});

$('body').on('click', '.btn-edit', function (event) {
    let id = event.target.parentNode.id;
    fetch(`http://localhost:8000/posts/${id}`)
        .then(res => res.json())
        .then(data => {
            $(".edit-name").val(data.name);
            $(".edit-lastName").val(data.lastName);
            $(".edit-number").val(data.number);
            $(".btn-save").attr("id", id);
            $(".main-modal").css("display", "block");
        });
});


$('.btn-save').on('click', function (event) {
    let id = $(".btn-save").attr("id");

    let newContact = {
        name: $('.edit-name').val(),
        lastName: $('.edit-lastName').val(),
        number: $('.edit-number').val()
    };

    fetch(`http://localhost:8000/posts/${id}`, {
            method: "PATCH",
            body: JSON.stringify(newContact),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(() => {
            $(".main-modal").css("display", "none");
            render();

        });
});

$('.next-btn').on('click', function () {
    if (page >= pageCount) return;
    page++;
    render();
});

$('.prev-btn').on('click', function () {
    if (page <= 1) return;
    page--;
    render();
});



render();