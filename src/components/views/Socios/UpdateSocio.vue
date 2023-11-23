<template>
    <Loading v-if="loading" />
    <div v-else class="container-fluid">
        <div class="row">
            <div class="col-md-6 offset-md-3" v-if="socio">
                <h3 class="text-center">Detalles del Socio: <strong>{{ nombre }}</strong></h3>
                <div class="text-end mb-1"><code>*campos obligatorios</code></div>
                <div class="card bg-light text-dark mb-4">
                    <div v-if="socio" class="card-body">
                        <div>
                            <p class="p pe-2 ps-2">
                                <strong>Numero de Socio: <code>*</code></strong><input disabled type="text"
                                    class="form-control" v-model="socio.nroSocio" />
                            </p>
                            <p class="p pe-2 ps-2">
                                <strong>Nombre: <code>*</code></strong><input type="text" class="form-control"
                                    v-model="socio.nombre" />
                            </p>
                            <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                                v-if="validarNombre(socio.nombre, 'nombre', 24) !== null">
                                <strong>{{ validarNombre(socio.nombre, 'nombre', 24) }}</strong>
                            </h6>
                            <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                                v-if="validarSoloLetras(socio.nombre, 'nombre',) !== null">
                                <strong>{{ validarSoloLetras(socio.nombre, 'nombre',) }}</strong>
                            </h6>
                            <p class="p pe-2 ps-2">
                                <strong>Apellido: <code>*</code></strong><input type="text" class="form-control"
                                    v-model="socio.apellido" />
                            </p>
                            <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                                v-if="validarNombre(socio.apellido, 'apellido', 24) !== null">
                                <strong>{{ validarNombre(socio.apellido, 'apellido', 24) }}</strong>
                            </h6>
                            <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                                v-if="validarSoloLetras(socio.apellido, 'apellido') !== null">
                                <strong>{{ validarSoloLetras(socio.apellido, 'apellido') }}</strong>
                            </h6>
                            <p class="p pe-2 ps-2">
                                <strong>Dni: <code>*</code></strong><input type="number" min="0" class="form-control"
                                    v-model="socio.dni" />
                            </p>
                            <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                                v-if="validarNumero(socio.dni, 6, 10, 'dni') !== null">
                                <strong>{{ validarNumero(socio.dni, 6, 10, 'dni') }}</strong>
                            </h6>
                            <p class="p pe-2 ps-2">
                                <strong>Email: <code>*</code></strong><input type="email" class="form-control"
                                    v-model="socio.email" />
                            </p>
                            <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                                v-if="validarMail(socio.email) !== null">
                                <strong>{{ validarMail(socio.email) }}</strong>
                            </h6>
                            <p class="p pe-2 ps-2">
                                <strong>Telefono: <code>*</code></strong><input type="number" class="form-control"
                                    v-model="socio.telefono" />
                            </p>
                            <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                                v-if="validarNumero(socio.telefono, 8, 15, 'telefono') !== null">
                                <strong>{{ validarNumero(socio.telefono, 8, 15, 'telefono') }}</strong>
                            </h6>
                            <p class="p pe-2 ps-2">
                                <strong>Dirección: <code>*</code></strong><input type="text" class="form-control"
                                    v-model="socio.direccion" />
                            </p>
                            <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                                v-if="validarNumero(socio.direccion, 5, 50, 'direccion') !== null">
                                <strong>{{ validarNumero(socio.direccion, 5, 50, 'direccion') }}</strong>
                            </h6>
                            <p class="p pe-2 ps-2">
                                <strong>Fecha de Nacimiento: <code>*</code></strong><input type="date" id="fecha"
                                    :max="obtenerFechaMax()" class="form-control" v-model="socio.fechaNacimiento" />
                            </p>
                            <p class="p pe-2 ps-2">
                                <strong>Observaciones: </strong>
                                <textarea style="height: 100px; max-height: 200px;" class="form-control"
                                    v-model="socio.observaciones"></textarea>
                            </p>
                            <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                                v-if="validarObservaciones(socio.observaciones) !== null">
                                <strong>{{ validarObservaciones(socio.observaciones) }}</strong>
                            </h6>
                            <div class="d-flex justify-content-center">
                                <div class="btn-group">
                                    <button class="btn btn-macabi1" @click="updateSocio">Actualizar Socio</button>

                                    <button class="btn btn-danger" @click="deleteSocio">Borrar Socio</button>
                                </div>
                            </div>
                            <hr>
                            <p class="p pe-2 ps-2">
                                <strong>Datos de contacto: </strong>
                                <br>
                            <div class="card mt-3" style="background-color: rgb(236, 236, 236);"
                                v-for="contacto in infoContactos">
                                <div class="card-body">
                                    <h5>Contacto: <strong>{{ nombreContacto }}</strong></h5>
                                    <div class="text-end"><code>*campos obligatorios</code></div>
                                    <p class="p pe-2 ps-2">
                                        <strong>Nombre: <code>*</code></strong><input type="text" class="form-control"
                                            v-model="contacto.nombre" />
                                    </p>
                                    <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                                        v-if="validarNombre(contacto.nombre, 'nombre', 50) !== null">
                                        <strong>{{ validarNombre(contacto.nombre, 'nombre', 50) }}</strong>
                                    </h6>
                                    <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                                        v-if="validarSoloLetras(contacto.nombre, 'nombre') !== null">
                                        <strong>{{ validarSoloLetras(contacto.nombre, 'nombre') }}</strong>
                                    </h6>
                                    <p class="p pe-2 ps-2">
                                        <strong>Apellido: <code>*</code></strong><input type="text" class="form-control"
                                            v-model="contacto.apellido" />
                                    </p>
                                    <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                                        v-if="validarNombre(contacto.apellido, 'apellido', 50) !== null">
                                        <strong>{{ validarNombre(contacto.apellido, 'apellido', 50) }}</strong>
                                    </h6>
                                    <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                                        v-if="validarSoloLetras(contacto.apellido, 'apellido') !== null">
                                        <strong>{{ validarSoloLetras(contacto.apellido, 'apellido') }}</strong>
                                    </h6>
                                    <p class="p pe-2 ps-2">
                                        <strong>Email: <code>*</code></strong><input type="text" class="form-control"
                                            v-model="contacto.email" />
                                    </p>

                                    <p class="p pe-2 ps-2">
                                        <strong>Teléfono: <code>*</code></strong><input type="number" min="0"
                                            class="form-control" v-model="contacto.telefono" />
                                    </p>
                                    <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                                        v-if="validarTelefono(contacto.telefono) !== null">
                                        <strong>{{ validarTelefono(contacto.telefono) }}</strong>
                                    </h6>
                                    <div class="d-flex justify-content-center">
                                        <div class="btn-group">
                                            <button class="btn btn-macabi1" @click="updateContacto(contacto)">Actualizar
                                                Contacto</button>
                                            <button class="btn btn-danger" @click="deleteContacto(contacto)">Borrar
                                                Contacto</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex justify-content-center mt-4">
                                <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#myModal">Agregar
                                    Contacto</button>
                            </div>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 offset-md-3" v-if="!socio">
                <div class="card fondo-card mb-4">
                    <div class="card-body" style="border-radius: 10px;">
                        <h5 class="fw-bold text-center">No se encontró el socio</h5>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-if="!loading" class="d-flex justify-content-center mb-4">
        <button class="btn btn-dark" @click="volver">Volver</button>
    </div>
    <br>
    <!--MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / -->
    <div v-if="socio" class="modal fade" id="myModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Crear Contacto para:</h5>
                    <h5 class="modal-title ps-2"><strong> {{ socio.nombre }}, {{
                        socio.apellido
                    }}</strong></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p class="p pe-2 ps-2">
                        <strong>Nombre: <code>*</code></strong><input type="text" class="form-control"
                            v-model="contactoCreate.nombre" />
                    </p>
                    <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                        v-if="validarNombre(contactoCreate.nombre, 'nombre', 50) !== null">
                        <strong>{{ validarNombre(contactoCreate.nombre, 'nombre', 50) }}</strong>
                    </h6>
                    <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                        v-if="validarSoloLetras(contactoCreate.nombre, 'nombre') !== null">
                        <strong>{{ validarSoloLetras(contactoCreate.nombre, 'nombre') }}</strong>
                    </h6>
                    <p class="p pe-2 ps-2">
                        <strong>Apellido: <code>*</code></strong><input type="text" class="form-control"
                            v-model="contactoCreate.apellido" />
                    </p>
                    <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                        v-if="validarNombre(contactoCreate.apellido, 'apellido', 50) !== null">
                        <strong>{{ validarNombre(contactoCreate.apellido, 'apellido', 50) }}</strong>
                    </h6>
                    <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                        v-if="validarSoloLetras(contactoCreate.apellido, 'apellido') !== null">
                        <strong>{{ validarSoloLetras(contactoCreate.apellido, 'apellido') }}</strong>
                    </h6>
                    <p class="p pe-2 ps-2">
                        <strong>Email: <code>*</code></strong><input type="text" class="form-control"
                            v-model="contactoCreate.email" />
                    </p>
                    <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                        v-if="validarMail(contactoCreate.email) !== null">
                        <strong>{{ validarMail(contactoCreate.email) }}</strong>
                    </h6>
                    <p class="p pe-2 ps-2W">
                        <strong>Teléfono: <code>*</code></strong><input type="number" min="0" class="form-control"
                            v-model="contactoCreate.telefono" />
                    </p>
                    <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                        v-if="validarTelefono(contactoCreate.telefono) !== null">
                        <strong>{{ validarTelefono(contactoCreate.telefono) }}</strong>
                    </h6>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-macabi1" @click="crearContacto">Crear</button>
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
                    <div class="text-start"><code>*campos obligatorios</code></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { useElementStore } from '../../../utils/Store';
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiUrl from '../../../../config/config.js'
import { Utils } from '../../../utils/utils';
import Loading from '../../dependentComponents/Loading.vue';

