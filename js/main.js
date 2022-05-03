let contenedorPrincipal = document.getElementById("content");
let divCarrito = document.getElementById("listadoCarrito");
let contador = document.getElementById("contador");
let precioTotal = document.getElementById("precioTotal");
let tipoProducto;
let nameDocument = document.title;
let idSelec = [];
let searchImput;
let producSelec = [];
var dataProduc;
let carritoProduc = [];
let acumPrecio = 0;
let valueEvent;
let idEvent;
let texto = ""
let productoAgregado;
let dataLs;
let indiceLocalStorage;
let carrito=[];
let idLocalStorage;
let productLs = []


//INICIO DE FETCH
fetch("https://apipetshop.herokuapp.com/api/articulos")
    .then((response) => response.json())
    .then((info) => {
        if (nameDocument == "Juguetes - Franco Petshop") {
            tipoProducto = "Juguete"; // GUARDAMOS
        } else if (nameDocument == "Farmacia - Franco Petshop") {
            tipoProducto = "Medicamento";
        }
        dataProduc = info.response;
        nameDocument = tipoProducto;                  
        inputText = document.querySelector("#filtroBusqueda");
        inputText.addEventListener("keyup", filtrar);
        obtenerLocalStorage();
        filtrar();        
                  
        
    });

function crearCards(data, contenedor, tipoProducto) {
    let productos = data.filter(articulo => articulo.tipo == tipoProducto)
    for (i = 0; i < productos.length; i++) {

        let newElemento = document.createElement('div')
        //newElemento.className="card"
        newElemento.innerHTML =
            `<div class="contenedor">
        <figure>
            <div class="precio m-3">
                <div class="imgCard">
                <img src="${productos[i].imagen}"
                    alt="" />
                </div>
                <div class="nombreCard">
                <h6>${productos[i].nombre}</h6>
                </div>
                <div class="precioCard">
                <p>Precio:$${productos[i].precio} </p>
                </div>
                <div class="unidadesCard">
                <p class="pocoStock"></p>  
                </div>                    
            </div>
            <div class="capa">
                <h4>${productos[i].nombre}</h4>
                <p>
                ${productos[i].descripcion}
                </p>
                <button type="button" class="btn btn-success bg-gradient shadow"
                value="${productos[i]._id}"id="buttonUno" onclick=addProduc(event)>Comprar</button> 
                </button>
            </div>
        </figure>
        </div>`
        contenedor.appendChild(newElemento)
        //filtro poco stock descuento
        var ultimasUnidades = document.getElementsByClassName("pocoStock")
        if (productos[i].stock < 5) {
            ultimasUnidades[i].innerHTML = `
        <div id="oferta">
        <img src="./assets/img/about/IMG_2658.PNG" alt="">
        </div>
        Últimas Unidades! ${productos[i].stock}`
            ultimasUnidades[i].classList.add("descuento")
        }
        else {
            ultimasUnidades[i].innerHTML = `Stock disponible ${productos[i].stock} `
        }

    }

}
function addProduc(event) {//evento para captar que producto se anadaio
    searchImput = event.target.value
    if (!idSelec.includes(searchImput)) {
        idSelec.push(searchImput)
        crearCarrito()
    }
    else {
        alert('El producto esta incluido en el carrito de compras')
    }
}
function aumentar(event) {//captar y ejecutar cuando se agregan cantidades.
    valueEvent = event.target.value
    if (carritoProduc[valueEvent].stock > carritoProduc[valueEvent].cantidadEnCarrito) {
        let idEvent = carritoProduc[valueEvent]._id
        carritoProduc[valueEvent].cantidadEnCarrito = carritoProduc[valueEvent].cantidadEnCarrito + 1
        document.getElementById(idEvent).value = carritoProduc[valueEvent].cantidadEnCarrito
        localStorage.setItem('cant',carritoProduc[valueEvent].cantidadEnCarrito)
        acumPrecio = carritoProduc[valueEvent].precio * (carritoProduc[valueEvent].cantidadEnCarrito - 1) + acumPrecio
        precioTotal.innerHTML = acumPrecio
        localStorage.setItem('total',acumPrecio);
        event.stopPropagation();
         
    }
    else {
        alert("Supera las unidades de stock")
        event.stopPropagation();
    }
}

