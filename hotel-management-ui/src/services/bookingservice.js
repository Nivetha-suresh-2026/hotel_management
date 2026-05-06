export const createBooking = (data) => {
  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  const newBooking = { ...data, id: Date.now() };
  bookings.push(newBooking);
  localStorage.setItem("bookings", JSON.stringify(bookings));
  console.log("Booking saved:", newBooking);
  return newBooking;
};

export const getBookings = () => {
  return JSON.parse(localStorage.getItem("bookings") || "[]");
};