export default {
    setup() {
        const sociosStore = useElementStore("socios")()
        const contactoStore = useElementStore("contacto")()

        const route = useRoute()
        const idSocio = route.params.id

        const router = useRouter()

        const nombre = ref(null)
        const nombreContacto = ref(null)

        const utils = new Utils()

        const loading = ref(true)

        onMounted(async () => {
            await sociosStore.fetchElements(`${apiUrl}/socio/getAll`)
            await sociosStore.fetchElementById(`${apiUrl}/socio/`, idSocio)
            data.value;
            loading.value = false
        })

        const socio = ref(null)
        const infoContactos = ref(null)

        const data = computed(() => {
            if (sociosStore.currentElement != null) {
                socio.value = sociosStore.currentElement.result;
                nombre.value = `${socio.value.apellido}, ${socio.value.nombre}`

                if (socio.value.InfoContactos.length != 0) {
                    infoContactos.value = socio.value.InfoContactos
                    nombreContacto.value = `${infoContactos.value[0].apellido}, ${infoContactos.value[0].nombre}`
                }
            }
        });

        const message = ref(null);
        const soloLetras = /^[A-Za-z\s]+$/; // letras y espacios
        const validateMail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        const updateSocio = async () => {
            message.value = null

            const dni = socio.value.dni;
            const email = socio.value.email;

            let hasDuplicateDNI = false
            let hasDuplicateEmail = false

            if (sociosStore.getElements.result.length > 0) {
                hasDuplicateDNI = sociosStore.getElements.result.some((socio) => socio.dni == dni && socio.idSocio != idSocio);
                hasDuplicateEmail = sociosStore.getElements.result.some((socio) => socio.email === email && socio.idSocio != idSocio);
            }
            if (hasDuplicateDNI) {
                alert("El DNI no puede repetirse")
                message.value = "a";
            } else if (hasDuplicateEmail) {
                alert("El correo electrónico no puede repetirse")
                message.value = "a";
            } else if (!/@/.test(email) && email.trim() === '') {
                message.value = "El Email debe debe contener '@' y no estar vacío";
            } else if (!validateMail.test(email)) {
                message.value = "Formato Email incorrecto";
            } else if (dni < 0) {
                message.value = "El DNI debe ser un número positivo";
            } else if (String(dni).length < 6 || String(dni).length > 10) {
                message.value = "El DNI debe tener un largo minimo de 6 digitos y un maximo de 10.";
            } else if (socio.value.telefono < 0) {
                message.value = "El Telefono debe ser un número positivo";
            } else if (String(socio.value.telefono).length < 8 || String(socio.value.telefono).length > 15) {
                message.value = "El teléfono debe tener un mínimo de 8 caracteres y un máximo de 15.";
            } else if (String(socio.value.nombre).length < 2 || String(socio.value.nombre).length > 24) {
                message.value = "El nombre debe tener un minimo de 2 caracteres y un maximo de 24.";
            } else if (!soloLetras.test(socio.value.nombre)) {
                message.value = "El nombre debe contener solo letras.";
            } else if (String(socio.value.apellido).length < 2 || String(socio.value.nombre).length > 24) {
                message.value = "El apellido debe tener un minimo de 2 caracteres y un maximo de 24.";
            } else if (!soloLetras.test(socio.value.apellido)) {
                message.value = "El apellido debe contener solo letras.";
            } else if (!socio.value.direccion || (String(socio.value.direccion).length < 5 || String(socio.value.direccion).length > 50)) {
                message.value = "La Dirección debe tener un mínimo de 5 caracteres y un máximo de 50.";
            } else if (String(socio.value.observaciones).length > 250) {
                message.value = "Las observaciones deben tener un maximo de 250 caracteres.";
            }

            console.log(message.value)

            if (message.value != null) {
                alert("Error detectado en el formulario")
            } else if (sociosStore.confirm("modificar", "modificado", "Socio")) {
                const socioUpdate = JSON.parse(JSON.stringify(sociosStore.currentElement.result))
                try {
                    await sociosStore.patchElement(`${apiUrl}/socio/${socioUpdate.idSocio}`, socioUpdate)
                    router.go(-1)
                } catch (e) {
                    console.log(e)
                    alert("Error updating");
                }
            }

        };

        async function deleteSocio() {
            if (utils.confirm("Eliminar", "Eliminado", "Socio")) {
                await sociosStore.deleteElement(`${apiUrl}/socio/`, idSocio)
                router.push('/socios')
            }
        }

        const contactoCreate = computed(() => contactoStore.currentElement)
        const messageModal = ref(null)

        contactoStore.setCurrentElement({
            idSocio: idSocio,
            nombre: "",
            apellido: "",
            email: "",
            telefono: "",
        });

        const crearContacto = (async () => {
            if (validarContacto("messageModal", contactoCreate.value) && contactoStore.confirm("crear", "registrado", "contacto")) {
                await contactoStore.createElement(`${apiUrl}/contacto/`, JSON.parse(JSON.stringify(contactoCreate.value)));
                location.reload()
            }
        });

        const updateContacto = (async (contacto) => {

            if (validarContacto("message", contacto) && contactoStore.confirm("modificar", "modificado", "Contacto de " + nombreContacto.value)) {
                await contactoStore.updateElement(`${apiUrl}/contacto/`, JSON.parse(JSON.stringify(contacto)), "idInfoContacto");
                location.reload()
            }
        });

        function validarContacto(tipo, contacto) {
            let crear = false;

            if (String(contacto.nombre).length < 2 || String(contacto.nombre).length > 24) {
            } else if (!soloLetras.test(contacto.nombre)) {

            } else if (String(contacto.apellido).length < 2 || String(contacto.apellido).length > 24) {

            } else if (!soloLetras.test(contacto.apellido)) {

            } else if (!validateMail.test(contacto.email)) {

            } else if (contacto.telefono < 0) {

            } else if (String(contacto.telefono).length < 9 || String(contacto.telefono).length > 30) {

            } else {
                crear = true
            }

            if (!crear) {
                alert("Error en los campos ingresados")
            }

            return crear
        }

        const deleteContacto = (async (contacto) => {
            if (contactoStore.confirm("eliminar", "eliminado", `Contacto de ${contacto.nombre}`)) {
                await contactoStore.deleteElement(`${apiUrl}/contacto/`, contacto.idInfoContacto);
                location.reload()
            }
        });

        function obtenerFechaMax() {
            const fechaActual = new Date();
            const year = fechaActual.getFullYear();
            const month = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
            const day = (fechaActual.getDate() - 1).toString().padStart(2, '0'); // Corregido: Restar 1 día

            return `${year}-${month}-${day}`;
        }

        function volver() {
            router.go(-1)
        }

        function validarNombre(nombre, tipo, max) {
            if (nombre.length < 2 || nombre.length > max) {
                return `El ${tipo} debe tener un mínimo de 2 caracteres y un máximo de ${max}`;
            } else {
                return null;
            }
        }

        function validarSoloLetras(contacto, tipo) {
            if (!soloLetras.test(contacto)) {
                return `El ${tipo} solo puede tener letras`;
            } else {
                return null;
            }
        }

        function validarMail(mail) {
            if (mail !== '' && !validateMail.test(mail) && mail !== null) {
                return "Formato de Mail incorrecto"
            } else {
                return null;
            }
        }

        function validarTelefono(contacto) {
            if (contacto === null || contacto === '') {
                return `El telefono no puede ser nulo`;
            }

            if (contacto !== null && (contacto < 0 || contacto.toString().length > 20)) {
                return "El número de teléfono debe ser un número positivo y tener un máximo de 20 caracteres";
            } else {
                return null;
            }
        }

        function validarNumero(contacto, min, max, tipo) {
            if (contacto === null || contacto === '') {
                if (tipo === 'direccion') {
                    return `La ${tipo} no puede ser nula`;
                } else {
                    return `El ${tipo} no puede ser nulo`;
                }
            }

            const telefonoString = contacto.toString();

            if (telefonoString.length < min || telefonoString.length > max || contacto < 0) {
                if (tipo === 'direccion') {
                    return `La ${tipo} debe ser un número positivo y tener entre ${min} y ${max} caracteres`;
                } else {
                    return `El ${tipo} debe ser un número positivo y tener entre ${min} y ${max} caracteres`;
                }
            }

            return null;
        }

        function validarObservaciones(observaciones) {
            if (observaciones !== null && observaciones.length > 250) {
                return "Las observaciones deben tener un máximo de 250 caracteres";
            } else {
                return null;
            }
        }

        return {
            socio,
            sociosStore,
            updateSocio,
            deleteSocio,
            infoContactos,
            obtenerFechaMax,
            message,
            updateContacto,
            deleteContacto,
            crearContacto,
            contactoCreate,
            messageModal,
            nombre,
            nombreContacto,
            volver,
            loading,
            validarNombre,
            validarMail,
            validarTelefono,
            validarSoloLetras,
            validarNumero,
            validarObservaciones
        }
    },
    components: {
        Loading
    }
}
</script>
<style scoped>
h6 {
    background-color: #f8d7da;
    border-color: #f0959e;
    color: #723b47;
    border-width: 2px;
    border-style: solid;
    border-radius: 4px;
    padding: 8px;
}
</style>