<template>
    <loading v-if="this.loading" />
    <div class="mb-5" v-else>

        <div v-if="usuarioStore.getRol == 'A'" class="container_flex">
            <div style="width: 100%;" class="text text-center pb-5 h1">Opciones de Administrador</div>

            <router-link to="/usuarios" class="fs-4 btn btn-primary primary-macabi btn-home"> Usuarios </router-link>

            <router-link to="/socios" class="fs-4 btn btn-primary primary-macabi btn-home"> Socios </router-link>

            <router-link to="/deportes" class="fs-4 btn btn-primary primary-macabi btn-home"> Deportes </router-link>

        </div>

        <div v-else-if="usuarioStore.getRol == 'C' && deportesDeUsuario.getElements" class="container_flex">
            <div style="width: 100%;" class="text text-center pb-5 h1">Tus Deportes asignados - Coordinador de Deportes
            </div>

            <router-link v-if="deportesDeUsuario.getElements.result.length > 0"
                v-for="sport in deportesDeUsuario.getElements.result" :to="'/detalleDeporte/' + sport.idDeporte"
                class="fs-4 btn btn-primary primary-macabi btn-home">
                {{ sport.nombre }}
            </router-link>

            <div v-else>
                <div style="width: 100%;" class="text text-center p-5 h5">No tienes deportes asignados :c</div>
            </div>
        </div>

        <div v-else-if="usuarioStore.getRol == 'P' && this.categoriasDeUsuario.getElements" class="container_flex">
            <div style="width: 100%;" class="text text-center pb-5 h1">Tus Categorías asignadas - Profesor</div>

            <router-link v-if="this.categoriasDeUsuario.getElements.categorias.length > 0"
                v-for="category in this.categoriasDeUsuario.getElements.categorias"
                :to="'/detalleCategoria/' + category.idCategoria" class="fs-4 btn btn-primary primary-macabi btn-home">
                {{ category.nombreCategoria }} - {{ category.Deporte.nombre }}
            </router-link>

            <div v-else>
                <div style="width: 100%;" class="text text-center p-5 h5">No tienes categorias asignadas :c</div>
            </div>

        </div>

        <div class="container_flex">
            <router-link to="/usuarios" class="fs-4 btn btn-success btn-home emergencia" v-if="this.usuarioStore.getRol == 'C'">
                <h4 class="text-center pt-3 pb-1"><strong>PROFESORES</strong></h4>
            </router-link>
            <router-link to="/contactosEmergencia" class="fs-4 btn btn-danger btn-home emergencia">
                <h4 class="text-center pt-3 pb-1"><strong>CONTACTOS DE EMERGENCIA</strong></h4>
            </router-link>
        </div>

    </div>
</template>
<script>
import { useElementStore } from "../utils/Store"
import { usrStore } from '../stores/usrStore.ts'
import apiUrl from "../../config/config";
import Loading from "./dependentComponents/Loading.vue";

export default {
    data() {
        return {
            usuarioStore: usrStore(),
            deportesDeUsuario: useElementStore("deportesDeUsuario")(),
            categoriasDeUsuario: useElementStore("categoriasDeUsuario")(),
            loading: true
        }
    },
    components: {
        Loading
    },
    async mounted() {

        document.title = 'Macabi Deportes App'

        if (!this.usuarioStore.isLogged) {
            await this.usuarioStore.reiniciarSesion()
        }

        switch (this.usuarioStore.getRol) {
            case 'C':
                this.obtenerDeportes()
                break;
            case 'P':
                this.obtenerCategorias()
                break;
            default:
                this.loading = false
        }

    },
    methods: {
        obtenerDeportes() {
            this.deportesDeUsuario.fetchElements(`${apiUrl}/usuario/${this.usuarioStore.getId}/deportes`)
            this.loading = false
        },

        obtenerCategorias() {
            this.categoriasDeUsuario.fetchElements(`${apiUrl}/usuario/${this.usuarioStore.getId}/categorias`)
            this.loading = false
        },
    },
}
</script>

<style scoped>
.btn-home {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;
    min-width: 200px;
    height: 70px;
    margin-bottom: 20px;
}

.emergencia {
    margin-top: 40px;
    width: 85%;
    min-width: 300px;

}
</style>
