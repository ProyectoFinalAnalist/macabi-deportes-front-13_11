<template>
    <Loading v-if="this.loading"/>
    <div v-else class="container_grid macabi_color_fondo tamaño_m">

        <div class="sub_container_title lightgrey_color_fondo">
            Registrar Socio
        </div>

        <div class="sub_container_basic lightgrey_color_fondo">

            <div class="form-floating mb-3">

                <input type="text" id="nroSocioInput" class="form-control" :disabled="this.nroSocioAutoGen"
                    :class="this.classInvalid[0]" placeholder="" v-model="this.nroSocio" @keypress="isNumber($event)">

                <label for="nroSocioInput"> Numero De Socio </label>

                <div class="form-check form-switch switch">
                    <input id="switchNroSocio" class="form-check-input" type="checkbox" role="switch"
                        @click="autoGenerarNroSocio()">
                </div>

                <div class="invalid-feedback" v-for="error in this.errorsMatrix[0]">
                    {{ error }}
                </div>

            </div>

            <div class="doble_input">

                <div class="form-floating mb-3" style="width: 49%;">
                    <input type="text" id="nombreInput" class="form-control" :class="this.classInvalid[1]" placeholder=""
                        v-model="this.nombre" @keypress="isAlpha($event)">
                    <label for="nombreInput">Nombre</label>
                    <div class="invalid-feedback" v-for="error in this.errorsMatrix[1]">
                        {{ error }}
                    </div>
                </div>

                <div class="form-floating mb-3" style="width: 49%;">
                    <input type="text" id="apellidoInput" class="form-control" :class="this.classInvalid[2]" placeholder=""
                        v-model="this.apellido" @keypress="isAlpha($event)">
                    <label for="apellidoInput">Apellido</label>
                    <div class="invalid-feedback" v-for="error in this.errorsMatrix[2]">
                        {{ error }}
                    </div>
                </div>

            </div>

            <div class="form-floating mb-3">
                <input type="email" id="emailInput" class="form-control" :class="this.classInvalid[4]" placeholder=""
                    v-model="this.email">
                <label for="emailInput">Email</label>
                <div class="invalid-feedback" v-for="error in this.errorsMatrix[4]">
                    {{ error }}
                </div>
            </div>

            <div class="doble_input">

                <div class="form-floating mb-3" style="width: 49%;">
                    <input type="text" id="dniInput" class="form-control" :class="this.classInvalid[3]" placeholder=""
                        v-model="this.dni" @keypress="isNumber($event)" maxlength="12">
                    <label for="dniInput">DNI</label>
                    <div class="invalid-feedback" v-for="error in this.errorsMatrix[3]">
                        {{ error }}
                    </div>
                </div>

                <div class="form-floating mb-3" style="width: 49%;">
                    <input type="date" id="fechaInput" class="form-control" :class="this.classInvalid[7]" placeholder=""
                        v-model="this.fechaNacimiento" :max="this.selectedDate">
                    <label for="fechaInput" class="date_label">Fecha De Nacimeinto</label>
                    <div class="invalid-feedback" v-for="error in this.errorsMatrix[7]">
                        {{ error }}
                    </div>
                </div>



            </div>

            <div class="form-floating mb-3">
                <input type="text" id="telefonoInput" class="form-control" :class="this.classInvalid[5]" placeholder=""
                    v-model="this.telefono" @keypress="isNumber($event)" maxlength="12">
                <label for="telefonoInput">Telefono</label>
                <div class="invalid-feedback" v-for="error in this.errorsMatrix[5]">
                    {{ error }}
                </div>
            </div>

            <div class="form-floating mb-3">
                <input type="text" id="direccionInput" class="form-control" :class="this.classInvalid[6]" placeholder=""
                    v-model="this.direccion">
                <label for="direccionInput">Direccion</label>
                <div class="invalid-feedback" v-for="error in this.errorsMatrix[6]">
                    {{ error }}
                </div>
            </div>

            <div class="form-floating mb-3">
                <input type="text" id="ObservInput" class="form-control" :class="this.classInvalid[8]" placeholder=""
                    v-model="this.observaciones">
                <label for="ObservInput">Observaciones</label>
                <div class="invalid-feedback" v-for="error in this.errorsMatrix[8]">
                    {{ error }}
                </div>
            </div>

            <div class="d-flex justify-content-center align-items-center">
                <button type="submit" class="btn btn-macabi1" @click="validarCampos">Registar Socio</button>
            </div>

        </div>
    </div>
    <br>
    <div v-if="!this.loading" class="d-flex justify-content-center align-items-center">
        <button type="submit" class="btn btn-dark" @click="volver">Cancelar</button>
    </div>
    <br>
