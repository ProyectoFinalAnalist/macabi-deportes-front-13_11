<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-6 offset-md-3" v-if="usuario">
                <h3 class="text-center">Detalles del Usuario: <strong>{{ usuario.apellido }}, {{ usuario.nombre }}</strong>
                </h3>
                <br>
                <div class="card bg-light text-dark mb-4">
                    <div class="card-body">
                        <p class="mb-2"><strong class="font-weight-bold">Email: </strong>{{ usuario.email }}</p>
                        <p class="mb-2"><strong class="font-weight-bold">Dni: </strong>{{ usuario.dni }}</p>
                        <p class="mb-2"><strong class="font-weight-bold">Edad: </strong>{{
                            utils.obtenerEdadXFecha(usuario.fechaNacimiento) }}<code>*</code></p>
                        <p class="mb-2"><strong class="font-weight-bold">Fecha de nacimiento: </strong>{{
                            utils.obtenerFechaFormateada(usuario.fechaNacimiento) }}</p>
                        <p class="mb-2"><strong class="font-weight-bold">Telefono: </strong>{{ usuario.telefono }}</p>
                        <p class="mb-2"><strong class="font-weight-bold">Rol: </strong>{{ roleName }}</p>
                        <p class="mb-2"><strong class="font-weight-bold">Activo: </strong>{{ activo }}</p>
                        <p class="mb-2"><strong class="font-weight-bold">Direccion: </strong>{{ usuario.direccion }}</p>
                    </div>
                </div>
                <div class="text-end my-3 ms-5">
                    <code>* Edad calculada a partir de la fecha de nacimiento automáticamente</code>
                </div>
                <div v-if="usuario.Rol.tipo != 'A'" class="mb-4">
                    <div v-if="usuario.Rol.tipo == 'C' && asignaciones != null">
                        <hr>
                        <h3 class="text-center pb-3">Deportes asignados del Coordinador</h3>
                        <div class="d-flex justify-content-end input-group">
                            <table class="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>Deporte:</th>
                                    </tr>
                                </thead>
                                <tbody class="text-center pointer">
                                    <tr v-for="deporte in asignaciones" :key="deporte.idDeporte"
                                        @click="irA(deporte.idDeporte, 'detalleDeporte')">
                                        <td>{{ deporte.nombre }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="text-end my-3 ms-2 mb-4">
                            <code>* Solo se puede desasignar Coordinadores de deportes en la sección de "Editar Deporte"</code>
                        </div>
                    </div>
                    <div v-else-if="usuario.Rol.tipo == 'P' && asignaciones != null">
                        <hr>
                        <h3 class="text-center pb-3">Categorías asignadas del Profesor</h3>
                        <div class="d-flex justify-content-center align-items-center mb-4">
                            <button type="button" class="btn btn-success" data-bs-toggle="collapse"
                                data-bs-target="#demo">Ayuda</button>
                        </div>
                        <div id="demo" class="collapse">
                            <code><strong>"Click"</strong> en el nombre de la <strong>Categoría</strong> para ir hacia los detalles de esa Categoría.
                                    <br><strong>"Click"</strong> en el nombre del <strong>Deporte</strong> para ir a los detalles de ese Deporte.</code>
                        </div>
                        <div class="d-flex justify-content-end input-group">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Categoría:</th>
                                        <th>Deporte:</th>
                                    </tr>
                                </thead>
                                <tbody class="text-center pointer">
                                    <tr v-for="categoria in asignaciones" :key="categoria.idCategoria">
                                        <td class="tablaHoover" @click="irA(categoria.idCategoria, 'detalleCategoria')">{{
                                            categoria.nombreCategoria }}</td>
                                        <td class="tablaHoover" @click="irA(categoria.Deporte.idDeporte, 'detalleDeporte')">
                                            {{
                                                categoria.Deporte.nombre }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="text-end my-3 ms-2 mb-4">
                            <code>* Solo se puede desasignar Profesores de categoría en la sección de "Editar Catgoría"</code>
                        </div>
                    </div>
                    <div class="card fondo-card text-center" v-else>
                        <div class="card-body p-0 pt-3">
                            <h6 class="card-text fw-bold">{{ messageError }}</h6>
                            <br>
                            <p>Para asignarle un deporte o categoría al usuario se tiene que hacer desde la pantalla editar
                                correspondiente</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 offset-md-3" v-else>
                <strong class="alert alert-warning text-center">El usuario no existe.</strong>
            </div>
            <div class="d-flex justify-content-center mb-5">
                <div class="btn-group mb-3">
                    <router-link class="btn btn-macabi1" v-if="usuario"
                        :to="`/modificarusuario/${usuario.idUsuario}`">Modificar
                        Usuario</router-link>

                    <button class="btn btn-dark" @click="volver">Volver</button>
                </div>
            </div>
        </div>
    </div>
    <br>
</template>
<style>
@import '../../../assets/btn.css';

.fondo-card {
    background-color: #f8d7da;
    border-color: #f0959e;
    color: #723b47;
    border-width: 2px;
    border-style: solid;
    border-radius: 4px;
    padding: 8px;
}

.pointer {
    cursor: pointer;
}

.tablaHoover:hover {
    background-color: rgb(230, 230, 230)
}
</style>
<script>
import { useElementStore } from "../../../stores/Store";
import { useRoute, useRouter } from "vue-router";
import { computed, ref } from "vue";
import { Utils } from "../../../utils/utils"
import apiUrl from "../../../../config/config";
import axios from "axios";

export default {
    setup() {

        const route = useRoute();
        const router = useRouter();
        const idUsuario = route.params.id.toString();
        const elementStore = useElementStore("usuario")();
        const utils = new Utils()

        elementStore.fetchElementById(idUsuario)
            .then(() => {
                switch (elementStore.currentElement.Rol.tipo) {
                    case 'C':
                        obtenerDeportes()
                        break;
                    case 'P':
                        obtenerCategorias()
                        break;
                }
            })

        const usuario = computed(() => elementStore.currentElement)
        const asignaciones = ref(null)
        const messageError = ref(null)

        function volver() {
            router.go(-1)
        }

        function obtenerDeportes() {
            axios.get(`${apiUrl}/usuario/${usuario.value.idUsuario}/deportes`, { withCredentials: true })
                .then(response => {
                    asignaciones.value = response.data.result
                })
                .catch(error => {
                    messageError.value = `${error.response.data.message} asignados`
                });
        }

        function obtenerCategorias() {
            axios.get(`${apiUrl}/usuario/${usuario.value.idUsuario}/categorias`, { withCredentials: true })
                .then(response => {
                    asignaciones.value = response.data.categorias
                })
                .catch(error => {
                    messageError.value = error.response.data.message
                });
        }

        function irA(id, route) {
            router.push(`/${route}/${id}`)
        }

        return {
            usuario,
            utils,
            volver,
            asignaciones,
            irA,
            messageError
        };
    },
    computed: {
        roleName() {
            switch (this.usuario.idRol) {
                case 1:
                    return "Administrador";
                case 2:
                    return "Coordinador";
                case 3:
                    return "Profesor"
                default:
                    return "Unknown";
            }
        },
        activo() {
            return this.usuario.activo ? "Si" : "No"
        }
    }
};
</script>
