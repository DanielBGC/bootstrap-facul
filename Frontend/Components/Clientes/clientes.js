// import {nameCurrentClient} from '../../main.js'

// window.addEventListener("load", mostrar)
setTimeout(function() {
    mostrar()
}, 500)

let proxId;

const clientNameP = document.querySelector('p.col')

async function getLastUserName() {
    const rawResponse = await fetch('http://localhost:3001/clients', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    
    const content = await rawResponse.json();
    
    const nameLastUser = content[content.length - 1].name
    
    const clientNameP = document.querySelector('p#user-name')
    clientNameP.innerHTML = "Seja bem vindo(a) " + nameLastUser + "!"
}
getLastUserName()

const showProductsButton = document.querySelector("#showProducts")
showProductsButton.addEventListener("click", () => {
    window.location.href = "../Produtos/produtos.html"
})


function openModal(action) {
    const modal = document.getElementById("modal")
    modal.style.display = "block"

    const addModal = document.querySelector("#modal div.adicionar")
    const removeModal = document.querySelector("#modal div.remover")

    if(action == 1) {
        addModal.style.display = "block"
        removeModal.style.display = "none"
    }
    else if(action == 2) {
        addModal.style.display = "none"
        removeModal.style.display = "block"
    }
}

function closeModal() {
    const modal = document.getElementById("modal")
    modal.style.display = "none"
}

// const addButton = document.querySelector(".acoes #adicionar")
// addButton.addEventListener("click", function() {
//     openModal(1)
// })

const removeButton = document.querySelector(".acoes #remover")
removeButton.addEventListener("click", function() {
    openModal(2)
})

const backButton = document.querySelector("#modal button#voltar")
backButton.addEventListener("click", function() {
    closeModal();
})

async function adicionar() {
    const name = document.querySelector("input#name").value
    const price = document.querySelector("input#price").value

    const obj = {
        id: proxId,
        name: name,
        price: price
    }

    console.log(obj)

    if(obj.name == "" || obj.name == " " || obj.name == null || obj.name == undefined) {
        alert("Preencha o nome corretamente")
    }
    else if(obj.price == "" || obj.price == "" || obj.price == null || obj.price == undefined || obj.price < 0) {
        alert("Preencha o e-mail corretamente")
    }
    else {
        const rawResponse = await fetch('http://localhost:3001/clients', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        });

        const content = await rawResponse.json();
        console.log(content);
    }   
}

const addProdButton = document.querySelector("#modal button#addProd")
addProdButton.addEventListener("click", function() {
    adicionar()
})

async function mostrar() {
    const rawResponse = await fetch('http://localhost:3001/clients', {
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
    });

    const content = await rawResponse.json();

    if(content.length > 0) {
        proxId = content[content.length - 1].id + 1;
        construirObj(content)
    } else {
        proxId = 0;
    }
}

function construirObj(content) {
    const table = document.querySelector("table")
    const thead = table.querySelector('thead')
    const tbody = table.querySelector('tbody')
    const rows = []
    let products = []
    let aux = {}
    
    content.forEach( element => {
        // const respondeProd =  searchProductsEachClient(element.id)
        
        // aux = {
        //     idClient: element.id,
        //     nameClient: element.name,
        //     ageClient: element.age,
        //     emailClient: element.email,
        //     gender: element.gender,
        //     products: respondeProd
        // }
        // products.push(aux)
   
        const row = document.createElement("tr")

        const IdCell = document.createElement("td")
        IdCell.innerHTML = element.id

        const nameCell = document.createElement("td")
        nameCell.innerHTML = element.name

        const ageCell = document.createElement("td")
        ageCell.innerHTML = element.age

        const emailCell = document.createElement("td")
        emailCell.innerHTML = element.email

        const genderCell = document.createElement("td")
        genderCell.innerHTML = element.gender

        row.append(IdCell, nameCell, ageCell, emailCell, genderCell)
        rows.push(row)
    });


    

    thead.innerHTML = `
            <th>ID</th>
            <th>Cliente</th>
            <th>Idade</th>
            <th>Email</th> 
            <th>Gênero</th> 
    `

    rows.forEach(element => {
        tbody.appendChild(element)
    })
}

async function searchProductsEachClient(id) {
    const products = []
 
    const rawResponse = await fetch('http://localhost:3001/prod-cli/' + id, {
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }   
    })

    const content = await rawResponse.json();

    content.idProduct.forEach(async prod => {
        const rawResponse2 = await  fetch('http://localhost:3001/products/' + prod, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            }   
        });

        const content2 = await rawResponse2.json();
        products.push(content2)
    })

    return products;
}

async function deletar(a) {
    const id = document.querySelector("#modal input#id").value

    const rawResponse = await fetch('http://localhost:3001/clients/' + id, {
        method: 'DELETE',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
    });

    const content = await rawResponse.json();
    console.log(content);
}

const removeProdButton = document.querySelector("#modal button#removeProd")
removeProdButton.addEventListener("click", function() {
    deletar();
})