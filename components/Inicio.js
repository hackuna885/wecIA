app.component("web-home", {
  template: /*html*/ `
        <!-- Inicia Código -->
        <header>
          <div class="centrado-h-v" id="vantaHalo">
            <div class="row">
              <div class="col-md-8 p-5 mx-auto">
        
                <div class="shadow border-0 rounded border-light p-4 p-lg-5 text-white"
                  style="background-color: rgba(0, 0, 0, .5); width: 100%;">
                  <div class="row">
                    <div class="col-8 mx-auto">
                      <img src="assets/img/logoCorsecTech.png" class="img-fluid my-3" alt="logo">
                    </div>
                  </div>
                  <div class="text-center text-md-center mb-4 mt-md-0">
                    <h1 class="mb-0 h3">Inicio de Sesión</h1>
                  </div>
        
                  <form class="mt-4" @submit.prevent="revDatos">
                    <div class="form-group mb-4">
                      <label>Correo</label>
                      <div class="input-group">
                        <span class="input-group-text" id="basic-addon1">
                          <svg class="icon icon-xs text-gray-600" fill="currentColor" viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                          </svg>
                        </span>
                        <input type="email" class="form-control" placeholder="ejemplo@correo.com" id="email" autofocus
                          v-model="nCorreo" required>
                      </div>
                    </div>
                    <div class="form-group" v-html="datos"></div>
                    <div class="form-group">
        
                      <div class="form-group mb-4">
                        <label>Contraseña</label>
                        <div class="input-group">
                          <span class="input-group-text" id="basic-addon2">
                            <svg class="icon icon-xs text-gray-600" fill="currentColor" viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </span>
                          <input type="password" placeholder="Contraseña" class="form-control" id="password" v-model="passUsr"
                            required>
                        </div>
                      </div>
        
                      <div class="form-group mb-4">
                        <label>Confirmar contraseña</label>
                        <div class="input-group">
                          <span class="input-group-text" id="basic-addon2">
                            <svg class="icon icon-xs text-gray-600" fill="currentColor" viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </span>
                          <input type="password" placeholder="Confirmar contraseña" class="form-control" id="confirm_password"
                            v-model="passUsrDos" :disabled="estadoPass" required>
                        </div>
                      </div>
                      <div :class="notificaEstadoPass" role="alert">
                        {{validaContrasena}}
                      </div>
        
                    </div>
                    <br>
                    <div class="d-grid">
                      <button type="submit" class="btn btn-gray-800" :disabled="!formularioValido">Iniciar Sesión</button>
                    </div>
                  </form>
        
                </div>
        
              </div>
            </div>
          </div>
        </header>
        <!-- Inicia Código -->


`,
  data() {
    return {
      datos: "",
      nCorreo: "",
      passUsr: "",
      passUsrDos: "",
      msgAlert: "",
      estadoPass: true,
      notificaEstadoPass: "",
      validaBtn: false,
      estadoBtn: false,
      redirectUrl: null,
      vantaEffect: null, // Añadimos una propiedad para almacenar la referencia al efecto
    };
  },
  computed: {
    validaContrasena() {
      this.notificaEstadoPass = "small alert alert-light text-muted";
      this.validaBtn = false;

      if (this.passUsr.length < 6) {
        this.estadoPass = true;
        return "La contraseña debe tener al menos seis (6) caracteres.";
      }

      this.estadoPass = false;

      if (this.passUsrDos.length < 6) {
        return "La segunda contraseña también debe tener al menos seis (6) caracteres.";
      }

      if (this.passUsr !== this.passUsrDos) {
        this.notificaEstadoPass = "small alert alert-danger";
        return "¡Error! Las contraseñas no coinciden.";
      }

      this.notificaEstadoPass = "small alert alert-success";
      this.validaBtn = true;
      return "Contraseña válida.";
    },
    // valida boton
    formularioValido() {
      return this.nCorreo && this.passUsr && this.passUsrDos && this.validaBtn;
    },

  },
  methods: {
    revDatos() {
      axios
        .post("../proCorsec/verifica/verifica.app", {
          opcion: 1,
          nCorreo: this.nCorreo,
          passUsr: this.passUsr,
        })
        .then((response) => {
          // Verificar si es la respuesta antigua (string "correcto") o la nueva (objeto)
          if (response.data === "correcto") {
            // Respuesta antigua - crear datos de usuario por defecto
            const defaultUser = {
              id: 1,
              nombre: 'Administrador',
              correo: this.nCorreo,
              rol: 1,      // Admin por defecto
              estado: 1,   // Activo
              tableros: 1, // Todos los tableros
              token: btoa(JSON.stringify({ email: this.nCorreo, timestamp: Date.now() }))
            };

            // Guardar estado de autenticación (compatible con el sistema anterior)
            localStorage.setItem("isAuthenticated", "true");

            //Guarda Varible de Correo de Usuario
            localStorage.setItem('userEmail', this.nCorreo);

            // Si tienes userPermissions disponible, úsalo
            if (typeof userPermissions !== 'undefined') {
              userPermissions.saveUserData(defaultUser);
            } else {
              // Fallback al sistema anterior
              localStorage.setItem("userData", JSON.stringify(defaultUser));
            }

            Swal.fire({
              icon: "success",
              title: "¡Bienvenido!",
              showConfirmButton: false,
              timer: 2000,
              willClose: () => {
                this.$router.push('/dashboard');
              },
            });

          } else if (response.data.status === "success") {
            // Nueva respuesta con permisos
            userPermissions.saveUserData(response.data.user);

            //Guarda Varible de Correo de Usuario
            localStorage.setItem('userEmail', this.nCorreo);

            Swal.fire({
              icon: "success",
              title: "¡Bienvenido!",
              text: `Hola ${response.data.user.nombre}`,
              showConfirmButton: false,
              timer: 2000,
              willClose: () => {
                const homePage = userPermissions.getHomePage();
                const redirectUrl = new URLSearchParams(window.location.search).get("redirect");

                if (redirectUrl && userPermissions.hasAccessToRoute(redirectUrl.replace('/', ''))) {
                  this.$router.push(redirectUrl);
                } else {
                  this.$router.push(homePage);
                }
              },
            });
          } else if (response.data.status === "error") {
            // Nueva respuesta de error
            this.datos = response.data.message;
          } else {
            // Respuesta antigua de error (HTML)
            this.datos = response.data;
          }
        })
        .catch((error) => {
          console.error("Error de autenticación:", error);
          Swal.fire({
            icon: "error",
            title: "Error de inicio de sesión",
            text: "No se pudo iniciar sesión. Intente nuevamente.",
          });
        });
    },

    // ####
    checkAuth() {
      return localStorage.getItem("isAuthenticated") === "true";
    },
    // ####
  },
  created() {
    // Captura el parámetro de redirección de la URL si existe
    const urlParams = new URLSearchParams(window.location.search);
    this.redirectUrl = urlParams.get("redirect");

    // Si el usuario ya está autenticado, redirigir inmediatamente
    if (this.checkAuth()) {
      const redirectTo = this.redirectUrl || "/dashboard";
      this.$router.push(redirectTo);
    }
  },
  mounted() {
    // Inicializar el efecto VANTA.HALO cuando el componente esté montado
    this.vantaEffect = VANTA.HALO({
      el: "#vantaHalo",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00
    });
  },
  // Importante: limpiar el efecto cuando el componente se destruya para evitar memory leaks
  beforeUnmount() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
  }

});

app.component("web-dashBoard", {
  template: /*html*/ `
        <!-- Inicia Código -->
      <base-layout>
      <!-- Solo el contenido específico del dashboard -->
      <div class="container-fluid">
        <!-- Estadísticas -->
        <div class="row">
          <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6">
            <div class="card card-stats mb-4 mb-lg-0">
              <div class="card-body">
                <div class="row">
                  <div class="col">
                    <h5 class="card-title text-uppercase text-muted mb-0">Proveedores</h5>
                    <span class="h2 font-weight-bold mb-0">{{ stats.proveedores }}</span>
                  </div>
                  <div class="col-auto">
                    <div class="icon icon-shape bg-primary text-white rounded-circle shadow">
                      <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6">
            <div class="card card-stats mb-4 mb-lg-0">
              <div class="card-body">
                <div class="row">
                  <div class="col">
                    <h5 class="card-title text-uppercase text-muted mb-0">Documentos</h5>
                    <span class="h2 font-weight-bold mb-0">{{ stats.documentos }}</span>
                  </div>
                  <div class="col-auto">
                    <div class="icon icon-shape bg-success text-white rounded-circle shadow">
                      <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6">
            <div class="card card-stats mb-4 mb-lg-0">
              <div class="card-body">
                <div class="row">
                  <div class="col">
                    <h5 class="card-title text-uppercase text-muted mb-0">Reportes</h5>
                    <span class="h2 font-weight-bold mb-0">{{ stats.reportes }}</span>
                  </div>
                  <div class="col-auto">
                    <div class="icon icon-shape bg-warning text-white rounded-circle shadow">
                      <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6">
            <div class="card card-stats mb-4 mb-lg-0">
              <div class="card-body">
                <div class="row">
                  <div class="col">
                    <h5 class="card-title text-uppercase text-muted mb-0">Usuarios</h5>
                    <span class="h2 font-weight-bold mb-0">{{ stats.usuarios }}</span>
                  </div>
                  <div class="col-auto">
                    <div class="icon icon-shape bg-info text-white rounded-circle shadow">
                      <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones rápidas -->
        <div class="row mt-4">
          <div class="col-12">
            <div class="card border-0 shadow">
              <div class="card-header">
                <h5 class="mb-0">Acciones Rápidas</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-4">
                    <router-link to="/proveedores" class="btn btn-outline-primary w-100 mb-2">
                      <svg class="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z"></path>
                      </svg>
                      Gestionar Proveedores
                    </router-link>
                  </div>
                  <div class="col-md-4">
                    <router-link to="/documentos" class="btn btn-outline-success w-100 mb-2">
                      <svg class="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path>
                      </svg>
                      Ver Documentos
                    </router-link>
                  </div>
                  <div class="col-md-4">
                    <router-link to="/reportes" class="btn btn-outline-warning w-100 mb-2">
                      <svg class="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3z" clip-rule="evenodd"></path>
                      </svg>
                      Generar Reportes
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      </base-layout>

        <!-- Termina Código -->


  `,
  data() {
    return {
      stats: {
        proveedores: 150,
        documentos: 247,
        reportes: 45,
        usuarios: 12
      }
    };
  },
  computed: {},
  methods: {},
  created() { },
  mounted() { },
});

// Componente de Proveedores
app.component("web-proveedores", {
  template: /*html*/ `
  <base-layout>
  <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card border-0 shadow mb-4">
            <div class="card-header">
              <div class="row align-items-center">
                <div class="col">
                  <h2 class="h5">Gestión de Proveedores</h2>
                  <p class="mb-0">Administra tu base de proveedores</p>
                </div>
                <div class="col-auto">
                  <button class="btn btn-sm btn-primary" @click="agregarProveedor()">
                    <svg class="icon icon-xs me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Nuevo Proveedor
                  </button>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-centered table-nowrap mb-0 rounded">
                  <thead class="thead-light">
                    <tr>
                      <th class="border-0">#</th>
                      <th class="border-0">Empresa</th>
                      <th class="border-0">Folio</th>
                      <th class="border-0">RFC</th>
                      <th class="border-0">Contacto</th>
                      <th class="border-0">Email</th>
                      <th class="border-0">Teléfono</th>
                      <th class="border-0">Documentos</th>
                      <th class="border-0">Estado Documentación</th>
                      <th class="border-0">Última Actualización</th>
                      <th class="border-0">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(liProveedores, index) in datos" :key="index">
                      <td>{{ index + 1 }}</td>
                      <td class="fw-bold">{{ liProveedores.nomEmpresa }}</td>
                      <td>{{ liProveedores.correo }}</td>
                      <td>{{ liProveedores.telefono }}</td>
                      <td>
                        <span class="badge"
                          :class="liProveedores.per2 == 1 ? 'bg-success' : liProveedores.per2 == 0 ? 'bg-warning' : 'bg-danger'">
                          {{ liProveedores.per2 == 1 ? 'Activo' : liProveedores.per2 == 0 ? 'Inactivo' : 'Bloqueado' }}
                        </span>
                      </td>
                      <td>
                        <button class="btn btn-sm btn-outline-primary me-1" @click="editProveedor(liProveedores.id,liProveedores.nomEmpresa, liProveedores.nombre, liProveedores.aPaterno, liProveedores.aMaterno, liProveedores.telefono, liProveedores.correo, liProveedores.password)">
                          <svg class="icon icon-xs" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                          </svg>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" @click="eliminarProveedor(liProveedores.id, liProveedores.nomEmpresa)" data-bs-toggle="tooltip"
                          data-bs-placement="top" title="Eliminar proveedor">
                          <svg class="icon icon-xs" fill="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </base-layout>
  `,
  data() {
    return {
      datos: [],

    };
  },
  computed: {
    validaBtn() {
      return this.nomUsr != '' && this.apeUsr != '' && this.corUsr != '' && this.pasUsr.length >= 5 ? this.estado = false : this.estado = true
    }
  },
  methods: {
    // BOTONES

    // Boton Alta
    async agregarProveedor() {
      const { value: formValues } = await Swal.fire({
        title: 'Nuevo Proveedor',
        html: /*html*/ `
                <div class="row m-0 p-0">
                  <div class="form-group mb-3 col-md-12">
                    <input type="text" class="form-control" placeholder="Nom Empresa..." value="" id="nomEmpre" name="nomEmpre" required />
                  </div>
                  <div class="form-group mb-3 col-md-12">
                    <input type="text" class="form-control" placeholder="Nombre..." value="" id="nombre" name="nombre" required />
                  </div>
                  <div class="form-group mb-3 col-md-12">
                    <input type="text" class="form-control" placeholder="Apellido Paterno..." value="" id="aPaterno" name="aPaterno" required />
                  </div>
                  <div class="form-group mb-3 col-md-12">
                    <input type="text" class="form-control" placeholder="Apellido Materno..." value="" id="aMaterno" name="aMaterno" required />
                  </div>
                  <div class="form-group mb-3 col-md-6">
                    <input type="text" class="form-control" placeholder="Teléfono..." value="" id="telefono" name="telefono" required />
                  </div>
                  <div class="form-group mb-3 col-md-6">
                  </div>
                  <div class="form-group mb-3 col-md-6">
                    <input type="email" class="form-control" placeholder="Correo..." value="" id="correo" name="correo" required />
                  </div>
                  <div class="form-group mb-3 col-md-6">
                    <input type="password" class="form-control" placeholder="Contraseña..." value="" id="password" name="password" required />
                  </div>
                </div>
                `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        confirmButtonColor: '#1f2a38',
        cancelButtonColor: '#d33'
      })
        .then((result) => {
          if (result.value) {
            const nomEmpre = document.getElementById('nomEmpre').value;
            const nombre = document.getElementById('nombre').value;
            const aPaterno = document.getElementById('aPaterno').value;
            const aMaterno = document.getElementById('aMaterno').value;
            const telefono = document.getElementById('telefono').value;
            const correo = document.getElementById('correo').value;
            const password = document.getElementById('password').value;

            this.alta(nomEmpre, nombre, aPaterno, aMaterno, telefono, correo, password);
            Swal.fire(
              '¡Alta Exitosa!',
              'Proveedor Agregado.',
              'success'
            );
          }
        })
    },

    // Boton de Actualizar
    editProveedor(id, nomEmpre, nombre, aPaterno, aMaterno, telefono, correo, password) {
      const proveedorActual = this.datos.find(p => p.id == id);
      const estadoActual = proveedorActual ? proveedorActual.per2 : 0;
      Swal.fire({
        title: 'Editar',
        html: /*html*/ `
                <div class="row m-0 p-0">
                    <div class="form-group mb-3 col-md-12">
                        <input type="text" class="form-control" placeholder="Nom Empresa..." value="${nomEmpre}" id="nomEmpre" name="nomEmpre" required />
                    </div>
                    <div class="form-group mb-3 col-md-12">
                        <input type="text" class="form-control" placeholder="Nombre..." value="${nombre}" id="nombre" name="nombre" required />
                    </div>
                    <div class="form-group mb-3 col-md-12">
                        <input type="text" class="form-control" placeholder="Apellido Paterno..." value="${aPaterno}" id="aPaterno" name="aPaterno" required />
                    </div>
                    <div class="form-group mb-3 col-md-12">
                        <input type="text" class="form-control" placeholder="Apellido Materno..." value="${aMaterno}" id="aMaterno" name="aMaterno" required />
                    </div>
                    <div class="form-group mb-3 col-md-6">
                        <input type="email" class="form-control" placeholder="Teléfono..." value="${telefono}" id="telefono" name="telefono" required />
                    </div>
                    <div class="form-group mb-3 col-md-6">
                    </div>
                    <div class="form-group mb-3 col-md-6">
                        <input type="email" class="form-control" placeholder="Correo..." value="${correo}" id="correo" name="correo" required />
                    </div>
                    <div class="form-group mb-3 col-md-6">
                        <input type="password" class="form-control" placeholder="Contraseña..." value="${password}" id="password" name="password" required />
                    </div>

                    <!-- Switch para Estado del Usuario -->
                    <div class="form-group mb-3 col-md-12">
                      <div class="d-flex align-items-center justify-content-between p-3 border rounded">
                        <div>
                          <label for="estadoSwitch" class="form-label mb-0 fw-bold">Estado del Usuario:</label>
                          <small class="text-muted d-block">Activa o desactiva el acceso del usuario</small>
                        </div>
                        <div class="form-check form-switch">
                          <input class="form-check-input" type="checkbox" id="estadoSwitch" name="estadoSwitch" ${estadoActual == 1 ? 'checked' : ''} style="transform: scale(1.2);">
                          <label class="form-check-label fw-bold" for="estadoSwitch" id="estadoLabel" style="color: ${estadoActual == 1 ? '#28a745' : '#dc3545'};">
                            ${estadoActual == 1 ? 'ACTIVO' : 'INACTIVO'}
                          </label>
                        </div>
                      </div>
                    </div>
                    
                </div>
                `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        confirmButtonColor: '#1f2a38',
        cancelButtonColor: '#d33',
        width: '600px',

        didOpen: () => {
          // El script se ejecuta cuando el modal se abre
          document.getElementById('estadoSwitch').addEventListener('change', function () {
            const label = document.getElementById('estadoLabel');
            if (this.checked) {
              label.textContent = 'ACTIVO';
              label.style.color = '#28a745'; // Verde
            } else {
              label.textContent = 'INACTIVO';
              label.style.color = '#dc3545'; // Rojo
            }
          });
        }
      })
        .then((result) => {
          if (result.value) {
            nomEmpre = document.getElementById('nomEmpre').value,
              nombre = document.getElementById('nombre').value,
              aPaterno = document.getElementById('aPaterno').value,
              aMaterno = document.getElementById('aMaterno').value,
              telefono = document.getElementById('telefono').value,
              correo = document.getElementById('correo').value,
              password = document.getElementById('password').value,
              estado = document.getElementById('estadoSwitch').checked ? 1 : 0;

            this.editar(id, nomEmpre, nombre, aPaterno, aMaterno, telefono, correo, password, estado);

            Swal.fire(
              '¡Actualizado!',
              'El registro ha sido actualizado.',
              'success'
            )
          }
        })
    },

    // Boton de Eliminar
    eliminarProveedor(id, nomEmpre) {
      Swal.fire({
        title: '¿Estás seguro de eliminar ' + nomEmpre + '?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1f2a38',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Borrar'
      })
        .then(result => {
          if (result.value) {
            this.eliminar(id)

            Swal.fire(
              '¡Eliminado!',
              'El registro ha sido eliminado.',
              'success'
            )
          }
        })
    },

    // PROCESOS

    // Proceso Alta
    alta(nomEmpre, nombre, aPaterno, aMaterno, telefono, correo, password) {
      axios.post('../proCorsec/datos/datos.app', {
        opcion: 1,
        nomEmpre: nomEmpre,
        nombre: nombre,
        aPaterno: aPaterno,
        aMaterno: aMaterno,
        telefono: telefono,
        correo: correo,
        password: password
      })
        .then(response => {
          this.liProveedores()
        })
    },

    // Proceso Editar
    editar(id, nomEmpre, nombre, aPaterno, aMaterno, telefono, correo, password, estado) {
      axios.post('../proCorsec/datos/datos.app', {
        opcion: 2,
        id: id,
        nomEmpre: nomEmpre,
        nombre: nombre,
        aPaterno: aPaterno,
        aMaterno: aMaterno,
        telefono: telefono,
        correo: correo,
        password: password,
        estado: estado,
      })
        .then(response => {
          this.liProveedores();
        });
    },

    // Proceso Eliminar
    eliminar(id) {
      axios.post('../proCorsec/datos/datos.app', {
        opcion: 3,
        id: id
      })
        .then(response => {
          this.liProveedores()
        })
    },

    // Lista de datos
    liProveedores() {
      axios.post('../proCorsec/datos/datos.app', {
        opcion: 4
      })
        .then(response => {
          this.datos = response.data
          // console.log(response.data)
        })
    }
  },
  created() {
    this.liProveedores()
  },
  mounted() { },
});

