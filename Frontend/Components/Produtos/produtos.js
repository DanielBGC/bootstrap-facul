// window.addEventListener("load", mostrar)
let proxId;

setTimeout(function() {
    mostrar()
}, 500)

// import ... from '../../main.js'


async function getLastUserName() {
    const rawResponse = await fetch('http://localhost:3001/clients/', {
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

const showClientsButton = document.querySelector("#showClients")
showClientsButton.addEventListener("click", () => {
    window.location.href = "../Clientes/clientes.html"
})

function openModal(action) {
    const modal = document.getElementById("modal")
    modal.style.display = "block"

    const addModal = document.querySelector("#modal div.adicionar")
    const removeModal = document.querySelector("#modal div.remover")

    const hiddenInput = document.querySelector("#modal input[type=hidden]")

    if(action == "add") {
        addModal.style.display = "block"
        removeModal.style.display = "none"
    }
    else {
        addModal.style.display = "none"
        removeModal.style.display = "block"
        hiddenInput.value = action;
        console.log(hiddenInput)
    }
}

function closeModal() {
    const modal = document.getElementById("modal")
    modal.style.display = "none"
}

const addButton = document.querySelector(".acoes #adicionar")
addButton.addEventListener("click", function() {
    openModal("add")
})

// const removeButton = document.querySelector(".acoes #remover")
// removeButton.addEventListener("click", function() {
//     openModal(2)
// })

const backButton = document.querySelector("#modal button#voltar")
backButton.addEventListener("click", function() {
    closeModal();
})


async function adicionar() {
    const name = document.querySelector("input#name").value
    let price = document.querySelector("input#price").value

    price = price.replace(",", ".")
    const obj = {
        id: proxId,
        name: name,
        price: +price
    }

    console.log(obj)

    if(obj.name == "" || obj.name == " " || obj.name == null || obj.name == undefined) {
        alert("Preencha o nome corretamente")
    }
    else if(obj.price == "" || obj.price == "" || obj.price == null || obj.price == undefined || obj.price < 0) {
        alert("Preencha o preço corretamente")
    }
    else {
        const rawResponse = await fetch('http://localhost:3001/products', {
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
    const rawResponse = await fetch('http://localhost:3001/products', {
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
    });

    const content = await rawResponse.json();

    if(content.length > 0) {
        console.log(content);
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
    
    content.forEach(element => {
        const row = document.createElement("tr")

        const IdCell = document.createElement("td")
        IdCell.innerHTML = element.id

        const nameCell = document.createElement("td")
        nameCell.innerHTML = element.name

        const priceCell = document.createElement("td")
        const priceValue = "R$" + element.price.toFixed(2);
        priceCell.innerHTML = priceValue.replace(".", ",")

        const remove = document.createElement("button")
        remove.innerHTML = "X"
        remove.addEventListener("click", function() {
            openModal(element.id)
        })
        priceCell.appendChild(remove)

        // IdPrice.innerHTML = `
        //     ${element.price} 
        //     <button onclick="deletar()"> X </button>` 

        row.append(IdCell, nameCell, priceCell)
        rows.push(row)
    });

    thead.innerHTML = `
            <th>ID</th>
            <th>Produto</th>
            <th>Preço</th> 
    `

    rows.forEach(element => {
        tbody.appendChild(element)
    })
}

async function deletar(id) {
    // const id = document.querySelector("#modal input#id").value

    const rawResponse = await fetch('http://localhost:3001/products/' + id, {
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
    const hiddenInput = document.querySelector("#modal input[type=hidden]")
    const id = hiddenInput.value
    deletar(id);
})