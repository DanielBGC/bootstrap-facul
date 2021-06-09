const forms = document.querySelectorAll('.requires-validation')
// forms.forEach(function (form) {
//   form.addEventListener('submit', function (event) {
//     if (!form.checkValidity()) {
//       event.preventDefault()
//       event.stopPropagation()
//       form.classList.add('was-validated')
//     }
    
//   })
// })

// forms.forEach(item => {
//   item.addEventListener('submit', function (event) {
//     if (!item.checkValidity()) {
//       event.preventDefault()
//       event.stopPropagation()
//       item.classList.add('was-validated')
//     } 
//   })
// })

const inputs = document.querySelectorAll('input[type=text], input[type=email], input[type=password]')
const radios = document.querySelectorAll('form input[type=radio]')
const select = document.querySelector('form select')

const submitBtn = document.querySelector("input#submit")
submitBtn.addEventListener("click", isFormValid)

// const isFormValid = function() {
  function isFormValid() {
  let inputControl = false;
  let selectControl = false;
  let radioControl = false;
  
  inputs.forEach(item => {
    if(item.value == "" || item.value == " ") {
      inputControl = false;
      item.parentNode.classList.add('was-validated')
    }
    else {
      inputControl = true;
    }
  })

  for (const item of radios) {
    if(!item.checked) {
      radioControl = false;
      item.parentNode.classList.add('was-validated')
    }
    else {
      radioControl = true;
      item.parentNode.classList.add('was-validated')
      break;
    }
  }

  for (const item of select.options) {
    //se não for a primeira opção do select
    if(item != select.options[0]) {
      console.log(item.selected)
      //se não estiver selecionado
      if(!item.selected) {
        selectControl = false;
        item.parentNode.parentNode.classList.add('was-validated')
      } 
      else {
        selectControl = true;
        item.parentNode.parentNode.classList.add('was-validated')
        break;
      }
    }
  }

  console.log(inputControl, selectControl, radioControl)
  if(inputControl && selectControl && radioControl) {
    adicionarCliente()
  }
}

function redirectPage() {
    window.location.href = 'Components/Produtos/produtos.html'
}

let proxId = 0;
async function adicionarCliente() {
  const name = document.querySelector("input[name=name]").value
  const email = document.querySelector("input[name=email]").value
  let idade;
  let genero;
  
  for (const item of select.options) {
    if(item.selected) {
      idade = item.innerHTML;
      break;
    }
  }
  
  for (const item of radios) {
    if(item.checked) { 
      genero = item.id;
    }
  }
  
  const obj = {
    name: name,
    email: email,
    age: idade,
    gender: genero,
    id: proxId
  }
  
  console.log(obj)
  
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
  redirectPage()
}

getClients();
async function getClients() {
  const rawResponse = await fetch('http://localhost:3001/clients', {
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
  } else {
      proxId = 0;
  }

}