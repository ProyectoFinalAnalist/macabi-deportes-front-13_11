<template>
    <div class="container-fluid px-5 mb-5">
        <div class="text text-center">
            <h1>Categoria: <strong>{{ nombreCategoria }}</strong> </h1>
            <h4>Deporte: <strong>{{ deporteCategoria }}</strong> </h4>
        </div>
        <h6 class="my-3"><strong>Profesor/es:</strong></h6>
        <div class="ms-5 mb-0">
            <button v-for="(profesor, index) in profesoresCategoria" :key="index" class="mb-1 mx-1 btn btn-sm btn-dark"
                @click="verProfesor(profesor.idUsuario)">
                {{ profesor.apellido }}, {{ profesor.nombre }}
            </button>
        </div>
        <br>
        <form @submit.prevent="buscar()">
            <div class="row g-2">
                <div class="col-12 col-md-auto">
                    <select id="filtro" class="form-select">
                        <option disabled>Filtrar por:</option>
                        <option value="nroSocio">Número de Socio</option>
                        <option selected value="nombre">Nombre</option>
                        <option value="apellido">Apellido</option>
                        <option value="dni">Dni</option>
                        <option value="email">Mail</option>
                    </select>
                </div>
                <div class="col-12 col-md-auto">
                    <input type="text" class="form-control" placeholder="Buscar..." v-model="busqueda">
                </div>
                <div class="col-12 col-md-auto">
                    <div class="btn-group d-flex justify-content-center mx-md-0" style="margin: 0% 40%;">
                        <button class="btn btn-danger text-center" type="button" v-on:click="reiniciar">Reiniciar</button>
                        <button class="btn btn-success text-center" type="button" v-on:click="buscar">Buscar</button>
                    </div>
                </div>
                <div class="col text-md-end">
                    <div class="d-flex justify-content-end mt-3 mb-0">
                        <p>Socios encontrados: <strong>{{ this.size }}</strong></p>
                    </div>
                </div>
            </div>
        </form>
        <br>
        <div class="text text-center mb-3"> <code>Solo se muestran los socios asignados a la categoría</code></div>
        <div v-if="listSocios && listSocios.length > 0">
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th class="d-none d-sm-table-cell">NroSocio:
                            <button class="btn bg-success" @click="ordenar('nroSocio')"></button>
                        </th>
                        <th>Nombre:</th>
                        <th>Apellido:</th>
                        <th class="d-none d-sm-table-cell">Dni:
                            <button class="btn bg-success" @click="ordenar('dni')"></button>
                        </th>
                        <th class="d-none d-lg-table-cell">Email:</th>
                    </tr>
                </thead>
                <tbody class="pointer">
                    <tr v-for="socio in sociosFiltados" :key="socio.idSocio" @click="irA(socio.idSocio)">
                        <td class="d-none d-sm-table-cell">{{ socio.nroSocio }}</td>
                        <td>{{ socio.nombre }} <label class="badge bg-macabi ms-3" id="socioNuevo"
                                v-if="socio.esNuevoSocio">NUEVO</label> </td>
                        <td>{{ socio.apellido }}</td>
                        <td class="d-none d-sm-table-cell">{{ socio.dni }}</td>
                        <td class="d-none d-lg-table-cell">{{ socio.email }}</td>
                    </tr>
                </tbody>
            </table>
            <div class="text text-start mb-2">
                <p>Socios en la categoría: <strong>{{ this.listSocios.length }}</strong></p>
            </div>
            
            <div class="text text-center">
                <p class="badge bg-macabi me-2 mb-0">NUEVO</p>
                <br>
                <code>* El socio fue agregado a la categoría dentro de los últimos 7 días</code>
            </div>
            
        </div>
       
        <div v-else class="text text-center fw-bold h3 alert alert-danger">No se encontraron socios asignados a la categoria
        </div>
        <hr>
        <div class="d-flex justify-content-center">
            <router-link :to="`/fechasCategoria/${this.idCategoria}`" class="btn btn-dark">Fechas</router-link>
        </div>
        <div class="text text-center pt-3">
            <code>Añadir o quitar socios <strong>de esta Categoría</strong></code>
        </div>
        <div class="d-flex justify-content-center my-3">
            <div class="btn-group">
                <router-link :to="`/agregarSocio/${this.idCategoria}`" class="btn btn-success">Añadir socios</router-link>
                <router-link :to="`/eliminarSociosCategoria/${this.idCategoria}`" class="btn btn-danger">Quitar
                    socios</router-link>
            </div>
        </div>
        <div class="d-flex justify-content-center mb-5">
            <div class="btn-group">
                <router-link :to="`/modificarCategoria/${this.idCategoria}`" class="btn btn-macabi1">Editar
                    Categoría</router-link>
                <button class="btn btn-dark" @click="volverAtras()">Volver</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import apiUrl from '../../../../config/config.js';
