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

        const roomHeap = new MinHeap();
        const rooms = []; // Para manter o registro de todas as reservas por quarto

        for (const reservation of sortedReservations) {
            let roomAssigned = false;
            
            // Verifica se o quarto com checkout mais próximo está disponível
            if (roomHeap.size() > 0) {
                const earliestRoom = roomHeap.peek();
                
                // Se o quarto com checkout mais próximo estiver disponível
                if (earliestRoom.lastCheckOut <= reservation.checkIn) {
                    // Atualiza o checkout do quarto e suas reservas
                    earliestRoom.lastCheckOut = reservation.checkOut;
                    earliestRoom.reservations.push(reservation);
                    reservation.room = earliestRoom.id;
                    roomHeap.updateRoot(reservation.checkOut);
                    roomAssigned = true;
                }
            }

            // Se nenhum quarto existente estiver disponível, cria um novo
            if (!roomAssigned) {
                const newRoom = {
                    id: rooms.length,
                    lastCheckOut: reservation.checkOut,
                    reservations: [reservation]
                };
                rooms.push(newRoom);
                roomHeap.insert(newRoom);
                reservation.room = newRoom.id;
            }
        }

        // Retorna os quartos com suas reservas
        return rooms;
    }
}
