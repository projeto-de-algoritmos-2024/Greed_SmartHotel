class HotelAlgorithms {
    static intervalScheduling(reservations) {
        // Ordena as reservas pelo horário de check-out
        const sortedReservations = [...reservations].sort((a, b) => 
            a.checkOut - b.checkOut
        );

        const selected = [];
        let lastFinish = null;

        for (const reservation of sortedReservations) {
            if (lastFinish === null || reservation.checkIn >= lastFinish) {
                selected.push(reservation);
                lastFinish = reservation.checkOut;
            }
        }

        return selected;
    }

    static intervalPartitioning(reservations) {
        if (reservations.length === 0) return [];

        // Ordena as reservas pelo horário de check-in
        const sortedReservations = [...reservations].sort((a, b) => 
            a.checkIn - b.checkIn
        );

        const rooms = [[]];  // Lista de quartos, cada quarto contém uma lista de reservas
        
        for (const reservation of sortedReservations) {
            // Tenta encontrar um quarto disponível
            let roomFound = false;
            
            for (let i = 0; i < rooms.length; i++) {
                const room = rooms[i];
                if (room.length === 0 || !this.hasOverlap(room, reservation)) {
                    room.push(reservation);
                    reservation.room = i;
                    roomFound = true;
                    break;
                }
            }
            
            // Se não encontrou quarto disponível, cria um novo
            if (!roomFound) {
                rooms.push([reservation]);
                reservation.room = rooms.length - 1;
            }
        }

        return rooms;
    }

    static hasOverlap(room, newReservation) {
        return room.some(existingReservation => 
            existingReservation.overlaps(newReservation)
        );
    }
}
