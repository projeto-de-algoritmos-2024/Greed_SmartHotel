class Reservation {
    constructor(id, guestName, checkIn, checkOut) {
        this.id = id;
        this.guestName = guestName;
        this.checkIn = new Date(checkIn);
        this.checkOut = new Date(checkOut);
        this.room = null;
    }

    static fromJSON(json) {
        const reservation = new Reservation(
            json.id,
            json.guestName,
            json.checkIn,
            json.checkOut
        );
        reservation.room = json.room;
        return reservation;
    }

    toJSON() {
        return {
            id: this.id,
            guestName: this.guestName,
            checkIn: this.checkIn,
            checkOut: this.checkOut,
            room: this.room
        };
    }

    overlaps(other) {
        return this.checkIn < other.checkOut && other.checkIn < this.checkOut;
    }
}
