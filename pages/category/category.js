let currentUser = localStorage.getItem('currentUser');
currentUser = JSON.parse(currentUser);

function getAllCategory() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/categories',
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (categories) {
            let content = '';
            for (let i = 0; i < categories.length; i++) {
                content += `<tr>
        <td>${i + 1}</td>
        <td>${categories[i].name}</td>
        <td><button class="btn btn-primary" type="button" data-toggle="modal" data-target="#create-category" 
        onclick="showEditCategory(${categories[i].id})"><i class="fa fa-edit"></i></button></td>
        <td><button class="btn btn-danger" type="button" data-toggle="modal" data-target="#delete-category" 
        onclick="showDeleteCategory(${categories[i].id})"><i class="fa fa-trash"></i></button></td>
    </tr>`
            }
            $('#category-list-content').html(content);
        }
    })
}

function showCreateCategory() {
    let title = "Create Category";
    let footer = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onclick="createNewCategory()"
                        aria-label="Close" class="close" data-dismiss="modal">Create
                </button>`;
    $('#create-category-title').html(title);
    $('#create-category-footer').html(footer);
    $('#name').val(null);
}

function createNewCategory() {
    let name = $('#name').val();
    let category = {
        name : name
    }
    $.ajax({
        type : 'POST',
        url: 'http://localhost:8080/categories',
        data: JSON.stringify(category),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (){
            getAllCategory();
            showSuccessMessage('Create successfully')
        },
        error: function (){
            showErrorMessage('Create failed')
        }
    })
}

function showEditCategory(id){
    let title = "Edit Category";
    let footer = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onclick="editCategory(${id})"
                        aria-label="Close" class="close" data-dismiss="modal">Edit
                </button>`;
    $('#create-category-title').html(title);
    $('#create-category-footer').html(footer);
    $('#name').val(null);
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/categories/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (category) {
            $('#name').val(category.name);
        }
    })
}

function editCategory(id){
    let name = $('#name').val();
    let category = {
        name : name
    }
    $.ajax({
        type: 'PUT',
        url: `http://localhost:8080/categories/${id}`,
        data: JSON.stringify(category),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (){
            getAllCategory();
            showSuccessMessage('Edit successfully')
        },
        error: function () {
            showErrorMessage('Edit failed')
        }
    })
}

function showDeleteCategory(id){
    let footer = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-danger" onclick="deleteCategory(${id})"
                        aria-label="Close" class="close" data-dismiss="modal">Delete</button>`;
    $('#footer-delete').html(footer);
}

function deleteCategory(id) {
    $.ajax({
        type: 'DELETE',
        url: `http://localhost:8080/categories/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function () {
            getAllCategory();
            showSuccessMessage('Delete successfully');
        },
        error: function () {
            showErrorMessage('Delete Failed');
        }

    })
}

$(document).ready(function () {
    if (currentUser != null) {
        getAllCategory();
    } else {
        location.href = "/login.html";
    }
})