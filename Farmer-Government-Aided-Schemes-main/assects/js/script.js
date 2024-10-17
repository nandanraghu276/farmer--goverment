// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDGFkadh6Orx3Z5RcrDretmfckIgsTrTVQ",
    authDomain: "fire-6e51d.firebaseapp.com",
    projectId: "fire-6e51d",
    storageBucket: "fire-6e51d.appspot.com",
    messagingSenderId: "60383305916",
    appId: "1:60383305916:web:33dedf7225271910f170b9",
    measurementId: "G-P8GET6M3S5"
  };
  
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

auth.onAuthStateChanged(user => {
    if (user) {
        const email = user.email;
        if (email === "admin@example.com") {
            document.getElementById('auth').style.display = 'none';
            document.getElementById('register').style.display = 'none';
            document.getElementById('user').style.display = 'none';
            document.getElementById('admin').style.display = 'block';
        } else{
            document.getElementById('auth').style.display = 'none';
            document.getElementById('register').style.display = 'none';
            document.getElementById('admin').style.display = 'none';
            document.getElementById('user').style.display = 'block';
        }
    } else {
        document.getElementById('auth').style.display = 'block';
        document.getElementById('register').style.display = 'none';
        document.getElementById('user').style.display = 'none';
        document.getElementById('admin').style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', (event) => {
    const heading = document.getElementById('main-heading');
    heading.textContent = 'Farmer Government Aided Schemes';
});


document.getElementById('showRegister').addEventListener('click', () => {
    document.getElementById('auth').style.display = 'none';
    document.getElementById('register').style.display = 'block';
});

document.getElementById('cancelRegister').addEventListener('click', () => {
    document.getElementById('register').style.display = 'none';
    document.getElementById('auth').style.display = 'block';
});

function register() {
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            alert('Registration successful!');
            document.getElementById('register').style.display = 'none';
            document.getElementById('auth').style.display = 'block';
        })
        .catch(error => {
            alert(error.message);
        });
}

function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    auth.signInWithEmailAndPassword(email, password)
        .catch(error => {
            alert(error.message);
        });
}

function logout() {
    auth.signOut();
}

function viewCropDetails() {
    const content = document.getElementById('userContent');
    content.innerHTML = '';
    db.collection('crops').get().then(snapshot => {
        snapshot.forEach(doc => {
            content.innerHTML += `<p>${doc.data().name}: ${doc.data().details}</p>`;
        });
    });
}

function viewGovtSchemes() {
    const content = document.getElementById('userContent');
    content.innerHTML = '';
    db.collection('schemes').get().then(snapshot => {
        snapshot.forEach(doc => {
            content.innerHTML += `<p>${doc.data().name}: ${doc.data().details}</p>`;
        });
    });
}

function applyForScheme() {
    const scheme = prompt('Enter scheme name:');
    if (scheme) {
        db.collection('applications').add({
            userId: auth.currentUser.uid,
            scheme: scheme,
            status: 'Pending'
        }).then(() => {
            alert('Application submitted!');
        });
    }
}

function viewApplicationStatus() {
    const content = document.getElementById('userContent');
    content.innerHTML = '';
    db.collection('applications').where('userId', '==', auth.currentUser.uid).get().then(snapshot => {
        snapshot.forEach(doc => {
            content.innerHTML += `<p>${doc.data().scheme}: ${doc.data().status}</p>`;
        });
    });
}

function postCropDetails() {
    const name = prompt('Enter crop name:');
    const details = prompt('Enter crop details:');
    if (name && details) {
        db.collection('crops').add({
            name: name,
            details: details
        }).then(() => {
            alert('Crop details posted!');
        });
    }
}

function postGovtSchemes() {
    const name = prompt('Enter scheme name:');
    const details = prompt('Enter scheme details:');
    if (name && details) {
        db.collection('schemes').add({
            name: name,
            details: details
        }).then(() => {
            alert('Government scheme posted!');
        });
    }
}

function approveSchemeRequests() {
    const content = document.getElementById('adminContent');
    content.innerHTML = '';
    db.collection('applications').where('status', '==', 'Pending').get().then(snapshot => {
        snapshot.forEach(doc => {
            const data = doc.data();
            const approveButton = `<button onclick="approveRequest('${doc.id}')">Approve</button>`;
            content.innerHTML += `<p>${data.scheme} - ${data.userId} ${approveButton}</p>`;
        });
    });
}

function approveRequest(id) {
    db.collection('applications').doc(id).update({
        status: 'Approved'
    }).then(() => {
        alert('Request approved!');
        approveSchemeRequests();
    });
}