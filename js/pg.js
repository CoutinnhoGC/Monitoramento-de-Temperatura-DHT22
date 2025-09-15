const firebaseConfig = {
  apiKey: "AIzaSyANWp3XMw2toLxgj0j0aenWLyoJ8kFkQns",
  authDomain: "iot-dht22-5ddc9.firebaseapp.com",
  databaseURL: "https://iot-dht22-5ddc9-default-rtdb.firebaseio.com",
  projectId: "iot-dht22-5ddc9",
  storageBucket: "iot-dht22-5ddc9.firebasestorage.app",
  messagingSenderId: "556062282873",
  appId: "1:556062282873:web:a7ad06c4cf699b542370a8"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

async function login() {
  const email = document.getElementById("campoEmail").value;
  const senha = document.getElementById("campoSenha").value;

  try {
    await auth.signInWithEmailAndPassword(email, senha);
    document.getElementById("telaLogin").classList.add("oculto");
    document.getElementById("painelMonitoramento").classList.remove("oculto");
    monitorarSensores();
  } catch (err) {
    console.error(err);
    document.getElementById("erroLogin").style.display = "block";
  }
}

async function logout() {
  await auth.signOut();
  document.getElementById("painelMonitoramento").classList.add("oculto");
  document.getElementById("telaLogin").classList.remove("oculto");
}

function calcularSensacao(temp, umid) {
  return (
    -8.784695 +
    1.61139411 * temp +
    2.338549 * umid +
    -0.14611605 * temp * umid +
    -0.012308094 * temp * temp +
    -0.016424828 * umid * umid +
    0.002211732 * temp * temp * umid +
    0.00072546 * temp * umid * umid +
    -0.000003582 * temp * temp * umid * umid
  ).toFixed(1);
}

function monitorarSensores() {
  const tempRef = db.ref("sensores/temperatura");
  const umidRef = db.ref("sensores/umidade");

  tempRef.on("value", snapshot => {
    const temp = snapshot.val();
    document.getElementById("valorTemp").textContent = temp;
    atualizarSensacao();
  });

  umidRef.on("value", snapshot => {
    const umid = snapshot.val();
    document.getElementById("valorUmid").textContent = umid;
    atualizarSensacao();
  });
}

function atualizarSensacao() {
  const temp = parseFloat(document.getElementById("valorTemp").textContent);
  const umid = parseFloat(document.getElementById("valorUmid").textContent);

  if (!isNaN(temp) && !isNaN(umid)) {
    document.getElementById("valorSensacao").textContent = calcularSensacao(temp, umid);
  }
}
