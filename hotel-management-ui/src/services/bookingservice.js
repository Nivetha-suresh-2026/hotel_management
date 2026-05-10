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

    // 2. Handle Guest Insertion/Update
    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .upsert({
        full_name: formData.guestName,
        phone: formData.contact,
        email: formData.email,
        id_proof_number: formData.aadhar,
        created_by: profile.id
      }, { onConflict: 'phone' }) 
      .select()
      .single();

    if (guestError) throw guestError;

    // 3. Date Calculations
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const totalNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)) || 1;
    
    const prices = {
      "Standard": 4500,
      "Deluxe": 7500,
      "Suite": 15000
    };
    const pricePerNight = prices[formData.roomType] || 4500;
    const totalAmount = pricePerNight * totalNights;

    // 4. Fetch a default branch
    const { data: branch } = await supabase.from('hotel_branches').select('id').limit(1).single();
    if (!branch) throw new Error("No branches available to book");

    // 5. Create Booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        branch_id: branch.id,
        guest_id: guest.id,
        check_in_date: formData.checkIn,
        check_out_date: formData.checkOut,
        status: 'reserved',
        price_per_night: pricePerNight,
        total_nights: totalNights,
        total_amount: totalAmount,
        number_of_guests: parseInt(formData.totalMembers),
        created_by: profile.id
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
      hotel_branches (branch_name)
    `)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
  return data;
};