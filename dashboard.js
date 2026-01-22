// --------------------------
// Données de démo (vide au départ ou récupérées depuis localStorage)
// --------------------------
let locations = JSON.parse(localStorage.getItem("locations")) || [];

// --------------------------
// Remplissage du tableau
// --------------------------
const table = document.getElementById("locationTable");

function refreshTable() {
    table.innerHTML = "";
    locations.forEach((loc, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${loc.client}</td>
            <td>${loc.car}</td>
            <td>${loc.driver}</td>
            <td>${loc.date}</td>
            <td class="actions">
                <button class="edit-btn" data-index="${index}"><i class="fas fa-pen"></i></button>
                <button class="delete-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        table.appendChild(row);
    });

    // Événements pour supprimer
    document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const index = btn.dataset.index;

        if (locations.length === 0) {
            alert("Aucune location à supprimer !");
            return;
        }

        const confirmDelete = confirm(
            "Voulez-vous vraiment supprimer cette location ?"
        );

        if (confirmDelete) {
            locations.splice(index, 1); // Supprime UNE location
            saveLocations();            // Met à jour localStorage
            refreshTable();             // Rafraîchit le tableau
        }
    });
});


    // Événements pour modifier
    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const i = btn.dataset.index;
            const loc = locations[i];

            document.getElementById("client").value = loc.client;
            document.getElementById("car").value = loc.car;
            document.getElementById("driver").value = loc.driver;
            document.getElementById("date").value = loc.date;

            modal.style.display = "block";

            // Modifier l'onsubmit pour mettre à jour
            locationForm.onsubmit = (e) => {
                e.preventDefault();
                loc.client = document.getElementById("client").value;
                loc.car = document.getElementById("car").value;
                loc.driver = document.getElementById("driver").value;
                loc.date = document.getElementById("date").value;

                saveLocations(); // Sauvegarde après modification
                refreshTable();
                locationForm.reset();
                modal.style.display = "none";

                locationForm.onsubmit = addLocation; // remettre l'onsubmit pour ajout
            };
        });
    });

    // Bouton Supprimer tout
    const deleteAllBtn = document.getElementById("deleteAllBtn");
    function updateDeleteAllButton() {
    deleteAllBtn.disabled = locations.length === 0;
}

    deleteAllBtn.onclick = () => {
        if (locations.length === 0) {
            alert("Aucune location à supprimer !");
            return;
        }

        const confirmDelete = confirm(
            "Voulez-vous vraiment supprimer toutes les locations ?"
        );

        if (confirmDelete) {
            locations.length = 0;
            saveLocations();
            refreshTable();
        }
    };

updateDeleteAllButton();

}

// --------------------------
// Fonction pour sauvegarder dans localStorage
// --------------------------
function saveLocations() {
    localStorage.setItem("locations", JSON.stringify(locations));
}

// --------------------------
// Filtre / recherche
// --------------------------
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
    const filter = searchInput.value.toLowerCase();
    table.innerHTML = "";

    locations.forEach((loc, index) => {
        const rowText = `${loc.client} ${loc.car} ${loc.driver}`.toLowerCase();
        if (rowText.includes(filter)) {
            const row = document.createElement("tr");

            function highlight(text) {
                if (!filter) return text;
                const regex = new RegExp(`(${filter})`, "gi");
                return text.replace(regex, '<span class="highlight">$1</span>');
            }

            row.innerHTML = `
                <td>${highlight(loc.client)}</td>
                <td>${highlight(loc.car)}</td>
                <td>${highlight(loc.driver)}</td>
                <td>${loc.date}</td>
                <td class="actions">
                    <button class="edit-btn" data-index="${index}"><i class="fas fa-pen"></i></button>
                    <button class="delete-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            table.appendChild(row);
        }
    });

    // Réattacher événements pour Modifier/Supprimer
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const i = btn.dataset.index;
            locations.splice(i, 1);
            saveLocations();
            refreshTable();
        });
    });

    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const i = btn.dataset.index;
            const loc = locations[i];

            document.getElementById("client").value = loc.client;
            document.getElementById("car").value = loc.car;
            document.getElementById("driver").value = loc.driver;
            document.getElementById("date").value = loc.date;

            modal.style.display = "block";

            locationForm.onsubmit = (e) => {
                e.preventDefault();
                loc.client = document.getElementById("client").value;
                loc.car = document.getElementById("car").value;
                loc.driver = document.getElementById("driver").value;
                loc.date = document.getElementById("date").value;

                saveLocations();
                refreshTable();
                locationForm.reset();
                modal.style.display = "none";

                locationForm.onsubmit = addLocation;
            };
        });
    });
});

// --------------------------
// Modal nouvelle location
// --------------------------
const modal = document.getElementById("locationModal");
const openBtn = document.getElementById("openModal");
const closeBtn = modal.querySelector(".close");
const locationForm = document.getElementById("locationForm");

// Fonction ajout classique
function addLocation(e) {
    e.preventDefault();
    const client = document.getElementById("client").value;
    const car = document.getElementById("car").value;
    const driver = document.getElementById("driver").value;
    const date = document.getElementById("date").value;

    locations.push({ client, car, driver, date });
    saveLocations();  // Sauvegarde dans localStorage
    refreshTable();
    locationForm.reset();
    modal.style.display = "none";
}

openBtn.addEventListener("click", () => {
    modal.style.display = "block";
    locationForm.onsubmit = addLocation;
});

closeBtn.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

// --------------------------
// Hamburger menu responsive
// --------------------------
document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    const hamburger = document.querySelector(".hamburger-btn");

    hamburger.addEventListener("click", () => {
        sidebar.classList.toggle("show");
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove("show");
        }
    });
});

function refreshCards() {
    // Total des locations
    document.getElementById("locationsCount").textContent = locations.length;

    // Clients uniques (par passeport)
    const clients = new Set(locations.map(l => l.passport));
    document.getElementById("clientsCount").textContent = clients.size;

    // Voitures uniques (par plaque)
    const cars = new Set(locations.map(l => l.carPlate));
    document.getElementById("carsCount").textContent = cars.size;

    // Chauffeurs uniques (par permis)
    const drivers = new Set(locations.map(l => l.license));
    document.getElementById("driversCount").textContent = drivers.size;
}

refreshCards();
refreshTable();