</template>

<script>
import axios from 'axios';
import apiUrl from "../../../../config/config.js"
import Loading from '../../dependentComponents/Loading.vue';

export default {
    data() {
        return {
            nroSocio: '',
            nroSocioAutoGen: false,

            nombre: '',
            apellido: '',
            dni: '',
            email: '',
            telefono: '',
            direccion: '',
            fechaNacimiento: '',
            observaciones: '',

            classInvalid: ['', '', '', '', '', '', '', '', ''],
            errorsMatrix: [[], [], [], [], [], [], [], [], []],


            errorMsj: '',
            isInvalid: '',
            selectedDate: null,

            loading: true
        };
    },
    components: {
        Loading
    }, 
    async created() {
        this.initializeDate()
        this.loading = false
    },
    methods: {

        autoGenerarNroSocio() {

            this.nroSocioAutoGen = !this.nroSocioAutoGen

            if (this.nroSocioAutoGen) {
                this.buffernroSocio = this.nroSocio
                this.nroSocio = 'Auto Generado'

            } else {
                this.nroSocio = this.buffernroSocio
            }

        },

        initializeDate() {
            const date = new Date()
            date.setDate(date.getDate() - 1);
            this.selectedDate = date.toISOString().slice(0, 10);
        },

        isNumber(evt) {
            const regexNumbers = /[0-9]/g
            const keyPressed = evt.key;

            if (!regexNumbers.test(keyPressed)) {
                evt.preventDefault()
            }
        },

        isAlpha(evt) {
            const regexNumbers = /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ]?$/
            const keyPressed = evt.key;

            if (!regexNumbers.test(keyPressed)) {
                evt.preventDefault()
            }
        },

        validarCampos() {

            this.registrarSocio()

        },

        async registrarSocio() {

            this.classInvalid = ['', '', '', '', '', '', '', '', '']

            this.errorsMatrix = [[], [], [], [], [], [], [], [], []]

            try {

                if(window.confirm("¿Quieres registrar este socio?")){
                    const data = {
                    nroSocio: this.nroSocio,
                    nombre: this.nombre,
                    apellido: this.apellido,
                    dni: this.dni,
                    email: this.email,
                    telefono: this.telefono,
                    direccion: this.direccion,
                    fechaNacimiento: this.fechaNacimiento,
                    observaciones: this.observaciones,
                };

                this.loading = true

                let response                

                if (!this.nroSocioAutoGen) {

                    response = await axios.post(`${apiUrl}/socio`, data, { withCredentials: true });

                } else {

                    response = await axios.post(`${apiUrl}/socio/noNroSocio`, data, { withCredentials: true });

                    alert("El socio se registró correctamente")


                }

                this.$router.push(`/socios`);
                }
                

            } catch (error) {

                console.log(error);

                if (!error.response) {
                    console.error(error);
                    this.errorMsj = "Fallo en la comunicacion con el servidor"

                } else {
                    const erroresArray = error.response.data.message.split("Validation error: ").filter(Boolean).map(error => error.trim().replace(/,?$/, ''));

                    this.showErrors(erroresArray)
                }

            } finally {
                this.loading = false
            }

        },

        showErrors(erroresArray) {
            erroresArray.forEach(error => {
                const numero = parseInt(error.substring(0, 1));
                //console.log("numero", numero)
                const mensaje = error.substring(1);
                //console.log(mensaje)


                if (/^[0-9]+(\.[0-9]+)?$/.test(numero)) {
                    this.classInvalid[numero] = 'is-invalid'
                    this.errorsMatrix[numero].push(mensaje);
                } else {
                    console.error(error)
                }

            });

        },

        volver() {
            this.$router.go(-1)
        }

    }
};
</script>

<style scoped>
.switch {
    display: flex;
    align-items: center;


    position: absolute;
    right: 30px;
    top: 15px;
}

.doble_input {
    display: flex;
    justify-content: space-between;
}

@media screen and (max-width:630px) {
    .date_label {
        max-width: 160px;
    }
}
</style>