import { supabase } from '../lib/supabaseClient';

export const createBooking = async (formData) => {
  try {
    // 1. Get current user profile ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No active session found. Please log in again.");

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (!profile) throw new Error("User profile not found");

    // 2. Handle Guest Insertion (Check if exists by phone, else create)
    let guest;
    const { data: existingGuest } = await supabase
      .from('guests')
      .select('id')
      .eq('phone', formData.contact)
      .single();

    if (existingGuest) {
      guest = existingGuest;
    } else {
      const { data: newGuest, error: guestError } = await supabase
        .from('guests')
        .insert([{
          full_name: formData.guestName,
          phone: formData.contact,
          email: formData.email,
          id_proof_number: formData.aadhar,
          created_by: profile.id
        }])
        .select()
        .single();
      
      if (guestError) throw guestError;
      guest = newGuest;
    }

    // 3. Fetch Room Details for price calculation
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('room_type')
      .eq('id', formData.roomId)
      .single();
    
    if (roomError || !room) throw new Error("Selected room not found");

    // 4. Date Calculations
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const totalNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)) || 1;
    
    // Using simple logic for prices based on room type
    const prices = {
      "AC": 5000,
      "NON AC": 3000,
      "Standard": 4500,
      "Deluxe": 7500,
      "Suite": 15000
    };
    const pricePerNight = prices[room.room_type] || 4000;
    const totalAmount = pricePerNight * totalNights;

    // 5. Create Booking using the new schema
    // Note: removed created_by from bookings as it's not in the latest schema provided
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        branch_id: formData.branchId,
        guest_id: guest.id,
        room_id: formData.roomId,
        check_in_date: formData.checkIn,
        check_out_date: formData.checkOut,
        status: 'reserved',
        total_nights: totalNights,
        total_amount: totalAmount,
        advance_paid: parseFloat(formData.advancePaid) || 0,
        payment_status: formData.paymentStatus,
        special_requests: formData.specialRequests,
        number_of_guests: parseInt(formData.totalMembers)
      }])
      .select()
      .single();

    if (bookingError) throw bookingError;

    console.log("Booking created in Supabase:", booking);
    return booking;
  } catch (error) {
    console.error("Error in createBooking:", error);
    throw error;
  }
};

export const getBookings = async () => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      guests (full_name, phone, email, id_proof_number),
      hotel_branches (branch_name),
      rooms (room_number, room_type)
    `)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
  return data;
};