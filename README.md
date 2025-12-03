🧮 Calculadora Geométrica

    Calculadora Geométrica es una aplicación web interactiva que permite calcular áreas, perímetros, volúmenes y operaciones con matrices, integrando además un sistema de usuarios con roles, modo oscuro y persistencia de datos a través de una API Flask.

👥 Integrantes

    - Brayan Estif Guillén Sanabria
    - Huamán Collazos, Leonid Kisley 
    - Macavilca Torre, José David
    - Yupanqui Anticona, Esteban

🆕 Nueva Funcionalidad

    La nueva funcionalidad del proyecto consiste en la integración del frontend con un backend desarrollado en Flask (Python), permitiendo el intercambio de información entre la aplicación web y el servidor.
    Gracias a esta integración, la aplicación ahora puede mantener una forma de persistencia temporal, lo que significa que los datos se almacenan en el servidor mientras el API está en ejecución.

    Aunque esta persistencia no se mantiene si el servidor se apaga o reinicia, resulta muy útil para realizar pruebas de funcionamiento, simulaciones de base de datos y comunicación cliente-servidor.

    Además, se implementaron endpoints (rutas API) que permiten enviar, recibir y actualizar información utilizando los métodos HTTP principales:

        -GET: para obtener información desde el servidor.
        -POST: para enviar nuevos registros.
        -PUT: para modificar datos existentes.
        -DELETE: para eliminar información (dentro de pruebas CRUD).

    Esta integración permitió reestructurar gran parte del código JavaScript, facilitando la comunicación entre los diferentes módulos del sistema (autenticación, figuras, matrices, etc.), de manera que todos puedan compartir y registrar información en el backend Flask.

    Asimismo, se realizaron mejoras internas en el código, como:

        -Reducción de redundancias en los scripts.
        -Comentarios explicativos para facilitar la comprensión del flujo.
        -Mejor manejo del historial y sincronización con el backend.

