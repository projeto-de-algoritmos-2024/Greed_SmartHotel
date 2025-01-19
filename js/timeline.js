class TimelineManager {
    constructor() {
        this.timeline = null;
        this.items = new vis.DataSet();
        this.groups = new vis.DataSet();
        this.currentDate = new Date();
        this.setupTimeline();
        this.setupControls();
    }

    setupTimeline() {
        const container = document.getElementById('timeline');
        
        // Configurações da timeline
        const options = {
            orientation: 'top',
            stack: false,
            showCurrentTime: true,
            verticalScroll: true,
            horizontalScroll: false,
            zoomKey: 'ctrlKey',
            format: {
                minorLabels: {
                    minute: 'h:mma',
                    hour: 'ha',
                    day: 'D',
                    week: 'D MMM',
                }
            },
            template: function (item) {
                return `
                    <div class="timeline-item">
                        <strong>${item.guest}</strong><br>
                        ${new Date(item.start).toLocaleDateString()} - 
                        ${new Date(item.end).toLocaleDateString()}
                    </div>
                `;
            }
        };

        this.timeline = new vis.Timeline(container, this.items, this.groups, options);
    }

    setupControls() {
        // Adiciona navegação por mês
        document.getElementById('prevMonth').onclick = () => {
            this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
            this.updateTimelineWindow();
            this.updateMonthDisplay();
        };

        document.getElementById('nextMonth').onclick = () => {
            this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
            this.updateTimelineWindow();
            this.updateMonthDisplay();
        };

        document.getElementById('currentMonth').onclick = () => {
            this.currentDate = new Date();
            this.updateTimelineWindow();
            this.updateMonthDisplay();
        };

        // Controles de zoom
        document.getElementById('zoomIn').onclick = () => {
            this.timeline.zoomIn(0.5);
        };

        document.getElementById('zoomOut').onclick = () => {
            this.timeline.zoomOut(0.5);
        };

        document.getElementById('fitAll').onclick = () => {
            this.timeline.fit();
        };

        // Atualiza a timeline quando o modal é aberto
        document.getElementById('timelineModal').addEventListener('shown.bs.modal', () => {
            this.updateTimeline();
            this.updateMonthDisplay();
            this.updateTimelineWindow();
            this.adjustTimelineHeight();
        });

        // Ajusta a altura quando a janela é redimensionada
        window.addEventListener('resize', () => {
            if (document.getElementById('timelineModal').classList.contains('show')) {
                this.adjustTimelineHeight();
            }
        });
    }

    adjustTimelineHeight() {
        const numRooms = this.groups.length;
        const minHeight = 400;
        const roomHeight = 50; // altura por quarto
        const containerHeight = Math.max(minHeight, numRooms * roomHeight);
        
        document.querySelector('.timeline-wrapper').style.height = `${containerHeight}px`;
        this.timeline.redraw();
    }

    updateTimelineWindow() {
        const start = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const end = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0, 23, 59, 59);
        this.timeline.setWindow(start, end, { animation: false });
    }

    updateMonthDisplay() {
        const monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        
        document.getElementById('currentMonthDisplay').textContent = 
            `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    }

    updateTimeline() {
        // Limpa os dados existentes
        this.items.clear();
        this.groups.clear();

        // Adiciona os quartos como grupos
        const rooms = {};
        hotelManager.reservations.forEach(reservation => {
            if (reservation.room !== null && !rooms[reservation.room]) {
                rooms[reservation.room] = true;
                this.groups.add({
                    id: reservation.room,
                    content: `Quarto ${reservation.room + 1}`
                });
            }
        });

        // Adiciona as reservas como items
        hotelManager.reservations.forEach(reservation => {
            if (reservation.room !== null) {
                this.items.add({
                    id: reservation.id,
                    group: reservation.room,
                    start: reservation.checkIn,
                    end: reservation.checkOut,
                    content: '',
                    guest: reservation.guestName,
                    className: 'reservation-timeline-item'
                });
            }
        });

        // Atualiza a janela de visualização e altura
        this.updateTimelineWindow();
        this.adjustTimelineHeight();
    }
}
