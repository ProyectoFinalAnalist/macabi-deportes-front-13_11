<template>
    <Loading v-if="loading"/>
    <div v-else class="container mt-4">
        <div class="row">
            <div class="col-md-6 offset-md-3" v-if="categoria">
                <div class="card bg-light text-dark mb-5">
                    <div v-if="categoria" class="card-body">
                        <h4>Detalles de la Categoría: <strong>{{ nombre }}</strong></h4>
                        <div>
                            <p class="p">
                                <strong>Nombre: </strong><input type="text" class="form-control"
                                    v-model="categoria.nombreCategoria" />
                            <div class="d-flex justify-content-center my-3">
                                <button class="btn btn-macabi1" @click="updateNombreCategoria">Actualizar nombre</button>
                            </div>
                            </p>
                            <p class="p pe-3">
                                <strong>Deporte al que pertenece: </strong>
                            </p>
                            <ul class="list-group mt-1 mb-4 text-center">
                                <li class="list-group-item list-group-item-light list-group-item-action text-dark"
                                    @click="irA(categoria.idDeporte, 'detalleDeporte')">
                                    <strong>{{ obtenerNombreDeporte(categoria.idDeporte).nombre }}</strong>
                                </li>
                            </ul>
                            <p class="p pe-3">
                                <strong>Profesores: </strong>
                            </p>
                            <table class="table table-hover table-bordered" v-if="profesores">
                                <thead>
                                    <tr>
                                        <th>Nombre:</th>
                                        <th>Apellido:</th>
                                        <th class="d-none d-sm-table-cell">DNI:</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="profesor in profesores" :key="profesor.idUsuario"
                                        @click="irA(profesor.idUsuario, 'usuarios')">
                                        <td>{{ profesor.nombre }}</td>
                                        <td>{{ profesor.apellido }}</td>
                                        <td class="d-none d-sm-table-cell">{{ profesor.dni }}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div v-else>
                                <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3">
                                    <strong>Categoría {{ nombre }} no posee profesores asigados</strong>
                                </h6>
                            </div>
                            <div class="justify-content-center d-flex">
                                <button class="btn btn-success mb-3" data-bs-toggle="modal" data-bs-target="#myModal2">
                                    Modificar Profesores
                                </button>
                            </div>
                            <div class="d-flex justify-content-center">
                                <button class="btn btn-danger" @click="confirmarEliminarCategoria">Borrar Categoría</button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 offset-md-3 mb-4" v-else>
                <div class="card fondo-card">
                    <div class="card-body" style="border-radius: 10px;">
                        <h5 class="fw-bold text-center">No se encontró la categoría</h5>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-if="!loading" class="d-flex justify-content-center">
        <button class="btn btn-dark" @click="volverAtras()">Volver</button>
    </div>
    <h5 v-if="message != null" class="alert alert-danger alert-sm mb-0 text-center m-2 mb-3">
        <strong>{{ message }}</strong>
    </h5>
    <!--MODAL 2 / MODAL 2 / MODAL 2 / MODAL 2 / MODAL 2 / MODAL 2 / MODAL 2 / MODAL 2 / MODAL 2 / MODAL 2 / MODAL 2 / MODAL 2 / -->
    <div class="modal fade" id="myModal2" tabindex="-1" aria-labelledby="exampleModalLabel2" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel2">Seleccionar Profesores</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div v-if="profesoresModal" v-for="profesor in profesoresModal" :key="profesor.idUsuario">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" :value="profesor.idUsuario"
                                :checked="isChecked(profesor.idUsuario)">
                            <label class="form-check-label" for="exampleCheckbox1">
                                <p class="h6"> {{ profesor.nombre }}, {{ profesor.apellido }} | DNI: {{
                                    profesor.dni }}</p>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-macabi1" @click="saveSelectedProfesores">Guardar</button>
                    <button type="button" class="btn btn-dark" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
@import "../../../assets/btn.css";

h6,
.fondo-card {
    background-color: #f8d7da;
    border-color: #f0959e;
    color: #723b47;
    border-width: 1px;
    border-style: solid;
    border-radius: 4px;
    padding: 8px;
}

li,
tbody {
    cursor: pointer;
}
</style>
<script>
import { useElementStore } from '../../../utils/Store';
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiUrl from '../../../../config/config.js'
import axios from 'axios'
import { usrStore } from '../../../stores/usrStore';
import { verificarAutorizacionCategoria } from "../../../utils/permisos";
import Loading from '../../dependentComponents/Loading.vue';