import { useElementStore } from '../../../utils/Store';

export default {
    setup() {
        const socioStore = useElementStore("categoria")(); // Asegúrate de usar la tienda correcta
        const { currentElement, fetchElementById, elements } = socioStore;
        return { currentElement, fetchElementById, elements };
    },
    data() {
        return {
            idCategoria: "",
            nombreCategoria: "nombreCategoria",
            deporteCategoria: "nombreDeporteCategoria",
            listSocios: [],
            busqueda: "",
            sociosFiltados: [],
            tipoFiltro: "",
            size: 0,
            orden: 0,
            profesoresCategoria: [

            ],
            fecha1SemanaAtras: "",

        };
    },
    async created() {
        this.idCategoria = this.$route.params.id;
        try {
            let respuesta = await axios.get(`${apiUrl}/categoria/${this.idCategoria}/nombreCategoria`, { withCredentials: true });
            this.nombreCategoria = respuesta.data.nombreCategoria
            let nombreDeporteBuscado = await axios.get(`${apiUrl}/categoria/${this.idCategoria}/nombreDeporte`, { withCredentials: true });
            this.deporteCategoria = nombreDeporteBuscado.data.nombreDeporte
            let respuestaSocios = await axios.get(`${apiUrl}/sociosXCategoria/${this.idCategoria}`, { withCredentials: true });
            let sociosLista = respuestaSocios.data.sociosDatos
            sociosLista.forEach(socio => {
                this.listSocios.push(socio)
            });

            this.fecha1SemanaAtras = new Date();
            this.fecha1SemanaAtras.setDate(this.fecha1SemanaAtras.getDate() - 7);
            this.asignarSiEsNuevoUsuarioONo(this.fecha1SemanaAtras, this.listSocios)

            this.sociosFiltados = this.listSocios
            this.size = this.listSocios.length

            try {
                let resultProfes = await axios.get(`${apiUrl}/categoria/${this.idCategoria}/getProfesores`);
                this.profesoresCategoria = resultProfes.data.usuariosList;
            } catch (e) {

            }


        } catch (e) {
        }

    },
    methods: {

        asignarSiEsNuevoUsuarioONo(fechaDiaSemanaAnterior, listaSocios) {

            listaSocios.forEach(socio => {

                let fechaRegistroSocio = new Date(socio.fechaRegistro)
                fechaRegistroSocio.setDate(fechaRegistroSocio.getDate() + 1)
                if (fechaRegistroSocio < fechaDiaSemanaAnterior) {
                    socio.esNuevoSocio = false;

                } else {
                    socio.esNuevoSocio = true;
                }

            });

        },

        verProfesor(profesor) {
            this.$router.push(`/usuarios/${profesor}`);
        },

        irA(id) {
            if (id != 0) {
                this.$router.push(`/socios/${id}`);

            }
        },
        buscar() {
            this.reiniciar();


            if (this.busqueda !== "") {
                this.tipoFiltro = document.getElementById("filtro").value;
                this.sociosFiltados = this.listSocios.filter(item => {
                    let propiedad = item[this.tipoFiltro];
                    let propiedadLowerCase = String(propiedad).toLowerCase();
                    let busquedaLowerCase = String(this.busqueda).toLowerCase();
                    return propiedadLowerCase.includes(busquedaLowerCase);
                });
                this.size = this.sociosFiltados.length || 0;
            }






        },
        reiniciar() {
            this.sociosFiltados = this.listSocios;
        },
        ordenar(columna) {
            this.orden = !this.orden

            this.sociosFiltados.sort((a, b) => {
                let factorOrden = this.orden ? -1 : 1;
                if (a[columna] < b[columna]) return -1 * factorOrden;
                if (a[columna] > b[columna]) return 1 * factorOrden;
                return 0;
            });
        },
        volverAtras() {
            this.$router.go(-1)
        }
    },
};
</script>

<style scoped>
.pointer {
    cursor: pointer
}

.bg-macabi {
    background-color: #004896;
}
</style>
