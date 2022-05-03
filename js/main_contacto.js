function validar_guardar() { 
    var usuario=document.getElementById("usuario");
    var doc=document.getElementById("doc").value;
    var docP=parseInt(doc)
    var mascota=document.getElementById("mascota");
    var email=document.getElementById("email");
    var tipo=document.getElementById("tipo");
    console.log(doc)
    console.log(isNaN(doc))

    if (usuario.value ===""){
        alert("Ingrese su nombre")
    }
    else if  (doc==""){
        alert("Debe ingresar un documento");
    }
    else if(isNaN(docP)){
        alert("Debe ingresar un numero valido");
    }
    else if (mascota.value ==="") {
        alert("Debe ingresar el nombre de su mascota");
    }
    else if (email.value ==="") {
        alert("Debe ingresar su correo");
    }
    else if (tipo.value ==="") {
            alert("Seleccione un tipo")
        
        }else{
            alert("Sus datos fueron cargados");
        }
       console.log(typeof doc)
}