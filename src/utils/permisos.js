
import axios from "axios";
import apiUrl from "../../config/config";
import { usrStore } from "../stores/usrStore";

export const verificarAutorizacionCategoria = async (idCategoria) => {
    console.log("llegue aca La categoria" + idCategoria);
    let permitido = true;
    const userStore = usrStore()
    console.log("El rol es: " + userStore.getRol);
    if(userStore.getRol == 'C'){
        let respuesta = await axios(`${apiUrl}/usuario/${userStore.getId}/${idCategoria}/validarPermisoProfesor`, { withCredentials: true })
        permitido = respuesta.result
    }else {
        if(userStore.getRol  == 'P') {
           let respuesta  = await axios(`${apiUrl}/usuario/${userStore.getId}/${idCategoria}/validarPermisoCoordinador`, { withCredentials: true })
           permitido = respuesta.result
        }
    }
    return permitido
  };