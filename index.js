const bcrypt = require("bcrypt");
const crypto = require("crypto");
const express = require("express");
const session = require("express-session");
const path = require("path");
const mysql = require("mysql");
const uuid = require("uuid");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const multer = require("multer");
const fs = require("fs");
const { random } = require("lodash");
const setTimeout = require("timers").setTimeout;
const fetch = require("node-fetch");
const { PDFDocument, rgb } = require("pdf-lib");
const qr = require("qrcode");
const twilio = require("twilio");
const bodyParser = require("body-parser");

const app = express();

dotenv.config();

function generarClaveSecreta() {
  return crypto.randomBytes(32).toString("hex");
}

const claveSecreta = generarClaveSecreta();

app.use(
  session({
    secret: claveSecreta,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

const pool = mysql.createPool({
  connectionLimit: 50,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// function consultar(query, params = []) {
//   return new Promise((resolve, reject) => {
//     pool.query(query, params, (error, results) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(results);
//       }
//     });
//   });
// }

const conexion = mysql.createConnection({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

app.set("view engine", "ejs");

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "views")));

app.listen(process.env.PORT, function () {
  console.log("Servidor activo: ", process.env.PORT);
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "service.regimed@gmail.com",
    pass: "hgjf ssaq kbvo wxwc",
  },
});

function generarToken(payload) {
  return jwt.sign(payload, "secreto", {
    expiresIn: "15m",
    issuer: "regimed.org",
  });
}

function generarToken3m(payload) {
  return jwt.sign(payload, "secreto", {
    expiresIn: "3m",
    issuer: "regimed.org",
  });
}

function generarTokenMedico(payload) {
  return jwt.sign(payload, "secreto", {
    issuer: "regimed.org",
  });
}

function enviarCorreoVerificacion(correo, token) {
  const mailOptions = {
    from: "service@regimed.life",
    to: correo,
    subject: "Verifica tu dirección de correo electrónico",
    html: `
    <!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
<meta charset="utf-8" />
<meta content="width=device-width" name="viewport" />
<meta content="IE=edge" http-equiv="X-UA-Compatible" />
<meta name="x-apple-disable-message-reformatting" />
<meta content="telephone=no,address=no,email=no,date=no,url=no" name="format-detection" />
<title>Frame 27</title>
<!--[if mso]>
            <style>
                * {
                    font-family: sans-serif !important;
                }
            </style>
        <![endif]-->
<!--[if !mso]><!-->
<!-- <![endif]-->
<link href="https://fonts.googleapis.com/css?family=Roboto:400" rel="stylesheet" type="text/css">
<link href="https://fonts.googleapis.com/css?family=Roboto:600" rel="stylesheet" type="text/css">
<link href="https://fonts.googleapis.com/css?family=Inter:700" rel="stylesheet" type="text/css">
<link href="https://fonts.googleapis.com/css?family=Roboto:700" rel="stylesheet" type="text/css">
<link href="https://fonts.googleapis.com/css?family=Inter:400" rel="stylesheet" type="text/css">
<style>
html {
    margin: 0 !important;
    padding: 0 !important;
}

* {
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
}
td {
    vertical-align: top;
    mso-table-lspace: 0pt !important;
    mso-table-rspace: 0pt !important;
}
a {
    text-decoration: none;
}
img {
    -ms-interpolation-mode:bicubic;
}
@media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
    u ~ div .email-container {
        min-width: 320px !important;
    }
}
@media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
    u ~ div .email-container {
        min-width: 375px !important;
    }
}
@media only screen and (min-device-width: 414px) {
    u ~ div .email-container {
        min-width: 414px !important;
    }
}

</style>
<!--[if gte mso 9]>
        <xml>
            <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
<style>
@media only screen and (max-device-width: 699px), only screen and (max-width: 699px) {

    .eh {
        height:auto !important;
    }
    .desktop {
        display: none !important;
        height: 0 !important;
        margin: 0 !important;
        max-height: 0 !important;
        overflow: hidden !important;
        padding: 0 !important;
        visibility: hidden !important;
        width: 0 !important;
    }
    .mobile {
        display: block !important;
        width: auto !important;
        height: auto !important;
        float: none !important;
    }
    .email-container {
        width: 100% !important;
        margin: auto !important;
    }
    .stack-column,
    .stack-column-center {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        direction: ltr !important;
    }
    .wid-auto {
        width:auto !important;
    }

    .table-w-full-mobile {
        width: 100%;
    }

    .text-44268512 {font-size:24px !important;}
    

    .mobile-center {
        text-align: center;
    }

    .mobile-center > table {
        display: inline-block;
        vertical-align: inherit;
    }

    .mobile-left {
        text-align: left;
    }

    .mobile-left > table {
        display: inline-block;
        vertical-align: inherit;
    }

    .mobile-right {
        text-align: right;
    }

    .mobile-right > table {
        display: inline-block;
        vertical-align: inherit;
    }

}

</style>
</head>

<body width="100%" style="background-color:#f5f5f5;margin:0;padding:0!important;mso-line-height-rule:exactly;">
<div style="background-color:#f5f5f5">
<!--[if gte mso 9]>
                <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                <v:fill type="tile" color="#f5f5f5"/>
                </v:background>
                <![endif]-->
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td valign="top" align="center">
<table bgcolor="#ffffff" style="margin:0 auto;" align="center" id="brick_container" cellspacing="0" cellpadding="0" border="0" width="700" class="email-container">
<tr>
<td width="700">
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td width="700">
<table cellspacing="0" cellpadding="0" border="0">
<tr>
<td width="680" align="center" style="vertical-align: middle; background-color:#254271;   padding-left:10px; padding-right:10px;" bgcolor="#254271">
<table border="0" cellpadding="0" cellspacing="0">
<tr>
<td height="10" style="height:10px; min-height:10px; line-height:10px;"></td>
</tr>
<tr>
<td style="vertical-align: middle;" align="center">
<div style="line-height:normal;text-align:left;"><span style="color:#ffffff;font-family:Roboto,Arial,sans-serif;font-size:14px;line-height:normal;text-align:left;">Una vida al alcance de tus manos.</span></div>
</td>
</tr>
<tr>
<td height="10" style="height:10px; min-height:10px; line-height:10px;"></td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td width="700">
<table cellspacing="0" cellpadding="0" border="0">
<tr>
<td width="600" align="center" style="background-color:#ddecf1;   padding-left:50px; padding-right:50px;" bgcolor="#ddecf1">
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td height="20" style="height:20px; min-height:20px; line-height:20px;"></td>
</tr>
<tr>
<td align="center">
<table cellspacing="0" cellpadding="0" border="0">
<tr>
<td width="156" align="center"><img src="https://plugin.markaimg.com/public/e2c7dcce/EClUR6HHWTsAdXX5cEsNnb3m8zqJjN.png" width="156" border="0" style="min-width:156px; width:156px;
         height: auto; display: block;"></td>
</tr>
</table>
</td>
</tr>
<tr>
<td height="30" style="height:30px; min-height:30px; line-height:30px;"></td>
</tr>
<tr>
<td width="100%">
<table width="100%" cellspacing="0" cellpadding="0" border="0">
<tr>
<td width="100%" style="background-color:#ffffff; border-radius:20px;  padding-left:30px; padding-right:30px;" bgcolor="#ffffff">
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td height="50" style="height:50px; min-height:50px; line-height:50px;"></td>
</tr>
<tr>
<td>
<div style="line-height:normal;text-align:left;"><span class="text-44268512" style="color:#254271;font-weight:600;font-family:Roboto,Arial,sans-serif;font-size:24px;line-height:normal;text-align:left;">Verifica tu dirección de email</span></div>
</td>
</tr>
<tr>
<td height="30" style="height:30px; min-height:30px; line-height:30px;"></td>
</tr>
<tr>
<td width="100%">
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td>
<table cellspacing="0" cellpadding="0" border="0">
<tr>
<td>
<div style="line-height:normal;text-align:left;"><span style="color:#254271;font-family:Roboto,Arial,sans-serif;font-size:14px;line-height:normal;text-align:left;">Haz clic en el botón de abajo para verificar tu dirección de email.</span></div>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td height="20" style="height:20px; min-height:20px; line-height:20px;"></td>
</tr>
<tr>
<td width="100%" style="vertical-align: middle; height:45px;  ">
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td>
<table cellspacing="0" cellpadding="0" border="0">
<tr>
<td style="vertical-align: middle;">
<div>
<!--[if mso]>
                        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="#" style="height:45px;v-text-anchor:middle;width:147px;" fillcolor="#00a3ff"  stroke="f" >
                        <w:anchorlock/>
                        <center style="white-space:nowrap;display:inline-block;text-align:center;color:#ffffff;font-weight:700;font-family:Inter,Arial,sans-serif;font-size:14px;">Verificar email</center>
                        </v:roundrect>
                    <![endif]-->
<a href="${
      process.env.URL_TOKEN + token
    }" style="white-space:nowrap;background-color:#00a3ff; display:inline-block;text-align:center;color:#ffffff;font-weight:700;font-family:Inter,Arial,sans-serif;font-size:14px;line-height:45px;width:147px; -webkit-text-size-adjust:none;mso-hide:all;box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.0430000014603138);">Verificar email</a>
</div>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td height="20" style="height:20px; min-height:20px; line-height:20px;"></td>
</tr>
<tr>
<td>
<div style="line-height:normal;text-align:left;"><span style="color:#254271;font-family:Roboto,Arial,sans-serif;font-size:14px;line-height:normal;text-align:left;">Por favor, asegúrate de no compartir nunca este código con nadie.</span></div>
</td>
</tr>
<tr>
<td height="20" style="height:20px; min-height:20px; line-height:20px;"></td>
</tr>
<tr>
<td>
<div style="line-height:normal;text-align:left;"><span style="color:#254271;font-weight:700;font-family:Roboto,Arial,sans-serif;font-size:14px;line-height:normal;text-align:left;">Nota:</span><span style="color:#254271;font-family:Roboto,Arial,sans-serif;font-size:14px;line-height:normal;text-align:left;"> El enlace es válido durante 30 minutos</span></div>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td height="50" style="height:50px; min-height:50px; line-height:50px;"></td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td height="30" style="height:30px; min-height:30px; line-height:30px;"></td>
</tr>
<tr>
<td width="100%" align="center">
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td width="100%" style="vertical-align: middle;   padding-left:30px; padding-right:30px;">
<table border="0" cellpadding="0" cellspacing="0">
<tr>
<td style="vertical-align: middle;" width="40"><img src="https://plugin.markaimg.com/public/e2c7dcce/sNBppuo83WQNGCv9RKXt7fzhR75GD9.png" width="40" border="0" style="min-width:40px; width:40px;
         height: auto; display: block;"></td>
</tr>
<tr>
<td height="15" style="height:15px; min-height:15px; line-height:15px;"></td>
</tr>
</table>
</td>
</tr>
<tr>
<td width="100%" style="  padding-left:30px; padding-right:30px;">
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td style=" border-width: 1px 0px 0px 0px; border-color:#004073; border-style:solid;">
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td height="15" style="height:15px; min-height:15px; line-height:15px;"></td>
</tr>
<tr>
<td width="540">
<div style="line-height:normal;text-align:left;"><span style="color:#004073;font-family:Inter,Arial,sans-serif;font-size:12px;line-height:normal;text-align:left;">Has recibido este email porque estás registrado en Regimed. Si tu no registraste este email, haz caso omiso a este mensaje.</span></div>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td height="20" style="height:20px; min-height:20px; line-height:20px;"></td>
</tr>
<tr>
<td width="540">
<div style="line-height:normal;text-align:left;"><span style="color:#004073;font-family:Inter,Arial,sans-serif;font-size:12px;line-height:normal;text-align:left;">Gracias,<br>El equipo de Regimed</span></div>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td height="40" style="height:40px; min-height:40px; line-height:40px;"></td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</div>
</body>

</html>
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(
        "Error al enviar el correo electrónico de verificación:",
        error
      );
    } else {
      console.log("Correo electrónico de verificación enviado:", info.response);
    }
  });
}

// * -------------------------- GETS -------------------------- * //

app.get("/", (req, res) => {
  res.render("index", {
    sesion: req.session.idUsuario,
  });
});

app.get("/registro", (req, res) => {
  if (!req.session.formData) {
    req.session.formData = {};
  }
  res.render("registro", {
    formData: req.session.formData,
    sesion: req.session.idUsuario,
  });
});

app.get("/principal", async (req, res) => {
  try {
    if (!req.session.idUsuario) {
      return res.redirect("/");
    }

    // Consulta para obtener datos personales
    const datosPersonales = await consultarDatosPersonales(req.session.idUsuario);

    // Consulta para obtener registros compartidos
    const registrosCompartidos = await consultarRegistrosCompartidos(req.session.idUsuario);

    // Consulta para verificar si el teléfono está verificado
    const telefonoVerificado = await verificarSiEstaVerificado(req.session.idUsuario);

    // Consulta para obtener vacunas preestablecidas
    const vacunasPreestablecidas = await consultarVacunasPreestablecidas(req.session.idUsuario);
    
    // Consulta para obtener historial médico
    const historialMedico = await consultarHistorialMedico(req.session.idUsuario);
    
    // Consulta para obtener historial médico
    const otrasVacunas = await consultarVacunas(req.session.idUsuario);

    // Renderizar la vista principal con los datos obtenidos
    res.render("principal", {
      nombre: datosPersonales.nombre,
      curp: datosPersonales.curp,
      imagenAMostrar: datosPersonales.imagen,
      telefono: datosPersonales.telefono,
      nacimiento: datosPersonales.nacimiento,
      peso: datosPersonales.peso,
      estatura: datosPersonales.estatura,
      sexo: datosPersonales.sexo,
      nacionalidad: datosPersonales.nacionalidad,
      sangre: datosPersonales.sangre,
      registros: registrosCompartidos,
      sesion: req.session.idUsuario,
      doctor: req.session.idDoctor,
      telefonoVerificado: telefonoVerificado,
      vacunasPreestablecidas: vacunasPreestablecidas,
      historialMedico: historialMedico,
      otrasVacunas: otrasVacunas
    });

  } catch (error) {
    console.error("Error al obtener datos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

async function consultarVacunas(idUsuario) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }

      const consulta = `
        SELECT *
        FROM vacuna
        WHERE usuario_id = ?
      `;
      connection.query(consulta, [idUsuario], (err, vacunas) => {
        connection.release();
        if (err) {
          reject(err);
        } else {
          resolve(vacunas);
        }
      });
    });
  });
}

async function consultarHistorialMedico(idUsuario) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }

      const consulta = `
        SELECT *
        FROM historial_medico
        WHERE usuario_id = ?
      `;
      connection.query(consulta, [idUsuario], (err, historialMedico) => {
        connection.release();
        if (err) {
          reject(err);
        } else {
          resolve(historialMedico);
        }
      });
    });
  });
}

// Función para consultar vacunas preestablecidas
async function consultarVacunasPreestablecidas(idUsuario) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }

      const consulta = `SELECT * FROM vacunas_preestablecidas WHERE usuario_id = ?`;
      connection.query(consulta, [idUsuario], (err, vacunas) => {
        connection.release();
        if (err) {
          reject(err);
        } else {
          resolve(vacunas);
        }
      });
    });
  });
}


// Función para consultar datos personales
async function consultarDatosPersonales(idUsuario) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }

      const consulta = `SELECT * FROM datos_personales WHERE usuario_id = ?`;
      connection.query(consulta, [idUsuario], (err, row) => {
        connection.release();
        if (err) {
          reject(err);
        } else {
          resolve({
            nombre: row[0].nombre,
            curp: row[0].curp,
            imagen: row[0].imagen ? row[0].imagen : "usuario.png",
            telefono: row[0].telefono,
            nacimiento: obtenerFechaFormateada(row[0].fecha_nac),
            peso: row[0].peso,
            estatura: row[0].estatura,
            sexo: row[0].sexo,
            nacionalidad: row[0].nacionalidad,
            sangre: row[0].tipo_sangre,
          });
        }
      });
    });
  });
}

// Función para consultar registros compartidos
async function consultarRegistrosCompartidos(idUsuario) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }

      const consulta = `
        SELECT registros_compartidos.*, datos_personales.*
        FROM registros_compartidos
        INNER JOIN datos_personales
        ON registros_compartidos.usuarioCompartido_id = datos_personales.usuario_id
        WHERE registros_compartidos.usuario_id = ?
      `;
      connection.query(consulta, [idUsuario], (err, registrosCompartidos) => {
        connection.release();
        if (err) {
          reject(err);
        } else {
          resolve(registrosCompartidos);
        }
      });
    });
  });
}

// Función para verificar si el telefono está verificado
async function verificarSiEstaVerificado(idUsuario) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }

      const consultaTelefono = `SELECT telefono FROM datos_personales WHERE usuario_id = ?`;
      connection.query(consultaTelefono, [idUsuario], (err, rows) => {
        if (err) {
          connection.release();
          reject(err);
        } else {
          const telefono = rows.length > 0 ? rows[0].telefono.replace(/\s/g, "") : "";
          if (telefono !== "") {
            const consultaVerificacion = `SELECT * FROM numeros_verificados WHERE telefono = ?`;
            connection.query(consultaVerificacion, [telefono], (err, verificaciones) => {
              connection.release();
              if (err) {
                reject(err);
              } else {
                resolve(verificaciones.length > 0 ? "V" : "N");
              }
            });
          } else {
            connection.release();
            resolve("");
          }
        }
      });
    });
  });
}

// Función para formatear la fecha
function obtenerFechaFormateada(fecha) {
  if (fecha !== "0000-00-00") {
    const fechaNacimiento = new Date(fecha);
    return fechaNacimiento.toISOString().split("T")[0];
  }
  return null;
}

app.use(
  session({
    secret: claveSecreta,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.get("/paciente/:telefono", (req, res) => {
  if (!req.session.idDoctor) {
    return res.redirect("/");
  }

  let telefono = req.params.telefono;

  const consulta = `SELECT * FROM numeros_verificados WHERE telefono = '${telefono}'`;

  conexion.query(consulta, (err, row) => {
    if (err) {
      throw err;
    } else {
      const consultaUsuario = `SELECT * FROM datos_personales WHERE usuario_id = '${row[0].usuario_id}'`;

      conexion.query(consultaUsuario, (err, row) => {
        if (err) {
          throw err;
        } else {
          var nombre = "";
          var curp = "";
          var imagen = "";
          var nacimiento = "";
          var peso = "";
          var estatura = "";
          var sexo = "";
          var nacionalidad = "";
          var sangre = "";
          if (row && row.length > 0) {
            nombre = row[0].nombre;
            curp = row[0].curp;
            imagen = row[0].imagen ? row[0].imagen : "usuario.png";
            telefono = row[0].telefono;
            nacimiento = row[0].fecha_nac;
            if (nacimiento !== "0000-00-00") {
              const fechaNacimiento = new Date(nacimiento);
              nacimiento = fechaNacimiento.toISOString().split("T")[0];
            }
            peso = row[0].peso;
            estatura = row[0].estatura;
            sexo = row[0].sexo;
            nacionalidad = row[0].nacionalidad;
            sangre = row[0].tipo_sangre;
          }

          res.render("paciente", {
            nombre: nombre,
            curp: curp,
            imagenAMostrar: imagen,
            telefono: telefono,
            nacimiento: nacimiento,
            peso: peso,
            estatura: estatura,
            sexo: sexo,
            nacionalidad: nacionalidad,
            sangre: sangre,
            registros: row,
            sesion: req.session.idUsuario,
          });
        }
      });
    }
  });
});

// app.get("/usuario/:usuario_id", (req, res) => {
//   const idUsuario = req.params.usuario_id;

//   console.log(idUsuario);

//   const consulta = `SELECT * FROM datos_personales WHERE usuario_id = '${idUsuario}'`;

//   conexion.query(consulta, (err, row) => {
//     if (err) {
//       throw err;
//     } else if (row.length !== 0) {
//       var nombre = "";
//       var curp = "";
//       var imagen = "";
//       var telefono = "";
//       var nacimiento = "";
//       var peso = "";
//       var estatura = "";
//       var sexo = "";
//       var nacionalidad = "";
//       var sangre = "";
//       if (row && row.length > 0) {
//         nombre = row[0].nombre;
//         curp = row[0].curp;
//         imagen = row[0].imagen ? row[0].imagen : "usuario.png";
//         telefono = row[0].telefono;
//         nacimiento = row[0].fecha_nac;
//         if (nacimiento !== "0000-00-00") {
//           const fechaNacimiento = new Date(nacimiento);
//           nacimiento = fechaNacimiento.toISOString().split("T")[0];
//         }
//         peso = row[0].peso;
//         estatura = row[0].estatura;
//         sexo = row[0].sexo;
//         nacionalidad = row[0].nacionalidad;
//         sangre = row[0].tipo_sangre;
//       }

//       res.render("usuario", {
//         nombre: nombre,
//         curp: curp,
//         imagenAMostrar: imagen,
//         telefono: telefono,
//         nacimiento: nacimiento,
//         peso: peso,
//         estatura: estatura,
//         sexo: sexo,
//         nacionalidad: nacionalidad,
//         sangre: sangre,
//         registros: row,
//         sesion: req.session.idUsuario,
//       });
//     }
//   });
// });

app.get("/usuario/:usuario_id", async (req, res) => {
  try {
    if (!req.session.correo) {
      req.session.correo = "";
    }

    const idUsuario = req.params.usuario_id;

    // Consulta para obtener datos personales
    const datosPersonales = await consultarDatosPersonales(idUsuario);

    // Consulta para verificar si el teléfono está verificado
    const telefonoVerificado = await verificarSiEstaVerificado(idUsuario);

    // Consulta para obtener vacunas preestablecidas
    const vacunasPreestablecidas = await consultarVacunasPreestablecidas(idUsuario);
    
    // Consulta para obtener historial médico
    const historialMedico = await consultarHistorialMedico(idUsuario);
    
    // Consulta para obtener otras vacunas
    const otrasVacunas = await consultarVacunas(idUsuario);

    // Renderizar la vista del usuario con los datos obtenidos
    res.render("usuario", {
      sesion: req.session.correo,
      nombre: datosPersonales.nombre,
      curp: datosPersonales.curp,
      imagenAMostrar: datosPersonales.imagen,
      telefono: datosPersonales.telefono,
      nacimiento: datosPersonales.nacimiento,
      peso: datosPersonales.peso,
      estatura: datosPersonales.estatura,
      sexo: datosPersonales.sexo,
      nacionalidad: datosPersonales.nacionalidad,
      sangre: datosPersonales.sangre,
      telefonoVerificado: telefonoVerificado,
      vacunasPreestablecidas: vacunasPreestablecidas,
      historialMedico: historialMedico,
      otrasVacunas: otrasVacunas
    });

  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    res.status(500).send("Error interno del servidor");
  }
});


app.get("/acceso", (req, res) => {
  if (!req.session.correo) {
    req.session.correo = "";
  }
  res.render("acceso", {
    correo: req.session.correo,
    sesion: req.session.idUsuario,
  });
});

app.get("/doctor", (req, res) => {
  if (!req.session.idDoctor) {
    return res.redirect("/");
  } else {
    const buscar =
      "SELECT * FROM datos_personales WHERE usuario_id = '" +
      req.session.idUsuario +
      "'";

    conexion.query(buscar, (err, row) => {
      if (err) {
        throw err;
      } else {
        var nombre = "";
        var curp = "";
        var imagen = "";
        var telefono = "";
        var nacimiento = "";
        var peso = "";
        var estatura = "";
        var sexo = "";
        var nacionalidad = "";
        var sangre = "";
        if (row && row.length > 0) {
          nombre = row[0].nombre;
          curp = row[0].curp;
          imagen = row[0].imagen ? row[0].imagen : "usuario.png";
          telefono = row[0].telefono;
          nacimiento = row[0].fecha_nac;
          if (nacimiento !== "0000-00-00") {
            const fechaNacimiento = new Date(nacimiento);
            nacimiento = fechaNacimiento.toISOString().split("T")[0];
          }
          peso = row[0].peso;
          estatura = row[0].estatura;
          sexo = row[0].sexo;
          nacionalidad = row[0].nacionalidad;
          sangre = row[0].tipo_sangre;
        }
        res.render("doctor", {
          nombre: nombre,
          curp: curp,
          imagenAMostrar: imagen,
          telefono: telefono,
          nacimiento: nacimiento,
          peso: peso,
          estatura: estatura,
          sexo: sexo,
          nacionalidad: nacionalidad,
          sangre: sangre,
          registros: row,
          sesion: req.session.idUsuario,
          doctor: req.session.doctor,
        });
      }
    });
  }
});

app.get("/cerrarSesion", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

app.get("/verificacion/usuario/:correo", (req, res) => {
  res.render("verificacion", {
    correo: req.params.correo,
    sesion: req.session.idUsuario,
  });
});

app.get("/verificar_correo", (req, res) => {
  const token = req.query.token;

  jwt.verify(token, "secreto", (err, decoded) => {
    if (err) {
      console.log("Token inválido");
      res.send("Token inválido");
    } else {
      const consulta = `SELECT * FROM registro_usuario WHERE correo = '${decoded.correo}'`;

      conexion.query(consulta, (err, rows) => {
        if (err) {
          throw err;
        } else {
          if (rows.length === 0) {
            const insertarRegistro = `INSERT INTO registro_usuario (usuario_id, nombre, apellido_paterno, apellido_materno, correo, contrasenia) VALUES ('${decoded.usuario_id}', '${decoded.nombre}', '${decoded.apellido_paterno}', '${decoded.apellido_materno}', '${decoded.correo}', '${decoded.contrasenia}')`;
            const insertarDatos = `INSERT INTO datos_personales (nombre, usuario_id, imagen, curp, fecha_nac, estatura, peso, sexo, tipo_sangre, telefono, nacionalidad) VALUES ('${decoded.nombre} ${decoded.apellido_paterno} ${decoded.apellido_materno}', '${decoded.usuario_id}', 'usuario.png', '', '0000-00-00', '0', '0', '', '', '', '')`;

            Promise.all([
              new Promise((resolve, reject) => {
                conexion.query(insertarRegistro, (err) => {
                  if (err) reject(err);
                  else resolve();
                });
              }),
              new Promise((resolve, reject) => {
                conexion.query(insertarDatos, (err) => {
                  if (err) reject(err);
                  else resolve();
                });
              }),
            ])
              .then(() => {
                req.session.idUsuario = decoded.usuario_id;
                res.redirect("/principal");
              })
              .catch((error) => {
                console.error("Error al insertar datos:", error);
                res.status(500).send("Error interno del servidor");
              });
          } else {
            req.session.idUsuario = rows[0].usuario_id;
            res.redirect("/principal");
          }
        }
      });
    }
  });
});

app.get("/verificar_doctor", (req, res) => {
  const token = req.query.token;

  jwt.verify(token, "secreto", (err, decoded) => {
    if (err) {
      console.log("Token inválido");
      res.send("Token inválido");
    } else {
      const consulta = `SELECT * FROM doctor WHERE usuario_id = '${decoded.usuario_id}'`;

      conexion.query(consulta, (err, rows) => {
        if (err) {
          throw err;
        } else {
          if (rows.length === 0) {
            const insertarDoctor = `INSERT INTO doctor (doctor_id, nombre, cedula, especialidad, usuario_id) VALUES ('${decoded.doctor_id}', '${decoded.nombre}', '${decoded.cedula}', '${decoded.especialidad}', '${decoded.usuario_id}')`;

            conexion.query(insertarDoctor);
          }
          res.send("Doctor verificado");
        }
      });
    }
  });
});

app.get("/generarTokenRegistro", (req, res) => {
  generarNumeroAleatorioUnico(req, res);
});

function generarNumeroAleatorioUnico(req, res) {
  const numeroAleatorio = random(100000, 999999);
  const tiempoActual = new Date();

  const consultaUsuario = `SELECT * FROM codigos_temporales WHERE usuario_id = '${req.session.idUsuario}'`;

  conexion.query(consultaUsuario, (err, rowsUsuario) => {
    if (err) {
      throw err;
    } else if (rowsUsuario.length === 0) {
      const consultaNumero = `SELECT * FROM codigos_temporales WHERE codigo = '${numeroAleatorio}'`;

      conexion.query(consultaNumero, (err, rowsNumero) => {
        if (err) {
          throw err;
        } else if (rowsNumero.length === 0) {
          const ingreso = `INSERT INTO codigos_temporales (usuario_id, codigo, hora_registro) VALUES ('${req.session.idUsuario}', '${numeroAleatorio}', NOW())`;

          conexion.query(ingreso, (err, result) => {
            if (err) {
              throw err;
            } else {
              const token =
                process.env.URL_AGREGAR_REGISTRO +
                generarToken3m({
                  usuarioId: req.session.idUsuario,
                  numero: numeroAleatorio,
                });
              res.json({ token, numeroAleatorio });
              const tiempoEspera = 3 * 60 * 1000;
              setTimeout(() => {
                console.log("Borrado: " + numeroAleatorio);
                const borrado = `DELETE FROM codigos_temporales WHERE usuario_id = '${req.session.idUsuario}' AND codigo = '${numeroAleatorio}'`;
                conexion.query(borrado);
              }, tiempoEspera);
            }
          });
        } else {
          generarNumeroAleatorioUnico(req, res);
        }
      });
    } else {
      const tiempoAnterior = new Date(rowsUsuario[0].hora_registro);
      const tiempoRestante = Math.round(
        (Math.round(tiempoAnterior) - (Math.round(tiempoActual) - 180000)) /
          1000
      );

      const numeroAleatorio = rowsUsuario[0].codigo;

      const token = generarToken({
        usuarioId: rowsUsuario[0].usuario_id,
        numero: rowsUsuario[0].codigo,
      });

      console.log(tiempoRestante);

      res.json({ token, numeroAleatorio, tiempoRestante });
    }
  });
}

app.get("/agregarRegistro", (req, res) => {
  const token = req.query.token;

  jwt.verify(token, "secreto", function (err, decoded) {
    if (err) {
      console.log("Token inválido");
      res.send("Token inválido");
    } else {
      const consulta = `SELECT * FROM codigos_temporales WHERE usuario_id = '${decoded.usuarioId}' AND codigo = '${decoded.numero}'`;

      conexion.query(consulta, (err, row) => {
        if (err) {
          throw err;
        } else if (row.length === 0) {
          res.send("Token inválido");
        } else {
          console.log(
            "Aqui tienes que guardar los registros para que tengan relacion"
          );
        }
      });
    }
  });
});

async function cargarFuente(font, pdfDoc) {
  return await pdfDoc.embedFont(font);
}

function calcularPosicionTexto(page, text, fontSize, font) {
  const textWidth = font.widthOfTextAtSize(text, fontSize);
  return (textX = page.getWidth() / 4 - textWidth / 2);
}

function agregarTexto(page, text, fontSize, font, y, xValue) {
  const x = calcularPosicionTexto(page, text, fontSize, font);
  page.drawText(text, {
    x: xValue !== undefined ? xValue : x,
    y,
    size: fontSize,
    font,
    color: rgb(4 / 255, 68 / 255, 115 / 255),
    weight: "600",
  });
}

async function agregarImagen(page, imagePath, x, pdfDoc) {
  try {
    const size = page.getWidth() / 2;
    const y = page.getHeight() - size;

    // Determinar el tipo de archivo basado en su extensión
    const extension = imagePath.split(".").pop().toLowerCase();
    let pdfImage;

    if (extension === "png") {
      const imageBytes = fs.readFileSync(imagePath);
      pdfImage = await pdfDoc.embedPng(imageBytes);
    } else if (extension === "jpg" || extension === "jpeg") {
      const imageBytes = fs.readFileSync(imagePath);
      pdfImage = await pdfDoc.embedJpg(imageBytes);
    } else {
      throw new Error(
        "Formato de imagen no compatible. Solo se admiten archivos PNG y JPG/JPEG."
      );
    }

    // Dibujar la imagen en la página del PDF
    page.drawImage(pdfImage, {
      x,
      y,
      width: size,
      height: size,
    });
  } catch (error) {
    console.error("Error al leer o cargar la imagen:", error);
    throw error; // Propagar el error hacia arriba
  }
}

app.get("/tarjeta", async (req, res) => {
  const datos = `SELECT * FROM datos_personales WHERE usuario_id = '${req.session.idUsuario}'`;
  console.log(req.session.idUsuario);

  conexion.query(datos, async (errDatos, rowDatos) => {
    if (errDatos) {
      throw errDatos;
    } else {
      try {
        // Lee el archivo PDF
        const existingPdfBytes = fs.readFileSync("pdf/tarjeta.pdf");

        // Carga el PDF
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const page = pdfDoc.getPages()[0];

        const qrData = process.env.URL_QRTARJETA + req.session.idUsuario;
        const qrWidth = 130;
        const qrHeight = 130;
        const qrOptions = {
          color: {
            width: qrWidth,
            height: qrHeight,
            dark: "#1d4370", // Color del módulo del código QR (negro en este caso)
            light: "#ffffff00", // Color de fondo del código QR (blanco en este caso)
          },
        };
        const qrImageBytes = await qr.toBuffer(qrData, qrOptions);

        const qrImage = await pdfDoc.embedPng(qrImageBytes);
        // const qrDims = qrImage.scale(0.9);
        const posicionQRX = page.getWidth() - page.getWidth() / 4 - qrWidth / 2;
        page.drawImage(qrImage, {
          x: posicionQRX, // Posición X en la página
          y: 77, // Posición Y en la página
          width: qrWidth, // Ancho de la imagen
          height: qrHeight, // Alto de la imagen
        });

        await agregarImagen(
          page,
          "views/img/users/" + rowDatos[0].imagen,
          0,
          pdfDoc
        );

        // Carga la fuente de texto
        const hel = await cargarFuente("Helvetica", pdfDoc);
        const helBold = await cargarFuente("Helvetica-Bold", pdfDoc);

        // Extraer valores del nombre
        const nombreCompleto = rowDatos[0].nombre;
        const partesNombre = nombreCompleto.split(" ");
        const apellidos = partesNombre.slice(-2).join(" ");
        const nombres = partesNombre.slice(0, -2).join(" ");

        // Agrega texto al PDF
        agregarTexto(page, nombres, 16, helBold, 90);
        agregarTexto(page, apellidos, 12, hel, 75);
        agregarTexto(page, "CURP: ", 7, helBold, 50, 7);
        agregarTexto(page, rowDatos[0].curp, 7, hel, 50, 32);
        agregarTexto(page, "T/S: ", 7, helBold, 40, 7);
        agregarTexto(page, rowDatos[0].tipo_sangre, 7, hel, 40, 22);

        // Guarda el PDF modificado
        const modifiedPdfBytes = await pdfDoc.save();
        const outputFilePath = path.join(__dirname, "pdf", "tarjeta2.pdf");
        fs.writeFileSync(outputFilePath, modifiedPdfBytes);
        // Envía el PDF modificado como respuesta con el encabezado para descargarlo
        res.contentType("application/pdf");
        res.sendFile(outputFilePath);
      } catch (error) {
        console.error("Error al modificar el título del PDF:", error);
        res
          .status(500)
          .send("Error al modificar el título del PDF: " + error.message);
      }
    }
  });
});

// * -------------------------- POSTS -------------------------- * //

app.post("/acceso", (req, res) => {
  const datos = req.body;

  const correo = datos.correo.trim();
  const contrasenia = datos.contrasenia.trim();

  const hashCorreo = crypto.createHash("sha256");
  hashCorreo.update(correo);
  const correoHash = hashCorreo.digest("hex");

  const buscar =
    "SELECT * FROM registro_usuario WHERE correo = '" + correoHash + "'";

  conexion.query(buscar, function (err, row) {
    if (err) {
      throw err;
    } else if (correo === "") {
      req.session.correo = correo;
      return res.render("acceso", {
        error: "Por favor, ingrese su correo.",
        errorField: "correo",
        correo: req.session.correo,
        sesion: req.session.idUsuario,
      });
    } else if (contrasenia === "") {
      req.session.correo = correo;
      return res.render("acceso", {
        error: "Por favor, ingresa la contraseña.",
        errorField: "contrasenia",
        correo: req.session.correo,
        sesion: req.session.idUsuario,
      });
    } else if (row.length === 0) {
      req.session.correo = correo;
      return res.render("acceso", {
        error: "El correo o la contraseña es incorrecta. Inténtelo de nuevo.",
        errorField: "noRes",
        correo: req.session.correo,
        sesion: req.session.idUsuario,
      });
    } else {
      bcrypt.compare(contrasenia, row[0].contrasenia, function (err, result) {
        if (!result) {
          req.session.correo = correo;
          return res.render("acceso", {
            error:
              "El correo o la contraseña es incorrecta. Inténtelo de nuevo.",
            errorField: "noRes",
            correo: req.session.correo,
            sesion: req.session.idUsuario,
          });
        } else {
          const consulta = `SELECT * FROM doctor WHERE usuario_id = '${row[0].usuario_id}'`;

          conexion.query(consulta, (err, rowDoctor) => {
            if (err) {
              throw err;
            } else if (rowDoctor.length !== 0) {
              req.session.idDoctor = rowDoctor[0].doctor_id;
              req.session.idUsuario = row[0].usuario_id;
              res.redirect("/principal");
            } else {
              req.session.idUsuario = row[0].usuario_id;
              res.redirect("/principal");
            }
          });
        }
      });
    }
  });
});
function enviarCorreoVerificacionDoctor(nombre, cedula, especialidad, token) {
  console.log(token);
  const mailOptions = {
    from: "service@regimed.org",
    to: "service@regimed.org",
    subject: "Verificación de Médico",
    html: `
    <p>Se ha recibido un nuevo formulario de registro de médico en la plataforma. A continuación, se detallan los datos proporcionados:</p>
    <ul>
      <li><strong>Nombre del médico:</strong> ${nombre}</li>
      <li><strong>Cédula profesional:</strong> ${cedula}</li>
      <li><strong>Especialidad:</strong> ${especialidad}</li>
    </ul>
    <p>Por favor, revisen estos datos y procedan según corresponda.
    <p><a href="https://regimed.org/verificar_doctor?token=${token}">Verifica aquí</a></p></p>
    <p>Atentamente, Regimed</p>
`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(
        "Error al enviar el correo electrónico de verificación:",
        error
      );
    } else {
      console.log("Correo electrónico de verificación enviado:", info.response);
    }
  });
}

app.post("/registroDoctor/:cedula/:especialidad/:captcha", async (req, res) => {
  const cedula = req.params.cedula;
  const especialidad = req.params.especialidad;

  const verificacionCaptcha = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=6LdjYrspAAAAAJn2Q6rIFphoWsw52t4cjRSv5w5p&response=${req.params.captcha}`,
    {
      method: "POST",
    }
  ).then((_res) => _res.json());

  if (verificacionCaptcha.success === true) {
    const consulta = `SELECT * FROM datos_personales WHERE usuario_id = '${req.session.idUsuario}'`;

    conexion.query(consulta, (err, row) => {
      const nombre = row[0].nombre;

      if (err) {
        throw err;
      } else if (row[0].imagen === "usuario.png") {
        res.json({ medico: "Imagen" });
      } else {
        const uuidGen = uuid.v4();

        const hashUUID = crypto.createHash("sha256");
        hashUUID.update(uuidGen);
        const uuidHash = hashUUID.digest("hex");

        const token = generarTokenMedico({
          usuario_id: req.session.idUsuario,
          doctor_id: uuidHash,
          nombre: nombre,
          cedula: cedula,
          especialidad: especialidad,
        });

        console.log(token);

        enviarCorreoVerificacionDoctor(nombre, cedula, especialidad, token);

        res.json({ medico: "Enviado" });
      }
    });
  }
});

app.post("/registro", (req, res) => {
  const datos = req.body;

  const nombre = datos.nombre.trim();
  const apellido_paterno = datos.apellido_paterno.trim();
  const apellido_materno = datos.apellido_materno.trim();
  const correo = datos.correo.trim();
  const contrasenia = datos.contrasenia.trim();
  const conf_contrasenia = datos.conf_contrasenia.trim();

  function guardarDatosFormulario(req) {
    req.session.formData = {
      nombre: nombre,
      apellido_paterno: apellido_paterno,
      apellido_materno: apellido_materno,
      correo: correo,
    };
  }

  const saltRounds = 10;
  const formatoNombre = /^[a-zA-ZÁáÉéÍíÓóÚúÜü\s]*$/;
  const formatoCorreo = /^\S+@\S+\.\S+$/.test(correo);
  const longMinContraseña = 8;
  const longMaxContraseña = 30;
  const passWithMay = /[A-Z]/.test(contrasenia);
  const passWithMin = /[a-z]/.test(contrasenia);
  const passWithEsp = /[$&+,:;=?@#|'<>.^*()%!-]/.test(contrasenia);

  const hashCorreo = crypto.createHash("sha256");
  hashCorreo.update(correo);
  const correoHash = hashCorreo.digest("hex");

  const buscar =
    "SELECT * FROM registro_usuario WHERE correo = '" + correoHash + "'";

  conexion.query(buscar, function (err, row) {
    if (err) {
      throw err;
    } else if (row.length > 0) {
      guardarDatosFormulario(req);
      return res.render("registro", {
        error: "El correo ya está registrado.",
        errorField: "correo",
        formData: req.session.formData,
        sesion: req.session.idUsuario,
      });
    } else if (nombre === "") {
      guardarDatosFormulario(req);
      return res.render("registro", {
        error: "Por favor, ingrese su nombre.",
        errorField: "nombre",
        formData: req.session.formData,
        sesion: req.session.idUsuario,
      });
    } else if (!formatoNombre.test(nombre)) {
      guardarDatosFormulario(req);
      return res.render("registro", {
        error: "El nombre solo debe contener letras y espacios.",
        errorField: "nombre",
        formData: req.session.formData,
        sesion: req.session.idUsuario,
      });
    } else if (apellido_paterno === "") {
      guardarDatosFormulario(req);
      return res.render("registro", {
        error: "Por favor, ingrese su apellido paterno.",
        errorField: "apellido_paterno",
        formData: req.session.formData,
        sesion: req.session.idUsuario,
      });
    } else if (apellido_materno === "") {
      guardarDatosFormulario(req);
      return res.render("registro", {
        error: "Por favor, ingrese su apellido materno.",
        errorField: "apellido_materno",
        formData: req.session.formData,
        sesion: req.session.idUsuario,
      });
    } else if (
      !formatoNombre.test(apellido_paterno) ||
      !formatoNombre.test(apellido_materno)
    ) {
      guardarDatosFormulario(req);
      return res.render("registro", {
        error: "Los apellidos solo debe contener letras y espacios.",
        errorField: "apellido_paterno",
        formData: req.session.formData,
        sesion: req.session.idUsuario,
      });
    } else if (correo === "") {
      guardarDatosFormulario(req);
      return res.render("registro", {
        error: "Por favor, ingrese su correo.",
        errorField: "correo",
        formData: req.session.formData,
        sesion: req.session.idUsuario,
      });
    } else if (!formatoCorreo) {
      guardarDatosFormulario(req);
      return res.render("registro", {
        error: "El correo ingresado no tiene un formato válido.",
        errorField: "correo",
        formData: req.session.formData,
        sesion: req.session.idUsuario,
      });
    } else if (contrasenia === "") {
      guardarDatosFormulario(req);
      return res.render("registro", {
        error: "Por favor, ingresa una contraseña",
        errorField: "contrasenia",
        formData: req.session.formData,
        sesion: req.session.idUsuario,
      });
    } else if (
      contrasenia.length < longMinContraseña ||
      contrasenia.length > longMaxContraseña
    ) {
      guardarDatosFormulario(req);
      return res.render("registro", {
        error:
          "La contraseña debe tener entre " +
          longMinContraseña +
          " y " +
          longMaxContraseña +
          " caracteres.",
        errorField: "contrasenia",
        formData: req.session.formData,
        sesion: req.session.idUsuario,
      });
    } else if (!passWithMay || !passWithMin || !passWithEsp) {
      guardarDatosFormulario(req);
      return res.render("registro", {
        error:
          "La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un carácter especial.",
        errorField: "contrasenia",
        formData: req.session.formData,
        sesion: req.session.idUsuario,
      });
    } else if (conf_contrasenia === "") {
      guardarDatosFormulario(req);
      return res.render("registro", {
        error: "Por favor, ingresa nuevamente la contraseña",
        errorField: "conf_contrasenia",
        formData: req.session.formData,
        sesion: req.session.idUsuario,
      });
    } else if (contrasenia !== conf_contrasenia) {
      guardarDatosFormulario(req);
      return res.render("registro", {
        error: "Las contraseñas no coinciden.",
        errorField: "dif_Contrasenia",
        formData: req.session.formData,
        sesion: req.session.idUsuario,
      });
    } else {
      bcrypt.hash(contrasenia, saltRounds, function (err, hash) {
        if (err) {
          console.error("Error al hashear la contraseña: ", err);
        } else {
          const contraseniaHash = hash;
          const uuidGen = uuid.v4();

          const hashUUID = crypto.createHash("sha256");
          hashUUID.update(uuidGen);
          const uuidHash = hashUUID.digest("hex");

          const token = generarToken({
            usuario_id: uuidHash,
            nombre: nombre,
            apellido_paterno: apellido_paterno,
            apellido_materno: apellido_materno,
            correo: correoHash,
            contrasenia: contraseniaHash,
          });

          enviarCorreoVerificacion(correo, token);

          res.redirect("/verificacion/usuario/" + correo);
        }
      });
    }
  });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "views/img/users");
  },
  filename: function (req, file, cb) {
    // Obtener la extensión del archivo original
    const extension = file.originalname.split(".").pop();
    // Generar un nuevo nombre para el archivo que incluya la extensión
    const nuevoNombre = `${req.session.idUsuario.slice(
      -5
    )}_${Date.now()}.${extension}`;
    cb(null, nuevoNombre);
  },
});

const upload = multer({ storage: storage });

app.post("/datosPersonales", upload.single("imagen"), (req, res) => {
  const datos = req.body;

  const nombre = datos.nombre;
  const curp = datos.curp;
  const telefono = datos.telefono;
  const nacimiento = datos.nacimiento ? datos.nacimiento : "0000-00-00";
  const peso = datos.peso ? datos.peso : 0;
  const nacionalidad = datos.nacionalidad;
  const estatura = datos.estatura ? datos.estatura / 100 : 0;
  const sexo = datos.sexo;
  const sangre = datos.sangre;
  let imagen = req.file ? req.file.filename : datos.imagen;
  const imagenGuardada = datos.imagenGuardada;

  if (imagenGuardada !== imagen && imagenGuardada !== "usuario.png") {
    fs.unlink("views/img/users/" + imagenGuardada, (err) => {
      if (err) {
        console.error("Error al eliminar el archivo:", err);
      } else {
        console.log("Archivo eliminado exitosamente");
      }
    });
  }

  console.log(imagen);

  const buscar = `SELECT * FROM datos_personales WHERE usuario_id = '${req.session.idUsuario}'`;

  conexion.query(buscar, (err, rows) => {
    if (err) {
      throw err;
    } else {
      const actualizar = `UPDATE datos_personales
      SET nombre = '${nombre}', 
          curp = '${curp}', 
          telefono = '${telefono}', 
          fecha_nac = '${nacimiento}', 
          peso = '${peso}', 
          estatura = '${estatura}', 
          sexo = '${sexo}', 
          nacionalidad = '${nacionalidad}', 
          tipo_sangre = '${sangre}', 
          imagen = '${imagen}'
      WHERE usuario_id = '${req.session.idUsuario}'`;

      conexion.query(actualizar, (err, rows) => {
        if (err) {
          throw err;
        }
      });
    }
  });
});

const accountSid = "AC7ecead8dc1f648aa7801bd8883f6a3c4";
const authToken = "ac49be903d87aa5cfe235055c1661093";
const client = twilio(accountSid, authToken);

app.post("/verificarNumeroTelefonicoPaciente/:telefonoPaciente", (req, res) => {
  const numeroTelefonico = req.params.telefonoPaciente.replace(/\s/g, "");
  const telefono = `SELECT * FROM numeros_verificados WHERE telefono = '${numeroTelefonico}'`;

  console.log(numeroTelefonico);
  console.log(telefono);

  conexion.query(telefono, async (err, row) => {
    if (err) {
      throw err;
    } else if (row.length !== 0) {
      try {
        const verificationCheck = await client.verify.v2
          .services("VA94d1b31b86d32e5f5d2cd8521c69ee4c")
          .verifications.create({
            to: numeroTelefonico,
            channel: "sms",
            locale: "es",
          });

        console.log(verificationCheck);
      } catch (error) {
        console.error(error);
        res.status(500).send("Hubo un error al enviar la verificación");
      }
    }
  });
});

app.post(
  "/verificarCodigoTelefonoPaciente/:telefono/:codigo",
  async (req, res) => {
    const telefono = req.params.telefono;
    const codigo = req.params.codigo;

    const numeroTelefonico = telefono.replace(/\s/g, "");
    try {
      const verificationCheck = await client.verify.v2
        .services("VA94d1b31b86d32e5f5d2cd8521c69ee4c")
        .verificationChecks.create({ to: numeroTelefonico, code: codigo });

      console.log(verificationCheck);

      if (verificationCheck.status === "approved") {
        res.json({ codigo: "Valido", telefono: numeroTelefonico });
      } else {
        res.json({ codigo: "Erroneo" });
      }
    } catch (error) {
      res.json({ codigo: "Erroneo" });
    }
  }
);

app.post("/verificarNumeroTelefonico", (req, res) => {
  const telefono = `SELECT * FROM datos_personales WHERE usuario_id = '${req.session.idUsuario}'`;

  console.log(telefono);

  conexion.query(telefono, async (err, row) => {
    if (err) {
      throw err;
    } else {
      let numeroTelefonico = row[0].telefono;

      console.log(numeroTelefonico);
      numeroTelefonico.replace(/\s/g, "");
      try {
        const verificationCheck = await client.verify.v2
          .services("VA94d1b31b86d32e5f5d2cd8521c69ee4c")
          .verifications.create({
            to: numeroTelefonico,
            channel: "sms",
            locale: "es",
          });

        console.log(verificationCheck);
      } catch (error) {
        console.error(error);
        res.status(500).send("Hubo un error al enviar la verificación");
      }
    }
  });
});

app.post("/verificarCodigoTelefono/:inputCodigo", async (req, res) => {
  console.log(req.params.inputCodigo);
  const telefono = `SELECT * FROM datos_personales WHERE usuario_id = '${req.session.idUsuario}'`;
  const codigo = req.params.inputCodigo;
  conexion.query(telefono, async (err, row) => {
    if (err) {
      throw err;
    } else {
      const numeroTelefonico = row[0].telefono.replace(/\s/g, "");
      try {
        const verificationCheck = await client.verify.v2
          .services("VA94d1b31b86d32e5f5d2cd8521c69ee4c")
          .verificationChecks.create({ to: numeroTelefonico, code: codigo });

        console.log(verificationCheck);

        if (verificationCheck.status === "approved") {
          console.log("Valido");
          res.json({ codigo: "Valido" });
          const telefonoVerificado = `INSERT INTO numeros_verificados (usuario_id, telefono) VALUES ('${req.session.idUsuario}', '${numeroTelefonico}')`;
          conexion.query(telefonoVerificado);
        } else {
          console.log("Invalido");
          res.json({ codigo: "Erroneo" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).send("Hubo un error al verificar el código");
      }
    }
  });
});

app.post("/verificarRegistro/:codigo/:captcha", async (req, res) => {
  const verificacionCaptcha = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=6LdjYrspAAAAAJn2Q6rIFphoWsw52t4cjRSv5w5p&response=${req.params.captcha}`,
    {
      method: "POST",
    }
  ).then((_res) => _res.json());

  if (verificacionCaptcha.success === true) {
    const consulta = `SELECT * FROM codigos_temporales WHERE codigo = ${req.params.codigo}`;

    conexion.query(consulta, (err, rows) => {
      if (err) {
        throw err;
      } else if (rows.length === 0) {
        res.json({ usuario: "Inexistente" });
      } else if (rows[0].usuario_id === req.session.idUsuario) {
        res.json({ usuario: "Mismo" });
      } else {
        const consulta = `SELECT * FROM registros_compartidos WHERE usuario_id = '${req.session.idUsuario}' AND usuarioCompartido_id = '${rows[0].usuario_id}' OR usuario_id = '${rows[0].usuario_id}' AND usuarioCompartido_id = '${req.session.idUsuario}'`;

        conexion.query(consulta, (err, row) => {
          if (err) {
            throw err;
          } else if (row.length === 0) {
            const ingreso1ro = `INSERT INTO registros_compartidos (usuario_id, usuarioCompartido_id) values ('${req.session.idUsuario}', '${rows[0].usuario_id}')`;
            const ingreso2do = `INSERT INTO registros_compartidos (usuario_id, usuarioCompartido_id) values ('${rows[0].usuario_id}', '${req.session.idUsuario}')`;
            conexion.query(ingreso1ro, (err, row) => {
              if (err) {
                throw err;
              } else {
                conexion.query(ingreso2do, (err, row) => {
                  if (err) {
                    throw err;
                  } else {
                    res.json({ usuario: "Ingresado" });
                  }
                });
              }
            });
          } else {
            res.json({ usuario: "Existente" });
          }
        });
      }
    });
  }
});

app.post("/guardarDatosPaciente", (req, res) => {
  const telefono = req.body.telefono;
  const vacunasPreestablecidas = req.body.vacunasPreestablecidas;
  const otrasVacunas = req.body.otrasVacunas;
  const historialMedico = req.body.historialMedico;

  const telefonoFormateado =
    telefono.substring(0, 3) +
    " " + // Los primeros dos caracteres
    telefono.substring(3, 6) +
    " " + // Del tercero al quinto (incluyendo el tercero)
    telefono.substring(6, 9) +
    " " + // Del sexto al séptimo (incluyendo el sexto)
    telefono.substring(9); // Del octavo al undécimo (incluyendo el undécimo)
  // telefono.substring(11); // El resto del número

  console.log(historialMedico.hospitalizacion_lesiones);
  console.log(historialMedico.hospitalizacion_lesiones ? 1 : 0);

  const usuario = `SELECT * FROM datos_personales WHERE telefono = '${telefonoFormateado}'`;

  conexion.query(usuario, (err, rowUsuario) => {
    if (err) {
      throw err;
    } else {
      console.log(vacunasPreestablecidas.BCG)
      const sqlVacunasPreestablecidas = `
    INSERT INTO vacunas_preestablecidas
    (usuario_id, fecha_bcg, fecha_hepatitisb1, fecha_hepatitisb2, fecha_hepatitisb3, fecha_prevalente1, fecha_prevalente2, fecha_prevalente3, fecha_prevalente4, fecha_dpt, fecha_rotavirus1, fecha_rotavirus2, fecha_rotavirus3, fecha_neumococica1, fecha_neumococica2, fecha_neumococica3, fecha_influenza1, fecha_influenza2, fecha_influenza3, fecha_srp1, fecha_srp2, fecha_sabin1, fecha_sabin2, fecha_sabin3, fecha_sabin4, fecha_sabin5, fecha_sabin6, fecha_sabin7, fecha_sabin8, fecha_sr)
    VALUES
    (
      '${rowUsuario[0].usuario_id}',
      '${vacunasPreestablecidas.BCG || "0000-00-00"}',
      '${vacunasPreestablecidas.Hepatitis_B_Primera || "0000-00-00"}',
      '${vacunasPreestablecidas.Hepatitis_B_Segunda || "0000-00-00"}',
      '${vacunasPreestablecidas.Hepatitis_B_Tercera || "0000-00-00"}',
      '${vacunasPreestablecidas.Pentavalente_Primera || "0000-00-00"}',
      '${vacunasPreestablecidas.Pentavalente_Segunda || "0000-00-00"}',
      '${vacunasPreestablecidas.Pentavalente_Tercera || "0000-00-00"}',
      '${vacunasPreestablecidas.Pentavalente_Cuarta || "0000-00-00"}',
      '${vacunasPreestablecidas.DPT || "0000-00-00"}',
      '${vacunasPreestablecidas.Rotavirus_Primera || "0000-00-00"}',
      '${vacunasPreestablecidas.Rotavirus_Segunda || "0000-00-00"}',
      '${vacunasPreestablecidas.Rotavirus_Tercera || "0000-00-00"}',
      '${vacunasPreestablecidas.Neumococica_Primera || "0000-00-00"}',
      '${vacunasPreestablecidas.Neumococica_Segunda || "0000-00-00"}',
      '${vacunasPreestablecidas.Neumococica_Refuerzo || "0000-00-00"}',
      '${vacunasPreestablecidas.Influenza_Primera || "0000-00-00"}',
      '${vacunasPreestablecidas.Influenza_Segunda || "0000-00-00"}',
      '${vacunasPreestablecidas.Influenza_Revacunación || "0000-00-00"}',
      '${vacunasPreestablecidas.SRP_Primera || "0000-00-00"}',
      '${vacunasPreestablecidas.SRP_Refuerzo || "0000-00-00"}',
      '${vacunasPreestablecidas.Sabin_1 || "0000-00-00"}',
      '${vacunasPreestablecidas.Sabin_2 || "0000-00-00"}',
      '${vacunasPreestablecidas.Sabin_3 || "0000-00-00"}',
      '${vacunasPreestablecidas.Sabin_4 || "0000-00-00"}',
      '${vacunasPreestablecidas.Sabin_5 || "0000-00-00"}',
      '${vacunasPreestablecidas.Sabin_6 || "0000-00-00"}',
      '${vacunasPreestablecidas.Sabin_7 || "0000-00-00"}',
      '${vacunasPreestablecidas.Sabin_8 || "0000-00-00"}',
      '${vacunasPreestablecidas.SR || "0000-00-00"}'
    )
    ON DUPLICATE KEY UPDATE
    fecha_bcg = '${vacunasPreestablecidas.BCG || "0000-00-00"}',
fecha_hepatitisb1 = '${vacunasPreestablecidas.Hepatitis_B_Primera || "0000-00-00"}',
fecha_hepatitisb2 = '${vacunasPreestablecidas.Hepatitis_B_Segunda || "0000-00-00"}',
fecha_hepatitisb3 = '${vacunasPreestablecidas.Hepatitis_B_Tercera || "0000-00-00"}',
fecha_prevalente1 = '${vacunasPreestablecidas.Pentavalente_Primera || "0000-00-00"}',
fecha_prevalente2 = '${vacunasPreestablecidas.Pentavalente_Segunda || "0000-00-00"}',
fecha_prevalente3 = '${vacunasPreestablecidas.Pentavalente_Tercera || "0000-00-00"}',
fecha_prevalente4 = '${vacunasPreestablecidas.Pentavalente_Cuarta || "0000-00-00"}',
fecha_dpt = '${vacunasPreestablecidas.DPT || "0000-00-00"}',
fecha_rotavirus1 = '${vacunasPreestablecidas.Rotavirus_Primera || "0000-00-00"}',
fecha_rotavirus2 = '${vacunasPreestablecidas.Rotavirus_Segunda || "0000-00-00"}',
fecha_rotavirus3 = '${vacunasPreestablecidas.Rotavirus_Tercera || "0000-00-00"}',
fecha_neumococica1 = '${vacunasPreestablecidas.Neumococica_Primera || "0000-00-00"}',
fecha_neumococica2 = '${vacunasPreestablecidas.Neumococica_Segunda || "0000-00-00"}',
fecha_neumococica3 = '${vacunasPreestablecidas.Neumococica_Refuerzo || "0000-00-00"}',
fecha_influenza1 = '${vacunasPreestablecidas.Influenza_Primera || "0000-00-00"}',
fecha_influenza2 = '${vacunasPreestablecidas.Influenza_Segunda || "0000-00-00"}',
fecha_influenza3 = '${vacunasPreestablecidas.Influenza_Revacunación || "0000-00-00"}',
fecha_srp1 = '${vacunasPreestablecidas.SRP_Primera || "0000-00-00"}',
fecha_srp2 = '${vacunasPreestablecidas.SRP_Refuerzo || "0000-00-00"}',
fecha_sabin1 = '${vacunasPreestablecidas.Sabin_1 || "0000-00-00"}',
fecha_sabin2 = '${vacunasPreestablecidas.Sabin_2 || "0000-00-00"}',
fecha_sabin3 = '${vacunasPreestablecidas.Sabin_3 || "0000-00-00"}',
fecha_sabin4 = '${vacunasPreestablecidas.Sabin_4 || "0000-00-00"}',
fecha_sabin5 = '${vacunasPreestablecidas.Sabin_5 || "0000-00-00"}',
fecha_sabin6 = '${vacunasPreestablecidas.Sabin_6 || "0000-00-00"}',
fecha_sabin7 = '${vacunasPreestablecidas.Sabin_7 || "0000-00-00"}',
fecha_sabin8 = '${vacunasPreestablecidas.Sabin_8 || "0000-00-00"}',
fecha_sr = '${vacunasPreestablecidas.SR || "0000-00-00"}';

`;
      conexion.query(sqlVacunasPreestablecidas);

      const sqlOtrasVacunas = `
    INSERT INTO vacuna (usuario_id, nombre, enfermedad_preventiva, dosis, edad_frecuencia, fecha_vacunacion)
    VALUES ('${rowUsuario[0].usuario_id}', '${otrasVacunas.Vacuna || ""}', '${otrasVacunas.Enfermedad_Preventiva || ""}', '${otrasVacunas.Dosis || ""}', '${otrasVacunas.Edad_Frecuencia || ""}', '${otrasVacunas.FechaVacunacion || "0000-00-00"}')
    ON DUPLICATE KEY UPDATE
    nombre = '${otrasVacunas.Vacuna || ""}',
    enfermedad_preventiva = '${otrasVacunas.Enfermedad_Preventiva || ""}',
    dosis = '${otrasVacunas.Dosis || ""}',
    edad_frecuencia = '${otrasVacunas.Edad_Frecuencia || ""}',
    fecha_vacunacion = '${otrasVacunas.FechaVacunacion || "0000-00-00"}';
`;
      conexion.query(sqlOtrasVacunas, (err, row) => {
        if (err) {
          throw err
        } else {
          console.log(sqlOtrasVacunas)
        }
      });

      const sqlHistorialMedico = `
    INSERT INTO historial_medico (
        usuario_id, 
        hospitalizacion_lesiones, 
        reacciones_alergicas, 
        problemas_corazon, 
        marcapasos_desfibrilador, 
        antecedentes_endocarditis, 
        implante_ortopedico, 
        fiebre_reumatica, 
        presion_arterial, 
        accidente_cerebrovascular, 
        problemas_sanguineos, 
        Hemorragia_prolongada_debido_a_un_corte, 
        Enfisema_falta_de_aliento_sarcoidosis, 
        Tuberculosis_sarampion_varicela, 
        Asma, 
        Problemas_respiratorios_o_de_sueno, 
        Problemas_renales, 
        Enfermedad_hepatica, 
        Ictericia, 
        Problemas_de_tiroides_enfermedad_paratiroidea_o_deficiencia_de_c, 
        Deficiencia_hormonal, 
        Colesterol_alto_o_toma_de_estatinas, 
        Diabetes, 
        Ulceras_estomacales_o_duodenales, 
        Trastornos_digestivos, 
        Osteoporosis_osteopenia, 
        Artritis, 
        Enfermedad_autoinmunitaria, 
        Glaucoma, 
        Lentes_de_contacto, 
        Lesiones_en_la_cabeza_o_en_el_cuello, 
        Epilepsia_convulsiones, 
        Trastornos_neurologicos, 
        Infecciones_virales_y_herpes_labial, 
        Cualquier_bulto_o_hinchazon_en_la_boca, 
        Urticaria_erupcion_cutanea_fiebre_del_heno, 
        ITS_ETS_VPH, 
        Hepatitis, 
        VIH_SIDA, 
        Tumores, 
        Terapia_de_radiacion, 
        Quimioterapia_medicamentos_inmunosupresores, 
        Dificultades_emocionales, 
        Tratamiento_psiquiatrico, 
        Medicamentos_antidepresivos, 
        Uso_de_alcohol_drogas_recreativas
    )
    VALUES (
        '${rowUsuario[0].usuario_id}', 
        ${historialMedico.hospitalizacion_lesiones ? 1 : 0}, 
        ${historialMedico.reacciones_alergicas ? 1 : 0}, 
        ${historialMedico.problemas_corazon ? 1 : 0}, 
        ${historialMedico.marcapasos_desfibrilador ? 1 : 0}, 
        ${historialMedico.antecedentes_endocarditis ? 1 : 0}, 
        ${historialMedico.implante_ortopedico ? 1 : 0}, 
        ${historialMedico.fiebre_reumatica ? 1 : 0}, 
        ${historialMedico.presion_arterial ? 1 : 0}, 
        ${historialMedico.accidente_cerebrovascular ? 1 : 0}, 
        ${historialMedico.problemas_sanguineos ? 1 : 0}, 
        ${historialMedico.Hemorragia_prolongada_debido_a_un_corte ? 1 : 0}, 
        ${historialMedico.Enfisema_falta_de_aliento_sarcoidosis ? 1 : 0}, 
        ${historialMedico.Tuberculosis_sarampion_varicela ? 1 : 0}, 
        ${historialMedico.Asma ? 1 : 0}, 
        ${historialMedico.Problemas_respiratorios_o_de_sueno ? 1 : 0}, 
        ${historialMedico.Problemas_renales ? 1 : 0}, 
        ${historialMedico.Enfermedad_hepatica ? 1 : 0}, 
        ${historialMedico.Ictericia ? 1 : 0}, 
        ${historialMedico.Problemas_de_tiroides_enfermedad_paratiroidea_o_deficiencia_de_c ? 1 : 0}, 
        ${historialMedico.Deficiencia_hormonal ? 1 : 0}, 
        ${historialMedico.Colesterol_alto_o_toma_de_estatinas ? 1 : 0}, 
        ${historialMedico.Diabetes ? 1 : 0}, 
        ${historialMedico.Ulceras_estomacales_o_duodenales ? 1 : 0}, 
        ${historialMedico.Trastornos_digestivos ? 1 : 0}, 
        ${historialMedico.Osteoporosis_osteopenia ? 1 : 0}, 
        ${historialMedico.Artritis ? 1 : 0}, 
        ${historialMedico.Enfermedad_autoinmunitaria ? 1 : 0}, 
        ${historialMedico.Glaucoma ? 1 : 0}, 
        ${historialMedico.Lentes_de_contacto ? 1 : 0}, 
        ${historialMedico.Lesiones_en_la_cabeza_o_en_el_cuello ? 1 : 0}, 
        ${historialMedico.Epilepsia_convulsiones ? 1 : 0}, 
        ${historialMedico.Trastornos_neurologicos ? 1 : 0}, 
        ${historialMedico.Infecciones_virales_y_herpes_labial ? 1 : 0}, 
        ${historialMedico.Cualquier_bulto_o_hinchazon_en_la_boca ? 1 : 0}, 
        ${historialMedico.Urticaria_erupcion_cutanea_fiebre_del_heno ? 1 : 0}, 
        ${historialMedico.ITS_ETS_VPH ? 1 : 0}, 
        ${historialMedico.Hepatitis ? 1 : 0}, 
        ${historialMedico.VIH_SIDA ? 1 : 0}, 
        ${historialMedico.Tumores ? 1 : 0}, 
        ${historialMedico.Terapia_de_radiacion ? 1 : 0}, 
        ${historialMedico.Quimioterapia_medicamentos_inmunosupresores ? 1 : 0}, 
        ${historialMedico.Dificultades_emocionales ? 1 : 0}, 
        ${historialMedico.Tratamiento_psiquiatrico ? 1 : 0}, 
        ${historialMedico.Medicamentos_antidepresivos ? 1 : 0}, 
        ${historialMedico.Uso_de_alcohol_drogas_recreativas ? 1 : 0}
    )
    ON DUPLICATE KEY UPDATE
    hospitalizacion_lesiones = ${historialMedico.hospitalizacion_lesiones ? 1 : 0},
    reacciones_alergicas = ${historialMedico.reacciones_alergicas ? 1 : 0},
    problemas_corazon = ${historialMedico.problemas_corazon ? 1 : 0},
    marcapasos_desfibrilador = ${historialMedico.marcapasos_desfibrilador ? 1 : 0},
    antecedentes_endocarditis = ${historialMedico.antecedentes_endocarditis ? 1 : 0},
    implante_ortopedico = ${historialMedico.implante_ortopedico ? 1 : 0},
    fiebre_reumatica = ${historialMedico.fiebre_reumatica ? 1 : 0},
    presion_arterial = ${historialMedico.presion_arterial ? 1 : 0},
    accidente_cerebrovascular = ${historialMedico.accidente_cerebrovascular ? 1 : 0},
    problemas_sanguineos = ${historialMedico.problemas_sanguineos ? 1 : 0},
    Hemorragia_prolongada_debido_a_un_corte = ${historialMedico.Hemorragia_prolongada_debido_a_un_corte ? 1 : 0},
    Enfisema_falta_de_aliento_sarcoidosis = ${historialMedico.Enfisema_falta_de_aliento_sarcoidosis ? 1 : 0},
    Tuberculosis_sarampion_varicela = ${historialMedico.Tuberculosis_sarampion_varicela ? 1 : 0},
    Asma = ${historialMedico.Asma ? 1 : 0},
    Problemas_respiratorios_o_de_sueno = ${historialMedico.Problemas_respiratorios_o_de_sueno ? 1 : 0},
    Problemas_renales = ${historialMedico.Problemas_renales ? 1 : 0},
    Enfermedad_hepatica = ${historialMedico.Enfermedad_hepatica ? 1 : 0},
    Ictericia = ${historialMedico.Ictericia ? 1 : 0},
    Problemas_de_tiroides_enfermedad_paratiroidea_o_deficiencia_de_c = ${historialMedico.Problemas_de_tiroides_enfermedad_paratiroidea_o_deficiencia_de_c ? 1 : 0},
    Deficiencia_hormonal = ${historialMedico.Deficiencia_hormonal ? 1 : 0},
    Colesterol_alto_o_toma_de_estatinas = ${historialMedico.Colesterol_alto_o_toma_de_estatinas ? 1 : 0},
    Diabetes = ${historialMedico.Diabetes ? 1 : 0},
    Ulceras_estomacales_o_duodenales = ${historialMedico.Ulceras_estomacales_o_duodenales ? 1 : 0},
    Trastornos_digestivos = ${historialMedico.Trastornos_digestivos ? 1 : 0},
    Osteoporosis_osteopenia = ${historialMedico.Osteoporosis_osteopenia ? 1 : 0},
    Artritis = ${historialMedico.Artritis ? 1 : 0},
    Enfermedad_autoinmunitaria = ${historialMedico.Enfermedad_autoinmunitaria ? 1 : 0},
    Glaucoma = ${historialMedico.Glaucoma ? 1 : 0},
    Lentes_de_contacto = ${historialMedico.Lentes_de_contacto ? 1 : 0},
    Lesiones_en_la_cabeza_o_en_el_cuello = ${historialMedico.Lesiones_en_la_cabeza_o_en_el_cuello ? 1 : 0},
    Epilepsia_convulsiones = ${historialMedico.Epilepsia_convulsiones ? 1 : 0},
    Trastornos_neurologicos = ${historialMedico.Trastornos_neurologicos ? 1 : 0},
    Infecciones_virales_y_herpes_labial = ${historialMedico.Infecciones_virales_y_herpes_labial ? 1 : 0},
    Cualquier_bulto_o_hinchazon_en_la_boca = ${historialMedico.Cualquier_bulto_o_hinchazon_en_la_boca ? 1 : 0},
    Urticaria_erupcion_cutanea_fiebre_del_heno = ${historialMedico.Urticaria_erupcion_cutanea_fiebre_del_heno ? 1 : 0},
    ITS_ETS_VPH = ${historialMedico.ITS_ETS_VPH ? 1 : 0},
    Hepatitis = ${historialMedico.Hepatitis ? 1 : 0},
    VIH_SIDA = ${historialMedico.VIH_SIDA ? 1 : 0},
    Tumores = ${historialMedico.Tumores ? 1 : 0},
    Terapia_de_radiacion = ${historialMedico.Terapia_de_radiacion ? 1 : 0},
    Quimioterapia_medicamentos_inmunosupresores = ${historialMedico.Quimioterapia_medicamentos_inmunosupresores ? 1 : 0},
    Dificultades_emocionales = ${historialMedico.Dificultades_emocionales ? 1 : 0},
    Tratamiento_psiquiatrico = ${historialMedico.Tratamiento_psiquiatrico ? 1 : 0},
    Medicamentos_antidepresivos = ${historialMedico.Medicamentos_antidepresivos ? 1 : 0},
    Uso_de_alcohol_drogas_recreativas = ${historialMedico.Uso_de_alcohol_drogas_recreativas ? 1 : 0};
`;

    conexion.query(sqlHistorialMedico, (err, row )=> {
      if (err) {
        throw err
      } else {
        console.log("Imprimideishon")
      }
    })

    }
  });

  console.log(telefono);
  // console.log(vacunasPreestablecidas);
  // console.log(historialMedico);
  // console.log(otrasVacunas);
});
