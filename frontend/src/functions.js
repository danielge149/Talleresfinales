import Swal from 'sweetalert2';
import  withReactContent from 'sweetalert2-react-content';

export function mostrarAlerta(mensaje, icono, foco=''){
    onfocus(foco);
    const MySwal= withReactContent(Swal);
    MySwal.fire({
        title: mensaje,
        icon: icono    
    });
}

function onfocus(foco){
    if(foco!==''){
        document.getElementById(foco).focus();
    }
}