// Componente de Docuemntos
app.component("web-regDoc", {
  template: /*html*/ `
  <base-layout>
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card border-0 shadow">
            <div class="card-header">
              <div class="row align-items-center">
                <div class="col">
                  <h2 class="h5 mb-0">Gestión de Documentos</h2>
                  <p class="text-muted small mb-0">Carga y administra los documentos requeridos</p>
                </div>
                <div class="col-auto">
                  <span class="badge bg-info">
                    {{ documentosSubidos }} / {{ documentosRequeridos.length }} documentos cargados
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulario Perfil de Empresa -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card border-0 shadow">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">
                <svg class="icon icon-sm me-2" fill="currentColor" viewBox="0 0 20 20" style="width: 20px; height: 20px;">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z" clip-rule="evenodd"></path>
                </svg>
                Perfil de la Empresa
              </h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="alta">
                <!-- Tipo de persona -->
                <div class="section-title">Información General</div>
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">Tipo de persona <span class="text-danger">*</span></label>
                    <div>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="tipoPersona" id="personaMoral" v-model="tipoPersona" value="moral" required>
                        <label class="form-check-label" for="personaMoral">Persona moral</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="tipoPersona" id="personaFisica" v-model="tipoPersona" value="fisica" required>
                        <label class="form-check-label" for="personaFisica">Persona física</label>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label for="rfc" class="form-label">RFC <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="rfc" v-model="rfc" placeholder="RFC de la empresa" required>
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-6">
                    <label for="razonSocial" class="form-label">Razón social <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="razonSocial" v-model="razonSocial" placeholder="Razón social" required>
                  </div>
                  <div class="col-md-6">
                    <label for="nombreComercial" class="form-label">Nombre comercial</label>
                    <input type="text" class="form-control" id="nombreComercial" v-model="nombreComercial" placeholder="Nombre comercial">
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-4">
                    <label for="usoCfdi" class="form-label">Uso de CFDI <span class="text-danger">*</span></label>
                    <select class="form-select" id="usoCfdi" v-model="usoCfdi" required>
                      <option value="">Seleccione una opción</option>
                      <option value="G03">Gastos en general (G03)</option>
                      <option value="G01">Adquisición de mercancías (G01)</option>
                    </select>
                  </div>

                  <div class="col-md-4">
                    <label for="metodoPago" class="form-label">Método de pago <span class="text-danger">*</span></label>
                    <select class="form-select" id="metodoPago" v-model="metodoPago" required>
                      <option value="PUE">PUE (Pago en Una sola Exhibición)</option>
                      <option value="PPD">PPD (Pago en Parcialidades o Diferido)</option>
                    </select>
                  </div>

                  <div class="col-md-4">
                    <label for="formaPago" class="form-label">Forma de pago <span class="text-danger">*</span></label>
                    <select class="form-select" id="formaPago" v-model="formaPago" required>
                      <option value="03">03 Transferencia Electrónica de fondos</option>
                    </select>
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-12">
                    <label for="descripcionEmpresa" class="form-label">Descripción de la empresa</label>
                    <textarea class="form-control" id="descripcionEmpresa" v-model="descripcionEmpresa" rows="3" placeholder="Breve descripción de la empresa"></textarea>
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-12">
                    <label for="descripcionProductos" class="form-label">Descripción de productos/servicios suministrados a Grupo Ángeles</label>
                    <textarea class="form-control" id="descripcionProductos" v-model="descripcionProductos" rows="3" placeholder="Describa los productos o servicios"></textarea>
                    
                    <!-- Zona de drag & drop para listado de precios -->
                    <div class="mt-3">
                      <label class="form-label">Listado de Precios</label>
                      <div 
                        class="drop-zone-small p-3 text-center border rounded"
                        :class="{
                          'bg-white': listadoPrecios,
                          'drag-over': isDraggingPrices
                        }"
                        @drop.prevent="handleDropPrices($event)"
                        @dragover.prevent="handleDragOverPrices($event)"
                        @dragenter.prevent="handleDragEnterPrices($event)"
                        @dragleave="handleDragLeavePrices($event)">
                        
                        <div v-if="!listadoPrecios">
                          <svg class="icon icon-lg text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 36px; height: 36px;">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                          </svg>
                          <p class="mb-2 small">Arrastra tu listado de precios aquí o</p>
                          <input 
                            type="file" 
                            id="fileInputPrices"
                            @change="handleFileSelectPrices($event)" 
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                            style="display: none;">
                          <button 
                            type="button"
                            class="btn btn-sm btn-outline-primary"
                            @click="clickFileInputPrices()">
                            Seleccionar archivo
                          </button>
                          <p class="text-muted small mt-2 mb-0">Formatos aceptados: PDF, JPG, PNG, Word, Excel</p>
                        </div>
                        
                        <div v-else>
                          <div class="file-display-container">
                            <div class="file-info-section">
                              <svg class="file-icon" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                  d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                                  clip-rule="evenodd"></path>
                              </svg>
                              <div class="file-text-container">
                                <p class="file-name" :title="listadoPrecios.name">{{ listadoPrecios.name }}</p>
                                <p class="file-meta">{{ formatFileSize(listadoPrecios.size) }}</p>
                              </div>
                            </div>
                            <div class="file-actions-section">
                              <button type="button" class="file-action-btn btn-view" @click.stop="verArchivo(listadoPrecios)" title="Ver archivo">
                                <svg fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                                  <path fill-rule="evenodd"
                                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                    clip-rule="evenodd"></path>
                                </svg>
                              </button>
                              <button type="button" class="file-action-btn btn-delete" @click.stop="eliminarListadoPrecios()"
                                title="Eliminar archivo">
                                <svg fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clip-rule="evenodd"></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-6">
                    <label for="numColaboradores" class="form-label">Número de colaboradores</label>
                    <input type="number" class="form-control" id="numColaboradores" v-model="numColaboradores" placeholder="Ej: 50">
                  </div>
                  <div class="col-md-6">
                    <label for="grupoMultinacional" class="form-label">¿Pertenece a algún grupo o multinacional?</label>
                    <input type="text" class="form-control" id="grupoMultinacional" v-model="grupoMultinacional" placeholder="En caso afirmativo, especifique cuál">
                  </div>
                </div>

                <!-- Direcciones -->
                <div class="section-title mt-4">Direcciones</div>
                <div class="row mb-3">
                  <div class="col-md-12">
                    <label for="direccionFiscal" class="form-label">Dirección fiscal <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="direccionFiscal" v-model="direccionFiscal" placeholder="Calle, número, colonia, ciudad, estado, CP" required>
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-12">
                    <div class="form-check mb-2">
                      <input class="form-check-input" type="checkbox" id="mismaNotificacion" v-model="mismaDireccionNotificacion" @change="copiarDireccion">
                      <label class="form-check-label" for="mismaNotificacion">
                        La dirección para notificaciones es la misma que la dirección fiscal
                      </label>
                    </div>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="direccionNotificaciones" 
                      v-model="direccionNotificaciones" 
                      placeholder="Dirección para enviar notificaciones"
                      :disabled="mismaDireccionNotificacion">
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-12">
                    <label for="otrasUbicaciones" class="form-label">Otras ubicaciones relacionadas con los productos/servicios ofertados</label>
                    <textarea class="form-control" id="otrasUbicaciones" v-model="otrasUbicaciones" rows="2" placeholder="Otras sucursales o ubicaciones"></textarea>
                  </div>
                </div>

                <!-- Contactos -->
                <div class="section-title mt-4">Información de Contacto</div>
                <div class="row mb-3">
                  <div class="col-md-4">
                    <label for="contactoPrincipal" class="form-label">Contacto principal <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="contactoPrincipal" v-model="contactoPrincipal" placeholder="Nombre completo" required>
                  </div>
                  <div class="col-md-4">
                    <label for="emailPrincipal" class="form-label">Correo electrónico <span class="text-danger">*</span></label>
                    <input type="email" class="form-control" id="emailPrincipal" v-model="emailPrincipal" placeholder="correo@ejemplo.com" required>
                  </div>
                  <div class="col-md-4">
                    <label for="telefonoPrincipal" class="form-label">Teléfono <span class="text-danger">*</span></label>
                    <input type="tel" class="form-control" id="telefonoPrincipal" v-model="telefonoPrincipal" placeholder="(55) 1234-5678" required>
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-4">
                    <label for="contactoAdministrativo" class="form-label">Contacto administrativo/pagos</label>
                    <input type="text" class="form-control" id="contactoAdministrativo" v-model="contactoAdministrativo" placeholder="Nombre completo">
                  </div>
                  <div class="col-md-4">
                    <label for="emailAdministrativo" class="form-label">Correo electrónico</label>
                    <input type="email" class="form-control" id="emailAdministrativo" v-model="emailAdministrativo" placeholder="correo@ejemplo.com">
                  </div>
                  <div class="col-md-4">
                    <label for="telefonoAdministrativo" class="form-label">Teléfono</label>
                    <input type="tel" class="form-control" id="telefonoAdministrativo" v-model="telefonoAdministrativo" placeholder="(55) 1234-5678">
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-4">
                    <label for="paginaWeb" class="form-label">Página web</label>
                    <input type="url" class="form-control" id="paginaWeb" v-model="paginaWeb" placeholder="https://www.ejemplo.com">
                  </div>
                  <div class="col-md-4">
                    <label for="redesSociales" class="form-label">Redes sociales</label>
                    <input type="text" class="form-control" id="redesSociales" v-model="redesSociales" placeholder="Facebook, LinkedIn, etc.">
                  </div>
                  <div class="col-md-4">
                    <label for="idioma" class="form-label">Idioma principal</label>
                    <select class="form-select" id="idioma" v-model="idioma">
                      <option value="español">Español</option>
                      <option value="ingles">Inglés</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </div>

                <!-- Información Bancaria -->
                <div class="section-title mt-4">Información Bancaria</div>
                <div class="row mb-3">
                  <div class="col-md-4">
                    <label for="nombreBanco" class="form-label">Nombre del banco <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="nombreBanco" v-model="nombreBanco" placeholder="Nombre del banco" required>
                  </div>
                  <div class="col-md-4">
                    <label for="numeroCuenta" class="form-label">Número de cuenta <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="numeroCuenta" v-model="numeroCuenta" placeholder="Número de cuenta" required>
                  </div>
                  <div class="col-md-4">
                    <label for="clabeBancaria" class="form-label">Cuenta CLABE <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="clabeBancaria" v-model="clabeBancaria" placeholder="18 dígitos" maxlength="18" required>
                  </div>
                </div>

                <!-- Botones de acción -->
                <div class="row mt-4">
                  <div class="col-12">
                    <div class="d-flex justify-content-end gap-2">
                      <button type="button" class="btn btn-outline-secondary me-2" @click="limpiarFormulario">
                        <svg class="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20" style="width: 16px; height: 16px;">
                          <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path>
                        </svg>
                        Limpiar
                      </button>
                      <button type="submit" class="btn btn-primary" :disabled="cargandoDatos">
                          <svg class="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20" style="width: 16px; height: 16px;">
                              <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z"></path>
                          </svg>
                          {{ textoBotonGuardar }}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de documentos requeridos -->
      <div class="row">
        <div class="col-12">
          <div class="card border-0 shadow">
            <div class="card-header">
              <h5 class="mb-0">
                <svg class="icon icon-sm me-2" fill="currentColor" viewBox="0 0 20 20" style="width: 20px; height: 20px;">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path>
                </svg>
                Documentos Requeridos
              </h5>
            </div>
            <div class="card-body">
              <!-- Lista de documentos requeridos con acordeón de Bootstrap -->
              <div class="accordion" id="accordionDocumentos">
                <div 
                  v-for="(doc, index) in documentosRequeridos" 
                  :key="index"
                  class="accordion-item">
                  <h2 class="accordion-header" :id="'heading' + index">
                    <button 
                      class="accordion-button collapsed"
                      :class="{'text-success': doc.archivo}"
                      type="button" 
                      data-bs-toggle="collapse" 
                      :data-bs-target="'#collapse' + index"
                      :aria-expanded="false"
                      :aria-controls="'collapse' + index">
                      <span class="me-3">
                        <svg v-if="doc.archivo" class="icon icon-sm text-success" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                        </svg>
                        <svg v-else class="icon icon-sm text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                        </svg>
                      </span>
                      <span class="flex-grow-1 text-start">
                        <strong>{{ doc.nombre }}</strong>
                        <span v-if="doc.requerido" class="badge bg-danger ms-2">Requerido</span>
                        <span v-if="doc.archivo && doc.archivo.name" class="badge bg-success ms-2">Cargado</span>
                      </span>
                    </button>
                  </h2>
                  <div 
                    :id="'collapse' + index" 
                    class="accordion-collapse collapse" 
                    :aria-labelledby="'heading' + index"
                    data-bs-parent="#accordionDocumentos">
                    <div class="accordion-body">
                      <p class="text-muted small mb-3">{{ doc.descripcion }}</p>
                    
                      <!-- INICIO: Lógica para documentos que permiten múltiples archivos -->
                      <div v-if="doc.hasOwnProperty('archivos')">
                        <!-- Mostrar archivos existentes -->
                        <div v-if="doc.archivos && doc.archivos.length > 0" class="mb-3">
                          <h6 class="text-muted">Archivos cargados ({{ doc.archivos.length }}/{{ doc.maxArchivos || 5 }}):</h6>
                          <div class="row g-2">
                            <div v-for="(archivo, archivoIndex) in doc.archivos" :key="archivoIndex" class="col-md-6">
                              <div class="file-display-container border rounded p-2">
                                <div class="file-info-section">
                                  <svg class="file-icon" fill="currentColor" viewBox="0 0 20 20" style="width: 20px; height: 20px;">
                                    <path fill-rule="evenodd"
                                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                      clip-rule="evenodd"></path>
                                  </svg>
                                  <div class="file-text-container ms-2">
                                    <p class="file-name mb-0" :title="archivo.name">{{ archivo.name }}</p>
                                    <p class="file-meta small text-muted mb-0">{{ formatFileSize(archivo.size) }}</p>
                                  </div>
                                </div>
                                <div class="file-actions-section">
                                  <button class="btn btn-sm btn-outline-primary me-1" @click="verArchivo(archivo)" title="Ver archivo">
                                    <svg fill="currentColor" viewBox="0 0 20 20" style="width: 16px; height: 16px;">
                                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                                      <path fill-rule="evenodd"
                                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                        clip-rule="evenodd"></path>
                                    </svg>
                                  </button>
                                  <button class="btn btn-sm btn-outline-danger" @click="eliminarArchivoOtros(index, archivoIndex)"
                                    title="Eliminar archivo">
                                    <svg fill="currentColor" viewBox="0 0 20 20" style="width: 16px; height: 16px;">
                                      <path fill-rule="evenodd"
                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                        clip-rule="evenodd"></path>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- Zona de drop para múltiples archivos -->
                        <div v-if="!doc.archivos || doc.archivos.length < (doc.maxArchivos || 5)"
                          class="drop-zone p-4 text-center border rounded mt-3" :class="{
                            'border-dashed': !doc.archivos || doc.archivos.length === 0,
                            'border-success bg-light': doc.archivos && doc.archivos.length > 0,
                            'drag-over': isDraggingOtros
                          }" @drop.prevent="handleDropOtros($event, index)" @dragover.prevent="isDraggingOtros = true"
                          @dragenter.prevent="isDraggingOtros = true" @dragleave.prevent="handleDragLeaveOtros($event)">
                          <svg class="icon icon-lg text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            style="width: 48px; height: 48px;">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                            </path>
                          </svg>
                          <p class="mb-2">
                            <span v-if="!doc.archivos || doc.archivos.length === 0">
                              Arrastra hasta {{ doc.maxArchivos || 5 }} archivos aquí o
                            </span>
                            <span v-else>
                              Puedes agregar {{ (doc.maxArchivos || 5) - doc.archivos.length }} archivo(s) más
                            </span>
                          </p>
                          <input type="file" :id="'fileInputOtros' + index" @change="handleFileSelectOtros($event, index)"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" multiple style="display: none;">
                          <button class="btn btn-sm btn-outline-primary" @click="clickFileInputOtros(index)">
                            <svg class="icon icon-xs me-1" fill="currentColor" viewBox="0 0 20 20" style="width: 16px; height: 16px;">
                              <path fill-rule="evenodd"
                                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                clip-rule="evenodd"></path>
                            </svg>
                            Seleccionar archivos
                          </button>
                          <p class="text-muted small mt-2 mb-0">
                            Formatos: PDF, JPG, PNG, Word, Excel | Máximo {{ doc.maxArchivos || 5 }} archivos
                          </p>
                        </div>
                        <div v-else class="alert alert-info mt-3">
                          <small>Has alcanzado el límite máximo de {{ doc.maxArchivos || 5 }} archivos</small>
                        </div>
                      </div>
                      <!-- FIN: Lógica para documentos que permiten múltiples archivos -->

                      <!-- INICIO: Lógica para documentos de un solo archivo -->
                      <div v-else>
                        <!-- Mostrar archivo existente -->
                        <div v-if="doc.archivo" class="mb-3">
                          <h6 class="text-muted">Archivo cargado:</h6>
                          <div class="row g-2">
                            <div class="col-md-6">
                              <div class="file-display-container border rounded p-2">
                                <div class="file-info-section">
                                  <svg class="file-icon" fill="currentColor" viewBox="0 0 20 20" style="width: 20px; height: 20px;">
                                    <path fill-rule="evenodd"
                                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                      clip-rule="evenodd"></path>
                                  </svg>
                                  <div class="file-text-container ms-2">
                                    <p class="file-name mb-0" :title="doc.archivo.name">{{ doc.archivo.name }}</p>
                                    <p class="file-meta small text-muted mb-0">{{ formatFileSize(doc.archivo.size) }}</p>
                                  </div>
                                </div>
                                <div class="file-actions-section">
                                  <button class="btn btn-sm btn-outline-primary me-1" @click="verArchivo(doc.archivo)" title="Ver archivo">
                                    <svg fill="currentColor" viewBox="0 0 20 20" style="width: 16px; height: 16px;">
                                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                                      <path fill-rule="evenodd"
                                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                        clip-rule="evenodd"></path>
                                    </svg>
                                  </button>
                                  <button class="btn btn-sm btn-outline-danger" @click="eliminarArchivo(index)"
                                    title="Eliminar archivo">
                                    <svg fill="currentColor" viewBox="0 0 20 20" style="width: 16px; height: 16px;">
                                      <path fill-rule="evenodd"
                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                        clip-rule="evenodd"></path>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- Zona de drop para un solo archivo -->
                        <div v-if="!doc.archivo"
                          class="drop-zone p-4 text-center border rounded border-dashed"
                          :class="{'drag-over': isDragging === index}"
                          @drop.prevent="handleDrop($event, index)"
                          @dragover.prevent="isDragging = index"
                          @dragenter.prevent="isDragging = index"
                          @dragleave.prevent="isDragging = null">
                          <svg class="icon icon-lg text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            style="width: 48px; height: 48px;">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                            </path>
                          </svg>
                          <p class="mb-2">Arrastra un archivo aquí o</p>
                          <input type="file" :id="'fileInput' + index" @change="handleFileSelect($event, index)"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" style="display: none;">
                          <button class="btn btn-sm btn-outline-primary" @click="clickFileInput(index)">
                            <svg class="icon icon-xs me-1" fill="currentColor" viewBox="0 0 20 20" style="width: 16px; height: 16px;">
                              <path fill-rule="evenodd"
                                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                clip-rule="evenodd"></path>
                            </svg>
                            Seleccionar archivo
                          </button>
                          <p class="text-muted small mt-2 mb-0">
                            Formatos: PDF, JPG, PNG, Word, Excel
                          </p>
                        </div>
                      </div>
                      <!-- FIN: Lógica para documentos de un solo archivo -->
                    </div>
                  </div>
                </div>
              </div>

              <!-- Botones de acción -->
              <div class="mt-4 d-flex justify-content-between">
                <button 
                  class="btn btn-outline-secondary"
                  @click="descargarTodos"
                  :disabled="documentosSubidos === 0">
                  <svg class="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                  Descargar todos
                </button>
                <button 
                  class="btn btn-success"
                  @click="ordenCompra"
                  :disabled="!hayDocumentosRequeridos">
                  <svg class="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z"></path>
                  </svg>
                  Orden de Compra
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </base-layout>
  `,
  data() {
    return {
      isDragging: null,
      isDraggingPrices: false,
      isDraggingOtros: false,
      folio: '',
      registroExistente: false,
      registroId: null,
      cargandoDatos: false,
      // Datos del perfil de empresa
      tipoPersona: 'moral',
      razonSocial: '',
      nombreComercial: '',
      usoCfdi: '',
      metodoPago: 'PUE',
      formaPago: '03',
      descripcionEmpresa: '',
      descripcionProductos: '',
      listadoPrecios: null,
      numColaboradores: '',
      grupoMultinacional: '',
      rfc: '',
      direccionFiscal: '',
      mismaDireccionNotificacion: false,
      direccionNotificaciones: '',
      otrasUbicaciones: '',
      contactoPrincipal: '',
      emailPrincipal: '',
      telefonoPrincipal: '',
      contactoAdministrativo: '',
      emailAdministrativo: '',
      telefonoAdministrativo: '',
      paginaWeb: '',
      redesSociales: '',
      idioma: 'español',
      nombreBanco: '',
      numeroCuenta: '',
      clabeBancaria: '',
      estado: true,
      listadoPreciosRuta: null,
      archivosEnServidor: {},
      documentosRequeridos: [
        {
          nombre: "Acta Constitutiva de la empresa",
          descripcion: "Documento legal que establece la creación de la empresa",
          requerido: false,
          archivo: null,
          fechaSubida: null
        },
        {
          nombre: "Última protocolización del acta constitutiva",
          descripcion: "En caso de tener alguna modificación al acta constitutiva original",
          requerido: false,
          archivo: null,
          fechaSubida: null
        },
        {
          nombre: "Poder notarial vigente",
          descripcion: "Documento que acredita las facultades del representante legal",
          requerido: false,
          archivo: null,
          fechaSubida: null
        },
        {
          nombre: "Identificación oficial vigente del representante legal",
          descripcion: "INE, pasaporte o cédula profesional del representante legal",
          requerido: false,
          archivo: null,
          fechaSubida: null
        },
        {
          nombre: "Constancia de situación fiscal actualizada",
          descripcion: "Máximo un mes de antigüedad, emitida por el SAT",
          requerido: true,
          archivo: null,
          fechaSubida: null
        },
        {
          nombre: "Comprobante de domicilio",
          descripcion: "No mayor a tres meses (recibo de luz, agua, teléfono o predial)",
          requerido: false,
          archivo: null,
          fechaSubida: null
        },
        {
          nombre: "Estado de cuenta bancario",
          descripcion: "No mayor a tres meses, debe mostrar el nombre de la empresa",
          requerido: false,
          archivo: null,
          fechaSubida: null
        },
        {
          nombre: "Última declaración anual y acuse",
          descripcion: "Declaración anual del ejercicio fiscal anterior con acuse de recibo",
          requerido: false,
          archivo: null,
          fechaSubida: null
        },
        {
          nombre: "Estados financieros auditados",
          descripcion: "Los últimos estados financieros auditados disponibles",
          requerido: false,
          archivo: null,
          fechaSubida: null
        },
        {
          nombre: "D32: Cumplimiento de obligaciones ante el SAT",
          descripcion: "Opinión de cumplimiento, máximo un mes de antigüedad",
          requerido: false,
          archivo: null,
          fechaSubida: null
        },
        {
          nombre: "Opinión del cumplimiento IMSS",
          descripcion: "Opinión del cumplimiento de obligaciones en materia de Seguridad Social (no mayor a 1 mes)",
          requerido: false,
          archivo: null,
          fechaSubida: null
        },
        {
          nombre: "Presentación corporativa",
          descripcion: "CV empresarial con las actividades realizadas por la empresa",
          requerido: false,
          archivo: null,
          fechaSubida: null
        },
        {
          nombre: "Carta membretada de cuenta bancaria",
          descripcion: "Carta firmada por el representante legal validando datos bancarios, sellada por el banco",
          requerido: false,
          archivo: null,
          fechaSubida: null
        },
        {
          nombre: "Organigrama de la organización",
          descripcion: "Estructura organizacional de la empresa",
          requerido: false,
          archivo: null,
          fechaSubida: null
        },
        {
          nombre: "Otros documentos",
          descripcion: "Sube hasta 5 archivos adicionales relevantes para tu empresa",
          requerido: false,
          archivos: [],
          fechaSubida: null,
          maxArchivos: 5
        }
      ]
    };
  },
  computed: {
    documentosSubidos() {
      let count = 0;
      this.documentosRequeridos.forEach(doc => {
        if (doc.hasOwnProperty('archivos') && Array.isArray(doc.archivos)) {
          count += doc.archivos.length;
        } else if (doc.archivo !== null && doc.archivo !== undefined) {
          count += 1;
        }
      });
      return count;
    },

    hayDocumentosRequeridos() {
      if (!this.registroExistente) {
        return false;
      }

      const constanciaFiscal = this.documentosRequeridos.find(doc =>
        doc.nombre === "Constancia de situación fiscal actualizada"
      );

      if (!constanciaFiscal || !constanciaFiscal.archivo) {
        return false;
      }

      return true;
    },

    textoBotonGuardar() {
      return this.registroExistente ? 'Actualizar perfil' : 'Guardar Perfil';
    }
  },
  methods: {
    async obtenerFolio() {
      try {
        const requestData = {
          opcion: 5
        };

        const response = await axios.post('../proCorsec/proveedores/proveedores.app', requestData);

        if (!response.data) {
          return false;
        }

        if (response.data.existe_folio) {
          this.folio = response.data.folio;

          if (!this.folio || this.folio.toString().trim() === '') {
            return false;
          }

          return true;
        } else {
          Swal.fire({
            icon: 'info',
            title: 'Sin folio de sesión',
            text: 'No se encontró un folio activo en la sesión. Por favor, inicie sesión nuevamente.',
            timer: 3000,
            showConfirmButton: false
          });
          return false;
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudo obtener el folio de la sesión'
        });
        return false;
      }
    },

    clickFileInputPrices() {
      const fileInput = document.getElementById('fileInputPrices');
      if (fileInput) {
        fileInput.click();
      }
    },

    clickFileInputOtros(index) {
      const fileInput = document.getElementById('fileInputOtros' + index);
      if (fileInput) {
        fileInput.click();
      }
    },

    async subirArchivo(archivo, tipoDocumento, index = null) {
      try {
        if (!archivo) {
          throw new Error("No se proporcionó archivo");
        }

        if (!this.folio) {
          const tieneFolio = await this.obtenerFolio();

          if (!tieneFolio) {
            throw new Error("No se pudo obtener folio de sesión");
          }
        }

        if (!this.razonSocial) {
          throw new Error("Se requiere razón social");
        }

        const formData = new FormData();
        formData.append('archivo', archivo);
        formData.append('tipoDocumento', tipoDocumento);
        formData.append('razonSocial', this.razonSocial);
        formData.append('rfc', this.rfc || '');

        const url = '../proCorsec/proveedores/subirArchivo/subirArchivo.app';

        Swal.fire({
          title: 'Subiendo archivo...',
          text: 'Por favor espera',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const response = await axios.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000,
          validateStatus: function (status) {
            return status < 500;
          }
        });

        if (response.status !== 200) {
          throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }

        if (!response.data) {
          throw new Error("Respuesta vacía del servidor");
        }

        if (typeof response.data === 'string') {
          try {
            response.data = JSON.parse(response.data);
          } catch (e) {
            throw new Error(`Respuesta no válida del servidor: ${response.data}`);
          }
        }

        if (!response.data.success) {
          const errorMsg = response.data.message || 'Error desconocido del servidor';
          throw new Error(errorMsg);
        }

        if (tipoDocumento === 'listado_precios') {
          this.listadoPreciosRuta = response.data.rutaArchivo;

        } else if (index !== null) {
          this.documentosRequeridos[index].archivo = archivo;
          this.documentosRequeridos[index].fechaSubida = new Date();
          this.documentosRequeridos[index].rutaServidor = response.data.rutaArchivo;

          this.archivosEnServidor[index] = {
            rutaServidor: response.data.rutaArchivo,
            nombreArchivo: response.data.nombreArchivo || archivo.name,
            directorio: response.data.directorio,
            tipoDocumento: tipoDocumento,
            fechaSubida: new Date().toISOString()
          };
        }

        Swal.fire({
          icon: 'success',
          title: '¡Archivo subido!',
          text: `${archivo.name} se ha guardado correctamente`,
          timer: 2000,
          showConfirmButton: false
        });

        return true;

      } catch (error) {
        let errorMessage = 'Error desconocido';

        if (error.response) {
          if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          } else {
            errorMessage = `Error del servidor: ${error.response.status} - ${error.response.statusText}`;
          }
        } else if (error.request) {
          errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión.';
        } else {
          errorMessage = error.message;
        }

        Swal.fire({
          icon: 'error',
          title: 'Error al subir archivo',
          text: errorMessage
        });

        return false;
      }
    },

    async eliminarArchivoServidor(index = null, esListadoPrecios = false) {
      try {
        let rutaArchivo;
        let tipoArchivo;

        if (esListadoPrecios) {
          rutaArchivo = this.listadoPreciosRuta;
          tipoArchivo = 'listado de precios';
        } else if (index !== null) {
          rutaArchivo = this.documentosRequeridos[index]?.rutaServidor ||
            this.archivosEnServidor[index]?.rutaServidor;
          tipoArchivo = this.documentosRequeridos[index]?.nombre || 'documento';
        }

        if (!rutaArchivo) {
          return true;
        }

        const response = await axios.post('../proCorsec/proveedores/eliminarArchivo/eliminarArchivo.app', {
          rutaArchivo: rutaArchivo,
          razonSocial: this.razonSocial || 'sin_nombre',
          tipoDocumento: tipoArchivo
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          if (esListadoPrecios) {
            this.listadoPreciosRuta = null;
          } else if (index !== null) {
            delete this.archivosEnServidor[index];
          }

          return true;
        } else {
          return false;
        }

      } catch (error) {
        if (error.response?.status === 404) {
          if (esListadoPrecios) {
            this.listadoPreciosRuta = null;
          } else if (index !== null) {
            delete this.archivosEnServidor[index];
          }

          return true;
        }

        return false;
      }
    },

    async handleFileSelectOtros(e, index) {
      const files = Array.from(e.target.files);
      await this.procesarArchivosOtros(files, index);
      e.target.value = '';
    },

    async handleDropOtros(e, index) {
      this.isDraggingOtros = false;
      const files = Array.from(e.dataTransfer.files);
      await this.procesarArchivosOtros(files, index);
    },

    handleDragLeaveOtros(e) {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        this.isDraggingOtros = false;
      }
    },

    async procesarArchivosOtros(files, index) {
      if (!this.razonSocial) {
        Swal.fire({
          icon: 'warning',
          title: 'Datos requeridos',
          text: 'Por favor ingrese la razón social antes de subir archivos'
        });
        return;
      }

      const doc = this.documentosRequeridos[index];
      const maxArchivos = doc.maxArchivos || 5;
      const archivosActuales = doc.archivos ? doc.archivos.length : 0;
      const espacioDisponible = maxArchivos - archivosActuales;

      if (files.length > espacioDisponible) {
        Swal.fire({
          icon: 'warning',
          title: 'Límite excedido',
          text: `Solo puedes subir ${espacioDisponible} archivo(s) más. Máximo ${maxArchivos} archivos.`
        });
        return;
      }

      const archivosValidos = [];
      for (const file of files) {
        if (this.validarArchivo(file)) {
          archivosValidos.push(file);
        }
      }

      if (archivosValidos.length === 0) {
        return;
      }

      Swal.fire({
        title: `Subiendo ${archivosValidos.length} archivo(s)...`,
        text: 'Por favor espera',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      if (!doc.archivos) {
        doc.archivos = [];
      }

      let exitosos = 0;
      let fallidos = 0;

      for (const archivo of archivosValidos) {
        try {
          const archivoIndex = doc.archivos.length;
          const tipoDocumento = `${doc.nombre}_${archivoIndex + 1}`;

          const exito = await this.subirArchivoOtros(archivo, tipoDocumento, index, archivoIndex);

          if (exito) {
            doc.archivos.push(archivo);
            exitosos++;
          } else {
            fallidos++;
          }
        } catch (error) {
          fallidos++;
        }
      }

      if (exitosos > 0 && fallidos === 0) {
        Swal.fire({
          icon: 'success',
          title: '¡Archivos subidos!',
          text: `Se subieron ${exitosos} archivo(s) correctamente`,
          timer: 2000,
          showConfirmButton: false
        });
      } else if (exitosos > 0 && fallidos > 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Subida parcial',
          text: `${exitosos} archivo(s) subidos, ${fallidos} fallaron`
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error en subida',
          text: 'No se pudo subir ningún archivo'
        });
      }
    },

    async subirArchivoOtros(archivo, tipoDocumento, index, archivoIndex) {
      try {
        if (!this.folio) {
          const tieneFolio = await this.obtenerFolio();
          if (!tieneFolio) {
            throw new Error("No se pudo obtener folio de sesión");
          }
        }

        const formData = new FormData();
        formData.append('archivo', archivo);
        formData.append('tipoDocumento', tipoDocumento);
        formData.append('razonSocial', this.razonSocial);
        formData.append('rfc', this.rfc || '');
        formData.append('esOtroDocumento', 'true');
        formData.append('archivoIndex', archivoIndex.toString());

        const response = await axios.post('../proCorsec/proveedores/subirArchivo/subirArchivo.app', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000
        });

        if (!response.data.success) {
          throw new Error(response.data.message || 'Error del servidor');
        }

        if (!this.archivosEnServidor[`${index}_otros`]) {
          this.archivosEnServidor[`${index}_otros`] = [];
        }

        this.archivosEnServidor[`${index}_otros`][archivoIndex] = {
          rutaServidor: response.data.rutaArchivo,
          nombreArchivo: response.data.nombreArchivo || archivo.name,
          tipoDocumento: tipoDocumento,
          fechaSubida: new Date().toISOString()
        };

        return true;

      } catch (error) {
        return false;
      }
    },

    async eliminarArchivo(index) {
      try {
        const doc = this.documentosRequeridos[index];
        const archivo = doc.archivo;

        if (!archivo) {
          return;
        }

        const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: `Se eliminará: ${archivo.name}`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
          Swal.fire({
            title: 'Eliminando archivo...',
            text: 'Por favor espera',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });

          const exito = await this.eliminarArchivoServidor(index, false);

          if (exito) {
            doc.archivo = null;
            doc.fechaSubida = null;
            doc.rutaServidor = null;

            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El archivo ha sido eliminado correctamente',
              timer: 1500,
              showConfirmButton: false
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al eliminar el archivo del servidor'
            });
          }
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al eliminar el archivo'
        });
      }
    },

    async eliminarArchivoOtros(index, archivoIndex) {
      try {
        const doc = this.documentosRequeridos[index];
        const archivo = doc.archivos[archivoIndex];

        if (!archivo) {
          return;
        }

        const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: `Se eliminará: ${archivo.name}`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
          Swal.fire({
            title: 'Eliminando archivo...',
            text: 'Por favor espera',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });

          const archivoServidor = this.archivosEnServidor[`${index}_otros`]?.[archivoIndex];
          if (archivoServidor) {
            try {
              await axios.post('../proCorsec/proveedores/eliminarArchivo/eliminarArchivo.app', {
                rutaArchivo: archivoServidor.rutaServidor,
                razonSocial: this.razonSocial || 'sin_nombre',
                tipoDocumento: archivoServidor.tipoDocumento
              });
            } catch (error) {
              // Error silencioso
            }
          }

          doc.archivos.splice(archivoIndex, 1);

          if (this.archivosEnServidor[`${index}_otros`]) {
            this.archivosEnServidor[`${index}_otros`].splice(archivoIndex, 1);
          }

          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'El archivo ha sido eliminado correctamente',
            timer: 1500,
            showConfirmButton: false
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al eliminar el archivo'
        });
      }
    },

    async subirListadoPrecios(archivo) {
      return await this.subirArchivo(archivo, 'listado_precios');
    },

    async handleDropPrices(e) {
      this.isDraggingPrices = false;

      const file = e.dataTransfer.files[0];

      if (file && this.validarArchivoPrices(file)) {
        if (!this.razonSocial) {
          Swal.fire({
            icon: 'warning',
            title: 'Datos requeridos',
            text: 'Por favor ingrese la razón social antes de subir archivos'
          });
          return;
        }

        const exito = await this.subirListadoPrecios(file);
        if (exito) {
          this.listadoPrecios = file;
        }
      }
    },

    handleDragLeavePrices(e) {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        this.isDraggingPrices = false;
      }
    },

    handleDragEnterPrices(e) {
      e.preventDefault();
      this.isDraggingPrices = true;
    },

    handleDragOverPrices(e) {
      e.preventDefault();
      this.isDraggingPrices = true;
    },

    async handleFileSelect(e, index) {
      const file = e.target.files[0];
      if (file && this.validarArchivo(file)) {
        if (!this.razonSocial) {
          Swal.fire({
            icon: 'warning',
            title: 'Datos requeridos',
            text: 'Por favor ingrese la razón social antes de subir archivos'
          });
          e.target.value = '';
          return;
        }

        const tipoDocumento = this.documentosRequeridos[index].nombre;
        const exito = await this.subirArchivo(file, tipoDocumento, index);

        if (!exito) {
          e.target.value = '';
        }
      }
      e.target.value = '';
    },

    async handleFileSelectPrices(e) {
      const file = e.target.files[0];
      if (file && this.validarArchivoPrices(file)) {
        if (!this.razonSocial) {
          Swal.fire({
            icon: 'warning',
            title: 'Datos requeridos',
            text: 'Por favor ingrese la razón social antes de subir archivos'
          });
          e.target.value = '';
          return;
        }

        const exito = await this.subirListadoPrecios(file);
        if (exito) {
          this.listadoPrecios = file;
        }
      }
      e.target.value = '';
    },

    async limpiarTodosLosArchivos() {
      try {
        const result = await Swal.fire({
          title: '¿Eliminar todos los archivos?',
          text: "Se eliminarán todos los documentos cargados",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Sí, eliminar todos',
          cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
          Swal.fire({
            title: 'Eliminando archivos...',
            text: 'Por favor espera',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });

          if (this.listadoPrecios) {
            await this.eliminarArchivoServidor(null, true);
            this.listadoPrecios = null;
            this.listadoPreciosRuta = null;
          }

          for (let i = 0; i < this.documentosRequeridos.length; i++) {
            const doc = this.documentosRequeridos[i];

            if (doc.archivos && Array.isArray(doc.archivos)) {
              for (let j = 0; j < doc.archivos.length; j++) {
                const archivoServidor = this.archivosEnServidor[`${i}_otros`]?.[j];
                if (archivoServidor) {
                  await this.eliminarArchivoServidor(null, false, archivoServidor.rutaServidor);
                }
              }
              doc.archivos = [];
            } else if (doc.archivo) {
              await this.eliminarArchivoServidor(i, false);
              doc.archivo = null;
              doc.fechaSubida = null;
              doc.rutaServidor = null;
            }
          }

          this.archivosEnServidor = {};

          Swal.fire({
            icon: 'success',
            title: 'Archivos eliminados',
            text: 'Todos los archivos han sido eliminados',
            timer: 2000,
            showConfirmButton: false
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al eliminar los archivos'
        });
      }
    },

    validarNombreEmpresa(nombre) {
      return nombre
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .toLowerCase()
        .substring(0, 50);
    },

    async cargarDatosExistentes() {
      const tieneFolio = await this.obtenerFolio();

      if (!tieneFolio) {
        return;
      }

      this.cargandoDatos = true;

      try {
        const response = await axios.post('../proCorsec/proveedores/proveedores.app', {
          opcion: 4
        });

        if (response.data.existe) {
          this.registroExistente = true;
          this.registroId = response.data.id;

          this.tipoPersona = response.data.tipoPersona || 'moral';
          this.rfc = response.data.rfc || '';
          this.razonSocial = response.data.razonSocial || '';
          this.nombreComercial = response.data.nombreComercial || '';
          this.usoCfdi = response.data.usoCfdi || '';
          this.metodoPago = response.data.metodoPago || '';
          this.formaPago = response.data.formaPago || '';
          this.descripcionEmpresa = response.data.descripcionEmpresa || '';
          this.descripcionProductos = response.data.descripcionProductos || '';
          this.numColaboradores = response.data.numColaboradores || '';
          this.grupoMultinacional = response.data.grupoMultinacional || '';
          this.direccionFiscal = response.data.direccionFiscal || '';
          this.mismaDireccionNotificacion = response.data.mismaDireccionNotificacion === '1';
          this.direccionNotificaciones = response.data.direccionNotificaciones || '';
          this.otrasUbicaciones = response.data.otrasUbicaciones || '';
          this.contactoPrincipal = response.data.contactoPrincipal || '';
          this.emailPrincipal = response.data.emailPrincipal || '';
          this.telefonoPrincipal = response.data.telefonoPrincipal || '';
          this.contactoAdministrativo = response.data.contactoAdministrativo || '';
          this.emailAdministrativo = response.data.emailAdministrativo || '';
          this.telefonoAdministrativo = response.data.telefonoAdministrativo || '';
          this.paginaWeb = response.data.paginaWeb || '';
          this.redesSociales = response.data.redesSociales || '';
          this.idioma = response.data.idioma || 'español';
          this.nombreBanco = response.data.nombreBanco || '';
          this.numeroCuenta = response.data.numeroCuenta || '';
          this.clabeBancaria = response.data.clabeBancaria || '';

          if (this.mismaDireccionNotificacion) {
            this.direccionNotificaciones = this.direccionFiscal;
          }

          await this.cargarArchivosExistentes();

        } else {
          this.registroExistente = false;
          this.registroId = null;

          if (this.razonSocial) {
            await this.cargarArchivosExistentes();
          }
        }

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar datos',
          text: 'No se pudieron cargar los datos existentes'
        });
      } finally {
        this.cargandoDatos = false;
      }
    },

    async cargarArchivosExistentes() {
      try {
        if (!this.folio) {
          const folioObtenido = await this.obtenerFolio();
          if (!folioObtenido) {
            return;
          }
        }

        const folioFinal = this.folio?.toString().trim();
        const razonSocialFinal = this.razonSocial?.toString().trim() || `temp_${folioFinal}`;

        const requestData = {
          folio: folioFinal,
          razonSocial: razonSocialFinal
        };

        const response = await axios({
          method: 'POST',
          url: '../proCorsec/proveedores/obtenerArchivos/obtenerArchivos.app',
          data: requestData,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 15000,
          validateStatus: function (status) {
            return status < 500;
          }
        });

        if (response.status !== 200) {
          throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }

        let data = response.data;
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (e) {
            throw new Error(`Error parsing JSON: ${e.message}`);
          }
        }

        if (!data.success || !data.archivos) {
          return;
        }

        const archivosEncontrados = data.archivos;

        // Cargar listado de precios
        if (archivosEncontrados.listado_precios) {
          this.listadoPreciosRuta = archivosEncontrados.listado_precios.ruta;
          this.listadoPrecios = {
            name: archivosEncontrados.listado_precios.nombre,
            size: archivosEncontrados.listado_precios.tamaño || archivosEncontrados.listado_precios.size || 0,
            type: archivosEncontrados.listado_precios.tipo || 'application/pdf',
            existeEnServidor: true,
            rutaServidor: archivosEncontrados.listado_precios.ruta
          };
        }

        // ✅ NUEVA LÓGICA: Priorizar documentos_por_nombre si existe
        if (archivosEncontrados.documentos_por_nombre) {
          console.log('Usando estructura documentos_por_nombre');
          this.procesarDocumentosPorNombre(archivosEncontrados.documentos_por_nombre);
        }
        // ✅ SEGUNDA OPCIÓN: Usar documentos_por_indice (sin nulls)
        else if (archivosEncontrados.documentos_por_indice) {
          console.log('Usando estructura documentos_por_indice');
          this.procesarDocumentosPorIndice(archivosEncontrados.documentos_por_indice);
        }
        // ✅ FALLBACK: Usar la estructura original
        else if (archivosEncontrados.documentos && Array.isArray(archivosEncontrados.documentos)) {
          console.log('Usando estructura documentos (array original)');
          this.procesarDocumentosArray(archivosEncontrados.documentos);
        }

      } catch (error) {
        console.error('Error en cargarArchivosExistentes:', error);
      }
    },

    // ✅ NUEVO: Método para procesar documentos por nombre (óptimo)
    procesarDocumentosPorNombre(documentosPorNombre) {
      console.log('Procesando documentos por nombre:', documentosPorNombre);

      this.documentosRequeridos.forEach((doc, index) => {
        const archivoServidor = documentosPorNombre[doc.nombre];

        if (doc.nombre === "Otros documentos") {
          // Manejar otros documentos (array)
          if (Array.isArray(archivoServidor)) {
            if (!doc.archivos) {
              doc.archivos = [];
            }

            archivoServidor.forEach((otroArchivo, otroIndex) => {
              if (otroArchivo && otroArchivo.nombre) {
                doc.archivos.push({
                  name: otroArchivo.nombre,
                  size: otroArchivo.tamaño || otroArchivo.size || 0,
                  type: otroArchivo.tipo || 'application/pdf',
                  existeEnServidor: true,
                  rutaServidor: otroArchivo.ruta
                });

                if (!this.archivosEnServidor[`${index}_otros`]) {
                  this.archivosEnServidor[`${index}_otros`] = [];
                }
                this.archivosEnServidor[`${index}_otros`][otroIndex] = {
                  rutaServidor: otroArchivo.ruta,
                  nombreArchivo: otroArchivo.nombre,
                  tipoDocumento: `${doc.nombre}_${otroIndex + 1}`,
                  fechaSubida: otroArchivo.fechaSubida
                };
              }
            });
          } else {
            if (!doc.archivos) {
              doc.archivos = [];
            }
          }
        } else {
          // Documento individual
          if (archivoServidor && archivoServidor.nombre && archivoServidor.ruta) {
            doc.archivo = {
              name: archivoServidor.nombre,
              size: archivoServidor.tamaño || archivoServidor.size || 0,
              type: archivoServidor.tipo || 'application/pdf',
              existeEnServidor: true,
              rutaServidor: archivoServidor.ruta
            };

            if (archivoServidor.fechaSubida) {
              doc.fechaSubida = new Date(archivoServidor.fechaSubida);
            }

            doc.rutaServidor = archivoServidor.ruta;

            this.archivosEnServidor[index] = {
              rutaServidor: archivoServidor.ruta,
              nombreArchivo: archivoServidor.nombre,
              tipoDocumento: doc.nombre,
              fechaSubida: archivoServidor.fechaSubida
            };

            console.log(`✅ Archivo cargado: ${doc.nombre}`);
          } else {
            // Limpiar si no hay archivo
            this.limpiarDocumento(doc, index);
          }
        }
      });
    },

    // ✅ NUEVO: Método para procesar documentos por índice (mejorado)
    procesarDocumentosPorIndice(documentosPorIndice) {
      console.log('Procesando documentos por índice:', documentosPorIndice);

      // Limpiar todos los documentos primero
      this.documentosRequeridos.forEach((doc, index) => {
        this.limpiarDocumento(doc, index);
      });

      // Procesar solo los archivos que existen
      Object.keys(documentosPorIndice).forEach(indiceStr => {
        const index = parseInt(indiceStr);
        const archivoServidor = documentosPorIndice[indiceStr];

        if (index >= 0 && index < this.documentosRequeridos.length) {
          const doc = this.documentosRequeridos[index];

          if (index === 14) { // Otros documentos
            this.procesarOtrosDocumentos(doc, archivoServidor, index);
          } else {
            this.procesarDocumentoIndividual(doc, archivoServidor, index);
          }
        }
      });
    },

    // ✅ MEJORADO: Método para procesar documentos array (fallback)
    procesarDocumentosArray(documentosArray) {
      console.log('Procesando documentos array (fallback)');

      documentosArray.forEach((archivoServidor, index) => {
        if (index >= this.documentosRequeridos.length) {
          return;
        }

        const doc = this.documentosRequeridos[index];

        if (doc.nombre === "Otros documentos") {
          this.procesarOtrosDocumentos(doc, archivoServidor, index);
        } else {
          this.procesarDocumentoIndividual(doc, archivoServidor, index);
        }
      });
    },

    // ✅ HELPER: Procesar documento individual
    procesarDocumentoIndividual(doc, archivoServidor, index) {
      if (archivoServidor &&
        (archivoServidor.nombre || archivoServidor.name) &&
        (archivoServidor.ruta || archivoServidor.rutaServidor)) {

        const nombreArchivo = archivoServidor.nombre || archivoServidor.name;
        const tamanoArchivo = archivoServidor.tamaño || archivoServidor.size || 0;
        const tipoArchivo = archivoServidor.tipo || archivoServidor.type || 'application/pdf';
        const rutaArchivo = archivoServidor.ruta || archivoServidor.rutaServidor;
        const fechaSubida = archivoServidor.fechaSubida || archivoServidor.fecha_subida;

        // En Vue 3, la asignación directa es reactiva
        doc.archivo = {
          name: nombreArchivo,
          size: tamanoArchivo,
          type: tipoArchivo,
          existeEnServidor: true,
          rutaServidor: rutaArchivo
        };

        if (fechaSubida) {
          doc.fechaSubida = new Date(fechaSubida);
        }

        doc.rutaServidor = rutaArchivo;

        this.archivosEnServidor[index] = {
          rutaServidor: rutaArchivo,
          nombreArchivo: nombreArchivo,
          tipoDocumento: doc.nombre,
          fechaSubida: fechaSubida
        };

        console.log(`✅ Archivo individual cargado: ${doc.nombre}`, doc.archivo);

        // VERIFICACIÓN ADICIONAL: Forzar actualización de la UI
        this.$forceUpdate();

      } else {
        this.limpiarDocumento(doc, index);
      }
    },

    // HELPER: Limpiar documento - VERSIÓN CORREGIDA
    limpiarDocumento(doc, index) {
      if (doc.nombre === "Otros documentos") {
        if (!doc.archivos) {
          this.$set(doc, 'archivos', []);
        }
      } else {
        // CORRECCIÓN: Usar Vue.set para limpiar también
        this.$set(doc, 'archivo', null);
        this.$set(doc, 'fechaSubida', null);
        this.$set(doc, 'rutaServidor', null);

        if (this.archivosEnServidor[index]) {
          delete this.archivosEnServidor[index];
        }
      }
    },

    procesarDocumentoIndividualAlternativo(doc, archivoServidor, index) {
      if (archivoServidor &&
        (archivoServidor.nombre || archivoServidor.name) &&
        (archivoServidor.ruta || archivoServidor.rutaServidor)) {

        const nombreArchivo = archivoServidor.nombre || archivoServidor.name;
        const tamanoArchivo = archivoServidor.tamaño || archivoServidor.size || 0;
        const tipoArchivo = archivoServidor.tipo || archivoServidor.type || 'application/pdf';
        const rutaArchivo = archivoServidor.ruta || archivoServidor.rutaServidor;
        const fechaSubida = archivoServidor.fechaSubida || archivoServidor.fecha_subida;

        // ALTERNATIVA: Reemplazar todo el objeto documento
        const documentoActualizado = {
          ...doc,
          archivo: {
            name: nombreArchivo,
            size: tamanoArchivo,
            type: tipoArchivo,
            existeEnServidor: true,
            rutaServidor: rutaArchivo
          },
          rutaServidor: rutaArchivo,
          fechaSubida: fechaSubida ? new Date(fechaSubida) : null
        };

        // Reemplazar el documento completo en el array
        this.$set(this.documentosRequeridos, index, documentoActualizado);

        this.archivosEnServidor[index] = {
          rutaServidor: rutaArchivo,
          nombreArchivo: nombreArchivo,
          tipoDocumento: doc.nombre,
          fechaSubida: fechaSubida
        };

        console.log(`✅ Documento reemplazado: ${doc.nombre}`, this.documentosRequeridos[index]);

      } else {
        this.limpiarDocumento(doc, index);
      }
    },

    // ✅ HELPER: Procesar otros documentos
    procesarOtrosDocumentos(doc, archivoServidor, index) {
      if (Array.isArray(archivoServidor)) {
        if (!doc.archivos) {
          doc.archivos = [];
        }

        archivoServidor.forEach((otroArchivo, otroIndex) => {
          if (otroArchivo && (otroArchivo.nombre || otroArchivo.name)) {
            const nombreArchivo = otroArchivo.nombre || otroArchivo.name;
            const tamanoArchivo = otroArchivo.tamaño || otroArchivo.size || 0;
            const tipoArchivo = otroArchivo.tipo || otroArchivo.type || 'application/pdf';
            const rutaArchivo = otroArchivo.ruta || otroArchivo.rutaServidor;

            doc.archivos.push({
              name: nombreArchivo,
              size: tamanoArchivo,
              type: tipoArchivo,
              existeEnServidor: true,
              rutaServidor: rutaArchivo
            });

            if (!this.archivosEnServidor[`${index}_otros`]) {
              this.archivosEnServidor[`${index}_otros`] = [];
            }
            this.archivosEnServidor[`${index}_otros`][otroIndex] = {
              rutaServidor: rutaArchivo,
              nombreArchivo: nombreArchivo,
              tipoDocumento: `${doc.nombre}_${otroIndex + 1}`,
              fechaSubida: otroArchivo.fechaSubida
            };
          }
        });

        console.log(`✅ Otros documentos cargados: ${doc.archivos.length}`);
      } else {
        if (!doc.archivos) {
          doc.archivos = [];
        }
      }
    },

    // ✅ HELPER: Limpiar documento
    limpiarDocumento(doc, index) {
      if (doc.nombre === "Otros documentos") {
        if (!doc.archivos) {
          doc.archivos = [];
        }
      } else {
        doc.archivo = null;
        doc.fechaSubida = null;
        doc.rutaServidor = null;

        if (this.archivosEnServidor[index]) {
          delete this.archivosEnServidor[index];
        }
      }
    },

    validarArchivoPrices(file) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];

      if (file.size > maxSize) {
        Swal.fire({
          icon: 'error',
          title: 'Archivo muy grande',
          text: `El archivo ${file.name} excede el tamaño máximo de 10MB`
        });
        return false;
      }

      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Tipo de archivo no permitido',
          text: 'Solo se aceptan archivos PDF, Word y Excel'
        });
        return false;
      }

      return true;
    },

    async eliminarListadoPrecios() {
      try {
        const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: "Se eliminará el listado de precios del servidor",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
          Swal.fire({
            title: 'Eliminando archivo...',
            text: 'Por favor espera',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });

          const exitoServidor = await this.eliminarArchivoServidor(null, true);

          this.listadoPrecios = null;
          this.listadoPreciosRuta = null;

          if (exitoServidor) {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado correctamente',
              text: 'El listado de precios ha sido eliminado del servidor',
              timer: 1500,
              showConfirmButton: false
            });
          } else {
            Swal.fire({
              icon: 'warning',
              title: 'Parcialmente eliminado',
              text: 'El archivo se eliminó localmente, pero pudo haber un problema en el servidor',
              timer: 3000,
              showConfirmButton: false
            });
          }
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al eliminar el listado de precios'
        });
      }
    },

    copiarDireccion() {
      if (this.mismaDireccionNotificacion) {
        this.direccionNotificaciones = this.direccionFiscal;
      } else {
        this.direccionNotificaciones = '';
      }
    },

    clickFileInput(index) {
      const fileInput = document.getElementById('fileInput' + index);
      if (fileInput) {
        fileInput.click();
      }
    },

    async handleDrop(e, index) {
      this.isDragging = null;
      const file = e.dataTransfer.files[0];

      if (file && this.validarArchivo(file)) {
        if (!this.razonSocial) {
          Swal.fire({
            icon: 'warning',
            title: 'Datos requeridos',
            text: 'Por favor ingrese la razón social antes de subir archivos'
          });
          return;
        }

        const tipoDocumento = this.documentosRequeridos[index].nombre;
        const exito = await this.subirArchivo(file, tipoDocumento, index);
      }
    },

    validarArchivo(file) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];

      if (file.size > maxSize) {
        Swal.fire({
          icon: 'error',
          title: 'Archivo muy grande',
          text: `El archivo ${file.name} excede el tamaño máximo de 10MB`
        });
        return false;
      }

      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Tipo de archivo no permitido',
          text: `El archivo ${file.name} no es un tipo de archivo válido`
        });
        return false;
      }

      return true;
    },

    async eliminarArchivo(index) {
      try {
        const doc = this.documentosRequeridos[index];

        if (!doc.archivo && !this.archivosEnServidor[index]) {
          Swal.fire({
            icon: 'info',
            title: 'Sin archivo',
            text: 'No hay archivo cargado para eliminar',
            timer: 2000
          });
          return;
        }

        const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: `Se eliminará: ${doc.nombre}`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
          Swal.fire({
            title: 'Eliminando archivo...',
            text: 'Por favor espera',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });

          const exitoServidor = await this.eliminarArchivoServidor(index, false);

          this.documentosRequeridos[index].archivo = null;
          this.documentosRequeridos[index].fechaSubida = null;
          this.documentosRequeridos[index].rutaServidor = null;

          delete this.archivosEnServidor[index];

          if (exitoServidor) {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El archivo ha sido eliminado correctamente',
              timer: 1500,
              showConfirmButton: false
            });
          } else {
            Swal.fire({
              icon: 'warning',
              title: 'Parcialmente eliminado',
              text: 'El archivo se eliminó localmente, pero pudo haber un problema en el servidor',
              timer: 3000,
              showConfirmButton: false
            });
          }
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al eliminar el archivo'
        });
      }
    },

    verArchivo(archivo) {
      if (archivo.existeEnServidor) {
        const urlEndpoint = `../proCorsec/proveedores/verArchivo/verArchivo.app?archivo=${encodeURIComponent(archivo.rutaServidor)}`;
        window.open(urlEndpoint, '_blank');

      } else {
        const url = URL.createObjectURL(archivo);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },

    formatDate(date) {
      if (!date) return '';
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(date).toLocaleDateString('es-MX', options);
    },

    descargarTodos() {
      Swal.fire({
        icon: 'info',
        title: 'Función en desarrollo',
        text: 'La descarga masiva de documentos estará disponible próximamente'
      });
    },

    async ordenCompra() {
      if (!this.folio || !this.razonSocial) {
        Swal.fire({
          icon: 'warning',
          title: 'Faltan datos',
          text: 'Se necesita el Folio y la Razón Social para generar la orden.'
        });
        return;
      }

      Swal.fire({
        title: 'Generando Orden de Compra',
        text: 'Por favor, espere...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        const params = new URLSearchParams();
        params.append('folio', this.folio);
        params.append('rfc', this.rfc);
        params.append('razonSocial', this.razonSocial);
        params.append('usoCfdi', this.usoCfdi);
        params.append('metodoPago', this.metodoPago);
        params.append('formaPago', this.formaPago);


        const response = await axios.post('../proCorsec/ordenCompra/ordenCompra.app', params, {
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        Swal.fire({
          icon: 'success',
          title: '¡Orden Generada!',
          text: 'La orden de compra está lista para ser visualizada.',
          showCancelButton: true,
          confirmButtonText: 'Ver Archivo',
          cancelButtonText: 'Cerrar',
          confirmButtonColor: '#1f2a38',
        }).then((result) => {
          if (result.isConfirmed) {
            window.open(url);
          }
          window.URL.revokeObjectURL(url);
        });

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo generar la orden de compra. Por favor, intente de nuevo.'
        });
      }
    },

    guardarPerfilEmpresa() {
      const camposRequeridos = [
        'tipoPersona', 'razonSocial', 'rfc', 'usoCfdi', 'metodoPago', 'formaPago', 'direccionFiscal',
        'contactoPrincipal', 'emailPrincipal', 'telefonoPrincipal',
        'nombreBanco', 'numeroCuenta', 'clabeBancaria'
      ];

      const camposFaltantes = camposRequeridos.filter(campo => !this.perfilEmpresa[campo]);

      if (camposFaltantes.length > 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Campos requeridos',
          text: 'Por favor complete todos los campos obligatorios marcados con *'
        });
        return;
      }

      Swal.fire({
        title: 'Guardando perfil de empresa...',
        text: 'Por favor espera',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: '¡Perfil guardado!',
          text: 'El perfil de la empresa se ha guardado correctamente',
          confirmButtonColor: '#1f2a38'
        });
      }, 2000);
    },

    async limpiarFormulario() {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Se borrarán todos los datos del formulario y archivos cargados",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, limpiar todo',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await this.limpiarTodosLosArchivos();

        this.tipoPersona = 'moral';
        this.razonSocial = '';
        this.nombreComercial = '';
        this.usoCfdi = '';
        this.metodoPago = 'PUE';
        this.formaPago = '03';
        this.descripcionEmpresa = '';
        this.descripcionProductos = '';
        this.listadoPrecios = null;
        this.numColaboradores = '';
        this.grupoMultinacional = '';
        this.rfc = '';
        this.direccionFiscal = '';
        this.mismaDireccionNotificacion = false;
        this.direccionNotificaciones = '';
        this.otrasUbicaciones = '';
        this.contactoPrincipal = '';
        this.emailPrincipal = '';
        this.telefonoPrincipal = '';
        this.contactoAdministrativo = '';
        this.emailAdministrativo = '';
        this.telefonoAdministrativo = '';
        this.paginaWeb = '';
        this.redesSociales = '';
        this.idioma = 'español';
        this.nombreBanco = '';
        this.numeroCuenta = '';
        this.clabeBancaria = '';

        this.archivosEnServidor = {};
        this.listadoPreciosRuta = null;

        Swal.fire({
          icon: 'success',
          title: 'Formulario limpiado',
          text: 'Todos los datos y archivos han sido eliminados',
          timer: 1500,
          showConfirmButton: false
        });
      }
    },

    async alta() {
      const opcion = this.registroExistente ? 2 : 1;
      const datos = {
        opcion: opcion,
        tipoPersona: this.tipoPersona,
        rfc: this.rfc,
        razonSocial: this.razonSocial,
        nombreComercial: this.nombreComercial,
        usoCfdi: this.usoCfdi,
        metodoPago: this.metodoPago,
        formaPago: this.formaPago,
        descripcionEmpresa: this.descripcionEmpresa,
        descripcionProductos: this.descripcionProductos,
        listadoPrecios: this.listadoPrecios,
        numColaboradores: this.numColaboradores,
        grupoMultinacional: this.grupoMultinacional,
        direccionFiscal: this.direccionFiscal,
        mismaDireccionNotificacion: this.mismaDireccionNotificacion,
        direccionNotificaciones: this.direccionNotificaciones,
        otrasUbicaciones: this.otrasUbicaciones,
        contactoPrincipal: this.contactoPrincipal,
        emailPrincipal: this.emailPrincipal,
        telefonoPrincipal: this.telefonoPrincipal,
        contactoAdministrativo: this.contactoAdministrativo,
        emailAdministrativo: this.emailAdministrativo,
        telefonoAdministrativo: this.telefonoAdministrativo,
        paginaWeb: this.paginaWeb,
        redesSociales: this.redesSociales,
        idioma: this.idioma,
        nombreBanco: this.nombreBanco,
        numeroCuenta: this.numeroCuenta,
        clabeBancaria: this.clabeBancaria,
      };

      if (this.registroExistente) {
        datos.id = this.registroId;
      }

      axios.post('../proCorsec/proveedores/proveedores.app', datos)
        .then(response => {
          const mensaje = this.registroExistente ? 'Se actualizó el registro' : 'Se agregó un nuevo registro';

          Swal.fire({
            icon: 'success',
            title: mensaje,
            showConfirmButton: true
          });

          if (!this.registroExistente) {
            this.registroExistente = true;
          }
        })
        .catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al guardar la información'
          });
        });
    },

    listaDatos() {
      axios.post('../proCorsec/proveedores/proveedores.app', {
        opcion: 4
      })
        .then(response => {
          this.datos = response.data
        })
    }
  },
  mounted() {
    this.$nextTick(async () => {
      try {
        await this.cargarDatosExistentes();
      } catch (error) {
        // Error silencioso
      }
    });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      document.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });
  }
});

