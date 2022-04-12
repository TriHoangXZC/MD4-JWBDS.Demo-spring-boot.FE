let currentUser = localStorage.getItem('currentUser');
currentUser = JSON.parse(currentUser);

function getAllProduct(page) {
    let q = $('#q').val();
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/products?page=${page}&q=${q}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (data) {
            let products = data.content;
            let content = '';
            for (let i = 0; i < products.length; i++) {
                content += `<tr>
        <td>${i + 1}</td>
        <td><a href="#" onclick="showProductDetail(${products[i].id})" id="product-name">${products[i].name}</a></td>
        <td>${products[i].price}</td>
        <td>${products[i].description}</td>
        <td><img src="http://localhost:8080/image/${products[i].image}" height="50"></td>
        <td>${products[i].category == null ? '' : products[i].category.name}</td>
        <td><button class="btn btn-primary" type="button" data-toggle="modal" data-target="#create-product" 
        onclick="showEditProduct(${products[i].id})"><i class="fa fa-edit"></i></button></td>
        <td><button class="btn btn-danger" type="button" data-toggle="modal" data-target="#delete-product" 
        onclick="showDeleteProduct(${products[i].id})"><i class="fa fa-trash"></i></button></td>
    </tr>`
            }
            $('#product-list-content').html(content);

            let page = `<button class="btn btn-primary" id="backup" onclick="getAllProduct(${data.pageable.pageNumber} - 1)">Previous</button>
<span>${data.pageable.pageNumber + 1 } | ${data.totalPages}</span>
<button class="btn btn-primary" id="next" onclick="getAllProduct(${data.pageable.pageNumber} + 1)">Next</button>`
            $('#product-list-page').html(page);
            if (data.pageable.pageNumber === 0) {
                document.getElementById("backup").hidden = true
            }
            if (data.pageable.pageNumber + 1 === data.totalPages) {
                document.getElementById("next").hidden = true
            }

            //Phan trang cach 2
//             let currentPage = data.number;
//             let contentForPaging = "";
//             if (!data.first) {
//                 contentForPaging = `<li class="page-item"><button class="page-link" onclick="getAllProduct(${currentPage - 1})">&laquo;</button></li>`
//             }
//             for (let i = 0; i < data.totalPages; i++) {
//                 contentForPaging =   `<li class="page-item"><button class="page-link" onclick="getAllProduct(${i})">${i+1}</button></li>`
//             }
//             if(!data.last){
//                 contentForPaging += `<li class="page-item"><button class="page-link" href="#" onclick="getAllProduct(data.number+1)">&raquo;</button></li>`;
//             }
//             $('#paging').html(contentForPaging);
//             $('#currentPage').html(`Current Page: ${currentPage+1}/${data.totalPages}`);
        }
    })
    event.preventDefault();
}

function showProductDetail(id) {
    event.preventDefault();
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/products/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (product) {
            let content = `<tr>
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.price}</td>
        <td>${product.description}</td>
        <td><img src="http://localhost:8080/image/${product.image}" height="50"></td>
        <td>${product.category == null ? '' : product.category.name}</td>
        </tr>`
            $('#product-list-content').html(content);
        }
    })
}

function showCreateProduct() {
    let title = 'Create Product';
    let footer = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onclick="createNewProduct()"
                        aria-label="Close" class="close" data-dismiss="modal">Create
                </button>`;
    $('#create-product-title').html(title);
    $('#create-product-footer').html(footer);
    $('#name').val(null);
    $('#price').val(null);
    $('#description').val(null);
    $('#image').val(null);
    $('#image-holder').attr('src', "");
    $('#category').val(null);

    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/categories',
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (categories) {
            let content = `<option>Chose category</option>`;
            for (let category of categories) {
                content += `<option value="${category.id}">${category.name}</option>`
            }
            $('#category').html(content);
        }
    })
}

function createNewProduct() {
    let name = $('#name').val();
    let price = $('#price').val();
    let description = $('#description').val();
    let image = $('#image').prop('files')[0];
    let category = $('#category').val();
    // let product = {
    //     name: name,
    //     price: price,
    //     description: description,
    //     category : {
    //         id: category
    //     }
    // }
    let product = new FormData();
    product.append('name', name);
    product.append('price', price);
    product.append('description', description);
    product.append('image', image);
    product.append('category', category);
    $.ajax({
        type: 'POST',
        url: `http://localhost:8080/products`,
        // data: JSON.stringify(product),
        // headers: {
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/json'
        // },
        data: product,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function () {
            getAllProduct();
            showSuccessMessage('Create successfully')
        },
        error: function () {
            showErrorMessage('Create failed')
        }
    })
}