export default {
    setup() {
        const categoriasStore = useElementStore("categorias")()
        const deporteStore = useElementStore("deportes")()
        const usuariosStore = useElementStore("usuarios")()
        const profesoresStore = useElementStore("profesores")()

        const userStore = usrStore();
        const rolUsuario = userStore.getRol
        const message = ref(null)

        const route = useRoute()
        const router = useRouter();
        const idCategoria = route.params.id
        const idDeporte = ref(0)

        const loading = ref(true)

        const nombre = ref(null)

        onMounted(async () => {
            if (!await verificarAutorizacionCategoria(idCategoria)) {
                router.push({ path: "/unauthorized" })
            }
            await categoriasStore.fetchElementById(`${apiUrl}/categoria/`, idCategoria)
            await deporteStore.fetchElements(`${apiUrl}/deporte/getAll`)
            usuariosStore.elements = null;
            usuariosStore.elementsList = null;
            await usuariosStore.fetchElements(`${apiUrl}/categoria/${idCategoria}/getProfesores`)
            await profesoresStore.fetchElements(`${apiUrl}/usuario/3/rol/activos`)
            loading.value = false
            data.value;
        })

        const categoria = ref(null)
        const categoriasDelDeporte = ref(null)
        const deporte = ref(null)
        const profesores = ref(null)
        const profesoresModal = ref(null)

        const data = computed(async () => {
            if (categoriasStore.currentElement != null) {
                categoria.value = categoriasStore.currentElement.result;
                deporte.value = obtenerNombreDeporte(categoria.value.idDeporte);
                idDeporte.value = deporte.value.idDeporte;
                profesoresModal.value = profesoresStore.getElements.result

                async function fetchData() {
                    try {
                        await idDeporte.value;
                        await categoriasStore.fetchElements(`${apiUrl}/categoria/${idDeporte.value}/deporte`);

                        if (categoriasStore.getElements) {
                            categoriasDelDeporte.value = categoriasStore.getElements.result;
                        }

                        if (usuariosStore.getElements != null) {
                            profesores.value = usuariosStore.getElements.usuariosList;
                        }

                        nombre.value = categoria.value.nombreCategoria;
                    } catch (error) {
                        console.error("Error al obtener datos asincrónicos:", error);
                    }
                }

                fetchData();
            }

        });

        function obtenerNombreDeporte(idDeporte) {
            const deporteEncontrado = deporteStore.getElements.result.find((deporte) => deporte.idDeporte === idDeporte);

            if (deporteEncontrado) { return deporteEncontrado; } else { return "Nombre no encontrado"; }
        }

        const deleteCategoria = async () => {

            try {
                await categoriasStore.deleteElement(
                    apiUrl,
                    "categoria/" + idCategoria + "/eliminarCategoria"
                );
                alert("Categoría eliminada con éxito");
                router.push("/deportes");
            } catch (error) {
                console.error("Error al eliminar el deporte:", error);
            }
        };

        const confirmarEliminarCategoria = () => {
            const mensaje = `¿Estás seguro de eliminar esta categoria: "${nombre.value}"?`;
            if (window.confirm(mensaje)) {
                deleteCategoria();
            }
        };

        function volverAtras() {
            router.go(-1);
        }

        const updateNombreCategoria = async () => {
            const catUpdated = JSON.parse(JSON.stringify(categoriasStore.currentElement.result))

            if (!validar() && categoriasStore.confirm("modificar", "modificada", "nombre de Categoría")) {
                await categoriasStore.updateElement(`${apiUrl}/categoria`, catUpdated, "idCategoria");
                location.reload();
            }
        }

        function validar() {

            let resultado = false;
            if (categoria.value.nombreCategoria.trim() === '') { message.value = "El nombre no puede estar vacío"; }

            if (categoriasDelDeporte.value.length > 0) {
                resultado = categoriasDelDeporte.value.some((c) => c.nombreCategoria == categoria.value.nombreCategoria && c.idCategoria != idCategoria);
            }

            if (resultado) { alert("El nombre no puede repetirse dentro de las categorías del mismo deporte") }

            return resultado;
        };

        function saveSelectedProfesores() {
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            const valoresSeleccionados = [];

            checkboxes.forEach((checkbox) => {
                if (checkbox.checked) {
                    valoresSeleccionados.push(checkbox.value);
                }
            });

            const nuevosProfesores = [];

            profesoresModal.value.forEach((profesor) => {
                if (valoresSeleccionados.includes(profesor.idUsuario.toString())) {
                    nuevosProfesores.push(profesor);
                }
            });


            if (usuariosStore.confirm("modificar", "modificado", "Profesor/es")) {
                profesores.value = nuevosProfesores;
                updateProfesores()
            }

        }

        async function updateProfesores() {
            await usuariosStore.deleteElement(`${apiUrl}/categoria/eliminarProfesores`, idCategoria);

            loading.value = true

            const usuarios = { idUsuarios: [] }
            for (const profe of profesores.value) {
                usuarios.idUsuarios.push(profe.idUsuario);
            }

            try {
                await axios.post(`${apiUrl}/categoria/${idCategoria}/agregarProfesores`, usuarios,)
            } catch (error) {
                console.log("error", error)
            } finally {
                location.reload()
            }
        }

        function isChecked(id) {
            if (profesores.value != null) {
                return profesores.value.some(profesor => profesor.idUsuario == id);
            }
            return false
        }

        function irA(id, route) {
            if (id != 0) {
                router.push(`/${route}/${id}`);
            }
        }

        return {
            categoriasStore,
            deporteStore,
            usuariosStore,
            obtenerNombreDeporte,
            deleteCategoria,
            categoria,
            deporte,
            profesores,
            volverAtras,
            nombre,
            updateNombreCategoria,
            message,
            profesoresModal,
            saveSelectedProfesores,
            isChecked,
            confirmarEliminarCategoria,
            deleteCategoria,
            irA,
            loading
        }
    },
    components: {
        Loading
    }
}
</script>