🚀 Cómo instalar el aplicativo

    1) Requisitos previos (qué necesitas)

        1.1.- Python 3.8+ instalado. (Comprobar en terminal/PowerShell: python --version o py --version.)
        1.2.- Git (opcional si vas a clonar por la terminal). Si no lo tienes, puedes descargar el repositorio 
              como ZIP desde GitHub.
        1.3.- Visual Studio Code (recomendado) o cualquier editor de texto.
        1.4.- (Opcional) Extensión Live Server para VS Code — facilita abrir el frontend con http://localhost:5500 
               y evita problemas CORS.
        1.5.- Conexión a Internet para descargar dependencias.

    2) Descargar el proyecto (dos métodos)

        Opción A — Usando Git (recomendado)

            1.- Abre Git Bash / PowerShell / CMD.
            2.- Ejecuta:
                git clone https://github.com/75564424-dot/CalculadoraFigurasYMatriz.git
                cd CalculadoraFigurasYMatriz
            3.- Verás la carpeta del proyecto en tu disco. En VS Code: File → Open Folder... → selecciona 
                CalculadoraFigurasYMatriz.

            Qué deberías ver en el explorador de archivos de VS Code (ejemplo):

                A:.
                │   index.html               → Página principal
                │   script.js                → Lógica general del sitio
                │   styles.css               → Estilos generales
                │   README.md                → Documentación del proyecto
                ...
        
        Opción B — Descargar ZIP (sin Git)

            1.- Ve a la URL del repo en GitHub.
            2.- Haz clic en Code → Download ZIP.
            3.- Extrae el ZIP en una carpeta y abre esa carpeta en VS Code.

    3) Instalar Python

        El backend del proyecto usa Flask, una herramienta de Python.

        Si aún no tienes Python instalado:

            1.- Entra a la página oficial: https://www.python.org/downloads/
            2.- Descarga la última versión estable (por ejemplo, Python 3.12 o superior).
            3.- Durante la instalación, marca la opción "Add Python to PATH" antes de hacer clic en Install Now.

        Para verificar si Python quedó bien instalado:
            python --version

        Deberías ver algo como:
            Python 3.12.0

        Instalar Python en Linux

        Python viene instalado por defecto en la mayoría de distribuciones Linux.
        Puedes comprobarlo ejecutando en la terminal:
            python3 --version

        Deberías ver algo como:
            Python 3.12.0

        Si no aparece o muestra una versión menor a 3.10, instala Python con alguno de estos comandos (dependiendo de tu distribución):

            Ubuntu / Debian
                sudo apt update
                sudo apt install python3 python3-pip -y

            Fedora
                sudo dnf install python3 python3-pip -y

            Arch / Manjaro
                sudo pacman -S python python-pip

        Una vez instalado, verifica también pip (el gestor de paquetes de Python):
            pip3 --version

    4) Instalar Flask

        Pasos instalacion en Windons:
            Una vez tengas Python, debes instalar Flask, que es el framework que permite la comunicación entre tu página web (frontend) y el servidor (backend).
                
                1.- Abre la terminal o consola (puedes buscar “cmd” en el menú Inicio).
                2.- Usa el siguiente comando:
                    pip install flask
                3.- Espera a que termine la instalación. Si todo sale bien, verás algo como:
                    Successfully installed Flask-3.0.0
                📘 Nota: No necesitas usar entornos virtuales. Flask se instalará directamente en tu sistema.
        
        Pasos instalacion Linux:
            
            1.- Una vez que Python y pip están listos, instala Flask globalmente con:
                pip3 install flask

            2.- Durante la instalación deberías ver mensajes similares a:
                Successfully installed Flask-3.0.0

            3.- Si aparece un error de permisos, agrega sudo al inicio del comando:
                sudo pip3 install flask

            📘 Nota: No necesitas usar entornos virtuales; Flask quedará instalado en tu sistema.

    5) Levantar el backend (Flask)

        Pasos para Windons
            1.- Desde la terminal ejecuta:
                cd "URL donde se encuentra la carpeta"/APIS
                python Flask.py
            
            2.- Qué deberías ver en la termina
                * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
                    Para detener el servidor: presiona CTRL + C en la terminal.

            3.- Probar que la API responde
                Abre el navegador y entra a:
                    http://127.0.0.1:5000/perfiles
                    
                Deberías ver un JSON con los perfiles guardados (ejemplo):
                    {
                        "admin": {
                            "nombre": "Administrador",
                            "email": "admin@gmail.com",
                            "password": "123",
                            "rol": "admin",
                            "historial": [],
                            "modo": "dark-mode"
                        },
                        "brayan": {
                            "nombre": "Brayan",
                            "email": "75564424@continental.edu.pe",
                            "password": "1234",
                            "rol": "usuario",
                            "historial": [],
                            "modo": "light-mode"
                        }
                    }

                Si ves ese JSON (o similar), el backend está funcionando.

        Levantar el backend (Flask) en Linux

            Para iniciar el backend, abre la terminal y navega hasta la carpeta donde está el proyecto.
            Por ejemplo, si lo descargaste en tu carpeta de usuario:
                cd ~/Descargas/CalculadoraFigurasYMatriz/APIS

            Luego ejecuta:
                python3 Flask.py

            Si todo funciona correctamente, deberías ver algo como:
                * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)

            De aqui puedes pasar al paso 3 de Windons, es lo mismo

    6) Levantar el frontend (páginas HTML)

        Tienes tres maneras de abrir el frontend:

            Opción A — Live Server (recomendada, fácil)

                1.- En VS Code instala la extensión Live Server.
                2.- Abre index.html y haz clic en "Go Live" (abajo a la derecha) o clic derecho → Open with Live Server.
                3.- Se abrirá algo como: http://127.0.0.1:5000/index.html. Ahora la app podrá hacer fetch() al backend sin problemas.
                4.- Qué verás: la página principal (menú) con tarjetas: Figuras 2D, Figuras 3D, Matrices y botones de login/registro.
            
            Opción B — Abrir el archivo directamente (doble clic en index.html)

                Funciona en muchos casos, pero puede causar bloqueos en las llamadas fetch() por restricciones de origen (CORS) al usar file://. Por eso recomiendo usar Live Server o python -m http.server.

                    # si usas Python 3
                    python -m http.server 5000

                    Abre en el navegador:
                    http://127.0.0.1:5000/index.html

    7) Flujo mínimo para probar la integración (ejemplo paso a paso)

        1.- Inicia el backend (python APIS/Flask.py) — verifica que http://127.0.0.1:5000/perfiles devuelva JSON.
        2.- Inicia el frontend con Live Server
        3.- En la app abre Autenticación → Iniciar Sesión, usa las credenciales del usuario admin:

            Email: admin@gmail.com
            Contraseña: 123

        4.- Tras iniciar sesión verás:

            Una tarjeta de bienvenida con el nombre y rol.
            Los botones Modo Oscuro/Claro , Cerrar Sesión y Eliminar Usuarios (si eres admin verás panel CRUD).

        5.- Entra al Panel CRUD (CRUD.html) y prueba:

            Leer usuarios → hace GET /perfiles y te muestra la lista.
            Crear usuario → hace POST /perfiles.
            Actualizar usuario → hace PUT /perfiles/:id.
            Eliminar usuario → hace DELETE /perfiles/:id.
    
    8) ¿Qué pasa si algo falla? — Troubleshooting rápido

        Error: Error de conexión con el servidor

            Asegúrate de que el backend esté corriendo en 127.0.0.1:5000.
            Revisa la terminal donde ejecutaste Flask para ver mensajes/errores.
            Si usas firewall, permite conexiones locales al puerto 5000.

        Problemas con fetch() desde el frontend (CORS / origen null)

            Si abriste HTML con file:// es posible que el navegador bloquee solicitudes. Usa Live Server o python -m http.server para servir los archivos vía http://....

        Puerto 5000 ocupado

            Cambia el puerto en Flask.py (ej.: app.run(debug=True, port=5001)) o libera el puerto que use otra aplicación.

        Dependencias faltantes (ModuleNotFoundError: No module named 'flask')

            Activa el virtualenv y ejecuta pip install flask flask-cors.