function disminuir(event) {//evento para captar que producto se resta
    valueEvent = event.target.value
    if (carritoProduc[valueEvent].cantidadEnCarrito > 0) {
        idEvent = carritoProduc[valueEvent]._id
        carritoProduc[valueEvent].cantidadEnCarrito = carritoProduc[valueEvent].cantidadEnCarrito - 1 //cambio valor de propiedad en el array
        document.getElementById(idEvent).value = carritoProduc[valueEvent].cantidadEnCarrito
        localStorage.setItem('cant',carritoProduc[valueEvent].cantidadEnCarrito)
        acumPrecio = acumPrecio - carritoProduc[valueEvent].precio
        precioTotal.innerHTML = acumPrecio
        localStorage.setItem('total',acumPrecio); 
        event.stopPropagation();

    }
    else {
        clearProductCarrito(valueEvent)
        event.stopPropagation();
    }


}
function crearCarrito() {   
        productoAgregado = dataProduc.filter(articulo => articulo._id === searchImput)
        productoAgregado[0].cantidadEnCarrito = 1//anadiendo propiedad al carrito
        if (!carritoProduc.includes(productoAgregado[0])){}    
        carritoProduc.push(productoAgregado[0])// armando array con articulos que estan el carrito     
        indexCarrito = carritoProduc.length - 1 //sber indice del valor dentro del carrito
        cantProduc = idSelec.length //Contador de los elementos que se encuentran en el carrito
        contador.innerHTML = cantProduc
        acumPrecio = acumPrecio + carritoProduc[indexCarrito].precio
        precioTotal.innerHTML = acumPrecio;
        //local store
        localStorage.setItem(productoAgregado[0]._id,productoAgregado[0]._id)        
        //var miObjeto = { 'marcado': 'html5', 'estilo': 'css3', 'comportamiento': 'js' };
        // Guardo el objeto como un string
        localStorage.setItem("productos", JSON.stringify(carritoProduc)); // configurar
        renderCarrito (indexCarrito, productoAgregado[0]);
        localStorage.setItem('total',acumPrecio);               
    }
    
    
//funcion eliminar productos del carrito
function clearProductCarrito(valor) {
    document.getElementById(valor).innerHTML = `<div id="">`;
    let indiceEliminar = idSelec.indexOf(idEvent)
    idSelec.splice(indiceEliminar, 1)
    carritoProduc.splice(valor, 0)
    cantProduc = idSelec.length
    contador.innerHTML = cantProduc
    localStorage.setItem('total',acumPrecio);
    
    
}
function filtrar() {
    //let contenedor = document.getElementById("resultado");
    contenedorPrincipal.innerHTML = "";
    let resultFiltro = [];
    texto = inputText.value.toLowerCase();
    let prueba = dataProduc.filter(item => item.tipo !== undefined)
    resultFiltro = prueba.filter(item => item.nombre.toLowerCase().includes(texto))
    crearCards(resultFiltro, contenedorPrincipal, nameDocument);

    if (contenedorPrincipal.innerHTML === "" && texto !== "") {
        contenedorPrincipal.innerHTML += `
              <li>Producto no encontrado...</li>
              `;
    }
};

//*****CONTACTO****/

function validar_guardar() {
    var usuario = document.getElementById("usuario");
    var doc = document.getElementById("doc").value;
    var docP = parseInt(doc)
    var mascota = document.getElementById("mascota");
    var email = document.getElementById("email");
    var tipo = document.getElementById("tipo");
    console.log(doc)
    console.log(isNaN(doc))

    if (usuario.value === "") {
        alert("Ingrese su nombre")
    }
    else if (doc === "") {
        alert("Debe ingresar un documento");
    }
    else if (isNaN(docP)) {
        alert("Debe ingresar un numero valido");
    }
    else if (mascota.value === "") {
        alert("Debe ingresar el nombre de su mascota");
    }
    else if (email.value === "") {
        alert("Debe ingresar su correo");
    }
    else if (tipo.value === "") {
        alert("Seleccione un tipo")

    } else {
        alert("Sus datos fueron cargados");
    }
    console.log(typeof doc)
}

function renderCarrito (indice, productoArgregado){
    let newElement = document.createElement('div')
        newElement.className = "carro_list"
        newElement.innerHTML = `<div id=${indice}>
        <div class="carro_list_cont">
            <img class="carro_list_img" src="${productoArgregado.imagen}" height="60px" width="60px">
            <h7 class="carro_tab">${productoArgregado.nombre}</h7>
        </div>
        <div class="carro_list_precio">
            <h6>$${productoArgregado.precio}</h6>
            <h6>
                <button value="${indice}" class="carro_cantidad_btn" id='disminuir' onclick="disminuir(event)">-</button>
                <input class="carro_cantidad_num" type="text" id="${productoArgregado._id}" value="1">
                <button value="${indice}" class="carro_cantidad_btn" id='aumentar' onclick="aumentar(event)">+</button>
            </h6>
            <h6 id=>Subtotal: $${productoArgregado.precio}</h6>
        </div>
    </div>`          
    
        divCarrito.appendChild(newElement)
}

function obtenerLocalStorage (){
    console.log('entre a la funcion');
    if (localStorage.getItem('productos')===null){   
        console.log('entre al if, no hay nada en Local Storage');     
    }
    else {
    carrito = JSON.parse(localStorage.getItem('productos'))
    
    
    carrito.forEach(function(item){
        let indice = productLs.indexOf(item)
        let id = item._id
        
        renderCarrito(indice,item)      
    })
    contador.innerHTML = carrito.length;
    precioTotal.innerHTML = localStorage.getItem('total')
    
    }}
    