// Componente de Auditoría
app.component("web-auditoria", {
  template: /*html*/ `
  <base-layout>
    <div class="container-fluid">
      <!-- Header de Auditoría -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card border-0 shadow">
            <div class="card-header bg-primary text-white">
              <div class="row align-items-center">
                <div class="col">
                  <h2 class="h5 mb-0">
                    <svg class="icon icon-sm me-2" fill="currentColor" viewBox="0 0 20 20"
                      style="width: 20px; height: 20px;">
                      <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"></path>
                    </svg>
                    Sistema de Auditoría de Proveedores
                  </h2>
                  <p class="text-light mb-0 opacity-75">Gestión y evaluación de documentos de proveedores</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- BOTÓN FLOTANTE - AGREGAR AQUÍ -->
      <button 
        v-if="pasoActual === 2" 
        @click="irAlFinal" 
        class="btn-flotante-scroll"
        title="Ir a conclusiones">
        <svg fill="currentColor" viewBox="0 0 20 20" style="width: 24px; height: 24px;">
          <path fill-rule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
        </svg>
      </button>

  
      <!-- Contenido principal -->
      <div v-if="pasoActual === 1" class="row">
        <div class="col-12">
          <div class="card border-0 shadow">
            <div class="card-header" style="background: linear-gradient(135deg, #475569, #334155); color: white;">
              <div class="d-flex align-items-center">
                <div class="rounded-circle p-2 me-3" style="background-color: rgba(255, 255, 255, 0.2);">
                  <svg width="20" height="20" fill="white" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z"
                      clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <h5 class="mb-1 text-white fw-bold">1. SELECCIÓN DE EMPRESA</h5>
                  <p class="mb-0 small" style="color: rgba(255, 255, 255, 0.8);">
                    Seleccione la empresa a auditar de la lista de proveedores registrados
                  </p>
                </div>
              </div>
            </div>
  
            <div class="card-body">
              <!-- Formulario de selección de empresa -->
              <div class="mb-4">
                <div class="row justify-content-center">
                  <div class="col-md-8">
                    <div class="mb-4">
                      <label for="empresaSelect" class="form-label fw-semibold text-dark">
                        Nombre de la Empresa <span class="text-danger">*</span>
                      </label>
  
                      <!-- Select con autocompletado -->
                      <div class="position-relative">
                        <input type="text" class="form-control form-control-lg"
                          :class="{ 'is-invalid': errorEmpresa, 'is-valid': empresaSeleccionada.id }" id="empresaSelect"
                          v-model="busquedaEmpresa" @input="buscarEmpresas" @focus="mostrarSugerencias = true"
                          @blur="ocultarSugerencias" placeholder="Escriba el nombre de la empresa..." autocomplete="off"
                          :disabled="cargandoEmpresas" required />
  
                        <!-- Spinner de carga -->
                        <div v-if="cargandoEmpresas" class="position-absolute top-50 end-0 translate-middle-y me-3">
                          <div class="spinner-border spinner-border-sm text-primary" role="status">
                            <span class="visually-hidden">Cargando...</span>
                          </div>
                        </div>
  
                        <!-- Lista de sugerencias -->
                        <div v-if="mostrarSugerencias && sugerenciasEmpresas.length > 0"
                          class="position-absolute w-100 bg-white border border-top-0 rounded-bottom shadow-lg"
                          style="z-index: 1050; max-height: 200px; overflow-y: auto;">
                          <div v-for="(empresa, index) in sugerenciasEmpresas" :key="empresa.id"
                            @mousedown="seleccionarEmpresa(empresa)"
                            class="px-3 py-2 cursor-pointer border-bottom empresa-sugerencia"
                            :class="{ 'bg-light': index === sugerenciaActiva }">
                            <div class="fw-medium">{{ empresa.nomEmpresa }}</div>
                            <small class="text-muted">RFC: {{ empresa.rfc || 'N/A' }}</small>
                          </div>
                        </div>
  
                        <!-- Mensaje cuando no hay resultados -->
                        <div
                          v-if="mostrarSugerencias && sugerenciasEmpresas.length === 0 && busquedaEmpresa.length > 2 && !cargandoEmpresas"
                          class="position-absolute w-100 bg-white border border-top-0 rounded-bottom shadow-lg px-3 py-2 text-muted text-center"
                          style="z-index: 1050;">
                          No se encontraron empresas con ese nombre
                        </div>
                      </div>
  
                      <!-- Mensajes de validación -->
                      <div v-if="errorEmpresa" class="invalid-feedback d-block">
                        {{ errorEmpresa }}
                      </div>
  
                      <!-- Información de empresa seleccionada -->
                      <div v-if="empresaSeleccionada.id" class="mt-3 p-3 bg-light rounded">
                        <div class="row">
                          <div class="col-md-6">
                            <h6 class="fw-bold text-success mb-2">Empresa Seleccionada:</h6>
                            <p class="mb-1"><strong>Nombre:</strong> {{ empresaSeleccionada.nomEmpresa }}</p>
                            <p class="mb-1"><strong>RFC:</strong> {{ empresaSeleccionada.rfc || 'N/A' }}</p>
                          </div>
                          <div class="col-md-6">
                            <p class="mb-1"><strong>Email:</strong> {{ empresaSeleccionada.correo || 'N/A' }}</p>
                            <p class="mb-0"><strong>Teléfono:</strong> {{ empresaSeleccionada.telefono || 'N/A' }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Footer con información y navegación -->
            <div class="card-footer bg-light">
              <div class="row align-items-center">
                <div class="col-12 col-md-6 mb-2 mb-md-0">
                  <small class="text-muted fw-medium">
                    <span v-if="empresaSeleccionada.id" class="text-success">
                      <strong>✓</strong> Empresa seleccionada: {{ empresaSeleccionada.nomEmpresa }}
                    </span>
                    <span v-else class="text-warning">
                      <strong>!</strong> Seleccione una empresa para continuar
                    </span>
                  </small>
                </div>
                <div class="col-12 col-md-6">
                  <div class="d-flex justify-content-md-end gap-2">
                    <button class="btn btn-outline-secondary" @click="volverAnterior" :disabled="procesandoFormulario">
                      <svg class="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20"
                        style="width: 16px; height: 16px;">
                        <path fill-rule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clip-rule="evenodd"></path>
                      </svg>
                      Anterior
                    </button>
                    <button class="btn btn-primary" @click="continuarSiguiente"
                      :disabled="!empresaSeleccionada.id || procesandoFormulario">
                      <span v-if="procesandoFormulario">
                        <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                        Procesando...
                      </span>
                      <span v-else>
                        Continuar
                        <svg class="icon icon-xs ms-2" fill="currentColor" viewBox="0 0 20 20"
                          style="width: 16px; height: 16px;">
                          <path fill-rule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clip-rule="evenodd"></path>
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- PASO 2: Formulario de auditoría -->
      <div v-if="pasoActual === 2" class="row">
        <div class="col-12">
          <div class="card border-0 shadow">
            <div class="card-header" style="background: linear-gradient(135deg, #475569, #334155); color: white;">
              <div class="d-flex align-items-center">
                <div class="rounded-circle p-2 me-3" style="background-color: rgba(255, 255, 255, 0.2);">
                  <svg width="20" height="20" fill="white" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clip-rule="evenodd"></path>
                    <path fill-rule="evenodd"
                      d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 1h6v4H7V6zm6 6H7v2h6v-2z"
                      clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <h5 class="mb-1 text-white fw-bold">2. FORMULARIO DE AUDITORÍA</h5>
                  <p class="mb-0 small" style="color: rgba(255, 255, 255, 0.8);">
                    Complete el formulario de evaluación para: {{ auditoriaActual.empresaNombre }}
                  </p>
                </div>
              </div>
            </div>
  
            <div class="card-body">
              <!-- Información de la empresa seleccionada -->
              <div class="alert alert-info mb-4">
                <div class="row">
                  <div class="col-md-6">
                    <strong>Empresa:</strong> {{ auditoriaActual.empresaNombre }}<br>
                    <strong>Folio:</strong> {{ auditoriaActual.folioAuditoria }}
                  </div>
                  <div class="col-md-6">
                    <strong>Email:</strong> {{ auditoriaActual.empresaCorreo || 'N/A' }}<br>
                    <strong>Teléfono:</strong> {{ auditoriaActual.empresaTelefono || 'N/A' }}
                  </div>
                </div>
              </div>
  
              <!-- Aquí formulario dinámico -->
              <div class="row">
                <div class="col-12">
                  <h6 class="mb-3">Formulario de Evaluación</h6>
  
                  <!-- Indicador de carga -->
                  <div v-if="cargandoFormulario" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                      <span class="visually-hidden">Cargando preguntas...</span>
                    </div>
                    <p class="text-muted mt-2">Cargando formulario de auditoría...</p>
                  </div>
  
                  <!-- Formulario de preguntas -->
                  <div v-else-if="preguntasFormulario.length > 0">
                    <form @submit.prevent="guardarFormulario">
                      <div v-for="categoria in Object.keys(preguntasAgrupadas)" :key="categoria" class="mb-4">
                        <h5 class="border-bottom pb-2 mb-3 text-primary">{{ categoria }}</h5>
  
                        <div v-for="pregunta in preguntasAgrupadas[categoria]" :key="pregunta.id" class="mb-4">
                          <div class="card border-0 shadow-sm">
                            <div class="card-body">
                              <label class="form-label fw-medium">
                                {{ pregunta.pregunta }}
                                <span v-if="pregunta.obligatoria" class="text-danger">*</span>
                              </label>
  
                              <!-- Input texto -->
                              <!-- <input v-if="pregunta.tipo_respuesta === 'texto'" type="text" class="form-control mb-3"
                                v-model="respuestasFormulario[pregunta.id]" :required="pregunta.obligatoria"
                                placeholder="Ingrese su respuesta..." /> -->

                              <!-- Input texto con select de evaluación -->
                              <div v-if="pregunta.tipo_respuesta === 'texto'" class="mb-3">
                                <div class="row g-2">
                                  <!-- Textarea de respuesta -->
                                  <div class="col-12 col-md-8">
                                    <textarea class="form-control" v-model="respuestasFormulario[pregunta.id]" :required="pregunta.obligatoria"
                                      placeholder="Ingrese su respuesta..." rows="3" style="resize: vertical; min-height: 80px;">
                                                                  </textarea>
                                  </div>
                              
                                  <!-- Select de evaluación -->
                                  <div class="col-12 col-md-4">
                                    <select class="form-select" v-model="evaluacionesFormulario[pregunta.id]" :id="'evaluacion_' + pregunta.id"
                                      @change="manejarCambioEvaluacion(pregunta.id)">
                                      <option value="null">Seleccione evaluación</option>
                                      <option value="na">➖ NA</option>
                                      <option value="0">❌ No cumple</option>
                                      <option value="0.5">⚠️ Parcialmente</option>
                                      <option value="1">✅ Cumple</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
  
                              <!-- Radio buttons para Sí/No -->
                              <div v-else-if="pregunta.tipo_respuesta === 'si_no'" class="mt-2 mb-3">
                                <div class="form-check form-check-inline">
                                  <input class="form-check-input" type="radio" :name="'pregunta_' + pregunta.id"
                                    :id="'si_' + pregunta.id" value="si" v-model="respuestasFormulario[pregunta.id]"
                                    :required="pregunta.obligatoria" />
                                  <label class="form-check-label" :for="'si_' + pregunta.id">Sí</label>
                                </div>
                                <div class="form-check form-check-inline">
                                  <input class="form-check-input" type="radio" :name="'pregunta_' + pregunta.id"
                                    :id="'no_' + pregunta.id" value="no" v-model="respuestasFormulario[pregunta.id]"
                                    :required="pregunta.obligatoria" />
                                  <label class="form-check-label" :for="'no_' + pregunta.id">No</label>
                                </div>
                              </div>
  
                              <!-- Select para opciones múltiples -->
                              <select v-else-if="pregunta.tipo_respuesta === 'opcion_multiple'" class="form-select mb-3"
                                v-model="respuestasFormulario[pregunta.id]" :required="pregunta.obligatoria">
                                <option value="">Seleccione una opción...</option>
                                <option v-for="opcion in pregunta.opciones" :key="opcion" :value="opcion">
                                  {{ opcion }}
                                </option>
                              </select>
  
                              <!-- Radio buttons para escala -->
                              <div v-else-if="pregunta.tipo_respuesta === 'escala'" class="mt-2 mb-3">
                                <div class="d-flex gap-3">
                                  <div v-for="opcion in pregunta.opciones" :key="opcion" class="form-check">
                                    <input class="form-check-input" type="radio" :name="'pregunta_' + pregunta.id"
                                      :id="'escala_' + pregunta.id + '_' + opcion" :value="opcion"
                                      v-model="respuestasFormulario[pregunta.id]" :required="pregunta.obligatoria" />
                                    <label class="form-check-label" :for="'escala_' + pregunta.id + '_' + opcion">
                                      {{ opcion }}
                                    </label>
                                  </div>
                                </div>
                              </div>
  
                              <!-- NUEVA SECCIÓN: Drop & Drop para archivos de la pregunta -->
                              <div class="mt-3">
                                <h6 class="text-muted mb-2">
                                  <svg class="icon icon-sm me-1" fill="currentColor" viewBox="0 0 20 20"
                                    style="width: 16px; height: 16px;">
                                    <path fill-rule="evenodd"
                                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                      clip-rule="evenodd"></path>
                                  </svg>
                                  Documentos de soporte (opcional)
                                </h6>
  
                                <!-- Mostrar archivos existentes -->
                                <div
                                  v-if="archivosPorPregunta[pregunta.id] && archivosPorPregunta[pregunta.id].length > 0"
                                  class="mb-3">
                                  <div class="row g-2">
                                    <div v-for="(archivo, archivoIndex) in archivosPorPregunta[pregunta.id]"
                                      :key="archivoIndex" class="col-md-6">
                                      <div class="file-display-container border rounded p-2">
                                        <div class="file-info-section">
                                          <svg class="file-icon" fill="currentColor" viewBox="0 0 20 20"
                                            style="width: 20px; height: 20px;">
                                            <path fill-rule="evenodd"
                                              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                              clip-rule="evenodd"></path>
                                          </svg>
                                          <div class="file-text-container ms-2">
                                            <p class="file-name mb-0" :title="archivo.name">{{ archivo.name }}</p>
                                            <p class="file-meta small text-muted mb-0">{{ formatFileSize(archivo.size) }}
                                            </p>
                                          </div>
                                        </div>
                                        <div class="file-actions-section">
                                          <button type="button" class="btn btn-sm btn-outline-primary me-1"
                                            @click="verArchivo(archivo)" title="Ver archivo">
                                            <svg fill="currentColor" viewBox="0 0 20 20"
                                              style="width: 16px; height: 16px;">
                                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                                              <path fill-rule="evenodd"
                                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                clip-rule="evenodd"></path>
                                            </svg>
                                          </button>
                                          <button type="button" class="btn btn-sm btn-outline-danger"
                                            @click="eliminarArchivoPregunta(pregunta.id, archivoIndex)"
                                            title="Eliminar archivo">
                                            <svg fill="currentColor" viewBox="0 0 20 20"
                                              style="width: 16px; height: 16px;">
                                              <path fill-rule="evenodd"
                                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                clip-rule="evenodd"></path>
                                            </svg>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
  
                                <!-- Zona de drop para archivos -->
                                <div class="drop-zone p-3 text-center border rounded border-dashed"
                                  :class="{ 'drag-over': isDraggingPregunta === pregunta.id }" @drop.prevent="handleDropPregunta($event, pregunta.id)"
                                  @dragover.prevent="isDraggingPregunta = pregunta.id" @dragenter.prevent="isDraggingPregunta = pregunta.id"
                                  @dragleave.prevent="handleDragLeavePregunta($event, pregunta.id)">
                                  <svg class="icon icon-lg text-gray-400 mb-2" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24" style="width: 36px; height: 36px;">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                                    </path>
                                  </svg>
                                  <p class="mb-2 small">
                                    <span>
                                      Arrastra archivos aquí o
                                    </span>
                                  </p>
                                  <input type="file" :id="'fileInputPregunta' + pregunta.id"
                                    @change="handleFileSelectPregunta($event, pregunta.id)"
                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" multiple style="display: none;">
                                  <button type="button" class="btn btn-sm btn-outline-primary"
                                    @click="clickFileInputPregunta(pregunta.id)">
                                    <svg class="icon icon-xs me-1" fill="currentColor" viewBox="0 0 20 20"
                                      style="width: 16px; height: 16px;">
                                      <path fill-rule="evenodd"
                                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                        clip-rule="evenodd"></path>
                                    </svg>
                                    Seleccionar archivos
                                  </button>
                                  <p class="text-muted small mt-2 mb-0">
                                    Formatos: PDF, JPG, PNG, Word, Excel | Sin límite de archivos
                                  </p>
                                </div>
                              </div>
                              <!-- FIN NUEVA SECCIÓN -->
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
  
                  <!-- Mensaje cuando no hay preguntas -->
                  <div v-else class="border rounded p-4 bg-light text-center">
                    <svg class="icon icon-lg text-muted mb-2" fill="currentColor" viewBox="0 0 20 20"
                      style="width: 48px; height: 48px;">
                      <path fill-rule="evenodd"
                        d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z"
                        clip-rule="evenodd"></path>
                    </svg>
                    <p class="text-muted mb-0">No se encontraron preguntas para el formulario de auditoría</p>
                  </div>
                </div>
              </div>
              <!-- NAVEGACIÓN DE PASOS DEL CUESTIONARIO -->
              <div class="d-flex justify-content-between mt-4 pt-4 border-top">
                <button class="btn btn-outline-secondary" @click="cambiarPasoAuditoria(pasoAuditoria - 1)" :disabled="pasoAuditoria <= 1">
                  <svg class="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                  Paso Anterior
                </button>
                <span class="fw-bold text-muted">Paso {{pasoAuditoria}} de {{totalPasosAuditoria}}</span>
                <button class="btn btn-primary" @click="cambiarPasoAuditoria(pasoAuditoria + 1)" :disabled="pasoAuditoria >= totalPasosAuditoria">
                  Siguiente Paso
                  <svg class="icon icon-xs ms-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                </button>
              </div>
            </div>

            <!-- NUEVA SECCIÓN: Formulario de Inspección Final -->
            <div class="mt-5 pt-4 border-top">
              <h5 class="mb-4 text-primary ps-3">
                Conclusiones de la Auditoría:
              </h5>

            <!-- INSERTAR DESPUÉS DEL TÍTULO "Conclusiones de la Auditoría:" Y ANTES DE "No conformidades críticas" -->

            <!-- Fecha de auditoría y Auditores (lado a lado) -->
            <div class="mb-4">
              <div class="card border-0 shadow-sm">
                <div class="card-body">
                  <div class="row g-3">
                    <!-- Fecha de auditoría -->
                    <div class="col-md-6">
                      <label for="fechaAuditoria" class="form-label fw-semibold text-dark">
                        Fecha de auditoría <span class="text-danger">*</span>
                      </label>
                      <input type="date" id="fechaAuditoria" class="form-control" v-model="formularioInspeccion.fechaAuditoria"
                        placeholder="Seleccione la fecha de auditoría" required>
                      <div class="form-text text-muted">
                        Seleccione la fecha en que se realizó la auditoría.
                      </div>
                    </div>
                    
                    <!-- Auditores -->
                    <div class="col-md-6">
                      <label for="auditores" class="form-label fw-semibold text-dark">
                        Auditores <span class="text-danger">*</span>
                      </label>
                      <input type="text" id="auditores" class="form-control" v-model="formularioInspeccion.auditores"
                        placeholder="Ingrese los nombres de los auditores..." maxlength="5000" required>
                      <div class="form-text text-muted">
                        Escriba los nombres de los auditores que participaron en la evaluación.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- AHORA VAN LOS CAMPOS EXISTENTES: No conformidades críticas, No conformidades menores, Observaciones -->

            

              <!-- No conformidades críticas -->
              <div class="mb-4">
                <div class="card border-0 shadow-sm">
                  <div class="card-body">
                    <label for="noConformidadesCriticas" class="form-label fw-semibold text-dark">
                      A. No conformidades críticas <span class="text-danger">*</span>
                    </label>
                    <textarea 
                      id="noConformidadesCriticas" 
                      class="form-control" 
                      v-model="formularioInspeccion.noConformidadesCriticas"
                      rows="4"
                      placeholder="Describa las no conformidades críticas encontradas durante la auditoría..."
                      required>
                    </textarea>
                    <div class="form-text text-muted">
                      Detalle las no conformidades que representan un riesgo crítico o violaciones graves a los estándares.
                    </div>
                  </div>
                </div>
              </div>

              <!-- No conformidades menores -->
              <div class="mb-4">
                <div class="card border-0 shadow-sm">
                  <div class="card-body">
                    <label for="noConformidadesMenores" class="form-label fw-semibold text-dark">
                      B. No conformidades menores <span class="text-danger">*</span>
                    </label>
                    <textarea 
                      id="noConformidadesMenores" 
                      class="form-control" 
                      v-model="formularioInspeccion.noConformidadesMenores"
                      rows="4"
                      placeholder="Describa las no conformidades menores identificadas..."
                      required>
                    </textarea>
                    <div class="form-text text-muted">
                      Indique las no conformidades menores que requieren atención pero no representan riesgo crítico.
                    </div>
                  </div>
                </div>
              </div>

              <!-- Observaciones -->
              <div class="mb-4">
                <div class="card border-0 shadow-sm">
                  <div class="card-body">
                    <label for="observaciones" class="form-label fw-semibold text-dark">
                      C. Observaciones <span class="text-danger">*</span>
                    </label>
                    <textarea 
                      id="observaciones" 
                      class="form-control" 
                      v-model="formularioInspeccion.observaciones"
                      rows="4"
                      placeholder="Registre observaciones generales sobre el proceso de auditoría..."
                      required>
                    </textarea>
                    <div class="form-text text-muted">
                      Incluya observaciones relevantes que no constituyen no conformidades pero son importantes.
                    </div>
                  </div>
                </div>
              </div>

              <!-- NUEVO CAMPO 3: Fortalezas del proveedor (va DESPUÉS de Observaciones y ANTES de Resumen del auditor) -->
            <div class="mb-4">
              <div class="card border-0 shadow-sm">
                <div class="card-body">
                  <label for="fortalezasProveedor" class="form-label fw-semibold text-dark">
                    D. Fortalezas del proveedor <span class="text-danger">*</span>
                  </label>
                  <textarea id="fortalezasProveedor" class="form-control" v-model="formularioInspeccion.fortalezasProveedor"
                    rows="4" placeholder="Describa las fortalezas y aspectos positivos del proveedor..." required>
                  </textarea>
                  <div class="form-text text-muted">
                    Detalle las fortalezas, buenas prácticas y aspectos positivos identificados en el proveedor.
                  </div>
                </div>
              </div>
            </div>

              <!-- Resumen del auditor -->
              <div class="mb-4">
                <div class="card border-0 shadow-sm">
                  <div class="card-body">
                    <label for="resumenAuditor" class="form-label fw-semibold text-dark">
                      Resumen del Hallazgos <span class="text-danger">*</span>
                    </label>
                    <textarea 
                      id="resumenAuditor" 
                      class="form-control" 
                      v-model="formularioInspeccion.resumenAuditor"
                      rows="5"
                      placeholder="Proporcione un resumen ejecutivo de los hallazgos de la auditoría..."
                     required>
                    </textarea>
                    <div class="form-text text-muted">
                      Resuma los aspectos más relevantes encontrados durante la auditoría y su evaluación general.
                    </div>
                  </div>
                </div>
              </div>


              <!-- Recomendaciones -->
              <div class="mb-4">
                <div class="card border-0 shadow-sm">
                  <div class="card-body">
                    <h5 class="mb-4 text-primary">Recomendaciones</h5>
              
                    <!-- Desarrollo de un Plan de Acción -->
                    <div class="mb-3">
                      <!-- <label for="planAccion" class="form-label fw-semibold text-dark">
                        Desarrollo de un Plan de Acción <span class="text-danger">*</span>
                      </label> -->
                      <textarea id="planAccion" class="form-control" v-model="formularioInspeccion.planAccion" rows="4"
                        placeholder="Describa el plan de acción propuesto: acciones correctivas, preventivas y de mejora a implementar..." required>
                      </textarea>
                      <div class="form-text text-muted">
                        Detalle las acciones específicas recomendadas para atender las no conformidades y observaciones identificadas.
                      </div>
                    </div>
              
                    <!-- Responsables -->
                    <!-- <div class="mb-3">
                      <label for="responsables" class="form-label fw-semibold text-dark">
                        Responsables <span class="text-danger">*</span>
                      </label>
                      <input type="text" id="responsables" class="form-control" v-model="formularioInspeccion.responsables"
                        placeholder="Indique los responsables de implementar cada acción (ej: Gerente de Calidad, Coordinador de Producción...)"
                        maxlength="5000" required>
                      <div class="form-text text-muted">
                        Especifique los cargos o nombres de las personas responsables de ejecutar las acciones recomendadas.
                      </div>
                    </div> -->
              
                    <!-- Plazos -->
                    <!-- <div class="mb-3">
                      <label for="plazos" class="form-label fw-semibold text-dark">
                        Plazos <span class="text-danger">*</span>
                      </label>
                      <input type="text" id="plazos" class="form-control" v-model="formularioInspeccion.plazos"
                        placeholder="Establezca los plazos para implementar las acciones (ej: 30 días para acciones críticas, 90 días para mejoras...)"
                        maxlength="5000" required>
                      <div class="form-text text-muted">
                        Define los tiempos límite para la implementación de cada acción, priorizando las no conformidades críticas.
                      </div>
                    </div> -->
              
                    <!-- Recursos -->
                    <!-- <div class="mb-3">
                      <label for="recursos" class="form-label fw-semibold text-dark">
                        Recursos <span class="text-danger">*</span>
                      </label>
                      <textarea id="recursos" class="form-control" v-model="formularioInspeccion.recursos" rows="3"
                        placeholder="Especifique los recursos necesarios: humanos, financieros, materiales, tecnológicos..." required>
                      </textarea>
                      <div class="form-text text-muted">
                        Identifique los recursos requeridos para ejecutar el plan de acción de manera efectiva.
                      </div>
                    </div> -->
              
                  </div>
                </div>
              </div>

              <!-- Conclusiones Generales -->
              <!-- <div class="mb-4">
                <div class="card border-0 shadow-sm">
                  <div class="card-body">
                    <label for="conclusionesGenerales" class="form-label fw-semibold text-dark">
                      Conclusiones Generales
                      <span class="text-danger"></span>
                    </label>
                    <textarea 
                      id="conclusionesGenerales" 
                      class="form-control" 
                      v-model="formularioInspeccion.conclusionesGenerales"
                      rows="5"
                      placeholder="Establezca las conclusiones finales y recomendaciones..."
                      required>
                    </textarea>
                    <div class="form-text text-muted">
                      Proporcione conclusiones definitivas sobre el cumplimiento y recomendaciones para mejoras.
                    </div>
                  </div>
                </div>
              </div> -->

              <!-- Indicador de completitud -->
              <div class="alert alert-info">
                <div class="d-flex align-items-center">
                  <svg class="icon icon-sm me-2 text-info" fill="currentColor" viewBox="0 0 20 20" style="width: 20px; height: 20px;">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                  </svg>
                  <div>
                    <strong>Inspección Final:</strong> 
                    <span v-if="camposInspeccionCompletos" class="text-success ms-2">
                      ✅ Todos los campos están completos ({{contadorCamposCompletos}}/8)
                    </span>
                    <span v-else class="text-warning ms-2">
                      ⚠️ Faltan campos por completar ({{contadorCamposCompletos}}/8)
                    </span>
                  </div>
                </div>
              </div>
            </div>  
  
            <!-- Footer con navegación del formulario -->
            <div class="card-footer bg-light">
              <div class="row align-items-center">
                <div class="col-12 col-md-4 mb-2 mb-md-0">
                  <small class="text-muted fw-medium">
                    <strong>Formulario:</strong> {{ auditoriaActual.empresaNombre }}
                  </small>
                </div>
                <div class="col-12 col-md-8">
                  <div class="d-flex justify-content-md-end gap-2 flex-wrap">
                    <!-- Botón Imprimir Dictamen -->
                    <button class="btn btn-info btn-block" @click="imprimirDictamen" :disabled="formularioInspeccion.fechaAuditoria != '' && formularioInspeccion.auditores != '' && formularioInspeccion.noConformidadesCriticas != '' && formularioInspeccion.noConformidadesMenores != '' && formularioInspeccion.observaciones != '' && formularioInspeccion.fortalezasProveedor != '' && formularioInspeccion.resumenAuditor != '' && formularioInspeccion.planAccion != '' && this.validaBtn === false ? this.estadoBtn = flase : this.estadoBtn = true">
                      <svg class="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20" style="width: 16px; height: 16px;">
                        <path fill-rule="evenodd"
                          d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zM5 14H4v-3h1v3zm1 0v2h6v-2H6zm0-1h8v-3H6v3z"
                          clip-rule="evenodd"></path>
                      </svg>
                      Imprimir Dictamen
                    </button>
                    <button class="btn btn-info btn-block" @click="imprimirDictamenTxt" :disabled="formularioInspeccion.fechaAuditoria != '' && formularioInspeccion.auditores != '' && formularioInspeccion.noConformidadesCriticas != '' && formularioInspeccion.noConformidadesMenores != '' && formularioInspeccion.observaciones != '' && formularioInspeccion.fortalezasProveedor != '' && formularioInspeccion.resumenAuditor != '' && formularioInspeccion.planAccion != '' && this.validaBtn === false ? this.estadoBtn = flase : this.estadoBtn = true">
                      TXT
                    </button>
                    <!-- <button class="btn btn-info btn-block" @click="imprimirDictamen" :disabled="formularioInspeccion.fechaAuditoria != '' && formularioInspeccion.auditores != '' && formularioInspeccion.noConformidadesCriticas != '' && formularioInspeccion.noConformidadesMenores != '' && formularioInspeccion.observaciones != '' && formularioInspeccion.fortalezasProveedor != '' && formularioInspeccion.resumenAuditor != '' && formularioInspeccion.planAccion != '' && formularioInspeccion.responsables != '' && formularioInspeccion.plazos != '' && formularioInspeccion.recursos
                     != '' && this.validaBtn === false ? this.estadoBtn = flase : this.estadoBtn = true">
                      <svg class="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20" style="width: 16px; height: 16px;">
                        <path fill-rule="evenodd"
                          d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zM5 14H4v-3h1v3zm1 0v2h6v-2H6zm0-1h8v-3H6v3z"
                          clip-rule="evenodd"></path>
                      </svg>
                      Imprimir Dictamen
                    </button> -->
                    <!-- <button class="btn btn-info" @click="imprimirDictamen" :disabled="procesandoFormulario">
                      <svg class="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20" style="width: 16px; height: 16px;">
                        <path fill-rule="evenodd"
                          d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zM5 14H4v-3h1v3zm1 0v2h6v-2H6zm0-1h8v-3H6v3z"
                          clip-rule="evenodd"></path>
                      </svg>
                      Imprimir Dictamen
                    </button> -->
            
                    <!-- Botón Cambiar Empresa -->
                    <button class="btn btn-outline-secondary" @click="regresarSeleccion">
                      <svg class="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20" style="width: 16px; height: 16px;">
                        <path fill-rule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clip-rule="evenodd"></path>
                      </svg>
                      Cambiar Empresa
                    </button>
            
                    <!-- Botón Guardar Auditoría -->
                    <button class="btn btn-success" @click="guardarFormulario" :disabled="procesandoFormulario">
                      <span v-if="procesandoFormulario">
                        <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                        Guardando...
                      </span>
                      <span v-else>
                        Guardar Auditoría
                        <svg class="icon icon-xs ms-2" fill="currentColor" viewBox="0 0 20 20" style="width: 16px; height: 16px;">
                          <path
                            d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z">
                          </path>
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Indicador de progreso -->
      <div class="row mt-4">
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-body py-3">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="small text-dark fw-medium">Progreso del proceso de auditoría</span>
                <span class="small text-muted">Paso {{ pasoActual }} de 2</span>
              </div>
              <div class="progress" style="height: 8px;">
                <div class="progress-bar bg-primary" role="progressbar" :style="'width: ' + (pasoActual * 50) + '%'"
                  :aria-valuenow="pasoActual * 50" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </base-layout>
  `,
  data() {
    return {
      // Control de pasos
      pasoActual: 1,
      mostrarFormulario: false,
      auditoriaActual: {},

      // Empresas y búsqueda
      busquedaEmpresa: '',
      empresasDisponibles: [],
      sugerenciasEmpresas: [],
      empresaSeleccionada: {},

      // Estados de UI
      mostrarSugerencias: false,
      cargandoEmpresas: false,
      procesandoFormulario: false,

      // Control de búsqueda
      timeoutBusqueda: null,
      sugerenciaActiva: -1,

      // Validaciones
      errorEmpresa: '',

      // Participantes (para mantener compatibilidad)
      participantes: [
        { id: 1, nombre: '', puesto: '' }
      ],
      // Datos del formulario de auditoría
      formularioAuditoria: {},
      preguntasFormulario: [],
      preguntasAgrupadas: {},
      preguntasPorPaso: {},
      pasoAuditoria: 1,
      totalPasosAuditoria: 1,
      evaluacionesFormulario: {}, // propiedad para las evaluaciones
      cargandoFormulario: false,

      //Gestión de archivos por pregunta
      archivosPorPregunta: {}, // Objeto que contendrá arrays de archivos por ID de pregunta
      isDraggingPregunta: null, // ID de la pregunta sobre la que se está arrastrando
      archivosEnServidorPorPregunta: {}, // Para trackear archivos subidos al servido
      
      //Validación btnm Imprimir
      validaBtn: false,
      estadoBtn: false,

      // Objeto para formulario de inspección final
      formularioInspeccion: {
        fechaAuditoria: '',
        auditores: '',
        noConformidadesCriticas: '',
        noConformidadesMenores: '',
        observaciones: '',
        fortalezasProveedor: '',
        resumenAuditor: '',
        conclusionesGenerales: '',
        planAccion: '',
        responsables: '',
        plazos: '',
        recursos: '',        
      }
    };
  },
  computed: {

    // Verificar si todos los campos de inspección están completos
    camposInspeccionCompletos() {
      const campos = this.formularioInspeccion;
      return campos.fechaAuditoria.trim() !== '' &&
        campos.auditores.trim() !== '' &&
        campos.noConformidadesCriticas.trim() !== '' &&
        campos.noConformidadesMenores.trim() !== '' &&
        campos.observaciones.trim() !== '' &&
        campos.fortalezasProveedor.trim() !== '' &&
        campos.resumenAuditor.trim() !== '' &&
        campos.conclusionesGenerales.trim() !== '';
    },

    // Contador de campos completos
    contadorCamposCompletos() {
      const campos = this.formularioInspeccion;
      let contador = 0;
      if (campos.fechaAuditoria.trim() !== '') contador++;
      if (campos.auditores.trim() !== '') contador++;
      if (campos.noConformidadesCriticas.trim() !== '') contador++;
      if (campos.noConformidadesMenores.trim() !== '') contador++;
      if (campos.observaciones.trim() !== '') contador++;
      if (campos.fortalezasProveedor.trim() !== '') contador++;  // AGREGAR ESTA LÍNEA
      if (campos.resumenAuditor.trim() !== '') contador++;
      if (campos.planAccion.trim() !== '') contador++;
      if (campos.responsables.trim() !== '') contador++;
      if (campos.plazos.trim() !== '') contador++;
      if (campos.recursos.trim() !== '') contador++;       
      return contador;
    }


  },
  methods: {
    repartirPreguntasEnPasos() {
      const preguntas = this.preguntasFormulario;
      this.preguntasPorPaso = {}; // Reset
      this.preguntasPorPaso[1] = preguntas.slice(0, 41);
      this.preguntasPorPaso[2] = preguntas.slice(41, 57);
      this.preguntasPorPaso[3] = preguntas.slice(57, 77);
      this.preguntasPorPaso[4] = preguntas.slice(77, 86);

      // Filter out empty steps
      this.preguntasPorPaso = Object.fromEntries(
        Object.entries(this.preguntasPorPaso).filter(([_, v]) => v.length > 0)
      );

      this.totalPasosAuditoria = Object.keys(this.preguntasPorPaso).length;
    },

    agruparPreguntas(preguntas) {
      const preguntasAgrupadas = {};
      if (!preguntas) return preguntasAgrupadas;
      preguntas.forEach(pregunta => {
        const categoria = pregunta.categoria;
        if (!preguntasAgrupadas[categoria]) {
          preguntasAgrupadas[categoria] = [];
        }
        preguntasAgrupadas[categoria].push(pregunta);
      });
      return preguntasAgrupadas;
    },

    cambiarPasoAuditoria(paso) {
      if (paso > 0 && paso <= this.totalPasosAuditoria) {
        this.pasoAuditoria = paso;
        this.preguntasAgrupadas = this.agruparPreguntas(this.preguntasPorPaso[this.pasoAuditoria]);
        window.scrollTo(0, 0);
      }
    },

    // Cargar empresas desde la base de datos
    async cargarEmpresas() {
      try {
        this.cargandoEmpresas = true;

        const response = await axios.post('../proCorsec/auditoria/auditoria.app', {
          opcion: 1 // Obtener lista de empresas
        });

        if (response.data.success) {
          this.empresasDisponibles = response.data.empresas;
        } else {
          throw new Error(response.data.message || 'Error al cargar empresas');
        }

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudieron cargar las empresas. Verifique la conexión.'
        });

      } finally {
        this.cargandoEmpresas = false;
      }
    },

    // Buscar empresas con autocompletado
    buscarEmpresas() {
      // Limpiar timeout anterior
      if (this.timeoutBusqueda) {
        clearTimeout(this.timeoutBusqueda);
      }

      // Limpiar empresa seleccionada si se modifica el texto
      if (this.empresaSeleccionada.id &&
        this.busquedaEmpresa !== this.empresaSeleccionada.nomEmpresa) {
        this.empresaSeleccionada = {};
        this.errorEmpresa = '';
      }

      // Si el texto es muy corto, limpiar sugerencias
      if (this.busquedaEmpresa.length < 2) {
        this.sugerenciasEmpresas = [];
        return;
      }

      // Buscar con delay para evitar muchas peticiones
      this.timeoutBusqueda = setTimeout(() => {
        this.filtrarEmpresas();
      }, 300);
    },

    // Filtrar empresas localmente
    filtrarEmpresas() {
      if (this.busquedaEmpresa.length < 2) {
        this.sugerenciasEmpresas = [];
        return;
      }

      const termino = this.busquedaEmpresa.toLowerCase();
      this.sugerenciasEmpresas = this.empresasDisponibles
        .filter(empresa =>
          empresa.nomEmpresa.toLowerCase().includes(termino) ||
          (empresa.rfc && empresa.rfc.toLowerCase().includes(termino))
        )
        .slice(0, 10); // Limitar a 10 resultados

      this.sugerenciaActiva = -1;
    },

    // Seleccionar una empresa de las sugerencias
    seleccionarEmpresa(empresa) {
      this.empresaSeleccionada = { ...empresa };
      this.busquedaEmpresa = empresa.nomEmpresa;
      this.sugerenciasEmpresas = [];
      this.mostrarSugerencias = false;
      this.errorEmpresa = '';

      // Feedback visual
      Swal.fire({
        icon: 'success',
        title: 'Empresa seleccionada',
        text: `${empresa.nomEmpresa} ha sido seleccionada`,
        timer: 1500,
        showConfirmButton: false
      });
    },

    // Ocultar sugerencias con delay
    ocultarSugerencias() {
      setTimeout(() => {
        this.mostrarSugerencias = false;
      }, 150);
    },

    // Validar selección de empresa
    validarEmpresa() {
      if (!this.empresaSeleccionada.id) {
        this.errorEmpresa = 'Debe seleccionar una empresa de la lista';
        return false;
      }

      this.errorEmpresa = '';
      return true;
    },

    // Continuar al siguiente paso
    async continuarSiguiente() {
      // Validar formulario
      if (!this.validarEmpresa()) {
        Swal.fire({
          icon: 'warning',
          title: 'Empresa requerida',
          text: 'Debe seleccionar una empresa antes de continuar'
        });
        return;
      }

      this.procesandoFormulario = true;

      try {
        const correoUsuario = this.obtenerCorreoUsuario();
        if (!correoUsuario) {
          throw new Error('No se pudo obtener el correo del usuario. Verifique que esté logueado.');
        }

        // Guardar selección en base de datos (ahora crea la auditoría)
        const response = await axios.post('../proCorsec/auditoria/auditoria.app', {
          opcion: 5, // Cambiado de 2 a 5
          datos: {
            empresaId: this.empresaSeleccionada.id,
            correo: correoUsuario,
            respuestas: {} // Enviar respuestas vacías para solo crear la auditoría
          }
        });

        if (response.data.success) {
          // Guardar datos en localStorage
          this.auditoriaActual = {
            auditoriaId: response.data.auditoria_id, // Ajustado a la nueva respuesta
            folioAuditoria: response.data.folio, // Ajustado a la nueva respuesta
            empresaId: this.empresaSeleccionada.id,
            empresaNombre: response.data.empresa_nombre, // Usar el nombre de la respuesta
            empresaCorreo: this.empresaSeleccionada.correo,
            empresaTelefono: this.empresaSeleccionada.telefono,
            fechaInicio: new Date().toISOString() // Usar fecha actual
          };

          localStorage.setItem('auditoriaActual', JSON.stringify(this.auditoriaActual));

          // Cambiar al paso 2 y cargar preguntas
          this.pasoActual = 2;
          this.mostrarFormulario = true;

          // Cargar preguntas del formulario
          await this.cargarPreguntasFormulario();

          Swal.fire({
            icon: 'success',
            title: 'Auditoría Iniciada',
            text: 'Formulario de auditoría cargado correctamente',
            timer: 1500,
            showConfirmButton: false
          });

        } else {
          throw new Error(response.data.message || 'Error al iniciar la auditoría');
        }

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al Iniciar Auditoría',
          text: error.message || 'No se pudo registrar la información. Intente nuevamente.'
        });

      } finally {
        this.procesandoFormulario = false;
      }
    },

    // Volver al paso anterior
    volverAnterior() {
      Swal.fire({
        title: '¿Regresar al paso anterior?',
        text: 'Se perderá la información no guardada',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, regresar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          // Navegar al paso anterior
          // this.$router.push('/auditoria/inicio');
        }
      });
    },

    // Métodos de compatibilidad con código anterior
    addParticipant() {
      // Mantener para compatibilidad
    },

    removeParticipant(id) {
      // Mantener para compatibilidad
    },

    // Regresar a la selección de empresa
    regresarSeleccion() {
      Swal.fire({
        title: '¿Cambiar empresa seleccionada?',
        text: 'Se perderá el progreso del formulario actual',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, cambiar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.pasoActual = 1;
          this.mostrarFormulario = false;
          this.empresaSeleccionada = {};
          this.busquedaEmpresa = '';
          this.auditoriaActual = {};
          localStorage.removeItem('auditoriaActual');
        }
      });
    },

    // Cargar preguntas de DB para el formulario de auditoría
    async cargarPreguntasFormulario() {
      try {
        this.cargandoFormulario = true;

        const response = await axios.post('../proCorsec/auditoria/auditoria.app', {
          opcion: 4,
          empresaId: this.auditoriaActual.empresaId,
          auditoriaId: this.auditoriaActual.auditoriaId
        });

        if (response.data.success) {
          this.preguntasFormulario = response.data.preguntas;
          this.repartirPreguntasEnPasos();
          this.preguntasAgrupadas = this.agruparPreguntas(this.preguntasPorPaso[this.pasoAuditoria]);

          // Inicializar respuestas y archivos del formulario principal
          this.respuestasFormulario = response.data.respuestas || {};
          this.evaluacionesFormulario = response.data.evaluaciones || {};
          this.archivosPorPregunta = response.data.archivos || {};
          this.archivosEnServidorPorPregunta = response.data.archivos_servidor || {};

          // Inicializar arrays para cada pregunta
          this.preguntasFormulario.forEach(pregunta => {
          if (!this.respuestasFormulario.hasOwnProperty(pregunta.id)) {
            this.respuestasFormulario[pregunta.id] = '';
          }
          if (!this.evaluacionesFormulario.hasOwnProperty(pregunta.id)) {
            this.evaluacionesFormulario[pregunta.id] = 'null';  // ← STRING "null", no null
          }
          if (!this.evaluacionesFormulario.hasOwnProperty(pregunta.id)) {
            this.evaluacionesFormulario[pregunta.id] = '';
          }
          if (!this.archivosPorPregunta.hasOwnProperty(pregunta.id)) {
            this.archivosPorPregunta[pregunta.id] = [];
          }
          if (!this.archivosEnServidorPorPregunta.hasOwnProperty(pregunta.id)) {
            this.archivosEnServidorPorPregunta[pregunta.id] = [];
          }
          
          // NUEVA LÓGICA: Si la respuesta es "N/A", sincronizar el select con "na"
          const respuesta = this.respuestasFormulario[pregunta.id];
          const evaluacion = this.evaluacionesFormulario[pregunta.id];

          // Caso 1: Si viene evaluación válida de la BD, usarla
          if (evaluacion && evaluacion !== 'null' && evaluacion !== '') {
          }
          // Caso 2: Si NO hay evaluación pero SÍ hay respuesta "N/A"
          else if (respuesta && respuesta.toString().trim().toUpperCase() === 'N/A') {
            this.evaluacionesFormulario[pregunta.id] = 'na';
          }
          // Si la evaluación está vacía/null pero hay respuesta, intentar inferir
          else if (respuesta && (!this.evaluacionesFormulario[pregunta.id] || this.evaluacionesFormulario[pregunta.id] === 'null')) {
            const respuestaStr = respuesta.toString().trim().toLowerCase();
            
            // Detectar "No se presenta evidencia" → evaluación = "0"
            if (respuestaStr === 'no se presenta evidencia' || respuestaStr.includes('no cumple')) {
              this.evaluacionesFormulario[pregunta.id] = '0';
            }
            // Detectar frases de cumplimiento parcial
            else if (respuestaStr.includes('parcialmente') || respuestaStr.includes('cumple parcialmente')) {
              this.evaluacionesFormulario[pregunta.id] = '0.5';
            }
            // Detectar frases de cumplimiento total
            else if (respuestaStr.includes('cumple satisfactoriamente') || respuestaStr.includes('sí,')) {
              this.evaluacionesFormulario[pregunta.id] = '1';
            }
          }
        });

          // NUEVO: Cargar conclusiones existentes desde cuncluciones.app
          await this.cargarConclusionesExistentes();

        } else {
          throw new Error(response.data.message);
        }

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar formulario',
          text: 'No se pudieron cargar las preguntas del formulario'
        });
      } finally {
        this.cargandoFormulario = false;
      }
    },

    async cargarConclusionesExistentes() {
      try {
        if (!this.auditoriaActual.folioAuditoria || !this.auditoriaActual.empresaId) {
          console.log('No hay folio o empresaId, saltando carga de conclusiones');
          return;
        }

        console.log('Cargando conclusiones para folio:', this.auditoriaActual.folioAuditoria, 'empresa:', this.auditoriaActual.empresaId);

        const response = await axios.post('../proCorsec/auditoria/cunclucionesAuditoria/cunclucionesAuditoria.php', {
          opcion: 2,
          folio: this.auditoriaActual.folioAuditoria,
          empresaId: this.auditoriaActual.empresaId  // AGREGAR VALIDACIÓN POR EMPRESA
        }, {
          timeout: 10000
        });

        if (response.data && response.data.success) {
          if (response.data.conclusiones) {
            const conclusiones = response.data.conclusiones;

            // VALIDAR QUE LAS CONCLUSIONES CORRESPONDAN A LA EMPRESA ACTUAL
            if (conclusiones.empresa_id && conclusiones.empresa_id != this.auditoriaActual.empresaId) {
              console.log('Las conclusiones no corresponden a la empresa actual, limpiando formulario');
              this.formularioInspeccion = {
                fechaAuditoria: '',
                auditores: '',
                noConformidadesCriticas: '',
                noConformidadesMenores: '',
                observaciones: '',
                fortalezasProveedor: '',
                resumenAuditor: '',
                conclusionesGenerales: '',
                planAccion: '',
                responsables: '',
                plazos: '',
                recursos: ''
              };
              return;
            }

            this.formularioInspeccion = {
              fechaAuditoria: this.formatearFechaParaInput(conclusiones.fecha_auditoria || ''),
              auditores: conclusiones.auditores || '',
              noConformidadesCriticas: conclusiones.no_conformidades_criticas || '',
              noConformidadesMenores: conclusiones.no_conformidades_menores || '',
              observaciones: conclusiones.observaciones || '',
              fortalezasProveedor: conclusiones.fortalezas_proveedor || '',
              resumenAuditor: conclusiones.resumen_auditor || '',
              conclusionesGenerales: conclusiones.conclusiones_generales || '',
              planAccion: conclusiones.plan_accion || '',
              responsables: conclusiones.responsables || '',
              plazos: conclusiones.plazos || '',
              recursos: conclusiones.recursos || ''
            };

            console.log('Conclusiones cargadas exitosamente');
          } else {
            console.log('No hay conclusiones previas para esta auditoría');
            // LIMPIAR FORMULARIO SI NO HAY CONCLUSIONES
            this.formularioInspeccion = {
              fechaAuditoria: '',
              auditores: '',
              noConformidadesCriticas: '',
              noConformidadesMenores: '',
              observaciones: '',
              fortalezasProveedor: '',
              resumenAuditor: '',
              conclusionesGenerales: '',
              planAccion: '',
              responsables: '',
              plazos: '',
              recursos: ''
            };
          }
        }

      } catch (error) {
        console.error('Error al cargar conclusiones existentes:', error);
        // EN CASO DE ERROR, LIMPIAR EL FORMULARIO
        this.formularioInspeccion = {
          fechaAuditoria: '',
          auditores: '',
          noConformidadesCriticas: '',
          noConformidadesMenores: '',
          observaciones: '',
          fortalezasProveedor: '',
          resumenAuditor: '',
          conclusionesGenerales: '',
          planAccion: '',
          responsables: '',
          plazos: '',
          recursos: ''
        };
      }
    },

    // Activar input de archivo para una pregunta específica
    clickFileInputPregunta(preguntaId) {
      const fileInput = document.getElementById('fileInputPregunta' + preguntaId);
      if (fileInput) {
        fileInput.click();
      }
    },

    // Manejar selección de archivos mediante input
    async handleFileSelectPregunta(e, preguntaId) {
      const files = Array.from(e.target.files);
      await this.procesarArchivosPregunta(files, preguntaId);
      e.target.value = '';
    },

    // Manejar drop de archivos
    async handleDropPregunta(e, preguntaId) {
      this.isDraggingPregunta = null;
      const files = Array.from(e.dataTransfer.files);
      await this.procesarArchivosPregunta(files, preguntaId);
    },

    // Manejar eventos de drag
    handleDragLeavePregunta(e, preguntaId) {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        this.isDraggingPregunta = null;
      }
    },

    manejarTeclas(e) {
      // Manejar navegación con teclas en sugerencias si es necesario
      if (this.mostrarSugerencias && this.sugerenciasEmpresas.length > 0) {
        // Lógica para navegación con teclas (opcional)
      }
    },

    // Respuestas auto
    async manejarCambioEvaluacion(preguntaId) {
      const valorEvaluacion = this.evaluacionesFormulario[preguntaId];

      const valorStr = String(valorEvaluacion);

      if (!valorEvaluacion || valorStr === 'null' || valorStr === 'undefined') {
        this.respuestasFormulario[preguntaId] = '';
        this.$forceUpdate();  // ← FORZAR ACTUALIZACIÓN
        return;
      }

      let respuestaAutomatica = '';

      if (valorStr === 'na') {
        respuestaAutomatica = 'N/A';
        this.respuestasFormulario[preguntaId] = respuestaAutomatica;
        this.$forceUpdate();  // ← FORZAR ACTUALIZACIÓN
        return;
      }

      if (valorStr === '0') {
        respuestaAutomatica = 'No se presenta evidencia';
        this.respuestasFormulario[preguntaId] = respuestaAutomatica;
        this.$forceUpdate();  // ← FORZAR ACTUALIZACIÓN
        return;
      }

      if (valorStr === '0.5') {

        try {
          const response = await axios.post('../proCorsec/auditoria/auditoria.app', {
            opcion: 8,
            preguntaId: parseInt(preguntaId),
            tipoEvaluacion: 'parcialmente'
          });

          if (response.data.success) {
            respuestaAutomatica = response.data.respuesta;
          } else {
            respuestaAutomatica = 'Cumple parcialmente con los requisitos';
          }
        } catch (error) {
          respuestaAutomatica = 'Cumple parcialmente con los requisitos';
        }

        this.respuestasFormulario[preguntaId] = respuestaAutomatica;
        this.$forceUpdate();  // ← FORZAR ACTUALIZACIÓN
        return;
      }

      if (valorStr === '1') {

        try {
          const response = await axios.post('../proCorsec/auditoria/auditoria.app', {
            opcion: 8,
            preguntaId: parseInt(preguntaId),
            tipoEvaluacion: 'cumple'
          });

          if (response.data.success) {
            respuestaAutomatica = response.data.respuesta;
          } else {
            respuestaAutomatica = 'Cumple satisfactoriamente con los requisitos';
          }
        } catch (error) {
          respuestaAutomatica = 'Cumple satisfactoriamente con los requisitos';
        }

        this.respuestasFormulario[preguntaId] = respuestaAutomatica;
        this.$forceUpdate();  // ← FORZAR ACTUALIZACIÓN
        return;
      }

    },

    // Procesar archivos para una pregunta específica
    async procesarArchivosPregunta(files, preguntaId) {
      if (!this.auditoriaActual.empresaNombre) {
        Swal.fire({
          icon: 'warning',
          title: 'Datos requeridos',
          text: 'Debe tener una empresa seleccionada antes de subir archivos'
        });
        return;
      }

      // Asegurar que el array existe
      if (!this.archivosPorPregunta[preguntaId]) {
        this.$set(this.archivosPorPregunta, preguntaId, []);
      }

      const archivosValidos = [];
      for (const file of files) {
        if (this.validarArchivo(file)) {
          archivosValidos.push(file);
        }
      }

      if (archivosValidos.length === 0) {
        return;
      }

      // Mostrar progreso
      Swal.fire({
        title: `Subiendo ${archivosValidos.length} archivo(s)...`,
        html: '<div id="upload-progress">Preparando...</div>',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      let exitosos = 0;
      let fallidos = 0;

      for (let i = 0; i < archivosValidos.length; i++) {
        const archivo = archivosValidos[i];

        try {
          // Actualizar progreso
          const progressElement = document.getElementById('upload-progress');
          if (progressElement) {
            progressElement.innerHTML = `Subiendo ${archivo.name} (${i + 1}/${archivosValidos.length})`;
          }

          const archivoIndex = this.archivosPorPregunta[preguntaId].length;
          const tipoDocumento = `pregunta_${preguntaId}_archivo_${archivoIndex + 1}`;

          const exito = await this.subirArchivoPregunta(archivo, tipoDocumento, preguntaId, archivoIndex);

          if (exito) {
            this.archivosPorPregunta[preguntaId].push(archivo);
            exitosos++;
          } else {
            fallidos++;
          }
        } catch (error) {
          fallidos++;
        }
      }

      // Mostrar resultado final
      if (exitosos > 0 && fallidos === 0) {
        Swal.fire({
          icon: 'success',
          title: '¡Archivos subidos!',
          text: `Se subieron ${exitosos} archivo(s) correctamente`,
          timer: 2000,
          showConfirmButton: false
        });
      } else if (exitosos > 0 && fallidos > 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Subida parcial',
          text: `${exitosos} archivo(s) subidos, ${fallidos} fallaron`
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error en subida',
          text: 'No se pudo subir ningún archivo. Revise la consola para más detalles.'
        });
      }
    },

    // Subir archivo individual para una pregunta
    async subirArchivoPregunta(archivo, tipoDocumento, preguntaId, archivoIndex) {
      try {
        // Validar que tenemos los datos necesarios
        if (!this.auditoriaActual.auditoriaId) {
          throw new Error('No hay auditoría activa');
        }

        const formData = new FormData();
        formData.append('archivo', archivo);
        formData.append('opcion', 6); // Nueva opción para subir archivos de auditoría
        formData.append('tipoDocumento', tipoDocumento);
        formData.append('auditoriaId', this.auditoriaActual.auditoriaId);
        formData.append('empresaId', this.auditoriaActual.empresaId);
        formData.append('empresaNombre', this.auditoriaActual.empresaNombre);
        formData.append('preguntaId', preguntaId.toString());
        formData.append('archivoIndex', archivoIndex.toString());

        // Usar el endpoint existente de auditoría
        const response = await axios.post('../proCorsec/auditoria/auditoria.app', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000
        });

        // Verificar la respuesta
        if (response.data && response.data.success) {
          // Guardar información del archivo en el servidor
          if (!this.archivosEnServidorPorPregunta[preguntaId]) {
            this.$set(this.archivosEnServidorPorPregunta, preguntaId, []);
          }

          this.archivosEnServidorPorPregunta[preguntaId][archivoIndex] = {
            rutaServidor: response.data.rutaArchivo,
            nombreArchivo: response.data.nombreArchivo || archivo.name,
            tipoDocumento: tipoDocumento,
            fechaSubida: new Date().toISOString(),
            id: response.data.archivoId || null
          };

          return true;

        } else {
          throw new Error(response.data.message || 'Error del servidor');
        }

      } catch (error) {
        return false;
      }
    },

    // Eliminar archivo de una pregunta específica
    async eliminarArchivoPregunta(preguntaId, archivoIndex) {
      try {
        const archivo = this.archivosPorPregunta[preguntaId][archivoIndex];
        if (!archivo) return;

        const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: `Se eliminará: ${archivo.name}`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
          const archivoServidor = this.archivosEnServidorPorPregunta[preguntaId]?.[archivoIndex];

          if (archivoServidor && archivoServidor.id) {
            // Usar opción 7 para eliminar del servidor
            await axios.post('../proCorsec/auditoria/auditoria.app', {
              opcion: 7,
              archivoId: archivoServidor.id
            });
          }

          // Eliminar del array local
          this.archivosPorPregunta[preguntaId].splice(archivoIndex, 1);
          if (this.archivosEnServidorPorPregunta[preguntaId]) {
            this.archivosEnServidorPorPregunta[preguntaId].splice(archivoIndex, 1);
          }

          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'El archivo ha sido eliminado correctamente',
            timer: 1500,
            showConfirmButton: false
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al eliminar el archivo'
        });
      }
    },

    // Validar archivo (reutilizado del componente original)
    validarArchivo(file) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];

      if (file.size > maxSize) {
        Swal.fire({
          icon: 'error',
          title: 'Archivo muy grande',
          text: `El archivo ${file.name} excede el tamaño máximo de 10MB`
        });
        return false;
      }

      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Tipo de archivo no permitido',
          text: `El archivo ${file.name} no es un tipo de archivo válido`
        });
        return false;
      }

      return true;
    },

    // Ver archivo (reutilizado del componente original)
    verArchivo(archivo) {
      if (archivo.existeEnServidor) {
        const baseUrl = '/proCorsec'; // Directorio raíz del proyecto
        const urlEndpoint = `${baseUrl}${archivo.webPath}`;
        window.open(urlEndpoint, '_blank');
      } else {
        const url = URL.createObjectURL(archivo);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }
    },

    // Formatear tamaño de archivo (reutilizado del componente original)
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },

    obtenerCorreoUsuario() {
      // Opción 1 (Preferida): Desde el gestor de permisos
      if (typeof userPermissions !== 'undefined' && userPermissions.user && userPermissions.user.correo) {
        console.log('Correo obtenido desde userPermissions:', userPermissions.user.correo);
        return userPermissions.user.correo;
      }

      // Opción 2 (Fallback): Desde localStorage directamente
      const correo = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
      if (correo) {
        console.log('Correo obtenido desde localStorage/sessionStorage:', correo);
        return correo;
      }

      // Opción 3 (Fallback más profundo): Intentar parsear 'userData'
      const userDataString = localStorage.getItem('userData');
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          if (userData && userData.correo) {
            console.log('Correo obtenido desde "userData" en localStorage:', userData.correo);
            return userData.correo;
          }
        } catch (e) {
          console.error('Error al parsear userData desde localStorage', e);
        }
      }

      console.log('No se pudo obtener el correo del usuario.');
      return null;
    },

    // Guardar formulario completo de auditoría
    async guardarFormulario() {
      this.procesandoFormulario = true;

      try {
        // Validaciones existentes
        if (!this.auditoriaActual.auditoriaId) {
          throw new Error('No hay una auditoría activa');
        }

        if (!this.auditoriaActual.folioAuditoria) {
          throw new Error('No se encontró el folio de la auditoría');
        }

        const correoUsuario = this.obtenerCorreoUsuario();
        if (!correoUsuario) {
          throw new Error('No se pudo obtener el correo del usuario. Verifique que esté logueado.');
        }

        const respuestasValidas = Object.keys(this.respuestasFormulario).filter(
          key => this.respuestasFormulario[key] && this.respuestasFormulario[key].toString().trim() !== ''
        );

        if (respuestasValidas.length === 0) {
          throw new Error('Debe responder al menos una pregunta antes de guardar');
        }

        // Mostrar loading
        Swal.fire({
          title: 'Guardando auditoría completa...',
          html: '<div id="save-progress">Preparando datos...</div>',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // PASO 1: Guardar formulario principal (auditoria.app)
        const progressElement = document.getElementById('save-progress');
        if (progressElement) {
          progressElement.innerHTML = 'Guardando formulario principal...';
        }

        const datosFormularioPrincipal = {
          opcion: 5,
          datos: {
            folio: this.auditoriaActual.folioAuditoria,
            correo: correoUsuario,
            auditoriaId: this.auditoriaActual.auditoriaId,
            empresaId: this.auditoriaActual.empresaId,
            empresaNombre: this.auditoriaActual.empresaNombre,
            respuestas: this.respuestasFormulario,
            evaluaciones: this.evaluacionesFormulario,
            archivos: this.archivosEnServidorPorPregunta
          }
        };

        const responseFormulario = await axios.post('../proCorsec/auditoria/auditoria.app', datosFormularioPrincipal, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000
        });

        if (!responseFormulario.data || !responseFormulario.data.success) {
          throw new Error(responseFormulario.data?.message || 'Error al guardar formulario principal');
        }

        // PASO 2: Guardar conclusiones (cunclucionesAuditoria.php)
        if (progressElement) {
          progressElement.innerHTML = 'Guardando conclusiones de auditoría...';
        }

        const datosConclusiones = {
          opcion: 1,
          auditoriaId: this.auditoriaActual.auditoriaId,
          empresaId: this.auditoriaActual.empresaId,
          folio: this.auditoriaActual.folioAuditoria,
          empresaNombre: this.auditoriaActual.empresaNombre,
          correo: correoUsuario,
          fechaAuditoria: this.formatearFechaParaAlmacenar(this.formularioInspeccion.fechaAuditoria),
          auditores: this.formularioInspeccion.auditores,
          noConformidadesCriticas: this.formularioInspeccion.noConformidadesCriticas,
          noConformidadesMenores: this.formularioInspeccion.noConformidadesMenores,
          observaciones: this.formularioInspeccion.observaciones,
          fortalezasProveedor: this.formularioInspeccion.fortalezasProveedor,
          resumenAuditor: this.formularioInspeccion.resumenAuditor,
          conclusionesGenerales: this.formularioInspeccion.conclusionesGenerales,
          planAccion: this.formularioInspeccion.planAccion,
          responsables: this.formularioInspeccion.responsables,
          plazos: this.formularioInspeccion.plazos,
          recursos: this.formularioInspeccion.recursos,
          fechaGuardado: new Date().toISOString(),
          totalPreguntas: this.preguntasFormulario.length,
          preguntasRespondidas: respuestasValidas.length
        };

        const responseConclusiones = await axios.post('../proCorsec/auditoria/cunclucionesAuditoria/cunclucionesAuditoria.php',
          datosConclusiones,
          {
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 30000
          }
        );

        if (!responseConclusiones.data || !responseConclusiones.data.success) {
          throw new Error(responseConclusiones.data?.message || 'Error al guardar conclusiones');
        }

        // ÉXITO: Ambos procesos completados
        await Swal.fire({
          icon: 'success',
          title: 'Auditoría guardada completamente',
          html: `
        <div class="text-start">
          <p><strong>✅ Formulario principal:</strong> Guardado correctamente</p>
          <p><strong>✅ Conclusiones:</strong> ${responseConclusiones.data.accion_realizada === 'actualizado' ? 'Actualizadas' : 'Guardadas'} correctamente</p>
          <p><strong>Folio:</strong> ${responseFormulario.data.folio || this.auditoriaActual.folioAuditoria}</p>
          <p><strong>Preguntas respondidas:</strong> ${respuestasValidas.length}/${this.preguntasFormulario.length}</p>
        </div>
      `,
          confirmButtonText: 'Aceptar'
        });

        // Limpiar datos locales
        localStorage.removeItem('auditoriaActual');
        this.resetearFormulario();
        // Swal.close();

      } catch (error) {
        console.error('Error al guardar auditoría completa:', error);

        // Cerrar loading si está activo
        if (Swal.isVisible()) {
          Swal.close();
        }

        let mensajeError = 'No se pudo guardar la auditoría completa';
        let detalleError = '';

        if (error.response) {
          mensajeError = error.response.data?.message || `Error del servidor: ${error.response.status}`;
          detalleError = error.response.data?.error_code ? `Código: ${error.response.data.error_code}` : '';
        } else if (error.request) {
          mensajeError = 'Error de conexión. Verifique su conexión a internet.';
        } else {
          mensajeError = error.message;
        }

        await Swal.fire({
          icon: 'error',
          title: 'Error al guardar',
          html: `
        <p>${mensajeError}</p>
        ${detalleError ? `<small class="text-muted">${detalleError}</small>` : ''}
      `,
          confirmButtonText: 'Intentar de nuevo'
        });

      } finally {
        this.procesandoFormulario = false;
      }
    },

    // Método para resetear el formulario después de guardar
    resetearFormulario() {
      this.pasoActual = 1;
      this.mostrarFormulario = false;
      this.empresaSeleccionada = {};
      this.busquedaEmpresa = '';
      this.auditoriaActual = {};
      this.respuestasFormulario = {};
      this.evaluacionesFormulario = {};
      this.archivosPorPregunta = {};
      this.archivosEnServidorPorPregunta = {};

      // AGREGAR ESTA LIMPIEZA COMPLETA DEL FORMULARIO DE INSPECCIÓN
      this.formularioInspeccion = {
        fechaAuditoria: '',
        auditores: '',
        noConformidadesCriticas: '',
        noConformidadesMenores: '',
        observaciones: '',
        fortalezasProveedor: '',
        resumenAuditor: '',
        conclusionesGenerales: '',
        planAccion: '',
        responsables: '',
        plazos: '',
        recursos: ''
      };
    },

    // Método mejorado para obtener correo del usuario
    obtenerCorreoUsuario() {
      try {
        // Opción 1 (Preferida): Desde el gestor de permisos
        if (typeof userPermissions !== 'undefined' && userPermissions.user && userPermissions.user.correo) {
          console.log('Correo obtenido desde userPermissions:', userPermissions.user.correo);
          return userPermissions.user.correo;
        }

        // Opción 2 (Fallback): Desde localStorage directamente
        const correo = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
        if (correo && correo.trim() !== '') {
          console.log('Correo obtenido desde localStorage/sessionStorage:', correo);
          return correo.trim();
        }

        // Opción 3 (Fallback más profundo): Intentar parsear 'userData'
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
          try {
            const userData = JSON.parse(userDataString);
            if (userData && userData.correo && userData.correo.trim() !== '') {
              console.log('Correo obtenido desde "userData" en localStorage:', userData.correo);
              return userData.correo.trim();
            }
          } catch (e) {
            console.error('Error al parsear userData desde localStorage', e);
          }
        }

        console.warn('No se pudo obtener el correo del usuario.');
        return null;

      } catch (error) {
        console.error('Error en obtenerCorreoUsuario:', error);
        return null;
      }
    },

    // Método para imprimir dictamen
    async imprimirDictamen() {
      try {
        // Validar que existe una auditoría activa
        if (!this.auditoriaActual.auditoriaId) {
          Swal.fire({
            icon: 'warning',
            title: 'Sin auditoría activa',
            text: 'Debe tener una auditoría en curso para generar el dictamen'
          });
          return;
        }

        // Validar que hay respuestas en el formulario
        const respuestasCount = Object.keys(this.respuestasFormulario || {}).filter(
          key => this.respuestasFormulario[key] && this.respuestasFormulario[key].toString().trim() !== ''
        ).length;

        if (respuestasCount === 0) {
          Swal.fire({
            icon: 'warning',
            title: 'Formulario incompleto',
            text: 'Debe completar al menos algunas preguntas antes de generar el dictamen'
          });
          return;
        }

        // Mostrar loading
        Swal.fire({
          title: 'Generando dictamen...',
          text: 'Por favor espere mientras se genera el documento',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Preparar datos para generar dictamen
        const datosImprimir = {
          opcion: 1,
          auditoriaId: this.auditoriaActual.auditoriaId,
          empresaId: this.auditoriaActual.empresaId,
          folio: this.auditoriaActual.folioAuditoria,
          // Incluir datos adicionales que podría necesitar el dictamen
          empresaNombre: this.auditoriaActual.empresaNombre,
          fechaAuditoria: this.auditoriaActual.fechaInicio || new Date().toISOString()
        };

        // Llamar al servidor para generar dictamen
        const response = await axios.post('../proCorsec/auditoria/impreAuditoria/auditoria.app', datosImprimir, {
          responseType: 'blob',
          timeout: 60000 // Aumentar timeout para generación de PDF
        });

        // Verificar que la respuesta sea un PDF válido
        if (response.data.size === 0) {
          throw new Error('El archivo PDF generado está vacío');
        }

        // Cerrar loading
        Swal.close();

        // Crear URL del archivo
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        // Crear nombre del archivo más limpio
        const nombreEmpresa = this.auditoriaActual.empresaNombre
          .replace(/[^a-zA-Z0-9\s]/g, '') // Remover caracteres especiales
          .replace(/\s+/g, '_')
          .substring(0, 30); // Limitar longitud

        const fechaActual = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const nombreArchivo = `Dictamen_${this.auditoriaActual.folioAuditoria}_${nombreEmpresa}_${fechaActual}.pdf`;

        // Crear enlace temporal para descarga
        const link = document.createElement('a');
        link.href = url;
        link.download = nombreArchivo;

        // Simular click para descargar
        document.body.appendChild(link);
        link.click();

        // Limpiar inmediatamente el enlace
        document.body.removeChild(link);

        // Abrir en nueva ventana para vista previa
        const viewerWindow = window.open(url, '_blank');

        if (!viewerWindow) {
          Swal.fire({
            icon: 'info',
            title: 'Dictamen generado',
            text: `El dictamen "${nombreArchivo}" se ha descargado. Si no se abrió automáticamente, revise su carpeta de descargas.`
          });
        } else {
          // Limpiar URL después de un tiempo prudente
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 5000);
        }

      } catch (error) {
        console.error('Error al generar dictamen:', error);

        // Cerrar loading si está activo
        if (Swal.isVisible()) {
          Swal.close();
        }

        let mensajeError = 'No se pudo generar el dictamen';

        if (error.response) {
          // Manejar diferentes códigos de error específicos
          switch (error.response.status) {
            case 404:
              mensajeError = 'No se encontraron datos suficientes para generar el dictamen';
              break;
            case 500:
              mensajeError = 'Error interno del servidor al generar el dictamen';
              break;
            case 403:
              mensajeError = 'No tiene permisos para generar este dictamen';
              break;
            default:
              mensajeError = error.response.data?.message || `Error del servidor: ${error.response.status}`;
          }
        } else if (error.request) {
          mensajeError = 'Error de conexión. Verifique su conexión a internet.';
        } else if (error.code === 'ECONNABORTED') {
          mensajeError = 'Timeout: La generación del dictamen está tomando demasiado tiempo';
        } else {
          mensajeError = error.message || 'Error desconocido';
        }

        Swal.fire({
          icon: 'error',
          title: 'Error al generar dictamen',
          text: mensajeError,
          confirmButtonText: 'Entendido'
        });
      }
    },

    async imprimirDictamenTxt() {
      try {
        // Validaciones (las mantienes igual)
        if (!this.auditoriaActual.auditoriaId) {
          Swal.fire({
            icon: 'warning',
            title: 'Sin auditoría activa',
            text: 'Debe tener una auditoría en curso para generar el dictamen'
          });
          return;
        }

        const respuestasCount = Object.keys(this.respuestasFormulario || {}).filter(
          key => this.respuestasFormulario[key] && this.respuestasFormulario[key].toString().trim() !== ''
        ).length;

        if (respuestasCount === 0) {
          Swal.fire({
            icon: 'warning',
            title: 'Formulario incompleto',
            text: 'Debe completar al menos algunas preguntas antes de generar el dictamen'
          });
          return;
        }

        // Preparar datos para enviar
        const datosImprimir = {
          opcion: 1,
          auditoriaId: this.auditoriaActual.auditoriaId,
          empresaId: this.auditoriaActual.empresaId,
          folio: this.auditoriaActual.folioAuditoria,
          empresaNombre: this.auditoriaActual.empresaNombre,
          fechaAuditoria: this.auditoriaActual.fechaInicio || new Date().toISOString()
        };

        // ✅ ENVIAR COMO JSON en lugar de form data
        const response = await fetch('../proCorsec/auditoria/impreAuditoriaTxt/auditoria.app', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'  // ← CRÍTICO
          },
          body: JSON.stringify(datosImprimir)  // ← Convertir a JSON
        });

        // Verificar respuesta
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        // Obtener el texto plano del dictamen
        const texto = await response.text();
        
        // Abrir en nueva ventana o descargar
        const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');

      } catch (error) {
        console.error('Error al generar dictamen:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo generar el dictamen. Intente nuevamente.'
        });
      }
    },

    // Formatear fecha de DD-MM-YYYY a YYYY-MM-DD para input date
    formatearFechaParaInput(fechaTexto) {
      if (!fechaTexto || fechaTexto.trim() === '') return '';

      try {
        const partes = fechaTexto.split('-');
        if (partes.length === 3) {
          const [dia, mes, año] = partes;
          return `${año}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
        }
        return '';
      } catch (error) {
        return '';
      }
    },

    // Formatear fecha de YYYY-MM-DD a DD-MM-YYYY para almacenar
    formatearFechaParaAlmacenar(fechaInput) {
      if (!fechaInput || fechaInput.trim() === '') return '';

      try {
        const [año, mes, dia] = fechaInput.split('-');
        return `${dia}-${mes}-${año}`;
      } catch (error) {
        return '';
      }
    },
    
    irAlFinal() {
      // Opción 1: Scroll suave hasta el final
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    },

  },
  created() {
    // Inicialización si es necesaria
  },
  mounted() {
    // Cargar empresas al iniciar el componente
    this.cargarEmpresas();

    // Verificar si hay una auditoría en progreso
    const auditoriaGuardada = localStorage.getItem('auditoriaActual');
    if (auditoriaGuardada) {
      try {
        this.auditoriaActual = JSON.parse(auditoriaGuardada);
        this.pasoActual = 2;
        this.mostrarFormulario = true;

        // Cargar preguntas si estamos en el paso 2
        this.cargarPreguntasFormulario();
      } catch (error) {
        localStorage.removeItem('auditoriaActual');
      }
    }


    // Manejar teclas para navegación en sugerencias
    document.addEventListener('keydown', this.manejarTeclas);

    // Prevenir comportamiento de drag por defecto en toda la página
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      document.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });


    if (this.pasoActual === 2) {
      this.cargarPreguntasFormulario();
    }
  },

  beforeDestroy() {
    // Limpiar event listeners
    document.removeEventListener('keydown', this.manejarTeclas);

    if (this.timeoutBusqueda) {
      clearTimeout(this.timeoutBusqueda);
    }

  }

});

// Componente de Reportes
app.component("web-reportes", {
  template: /*html*/ `
  <base-layout>
    <div class="container-fluid">
      <!-- Header del reporte -->
      <div class="row">
        <div class="col-12">
          <div class="card border-0 shadow mb-4">
            <div class="card-header">
              <div class="row align-items-center">
                <div class="col">
                  <h2 class="h5">Reporte de Proveedores</h2>
                  <p class="mb-0">Estado de documentación y registro de proveedores</p>
                </div>
                <div class="col-auto">
                  <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-primary" @click="actualizarReporte()">
                      <svg class="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                          clip-rule="evenodd"></path>
                      </svg>
                      Actualizar
                    </button>

                    <button class="btn btn-sm btn-outline-secondary" @click="recalcularCache()">
                      <svg class="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                          clip-rule="evenodd"></path>
                      </svg>
                      Recalcular Caché
                    </button>
                
                    <button class="btn btn-sm btn-success" @click="exportarReporte()">
                      <svg class="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clip-rule="evenodd"></path>
                      </svg>
                      Exportar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas rápidas -->
      <div class="row mb-4 mx-auto">
        <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6">
          <div class="card card-stats mb-4 mb-lg-0" style="height: 200px; padding-left: 0px;">
            <div class="card-body">
              <div class="row">
                <div class="col text-center">
                  <h5 class="card-title text-uppercase text-muted mb-0 text-start" style="font-size: 1em;">Total Proveedores</h5>                  
                  <span class="h2 font-weight-bold mb-0">{{ stats.total }}</span>
                </div>
                <div class="col-auto mx-auto text-center">
                  <div class="icon icon-shape bg-primary text-white rounded-circle shadow">
                    <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6">
          <div class="card card-stats mb-4 mb-lg-0" style="height: 200px; padding-left: 0px;">
            <div class="card-body">
              <div class="row">
                <div class="col text-center">
                  <h5 class="card-title text-uppercase text-muted mb-0 text-start" style="font-size: 1em;">Documentación Completa</h5>
                  <span class="h2 font-weight-bold mb-0">{{ stats.completos }}</span>
                </div>
                <div class="col-auto mx-auto text-center">
                  <div class="icon icon-shape bg-success text-white rounded-circle shadow">
                    <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6">
          <div class="card card-stats mb-4 mb-lg-0" style="height: 200px; padding-left: 0px;">
            <div class="card-body">
              <div class="row">
                <div class="col text-center">
                  <h5 class="card-title text-uppercase text-muted mb-0 text-start" style="font-size: 1em;">Pendientes</h5>
                  <span class="h2 font-weight-bold mb-0">{{ stats.pendientes }}</span>
                  <br>
                </div>
                <div class="col-auto mx-auto text-center">
                  <div class="icon icon-shape bg-warning text-white rounded-circle shadow">
                    <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6">
          <div class="card card-stats mb-4 mb-lg-0" style="height: 200px; padding-left: 0px;">
            <div class="card-body">
              <div class="row">
                <div class="col text-center">
                  <h5 class="card-title text-uppercase text-muted mb-0 text-start" style="font-size: 1em;">Sin Información</h5>
                  <span class="h2 font-weight-bold mb-0">{{ stats.sinInfo }}</span>
                </div>
                <div class="col-auto mx-auto text-center">
                  <div class="icon icon-shape bg-danger text-white rounded-circle shadow">
                    <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros y búsqueda -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card border-0 shadow">
            <div class="card-body py-3">
              <div class="row align-items-center">
                <div class="col-md-4">
                  <div class="input-group">
                    <span class="input-group-text">
                      <svg class="icon icon-xs" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
                      </svg>
                    </span>
                    <input type="text" class="form-control" placeholder="Buscar proveedor..." v-model="filtroNombre" @input="filtrarDatos">
                  </div>
                </div>
                <div class="col-md-3">
                  <select class="form-select" v-model="filtroEstado" @change="filtrarDatos">
                    <option value="">Todos los estados</option>
                    <option value="completo">Documentación completa</option>
                    <option value="pendiente">Documentación pendiente</option>
                    <option value="sin_info">Sin información</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <select class="form-select" v-model="filtroDocumentos" @change="filtrarDatos">
                    <option value="">Todos</option>
                    <option value="con_documentos">Con documentos</option>
                    <option value="sin_documentos">Sin documentos</option>
                  </select>
                </div>
                <div class="col-md-2">
                  <button class="btn btn-outline-secondary w-100" @click="limpiarFiltros">
                    <svg class="icon icon-xs me-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1z" clip-rule="evenodd"></path>
                    </svg>
                    Limpiar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de reportes -->
      <div class="row">
        <div class="col-12">
          <div class="card border-0 shadow">
            <div class="card-header">
              <div class="row align-items-center">
                <div class="col">
                  <h5 class="mb-0">Lista de Proveedores</h5>
                  <small class="text-muted">
                    Mostrando {{ rangoActual.inicio }} - {{ rangoActual.fin }} de {{ datosFiltrados.length }} proveedores
                  </small>
                </div>
              </div>
            </div>
      
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-centered table-nowrap mb-0">
                  <thead class="thead-light">
                    <tr>
                      <th class="border-0">#</th>
                      <th class="border-0">Empresa</th>
                      <th class="border-0">Folio</th>
                      <th class="border-0">RFC</th>
                      <th class="border-0">Contacto</th>
                      <th class="border-0">Email</th>
                      <th class="border-0">Teléfono</th>
                      <th class="border-0">Documentos</th>
                      <th class="border-0">Estado Documentación</th>
                      <th class="border-0">Última Actualización</th>
                      <th class="border-0">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="datosFiltrados.length === 0">
                      <td colspan="11" class="text-center py-4">
                        <div class="text-muted">
                          <svg class="icon icon-lg mb-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clip-rule="evenodd"></path>
                          </svg>
                          <p class="mb-0">No se encontraron proveedores con los filtros aplicados</p>
                        </div>
                      </td>
                    </tr>
                    <tr v-for="(proveedor, index) in datosPaginados" :key="proveedor.id">
                      <td>{{ (paginaActual - 1) * itemsPorPagina + index + 1 }}</td>
                      <td>
                          <div class="fw-bold">{{ proveedor.nomEmpresa || 'Sin nombre' }}</div>
                          <small class="text-muted">{{ proveedor.razonSocial || 'N/A' }}</small>
                      </td>
                      <td>
                        <small class="text-success">{{ proveedor.folio || 'N/A' }}</small>
                      </td>
                      <td>
                        <small class="text-danger">{{ proveedor.rfc || 'N/A' }}</small>
                      </td>
                      <td>{{ proveedor.contactoPrincipal || proveedor.nombre || 'N/A' }}</td>
                      <td>{{ proveedor.emailPrincipal || proveedor.correo || 'N/A' }}</td>
                      <td>{{ proveedor.telefonoPrincipal || proveedor.telefono || 'N/A' }}</td>
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="progress me-2" style="width: 60px; height: 6px;">
                            <div class="progress-bar" :class="getProgressClass(proveedor.documentos)" role="progressbar"
                              :style="'width: ' + getProgressPercentage(proveedor.documentos) + '%'">
                            </div>
                          </div>
                          <small class="text-nowrap">{{ proveedor.documentos || 0 }}/15</small>
                        </div>
                      </td>
                      <td>
                        <span class="badge" :class="getEstadoBadgeClass(proveedor)">
                          {{ getEstadoText(proveedor) }}
                        </span>
                      </td>
                      <td>
                        <small class="text-muted">{{ formatDate(proveedor.fechaActualizacion) }}</small>
                      </td>
                      <td>
                        <div class="btn-group" role="group">
                          <button class="btn btn-sm btn-outline-primary" @click="verDetalle(proveedor)"
                            data-bs-toggle="tooltip" title="Ver detalle">
                            <svg class="icon icon-xs" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                              <path fill-rule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </button>
                          <button class="btn btn-sm btn-outline-success" @click="descargarDocumentos(proveedor)"
                            :disabled="!proveedor.documentos || proveedor.documentos === 0" data-bs-toggle="tooltip"
                            title="Descargar documentos">
                            <svg class="icon icon-xs" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd"
                                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </button>
                          <button class="btn btn-sm btn-outline-info" @click="enviarRecordatorio(proveedor)"
                            :disabled="getEstadoText(proveedor) === 'Completo'" data-bs-toggle="tooltip"
                            title="Enviar recordatorio">
                            <svg class="icon icon-xs" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div> <!-- ⬅️ CERRAR card-body AQUÍ -->
      
            <!-- ⬇️ Footer al mismo nivel que card-body -->
            <div class="card-footer bg-white border-0">
              <div class="row align-items-center">
                <div class="col-md-6">
                  <div class="d-flex align-items-center gap-2">
                    <label class="mb-0">Mostrar:</label>
                    <select class="form-select form-select-sm" style="width: 80px;" v-model.number="itemsPorPagina"
                      @change="paginaActual = 1">
                      <option :value="10">10</option>
                      <option :value="25">25</option>
                      <option :value="50">50</option>
                      <option :value="100">100</option>
                    </select>
                    <span class="text-muted small">por página</span>
                  </div>
                </div>
                <div class="col-md-6">
                  <nav aria-label="Paginación">
                    <ul class="pagination justify-content-end mb-0">
                      <li class="page-item" :class="{ disabled: paginaActual === 1 }">
                        <a class="page-link" href="#" @click.prevent="paginaAnterior">
                          <svg class="icon icon-xs" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                              clip-rule="evenodd"></path>
                          </svg>
                        </a>
                      </li>
      
                      <li v-for="pagina in totalPaginas" :key="pagina" class="page-item"
                        :class="{ active: paginaActual === pagina }"
                        v-show="Math.abs(pagina - paginaActual) < 3 || pagina === 1 || pagina === totalPaginas">
                        <a class="page-link" href="#" @click.prevent="irAPagina(pagina)">{{ pagina }}</a>
                      </li>
      
                      <li class="page-item" :class="{ disabled: paginaActual === totalPaginas }">
                        <a class="page-link" href="#" @click.prevent="paginaSiguiente">
                          <svg class="icon icon-xs" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clip-rule="evenodd"></path>
                          </svg>
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
      
          </div>
        </div>
      </div>
    </div>
  </base-layout>
  `,
  data() {
    return {
      datos: [],
      datosFiltrados: [],
      cargando: false,
      filtroNombre: '',
      filtroEstado: '',
      filtroDocumentos: '',
      stats: {
        total: 0,
        completos: 0,
        pendientes: 0,
        sinInfo: 0
      },
      paginaActual: 1,
      itemsPorPagina: 10
    };
  },
  computed: {
    //Calcular datos paginados
    datosPaginados() {
        const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
        const fin = inicio + this.itemsPorPagina;
        return this.datosFiltrados.slice(inicio, fin);
    },
    
    totalPaginas() {
        return Math.ceil(this.datosFiltrados.length / this.itemsPorPagina);
    },
    
    rangoActual() {
        const inicio = (this.paginaActual - 1) * this.itemsPorPagina + 1;
        const fin = Math.min(this.paginaActual * this.itemsPorPagina, this.datosFiltrados.length);
        return { inicio, fin };
    }
  },
  methods: {
    // Cargar datos de proveedores desde el servidor
    async listaReportes() {
      this.cargando = true;
      try {
        const responseProveedores = await axios.post('../proCorsec/datos/datos.app', {
          opcion: 4
        });

        this.datos = responseProveedores.data.map(proveedor => ({
          ...proveedor,
          documentosRequeridos: 15
        }));

        this.datosFiltrados = [...this.datos];
        this.calcularEstadisticas();

      } catch (error) {
        console.error('Error al cargar datos:', error);
        this.generarDatosEjemplo();
      } finally {
        this.cargando = false;
      }
    },

    // Actualizar reporte
    actualizarReporte() {
      Swal.fire({
        title: 'Actualizando reporte...',
        text: 'Por favor espere',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      this.listaReportes().then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Reporte actualizado',
          text: 'Los datos se han actualizado correctamente',
          timer: 2000,
          showConfirmButton: false
        });
      });
    },

    // Agregar en methods, después de actualizarReporte()
    async recalcularCache() {
      const result = await Swal.fire({
        title: '¿Recalcular caché?',
        text: 'Esto actualizará el conteo de documentos de todos los proveedores',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, recalcular',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#1f2a38'
      });

      if (!result.isConfirmed) return;

      Swal.fire({
        title: 'Recalculando caché...',
        text: 'Por favor espere',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        // Actualizar caché para cada proveedor
        for (const proveedor of this.datos) {
          await axios.post('../proCorsec/datos/datos.app', {
            opcion: 7,
            folio: proveedor.folio
          });
        }

        // Recargar datos
        await this.listaReportes();

        Swal.fire({
          icon: 'success',
          title: 'Caché actualizado',
          text: 'El conteo de documentos se ha recalculado correctamente',
          timer: 2000,
          showConfirmButton: false
        });

      } catch (error) {
        console.error('Error al recalcular caché:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al recalcular el caché'
        });
      }
    },

    // Exportar reporte
    async exportarReporte() {
        const { value: formato } = await Swal.fire({
            title: 'Exportar reporte',
            text: 'Seleccione el formato de exportación',
            input: 'select',
            inputOptions: {
                'excel': 'Excel (.xlsx)',
                'pdf': 'PDF (.pdf)',
                'csv': 'CSV (.csv)'
            },
            inputPlaceholder: 'Seleccione formato',
            showCancelButton: true,
            confirmButtonText: 'Exportar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#1f2a38'
        });

        if (!formato) return;

        Swal.fire({
            title: 'Generando archivo...',
            text: 'Por favor espere',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const fecha = new Date().toISOString().slice(0, 10);
            const nombreArchivo = `Reporte_Proveedores_${fecha}`;

            switch (formato) {
                case 'excel':
                    this.exportarExcel(nombreArchivo);
                    break;
                case 'pdf':
                    this.exportarPDF(nombreArchivo);
                    break;
                case 'csv':
                    this.exportarCSV(nombreArchivo);
                    break;
            }

            Swal.fire({
                icon: 'success',
                title: 'Exportación completada',
                text: `El archivo se ha descargado correctamente`,
                timer: 2000,
                showConfirmButton: false
            });

        } catch (error) {
            console.error('Error al exportar:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al generar el archivo'
            });
        }
    },

    exportarExcel(nombreArchivo) {
        const datosExcel = this.datosFiltrados.map((proveedor, index) => ({
            '#': index + 1,
            'Empresa': proveedor.nomEmpresa || 'Sin nombre',
            'Razón Social': proveedor.razonSocial || 'N/A',
            'Folio': proveedor.folio || 'N/A',
            'RFC': proveedor.rfc || 'N/A',
            'Contacto': proveedor.contactoPrincipal || proveedor.nombre || 'N/A',
            'Email': proveedor.emailPrincipal || proveedor.correo || 'N/A',
            'Teléfono': proveedor.telefonoPrincipal || proveedor.telefono || 'N/A',
            'Documentos': `${proveedor.documentos || 0}/15`,
            'Estado': this.getEstadoText(proveedor),
            'Última Actualización': this.formatDate(proveedor.fechaActualizacion)
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(datosExcel);

        ws['!cols'] = [
            { wch: 5 }, { wch: 30 }, { wch: 15 }, { wch: 25 },
            { wch: 30 }, { wch: 15 }, { wch: 12 }, { wch: 18 }, { wch: 20 }
        ];

        XLSX.utils.book_append_sheet(wb, ws, 'Proveedores');
        XLSX.writeFile(wb, `${nombreArchivo}.xlsx`);
    },

    exportarPDF(nombreArchivo) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('landscape');

        doc.setFontSize(16);
        doc.text('Reporte de Proveedores', 14, 15);

        doc.setFontSize(10);
        doc.text(`Generado: ${new Date().toLocaleDateString('es-MX')}`, 14, 22);
        doc.text(`Total de proveedores: ${this.datosFiltrados.length}`, 14, 27);

        const datosTabla = this.datosFiltrados.map((proveedor, index) => [
            index + 1,
            proveedor.nomEmpresa || 'Sin nombre',
            proveedor.razonSocial || 'N/A',
            proveedor.folio || 'N/A',
            proveedor.rfc || 'N/A',
            proveedor.contactoPrincipal || proveedor.nombre || 'N/A',
            proveedor.emailPrincipal || proveedor.correo || 'N/A',
            `${proveedor.documentos || 0}/15`,
            this.getEstadoText(proveedor)
        ]);

        doc.autoTable({
            startY: 32,
            head: [['#', 'Empresa', 'Razón Social', 'Folio', 'RFC', 'Contacto', 'Email', 'Docs', 'Estado']],
            body: datosTabla,
            styles: {
                fontSize: 8,
                cellPadding: 2
            },
            headStyles: {
                fillColor: [31, 42, 56],
                textColor: 255,
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            },
            columnStyles: {
                0: { cellWidth: 10 },
                1: { cellWidth: 50 },
                2: { cellWidth: 30 },
                3: { cellWidth: 45 },
                4: { cellWidth: 55 },
                5: { cellWidth: 20 },
                6: { cellWidth: 30 }
            }
        });

        doc.save(`${nombreArchivo}.pdf`);
    },

    exportarCSV(nombreArchivo) {
        const headers = ['#', 'Empresa', 'Razón Social', 'Folio', 'RFC', 'Contacto', 'Email', 'Teléfono', 'Documentos', 'Estado', 'Última Actualización'];

        const rows = this.datosFiltrados.map((proveedor, index) => [
            index + 1,
            proveedor.nomEmpresa || proveedor.razonSocial || 'Sin nombre',
            proveedor.razonSocial || 'N/A',
            proveedor.folio || 'N/A',
            proveedor.rfc || 'N/A',
            proveedor.contactoPrincipal || proveedor.nombre || 'N/A',
            proveedor.emailPrincipal || proveedor.correo || 'N/A',
            proveedor.telefonoPrincipal || proveedor.telefono || 'N/A',
            `${proveedor.documentos || 0}/15`,
            this.getEstadoText(proveedor),
            this.formatDate(proveedor.fechaActualizacion)
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `${nombreArchivo}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    // Calcular estadísticas
    calcularEstadisticas() {
      this.stats.total = this.datos.length;
      this.stats.completos = this.datos.filter(p => this.getEstadoText(p) === 'Completo').length;
      this.stats.pendientes = this.datos.filter(p => this.getEstadoText(p) === 'Pendiente').length;
      this.stats.sinInfo = this.datos.filter(p => this.getEstadoText(p) === 'Sin información').length;
    },

    // Métodos de paginación
    irAPagina(pagina) {
      if (pagina >= 1 && pagina <= this.totalPaginas) {
        this.paginaActual = pagina;
      }
    },

    paginaAnterior() {
      if (this.paginaActual > 1) {
        this.paginaActual--;
      }
    },

    paginaSiguiente() {
      if (this.paginaActual < this.totalPaginas) {
        this.paginaActual++;
      }
    },

    // Resetear página al filtrar
    filtrarDatos() {
      this.datosFiltrados = this.datos.filter(proveedor => {
        const nombreMatch = !this.filtroNombre ||
          (proveedor.nomEmpresa || '').toLowerCase().includes(this.filtroNombre.toLowerCase()) ||
          (proveedor.razonSocial || '').toLowerCase().includes(this.filtroNombre.toLowerCase());

        const estadoMatch = !this.filtroEstado ||
          this.getEstadoValue(proveedor) === this.filtroEstado;

        const documentosMatch = !this.filtroDocumentos ||
          (this.filtroDocumentos === 'con_documentos' && proveedor.documentos > 0) ||
          (this.filtroDocumentos === 'sin_documentos' && (!proveedor.documentos || proveedor.documentos === 0));

        return nombreMatch && estadoMatch && documentosMatch;
      });

      this.paginaActual = 1;
    },

    // Limpiar filtros
    limpiarFiltros() {
      this.filtroNombre = '';
      this.filtroEstado = '';
      this.filtroDocumentos = '';
      this.datosFiltrados = [...this.datos];
    },

    // Obtener clase CSS para el progreso de documentos
    getProgressClass(documentos) {
      const porcentaje = this.getProgressPercentage(documentos);
      if (porcentaje >= 80) return 'bg-success';
      if (porcentaje >= 50) return 'bg-warning';
      return 'bg-danger';
    },

    // Obtener porcentaje de progreso
    getProgressPercentage(documentos) {
      return Math.round((documentos || 0) / 15 * 100);
    },

    // Obtener clase del badge de estado
    getEstadoBadgeClass(proveedor) {
      const estado = this.getEstadoText(proveedor);
      switch (estado) {
        case 'Completo': return 'bg-success';
        case 'Pendiente': return 'bg-warning';
        default: return 'bg-danger';
      }
    },

    // Obtener texto del estado
    getEstadoText(proveedor) {
      const docs = proveedor.documentos || 0;
      if (docs >= 12) return 'Completo'; // 80% de documentos
      if (docs > 0) return 'Pendiente';
      return 'Sin información';
    },

    // Obtener valor del estado para filtros
    getEstadoValue(proveedor) {
      const estado = this.getEstadoText(proveedor);
      switch (estado) {
        case 'Completo': return 'completo';
        case 'Pendiente': return 'pendiente';
        default: return 'sin_info';
      }
    },

    // Ver detalle del proveedor
    verDetalle(proveedor) {
      Swal.fire({
        title: `Detalle: ${proveedor.nomEmpresa || proveedor.razonSocial}`,
        html: `
          <div class="text-start">
            <p><strong>RFC:</strong> ${proveedor.rfc || 'N/A'}</p>
            <p><strong>Email:</strong> ${proveedor.emailPrincipal || proveedor.correo || 'N/A'}</p>
            <p><strong>Teléfono:</strong> ${proveedor.telefonoPrincipal || proveedor.telefono || 'N/A'}</p>
            <p><strong>Documentos subidos:</strong> ${proveedor.documentos || 0} de 15</p>
            <p><strong>Estado:</strong> ${this.getEstadoText(proveedor)}</p>
            <p><strong>Última actualización:</strong> ${this.formatDate(proveedor.fechaActualizacion)}</p>
          </div>
        `,
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#1f2a38'
      });
    },

    // Descargar documentos del proveedor
    async descargarDocumentos(proveedor) {
      if (!proveedor.documentos || proveedor.documentos === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Sin documentos',
          text: 'Este proveedor no tiene documentos para descargar'
        });
        return;
      }

      Swal.fire({
        title: 'Preparando descarga...',
        text: 'Por favor espere',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        // Obtener lista de archivos del proveedor
        const response = await axios.post('../proCorsec/datos/datos.app', {
          opcion: 5,
          folio: proveedor.folio
        });

        if (!response.data || response.data.length === 0) {
          Swal.fire({
            icon: 'warning',
            title: 'Sin archivos',
            text: 'No se encontraron archivos para este proveedor'
          });
          return;
        }

        // Crear ZIP con JSZip
        const zip = new JSZip();
        const carpeta = zip.folder(proveedor.nomEmpresa || proveedor.folio);

        // Agregar cada archivo al ZIP
        response.data.forEach(archivo => {
          // Convertir base64 a blob
          const byteCharacters = atob(archivo.contenido);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);

          carpeta.file(archivo.nombre, byteArray);
        });

        // Generar y descargar ZIP
        const content = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(content);

        link.href = url;
        link.download = `Documentos_${proveedor.nomEmpresa || proveedor.folio}_${new Date().toISOString().slice(0, 10)}.zip`;
        link.click();

        URL.revokeObjectURL(url);

        Swal.fire({
          icon: 'success',
          title: 'Descarga completada',
          text: `Se descargaron ${response.data.length} archivos`,
          timer: 2000,
          showConfirmButton: false
        });

      } catch (error) {
        console.error('Error al descargar documentos:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al descargar los documentos'
        });
      }
    },

    // Enviar recordatorio al proveedor
    async enviarRecordatorio(proveedor) {
      const result = await Swal.fire({
        title: 'Enviar recordatorio',
        text: `¿Enviar recordatorio a ${proveedor.nomEmpresa || proveedor.razonSocial}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, enviar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#1f2a38'
      });

      if (result.isConfirmed) {
        Swal.fire({
          title: 'Enviando recordatorio...',
          text: 'Por favor espere',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Simular envío de email
        setTimeout(() => {
          Swal.fire({
            icon: 'success',
            title: 'Recordatorio enviado',
            text: 'El recordatorio se ha enviado correctamente',
            timer: 2000,
            showConfirmButton: false
          });
        }, 1500);
      }
    },

    // Formatear fecha
    formatDate(fecha) {
      if (!fecha) return 'N/A';

      try {
        const date = new Date(fecha);
        const opciones = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        };
        return date.toLocaleDateString('es-MX', opciones);
      } catch (error) {
        return 'N/A';
      }
    },

    // Generar datos de ejemplo para pruebas
    generarDatosEjemplo() {
      this.datos = [
        {
          id: 1,
          nomEmpresa: "Tech Solutions SA de CV",
          razonSocial: "Tech Solutions SA de CV",
          nombreComercial: "TechSol",
          rfc: "TSO120315ABC",
          contactoPrincipal: "Juan Pérez",
          emailPrincipal: "juan.perez@techsol.com",
          telefonoPrincipal: "(55) 1234-5678",
          documentos: 12,
          documentosRequeridos: 15,
          fechaActualizacion: new Date("2024-12-15T10:30:00")
        },
        {
          id: 2,
          nomEmpresa: "Servicios Integrales XYZ",
          razonSocial: "Servicios Integrales XYZ SA",
          nombreComercial: "IntegralesXYZ",
          rfc: "SIX140820DEF",
          contactoPrincipal: "María González",
          emailPrincipal: "maria.gonzalez@integralesxyz.com",
          telefonoPrincipal: "(55) 9876-5432",
          documentos: 8,
          documentosRequeridos: 15,
          fechaActualizacion: new Date("2024-12-14T15:45:00")
        },
        {
          id: 3,
          nomEmpresa: "Construcciones ABC",
          razonSocial: "Construcciones ABC SA de CV",
          nombreComercial: "ABC Construcciones",
          rfc: "CAB090510GHI",
          contactoPrincipal: "Carlos Rodríguez",
          emailPrincipal: "carlos@construccionesabc.com",
          telefonoPrincipal: "(55) 5555-1234",
          documentos: 15,
          documentosRequeridos: 15,
          fechaActualizacion: new Date("2024-12-16T09:20:00")
        },
        {
          id: 4,
          nomEmpresa: "Distribuidora Norte",
          razonSocial: "Distribuidora Norte SA",
          nombreComercial: "DistriNorte",
          rfc: "DNO200718JKL",
          contactoPrincipal: "Ana Martínez",
          emailPrincipal: "ana.martinez@distribuidoranorte.com",
          telefonoPrincipal: "(55) 7777-8888",
          documentos: 3,
          documentosRequeridos: 15,
          fechaActualizacion: new Date("2024-12-10T12:15:00")
        },
        {
          id: 5,
          nomEmpresa: "Logística Express",
          razonSocial: "Logística Express SA de CV",
          nombreComercial: "LogiExpress",
          rfc: "LEX160922MNO",
          contactoPrincipal: "Roberto Silva",
          emailPrincipal: "roberto@logisticaexpress.com",
          telefonoPrincipal: "(55) 3333-4444",
          documentos: 0,
          documentosRequeridos: 15,
          fechaActualizacion: null
        },
        {
          id: 6,
          nomEmpresa: "Consultoría Digital Pro",
          razonSocial: "Consultoría Digital Pro SA de CV",
          nombreComercial: "DigiPro",
          rfc: "CDP051118PQR",
          contactoPrincipal: "Laura Fernández",
          emailPrincipal: "laura@consultoriadigital.com",
          telefonoPrincipal: "(55) 4444-5555",
          documentos: 14,
          documentosRequeridos: 15,
          fechaActualizacion: new Date("2024-12-13T14:30:00")
        },
        {
          id: 7,
          nomEmpresa: "Suministros Industriales MX",
          razonSocial: "Suministros Industriales MX SA",
          nombreComercial: "SumMX",
          rfc: "SIM220415STU",
          contactoPrincipal: "Miguel Torres",
          emailPrincipal: "miguel@suministrosmx.com",
          telefonoPrincipal: "(55) 6666-7777",
          documentos: 6,
          documentosRequeridos: 15,
          fechaActualizacion: new Date("2024-12-11T11:15:00")
        }
      ];

      this.datosFiltrados = [...this.datos];
      this.calcularEstadisticas();
    },

    // Método compatibilidad con el original
    listaDatos() {
      this.listaReportes();
    }
  },
  created() {
    this.listaReportes();
  },
  mounted() {
    // Inicializar tooltips si se usa Bootstrap
    this.$nextTick(() => {
      if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
          return new bootstrap.Tooltip(tooltipTriggerEl);
        });
      }
    });
  }
});

// Componente de Conclusion
app.component("web-conclusion", {
  template: /*html*/ `
    <base-layout>
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card border-0 shadow mb-4">
              <div class="card-header">
                <h2 class="h5">Carta de Conformidad</h2>
              </div>
              <div class="card-body">
                
                <!-- ALERTA SI YA EXISTE FIRMA -->
                <div v-if="firmaExistente" class="alert alert-info mb-4" role="alert">
                  <i class="fas fa-info-circle"></i>
                  <strong>Firma ya registrada</strong><br>
                  Este documento ya fue firmado el {{ fechaFirmaExistente }}.
                  No es posible firmar nuevamente.
                </div>
                
                <div id="documento-imprimir" class="document-content" style="max-width: 800px; margin: 0 auto; font-family: 'Times New Roman', serif; line-height: 1.6; text-align: justify;">
                  
                  <h3 class="text-center mb-4"><strong>CARTA DE CONFORMIDAD Y TÉRMINO DE AUDITORÍA DE PROVEEDORES</strong></h3>
                  
                  <p><strong>Lugar y fecha:</strong> {{ direccionFiscal }}, a <strong>{{ fechaActual }}</strong></p>
                  
                  <p><strong>Asunto:</strong> Carta de conformidad de auditoría de proveedor</p>
                  
                  <p>Yo, <strong>{{ contactoPrincipal }}</strong>, en mi calidad de <strong>Representante de la empresa </strong><strong>{{ razonSocial }}</strong>, con Registro Federal de Contribuyentes <strong>{{ rfc }}</strong>, y con domicilio en <strong>{{ direccionFiscal }}</strong>, en mi carácter de <strong>Proveedor</strong> de <strong>Grupo Ángeles, S.A. de C.V.</strong>, por medio de la presente:</p>
                  
                  <p class="text-center mt-4 mb-3"><strong>MANIFIESTO BAJO PROTESTA DE DECIR VERDAD</strong> que:</p>
                  
                  <ol>
                    <li class="mb-3">He sido debidamente informado sobre el <strong>proceso de auditoría</strong> realizado por <strong>Grupo Ángeles</strong> a nuestra empresa, así como sobre los <strong>procedimientos, metodologías, instrumentos y criterios de evaluación aplicados</strong> durante dicho proceso.</li>
                    
                    <li class="mb-3"><strong>Reconozco y acepto</strong> los resultados, hallazgos, observaciones y calificación obtenida como parte de la auditoría, mismos que fueron comunicados y explicados de manera clara y transparente.</li>
                    
                    <li class="mb-3"><strong>Autorizo y doy mi conformidad</strong> para que los datos, documentos y evidencias recopiladas durante el proceso sean utilizados exclusivamente para fines de control, verificación y mejora del sistema de gestión de proveedores de Grupo Ángeles.</li>
                    
                    <li class="mb-3">Declaro que no existe inconformidad respecto al desarrollo, resultado o cierre del proceso de auditoría, y en consecuencia, <strong>acepto formalmente el término de la auditoría</strong> correspondiente.</li>
                  </ol>
                  
                  <p class="mt-4">Sin más que manifestar, firmo la presente para los efectos legales y administrativos a que haya lugar.</p>
                  
                  <p class="mt-5 text-center">Atentamente,</p>
                  
                  <div class="mt-5">
                    <p><strong>{{ razonSocial }}</strong><br>
                    Representante de la empresa:<strong>{{ contactoPrincipal }}</strong></p>
                    
                    <!-- WIDGET DE FIRMA -->
                    <div class="firma-container mt-4">
                      <p><strong>Firma:</strong></p>
                      
                      <!-- ✅ SI YA EXISTE FIRMA, MOSTRAR IMAGEN -->
                      <div v-if="firmaExistente" class="text-center">
                        <img :src="imagenFirmaExistente" alt="Firma registrada" style="max-width: 400px; border: 2px solid #000; padding: 10px; background: #fff;">
                        <p class="text-muted mt-2"><small>Firma registrada el {{ fechaFirmaExistente }}</small></p>
                      </div>
                      
                      <!-- ✅ SI NO EXISTE, MOSTRAR CANVAS -->
                      <div v-else>
                        <div class="signature-wrapper" style="border: 2px solid #000; background: #fff; border-radius: 4px;">
                          <canvas 
                            ref="signatureCanvas" 
                            style="width: 100%; height: 200px; display: block; touch-action: none;"
                          ></canvas>
                        </div>
                        
                        <button 
                          @click="limpiarFirma" 
                          class="btn btn-sm btn-outline-secondary mt-2 no-print"
                          type="button"
                        >
                          <i class="fas fa-eraser"></i> Limpiar firma
                        </button>
                        
                        <div v-if="firmaGuardada" class="mt-3">
                          <p class="text-success"><i class="fas fa-check-circle"></i> Firma guardada</p>
                          <img :src="firmaGuardada" alt="Firma" style="max-width: 300px; border: 1px solid #ddd; padding: 5px;">
                        </div>
                      </div>
                    </div>
                    
                    <p class="mt-4">Teléfono: <u>{{ telefonoPrincipal }}</u></p>
                    <p>Correo electrónico: <u>{{ emailPrincipal }}</u></p>
                  </div>
                  
                </div>
                
                <!-- BOTONES -->
                <div class="d-flex justify-content-start gap-2 mt-4 no-print">
                  <button 
                    @click="guardarDocumento" 
                    class="btn btn-primary"
                    :disabled="cargando || firmaExistente"
                    v-if="!firmaExistente"
                  >
                    <i class="fas fa-save"></i> {{ cargando ? 'Guardando...' : 'Guardar' }}
                  </button>
                  
                  <button 
                    @click="imprimirDocumento" 
                    class="btn btn-secondary"
                  >
                    <i class="fas fa-print"></i> Imprimir
                  </button>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </base-layout>
  `,
  
  data() {
    return {
      folio: '',
      signaturePad: null,
      firmaGuardada: null,
      cargando: false,
      razonSocial: '',
      rfc: '',
      contactoPrincipal: '',
      direccionFiscal: '',
      telefonoPrincipal: '',
      emailPrincipal: '',
      fechaActual: new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }),
      // ✅ NUEVOS
      firmaExistente: false,
      fechaFirmaExistente: '',
      imagenFirmaExistente: ''
    };
  },
  
  methods: {
    // ✅ NUEVO: Verificar si ya existe firma
    async verificarFirmaExistente() {
      try {
        const response = await axios.get('../proCorsec/proveedores/verificarFirma/verificarFirma.app');
        
        if (response.data?.success && response.data.existe) {
          this.firmaExistente = true;
          this.fechaFirmaExistente = new Date(response.data.fechaRegistro).toLocaleDateString('es-MX', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          
          // Cargar la imagen de la firma existente
          this.imagenFirmaExistente = '../proCorsec/app/firmas_proveedores/' + response.data.rutaArchivo.split('/').slice(-2).join('/');
        }
      } catch (error) {
        console.error('Error al verificar firma:', error);
      }
    },

    inicializarFirma() {
      // ✅ Solo inicializar si NO existe firma
      if (this.firmaExistente) return;
      
      const canvas = this.$refs.signatureCanvas;
      if (!canvas) return;
      
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d").scale(ratio, ratio);
      
      this.signaturePad = new SignaturePad(canvas, {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        penColor: 'rgb(0, 0, 0)'
      });
    },
    
    limpiarFirma() {
      if (this.signaturePad) {
        this.signaturePad.clear();
        this.firmaGuardada = null;
      }
    },
    
    async guardarDocumento() {
      try {
        // ✅ Validar que no exista firma
        if (this.firmaExistente) {
          Swal.fire({
            icon: 'warning',
            title: 'Firma ya registrada',
            text: 'Este documento ya fue firmado previamente'
          });
          return;
        }
        
        if (!this.signaturePad || this.signaturePad.isEmpty()) {
          Swal.fire({
            icon: 'warning',
            title: 'Firma requerida',
            text: 'Por favor, firma el documento antes de guardar'
          });
          return;
        }
        
        this.cargando = true;
        
        const firmaDataURL = this.signaturePad.toDataURL('image/png');
        const blob = await this.dataURLtoBlob(firmaDataURL);
        const timestamp = new Date().getTime();
        const archivoFirma = new File([blob], `firma_${timestamp}.png`, { type: 'image/png' });
        
        const exito = await this.subirFirma(archivoFirma);
        
        if (exito) {
          this.firmaGuardada = firmaDataURL;
          
          // ✅ Actualizar estado
          await this.verificarFirmaExistente();
          
          Swal.fire({
            icon: 'success',
            title: '¡Documento guardado!',
            text: 'La carta de conformidad se guardó correctamente',
            timer: 2000
          });
        }
        
      } catch (error) {
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo guardar el documento'
        });
      } finally {
        this.cargando = false;
      }
    },
    
    async subirFirma(archivo) {
      try {
        const formData = new FormData();
        formData.append('archivo', archivo);

        const url = '../proCorsec/proveedores/subirFirmas/subirFirmas.app';

        Swal.fire({
          title: 'Guardando firma...',
          text: 'Por favor espera',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });

        const response = await axios.post(url, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 30000
        });

        if (!response.data?.success) {
          throw new Error(response.data?.message || 'Error del servidor');
        }

        return true;

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al guardar firma',
          text: error.response?.data?.message || error.message
        });
        return false;
      }
    },
    
    dataURLtoBlob(dataURL) {
      return new Promise((resolve) => {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        resolve(new Blob([u8arr], { type: mime }));
      });
    },
    
    async imprimirDocumento() {
      try {
        // 1. Guardar la firma si existe
        if (this.signaturePad && !this.signaturePad.isEmpty()) {
          this.firmaGuardada = this.signaturePad.toDataURL('image/png');
        }

        // 2. Preparar los datos a enviar
        const datos = {
          folio: this.folio,  // Asegúrate de tener esta variable en data()
          fechaActual: this.fechaActual
        };

        // 3. Mostrar mensaje de "generando PDF"
        Swal.fire({
          title: 'Generando PDF...',
          text: 'Por favor espera',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });

        // 4. Enviar petición al backend
        const response = await axios.post(
          '../proCorsec/proveedores/impreConclusion/impreConclusion.app',
          datos,
          { responseType: 'blob',
            headers: { 'Content-Type': 'application/json' }
           }
        );

        // 5. Cerrar el mensaje de carga
        Swal.close();

        // 6. Abrir el PDF en nueva ventana
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');

      } catch (error) {
        console.error('Error al generar PDF:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo generar el PDF'
        });
      }
    }
  },
  
  mounted() {
    // ✅ Primero verificar si existe firma
    this.verificarFirmaExistente().then(() => {
      // Luego inicializar el canvas solo si NO existe firma
      this.$nextTick(() => {
        this.inicializarFirma();
      });
    });

    // Cargar datos del proveedor
    axios.get('../proCorsec/proveedores/conclusion/conclusion.app')
      .then(response => {
        this.folio = response.data.folio;
        this.razonSocial = response.data.razonSocial;
        this.rfc = response.data.rfc;
        this.contactoPrincipal = response.data.contactoPrincipal;
        this.direccionFiscal = response.data.direccionFiscal;
        this.telefonoPrincipal = response.data.telefonoPrincipal;
        this.emailPrincipal = response.data.emailPrincipal;
      })
      .catch(error => {
        console.error("Error al traer los datos:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error de Carga',
          text: 'No se pudieron cargar los datos'
        });
      });
  }
});

// Componente de Configuración
app.component("web-configuracion", {
  template: /*html*/ `
  <base-layout>
  </base-layout>
  `,
  data() {
    return {
      datos: "",

    };
  },
  computed: {},
  methods: {},
  created() { },
  mounted() { },
});