📡 Lista de Endpoints implementados

    La API Flask actúa como el backend de la Calculadora Geométrica, gestionando los datos de los usuarios, su modo de visualización (oscuro/claro) y el historial de operaciones realizadas en las distintas secciones del aplicativo (figuras 2D, 3D y matrices).

    A continuación se detallan los endpoints implementados:

        🔹 GET /perfiles

        Descripción:
        Devuelve todos los perfiles almacenados temporalmente en memoria dentro del servidor Flask.

        Ejemplo de respuesta (JSON):
            {
                "admin": {
                    "nombre": "Administrador",
                    "email": "admin@gmail.com",
                    "password": "123",
                    "rol": "admin",
                    "historial": [],
                    "modo": "dark-mode"
                },
                "brayan": {
                    "nombre": "Brayan",
                    "email": "75564424@continental.edu.pe",
                    "password": "1234",
                    "rol": "usuario",
                    "historial": [],
                    "modo": "light-mode"
                }
            }

        🔹 GET /perfil/<nombre>

        Descripción:
        Obtiene los datos de un usuario específico según su nombre o ID de registro.
        Parámetro de ruta:

        <nombre> — nombre del usuario registrado.

        Ejemplo:
            GET /perfil/brayan

        Respuesta:
            {
                "nombre": "Brayan",
                "email": "75564424@continental.edu.pe",
                "password": "1234",
                "rol": "usuario",
                "historial": [],
                "modo": "light-mode"
            }
        
        🔹 POST /perfil

        Descripción:
        Crea un nuevo perfil de usuario y lo guarda en el servidor.
        
        Ejemplo de cuerpo de solicitud (JSON):
            {
                "nombre": "Lucía",
                "email": "lucia@example.com",
                "password": "12345",
                "rol": "usuario",
                "modo": "light-mode"
            }

        Respuesta:
            {
                "mensaje": "Usuario Lucía registrado correctamente."
            }

        🔹 PUT /perfil/<nombre>

        Descripción:
        Actualiza los datos de un perfil existente.
        Parámetro de ruta:

        <nombre> — nombre actual del usuario a modificar.

        Ejemplo:
            PUT /perfil/brayan

        Cuerpo de solicitud (JSON):
            {
                "email": "brayan_nuevo@example.com",
                "modo": "dark-mode"
            }

        Respuesta:
            {
                "mensaje": "Perfil de Brayan actualizado correctamente."
            }
        
        🔹 DELETE /perfil/<nombre>

        Descripción:
        Elimina un perfil registrado en memoria.

        Ejemplo:
            DELETE /perfil/brayan
        
        Respuesta:
            {
                "mensaje": "Perfil de Brayan eliminado correctamente."
            }

        🔹 POST /historial

        Descripción:
        Permite registrar actividades o acciones realizadas por los usuarios (como cálculos de figuras, determinantes, etc.).

        Ejemplo de cuerpo (JSON):
            {
                "usuario": "Brayan",
                "accion": "Cálculo de determinante 4x4 en módulo Matrices"
            }
        
        Respuesta:

            {
                "mensaje": "Historial actualizado correctamente."
            }
        
        🧠 Nota técnica

            Estos endpoints no escriben en una base de datos persistente; los datos se almacenan en memoria del servidor Flask.
            Esto significa que al detener el servidor, la información se reinicia.
            Aun así, esta funcionalidad permite simular una base de datos real y probar la comunicación cliente-servidor (frontend-backend).

📂 Estructura de carpetas

    A:.
    │   index.html               → Página principal
    │   script.js                → Lógica general del sitio
    │   styles.css               → Estilos generales
    │   README.md                → Documentación del proyecto
    │
    ├───APIS
    │       Flask.py             → API Flask (backend principal)
    │
    ├───autenticacion
    │       CRUD.html            → Interfaz de gestión de usuarios
    │       CRUD.js              → Lógica de CRUD de usuarios
    │       login.html           → Inicio de sesión
    │       registro.html        → Registro de usuarios
    │
    ├───figuras2d
    │       circulo.html, cuadrado.html, triangulo.html → Cálculo de figuras planas
    │       figuras2d.js         → Funciones JS para figuras 2D
    │
    ├───figuras3d
    │       cubo.html, cilindro.html, esfera.html → Cálculo de figuras 3D
    │       figuras3d.js         → Funciones JS para figuras 3D
    │
    ├───imagenes
    │       (imágenes ilustrativas de las figuras)
    │
    └───matrices
            matrices.html         → Interfaz para operaciones con matrices
            matrices.js           → Lógica de cálculo de matrices