function showLogOut() {
    let footer = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-danger" onclick="logOut()"
                        aria-label="Close" class="close" data-dismiss="modal">Log out</button>`;
    $('#footer-log-out').html(footer);
}

function showDeleteProduct(id) {
    let footer = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-danger" onclick="deleteProduct(${id})"
                        aria-label="Close" class="close" data-dismiss="modal">Delete</button>`;
    $('#footer-delete').html(footer);
}

function deleteProduct(id) {
    $.ajax({
        type: 'DELETE',
        url: `http://localhost:8080/products/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function () {
            getAllProduct();
            showSuccessMessage('Delete successfully');
        },
        error: function () {
            showErrorMessage('Delete failed')
        }
    })
}

function showEditProduct(id) {
    $('#name').val(null);
    $('#price').val(null);
    $('#description').val(null);
    $('#image').val(null);
    $('#image-holder').attr('src', "");
    $('#category').val(null);
    let title = 'Edit Product';
    let footer = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onclick="editProduct(${id})"
                        aria-label="Close" class="close" data-dismiss="modal">Edit</button>`;
    $('#create-product-title').html(title);
    $('#create-product-footer').html(footer);
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/products/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (product) {
            $('#name').val(product.name);
            $('#price').val(product.price);
            $('#description').val(product.description);
            $('#image-holder').attr('src', `http://localhost:8080/image/${product.image}`);
            $('#category').val(product.category.id);
            // $('#image').val(product.image);
            $.ajax({
                type: 'GET',
                url: `http://localhost:8080/categories`,
                headers: {
                    'Authorization': 'Bearer ' + currentUser.token
                },
                success: function (categories) {
                    // let content = `<option>Chose category</option>`;
                    // for (let category of categories) {
                    //     content += `<option value="${category.id}">${category.name}</option>`
                    // }
                    let content = "";
                    for (let i = 0; i < categories.length; i++) {
                        if (product.category.id === categories[i].id) {
                            content += `<option value="${categories[i].id}" selected>${categories[i].name}</option>`
                        } else {
                            content += `<option value="${categories[i].id}">${categories[i].name}</option>`
                        }
                    }
                    $('#category').html(content);
                }
            })
        }
    })
}

function editProduct(id) {
    let name = $('#name').val();
    let price = $('#price').val();
    let description = $('#description').val();
    let image = $('#image').prop('files')[0];
    let category = $('#category').val();
    let product = new FormData();
    product.append('name', name);
    product.append('price', price);
    product.append('description', description);
    if (image != null) {
        product.append('image', image);
    }
    product.append('category', category);
    // let product = {
    //     name: name,
    //     price: price,
    //     description: description,
    //     category : {
    //         id : category
    //     }
    // }
    $.ajax({
        type: 'POST',
        url: `http://localhost:8080/products/${id}`,
        // data: JSON.stringify(product),
        data: product,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        headers: {
            // 'Accept': 'application/json',
            // 'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function () {
            getAllProduct();
            showSuccessMessage('Edit successfully');
        },
        error: function () {
            showErrorMessage('Edit failed');
        }
    })
}

function logOut() {
    event.preventDefault();
    localStorage.removeItem("currentUser");
    location.href = "/M4-JWBDS.Product-Management-Upload-File.FrontEnd/pages/auth/login.html";
}

$(document).ready(function () {
    if (currentUser != null) {
        getAllProduct();
    } else {
        location.href = "/M4-JWBDS.Product-Management-Upload-File.FrontEnd/pages/auth/login.html";
    }
})

