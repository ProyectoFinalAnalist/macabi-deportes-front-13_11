<template>
  <Loading v-if="loading" />
  <div v-else class="container-fluid ps-5 pe-5 mb-5">
    <div class="text text-center h1">USUARIOS</div>
    <br>
    <form @submit.prevent="buscar()">
      <div class="row g-2">
        <div class="col-12 col-md-auto">
          <select id="filtro" class="form-select" style="cursor: pointer;">
            <option disabled>Filtrar por:</option>
            <option value="nombre">Nombre</option>
            <option value="apellido">Apellido</option>
            <option value="email">Mail</option>
            <option value="dni">Dni</option>
          </select>
        </div>
        <div class="col-12 col-md-auto">
          <input type="text" class="form-control" placeholder="Buscar..." v-model="busqueda">
        </div>
        <div class="col-12 col-md-auto" v-if="usuarioStore.getRol == 'A'">
          <button class="btn btn-macabi1 mb-1 px-3" type="button" data-bs-toggle="collapse"
            data-bs-target="#checkboxesCollapse" aria-expanded="true" aria-controls="checkboxesCollapse">
            Filtro por ROL
          </button>
          <div id="checkboxesCollapse" class="accordion-collapse collapse" aria-labelledby="headingOne"
            data-bs-parent="#checkboxAccordion">
            <div class="accordion-body my-1">
              <input type="checkbox" id="admin" name="A" value="A" v-model="checkboxes"
                class="form-check-input form-check-input-sm mx-1" style="cursor: pointer;">
              <label for="Administrador" class="form-check-label">Administrador</label><br>
              <input type="checkbox" id="coordinador" name="C" value="C" v-model="checkboxes"
                class="form-check-input form-check-input-sm mx-1" style="cursor: pointer;">
              <label for="Coordinador" class="form-check-label">Coordinador</label><br>
              <input type="checkbox" id="profesor" name="P" value="P" v-model="checkboxes"
                class="form-check-input form-check-input-sm mx-1" style="cursor: pointer;">
              <label for="Profesor" class="form-check-label">Profesor</label>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-auto">
          <div class="btn-group d-flex justify-content-center mx-md-0" style="margin: 0% 40%;">
            <button class="btn btn-danger text-center" type="button" v-on:click="reiniciar">Reiniciar</button>
            <button class="btn btn-success text-center" type="button" v-on:click="buscar">Buscar</button>
          </div>
        </div>
        <div class="col text-md-end">
          <div class="d-flex justify-content-end mt-3 mb-0">
            <p>Usuarios encontrados: <strong>{{ size }}</strong></p>
          </div>
        </div>
      </div>
    </form>
    <br>
    <div class="d-flex justify-content-end input-group" v-if="usuarios">
      <table class="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Nombre:</th>
            <th>Apellido:</th>
            <th class="d-none d-sm-table-cell">Email:</th>
            <th class="d-none d-sm-table-cell">Dni: <button class="btn bg-success" @click="ordenar('dni')"></button></th>
            <th class="d-none d-md-table-cell">Rol:</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in usuarios" :key="user.idUsuario" @click="irA(user.idUsuario)"
            :class="{ 'table-danger': !user.activo }">
            <td>{{ user.nombre }}</td>
            <td>{{ user.apellido }}</td>
            <td class="d-none d-sm-table-cell">{{ user.email }}</td>
            <td class="d-none d-sm-table-cell"> {{ user.dni }}</td>
            <td class="d-none d-md-table-cell"> {{ obtenerRol(user.Rol.tipo) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="d-flex justify-content-between my-3">
      <p class="pe-5" v-if="elementStore.getElements">Usuarios en total: <strong>{{ elementStore.getElements.length
      }}</strong></p>
      <code>Si se encuentra en rojo, el usuario no está activo</code>
    </div>
    <div class="d-flex justify-content-center align-items-center">
      <div class="btn-group">
        <button class="btn btn-macabi1">
          <router-link to="/crearusuario" class="nav-item nav-link" href="#">Crear Usuario</router-link>
        </button>
        <button class="btn btn-dark">
          <router-link to="/" class="nav-item nav-link" href="#">Volver a Inicio</router-link>
        </button>
      </div>
    </div>
  </div>
  <br>
</template>
<style scoped>
@import '../../../assets/btn.css';

tbody {
  cursor: pointer;
}
</style>
<script>
import { useElementStore } from "../../../stores/Store";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Loading from '../../dependentComponents/Loading.vue';
import { usrStore } from "../../../stores/usrStore";

export default
  {
    components: {
      Loading,
    },
    setup() {
      const elementStore = useElementStore("usuario")()
      let busqueda = ""
      const usuarios = ref(null)
      const orden = ref(true)
      const router = useRouter();
      const loading = ref(true)

      const size = ref(0)

      const usuarioStore = usrStore()

      onMounted(() => {
        elementStore.currentElement = null
        elementStore.fetchElements().then(() => {
        }).then(() => {
          if (usuarioStore.getRol == 'C') {
            elementStore.setElements(elementStore.getElements.filter((usuario) => usuario.Rol.tipo == 'P'))
          }

          usuarios.value = elementStore.getElements

        }).then(() => {
          size.value = usuarios.value.length || 0
          loading.value = false
        })

      })
      const checkboxes = ref(['P', 'C', 'A'])

      function buscar() {
        reiniciar();
        busqueda = this.busqueda;

        if (busqueda !== "") {
          usuarios.value = elementStore.getElements.filter(item => {
            const propiedad = item[document.getElementById("filtro").value];
            const propiedadLowerCase = String(propiedad).toLowerCase();
            const busquedaLowerCase = String(busqueda).toLowerCase();
            return propiedadLowerCase.includes(busquedaLowerCase) && checkboxes.value.some(rol => item.Rol.tipo.includes(rol));
          });
        } else {
          usuarios.value = elementStore.getElements.filter(item => {
            return checkboxes.value.some(rol => item.Rol.tipo.includes(rol));
          });
        }

        const rolesMap = {
          'P': 'Profesores',
          'A': 'Administradores',
          'C': 'Coordinadores'
        };

        let msjCheckboxes = ''

        if (checkboxes.value.length === 3) {
          msjCheckboxes = 'Usuarios';
        } else if (checkboxes.value.length > 0) {
          msjCheckboxes = checkboxes.value.map(rol => rolesMap[rol]).join(', ');
        }

        size.value = usuarios.value.length || 0;

        if (size.value == 0) {
          if (busqueda !== "") {
            alert(`No se encontraron "${msjCheckboxes}" con el filtro: "${document.getElementById("filtro").value}" y con la búsqueda: "${busqueda}"`)
          }
          reiniciar()
        }
      }

      function reiniciar() {
        usuarios.value = elementStore.getElements
        size.value = usuarios.value.length || 0
      }

      function ordenar(columna) {
        orden.value = !orden.value

        usuarios.value.sort((a, b) => {
          const factorOrden = orden.value ? -1 : 1;
          if (a[columna] < b[columna]) return -1 * factorOrden;
          if (a[columna] > b[columna]) return 1 * factorOrden;
          return 0;
        });
      }

      function irA(id) {
        if (id != 0) {
          router.push(`/usuarios/${id}`);
        }
      }

      function generarCorreos(cantidad) {
        let correos = [];

        for (let i = 1; i <= cantidad; i++) {
          let correo = `email${i}@gmail.com`;
          correos.push(correo);
        }

        return correos;
      }

      function obtenerRol(rol) {
        if (rol != null || rol != '') {
          if (rol == 'A') {
            return 'Administrador'
          } else if (rol == 'C') {
            return 'Coordinador'
          } else if (rol == 'P') {
            return 'Profesor'
          }
        } else {
          return 'Rol desconocido'
        }
      }

      return {
        elementStore,
        usuarios,
        buscar,
        busqueda,
        reiniciar,
        size,
        ordenar,
        irA,
        checkboxes,
        obtenerRol,
        loading,
        Loading,
        usuarioStore
      }
    },
  }
</script>