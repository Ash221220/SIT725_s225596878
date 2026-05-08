const socket = io();

const seatContainer = document.getElementById("seatContainer");

socket.on("loadSeats", (seats) => {
  renderSeats(seats);
});

socket.on("seatUpdated", (seats) => {
  renderSeats(seats);
});

function renderSeats(seats) {

  seatContainer.innerHTML = "";

  seats.forEach((seat) => {

    const div = document.createElement("div");

    div.classList.add("seat-card");

    div.innerHTML = `
      <h2>Seat ${seat.id}</h2>

      <p class="${seat.status === "Available" ? "available" : "reserved"}">
        ${seat.status}
      </p>

      <button onclick="toggleSeat(${seat.id})">
        ${seat.status === "Available" ? "Reserve" : "Release"}
      </button>
    `;

    seatContainer.appendChild(div);
  });
}

function toggleSeat(id) {
  socket.emit("toggleSeat", id);
}