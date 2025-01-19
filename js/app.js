class HotelManager {
    constructor() {
        this.reservations = [];
        this.currentId = 1;
        this.timelineManager = new TimelineManager();
        this.loadReservations();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('reservationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addReservation();
        });

        // Delete confirmation
        document.getElementById('confirmDelete').addEventListener('click', () => {
            if (this.reservationToDelete) {
                this.deleteReservation(this.reservationToDelete);
                this.reservationToDelete = null;
                bootstrap.Modal.getInstance(document.getElementById('confirmationModal')).hide();
            }
        });
    }

    addReservation() {
        const guestName = document.getElementById('guestName').value;
        const checkIn = document.getElementById('checkIn').value;
        const checkOut = document.getElementById('checkOut').value;

        // Validações
        if (new Date(checkIn) >= new Date(checkOut)) {
            alert('A data de check-out deve ser posterior à data de check-in');
            return;
        }

        const reservation = new Reservation(
            this.currentId++,
            guestName,
            checkIn,
            checkOut
        );

        this.reservations.push(reservation);
        this.updateReservations();
        this.saveReservations();

        // Limpa o formulário
        document.getElementById('reservationForm').reset();
    }

    confirmDelete(id) {
        this.reservationToDelete = id;
        new bootstrap.Modal(document.getElementById('confirmationModal')).show();
    }

    deleteReservation(id) {
        this.reservations = this.reservations.filter(r => r.id !== id);
        this.updateReservations();
        this.saveReservations();
    }

    updateReservations() {
        // Aplica os algoritmos
        const scheduledReservations = HotelAlgorithms.intervalScheduling(this.reservations);
        const rooms = HotelAlgorithms.intervalPartitioning(this.reservations);

        // Atualiza estatísticas
        document.getElementById('totalReservations').textContent = this.reservations.length;
        document.getElementById('totalRooms').textContent = rooms.length;

        // Atualiza a lista de reservas
        const tbody = document.getElementById('reservationsList');
        tbody.innerHTML = '';

        this.reservations.forEach(reservation => {
            const tr = document.createElement('tr');
            tr.className = 'reservation-row';
            
            const isScheduled = scheduledReservations.some(r => r.id === reservation.id);
            if (!isScheduled) {
                tr.classList.add('table-warning');
            }

            tr.innerHTML = `
                <td>${reservation.guestName}</td>
                <td>${reservation.checkIn.toLocaleDateString()}</td>
                <td>${reservation.checkOut.toLocaleDateString()}</td>
                <td>${reservation.room !== null ? reservation.room + 1 : 'Não atribuído'}</td>
                <td>
                    <button class="btn btn-danger btn-sm btn-action" onclick="hotelManager.confirmDelete(${reservation.id})">
                        Excluir
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Atualiza a timeline se ela estiver visível
        if (document.getElementById('timelineModal').classList.contains('show')) {
            this.timelineManager.updateTimeline();
        }
    }

    saveReservations() {
        localStorage.setItem('reservations', JSON.stringify(this.reservations));
        localStorage.setItem('currentId', this.currentId.toString());
    }

    loadReservations() {
        const savedReservations = localStorage.getItem('reservations');
        const savedId = localStorage.getItem('currentId');

        if (savedReservations) {
            this.reservations = JSON.parse(savedReservations).map(r => Reservation.fromJSON(r));
        }

        if (savedId) {
            this.currentId = parseInt(savedId);
        }

        this.updateReservations();
    }
}

// Inicializa o gerenciador
const hotelManager = new HotelManager();
