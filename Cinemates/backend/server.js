// server.js
const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const crypto = require('crypto');


// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

const cors = require('cors');


app.use(cors({origin:' http://localhost:5173'}));
app.use(bodyParser.json());

// Create PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Handle form submission for customer details
app.post('/api/book-now', async (req, res) => {
    console.log('Received data:', req.body);  // Log the received data
  
    const {
      booking_name,
      number_of_persons,
      email,
      phone_no1,
      alternate_no,
      decoration_needed = 'N',
    } = req.body;
  
    // Check for missing required fields
    if (!booking_name || !email || !phone_no1) {
      return res.status(400).json({ error: 'Booking name, email, and phone number are required' });
    }
  
    try {
      const result = await pool.query(
        `INSERT INTO co_dashboard.t_customer_details 
        (booking_name, number_of_persons, email, phone_no1, alternate_no, decoration_needed) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING cust_id`,
        [booking_name, number_of_persons, email, phone_no1, alternate_no, decoration_needed]
      );
  
      res.status(200).json({
        message: 'Customer details added successfully',
        customerId: result.rows[0].cust_id,
      });
    } catch (error) {
      console.error('Error inserting customer details:', error);
      res.status(500).json({ error: 'An error occurred while adding the customer details' });
    }
  });
  


//////locations display///////////
app.get('/api/locations', async (req, res) => {
    try {
      const result = await pool.query(`SELECT * FROM co_adminportal.t_locations where public_flag = 'Y'`);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching locations:', error);
      res.status(500).json({ error: 'Failed to fetch locations' });
    }
  });



 
  
app.get('/api/booked_slots', async (req, res) => {
  const { date } = req.query; // Get date from query params

  try {
    // Fetch all booked slots for the specific date
    const result = await pool.query(
      'SELECT * FROM co_adminportal.booked_slots WHERE booked_date = $1',
      [date]
    );
    res.json(result.rows); // Send the list of booked slots as response
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    res.status(500).json({ error: 'Failed to fetch booked slots' });
  }
});


///theatres/////
app.get('/api/theaters', async (req, res) => {
    const { loc_id } = req.query; // Get loc_id from query params
    try {
      const result = await pool.query(
        `SELECT * FROM co_adminportal.t_theater WHERE loc_id = $1`,
        [loc_id]
      );
      res.json(result.rows); // Send the list of theaters as response
    } catch (error) {
      console.error('Error fetching theaters:', error);
      res.status(500).json({ error: 'Failed to fetch theaters' });
    }
  });
 
  

  

// Endpoint to check if a slot is available for a specific theater and date
app.post('/api/check_slot', async (req, res) => {
  const { theater_id, loc_id, booked_date, booked_slot } = req.body;

  try {
    // Check if the slot is already booked for the specific date, theater, and location
    const checkResult = await pool.query(
      'SELECT * FROM co_adminportal.booked_slots WHERE Booked_date = $1 AND Booked_slot = $2 AND theater_id = $3 AND loc_id = $4',
      [booked_date, booked_slot, theater_id, loc_id] // Make sure loc_id and theater_id are used correctly
    );

    if (checkResult.rows.length > 0) {
      // Slot is already booked for this specific combination
      return res.status(400).send('Slot already booked');
    }

    // Slot is available
    res.status(200).send('Slot is available');
  } catch (error) {
    console.error('Error checking slot availability:', error);
    res.status(500).send('Server Error');
  }
});




// Endpoint to get the list of occasions
app.get('/api/occasions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM co_adminportal.t_occasions');
    res.json(result.rows); // Send the list of occasions as a response
  } catch (error) {
    console.error('Error fetching occasions:', error);
    res.status(500).send('Server Error');
  }
});

app.post('/api/save-occasion', async (req, res) => {
  const { cust_id, booking_occasion, booking_nickname, partner_nickname } = req.body;

  // Check if all required data is provided
  if (!cust_id || !booking_occasion || !booking_nickname ) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO co_dashboard.t_customer_occasion
        (cust_id, booking_occasion, booking_nickname, partner_nickname, create_date)
        VALUES ($1, $2, $3, $4, CURRENT_DATE)`,
      [cust_id, booking_occasion, booking_nickname, partner_nickname]
    );

    res.status(201).json({ message: 'Occasion details saved successfully' });
  } catch (err) {
    console.error('Error saving occasion details:', err);
    res.status(500).json({ message: 'Error saving occasion details' });
  }
});




// app.post('/api/save-cake', async (req, res) => {
//   const { cust_id, cake_name, quantity, item_price, weight, egg_eggless } = req.body;

//   if (!cust_id || !cake_name || !quantity || !item_price) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   try {
//     // First, delete any existing cake entries for this customer to avoid duplicates
//     await pool.query(
//       'DELETE FROM co_dashboard.t_customer_cake WHERE cust_id = $1 AND cake_name = $2',
//       [cust_id, cake_name]
//     );

//     // Then insert the new cake entry
//     const result = await pool.query(
//       `INSERT INTO co_dashboard.t_customer_cake
//         (cust_id, cake_name, quantity, item_price, weight, egg_eggless, createdate)
//         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE)`,
//       [cust_id, cake_name, quantity, item_price, weight || null, egg_eggless || null]
//     );

//     res.status(201).json({ message: 'Cake details saved successfully' });
//   } catch (err) {
//     console.error('Error saving cake:', err);
//     res.status(500).json({ message: 'Error saving cake details' });
//   }
// });



// app.get('/api/cakes', async (req, res) => {
//   try {
//     const { egg_eggless } = req.query;

//     let query = 'SELECT cake_id, cake_name, cake_image_url, egg_eggless, cake_price1, cake_quantity1, cake_price2, cake_quantity2, cake_price3, cake_quantity3, cake_price4, cake_quantity4, cake_price5, cake_quantity5, tagline1, tagline2, tagline3 FROM co_adminportal.t_cakes';
//     let params = [];

//     if (egg_eggless) {
//       query += ' WHERE egg_eggless = $1';
//       params.push(egg_eggless);
//     }

//     query += ' ORDER BY cake_name ASC';

//     const result = await pool.query(query, params);

//     // Validate egg_eggless values in database
//     const validatedCakes = result.rows.map(cake => {
//       if (!['egg', 'eggless'].includes(cake.egg_eggless)) {
//         cake.egg_eggless = 'egg'; // Default to egg if invalid
//       }
//       return cake;
//     });

//     res.json(validatedCakes);
//   } catch (error) {
//     console.error('Error fetching cakes:', error);
//     res.status(500).json({
//       error: 'Failed to fetch cakes',
//       details: error.message,
//     });
//   }
// });

// review
   
app.post('/api/save-cakes', async (req, res) => {
  const { cust_id, cake_name, quantity, item_price, weight, egg_eggless } = req.body;

  // Validate required fields
  if (!cust_id || !cake_name || !quantity || !item_price) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Parse numeric fields
  const parsedQuantity = parseInt(quantity, 10);
  const parsedItemPrice = parseFloat(item_price);

  if (isNaN(parsedQuantity) || isNaN(parsedItemPrice)) {
    return res.status(400).json({ message: 'Invalid quantity or item_price format' });
  }

  try {
    // Delete existing entries
    await pool.query(
      'DELETE FROM co_dashboard.t_customer_cake WHERE cust_id = $1 AND LOWER(cake_name) = LOWER($2)',
      [cust_id, cake_name]
    );

    // Insert new entry with only the columns that exist
    // Include weight and egg type info in the cake_name for reference
    const cakeNameWithDetails = `${cake_name} (${weight || '500g'}, ${egg_eggless || 'eggless'})`;
    
    const result = await pool.query(
      `INSERT INTO co_dashboard.t_customer_cake
        (cust_id, cake_name, quantity, item_price, createdate)
        VALUES ($1, $2, $3, $4, CURRENT_DATE)
        RETURNING *`,
      [cust_id, cakeNameWithDetails, parsedQuantity, parsedItemPrice]
    );

    console.log('Cake saved successfully:', result.rows[0]);
    res.status(201).json({ 
      success: true,
      message: 'Cake details saved successfully', 
      data: result.rows[0] 
    });
  } catch (err) {
    console.error('Error saving cake:', err.stack);
    res.status(500).json({ message: 'Error saving cake details', error: err.message });
  }
});

app.get('/api/food-items', async (req, res) => {
  try {
    const query = `
      SELECT 
        food_id,
        food_item_name,
        food_item_url,
        create_date,
        food_price,
        tag_line_1,
        tag_line_2,
        tag_line_3
      FROM co_adminportal.t_food_items
      WHERE create_date <= CURRENT_DATE
      ORDER BY create_date DESC;
    `;

    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching food items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.get('/api/cakes', async (req, res) => {
  try {
    const query = `
      SELECT 
        cake_id, 
        cake_name, 
        cake_image_url, 
        egg_eggless, 
        cake_price1, 
        cake_quantity1, 
        cake_price2, 
        cake_quantity2, 
        cake_price3, 
        cake_quantity3, 
        cake_price4, 
        cake_quantity4, 
        cake_price5, 
        cake_quantity5, 
        tagline1, 
        tagline2, 
        tagline3 
      FROM co_adminportal.t_cakes 
      ORDER BY cake_name ASC
    `;

    const result = await pool.query(query);

    // Validate egg_eggless values in database
    const validatedCakes = result.rows.map(cake => {
      if (!['egg', 'eggless'].includes(cake.egg_eggless)) {
        cake.egg_eggless = 'egg'; // Default to egg if invalid
      }
      return cake;
    });

    res.json(validatedCakes);
  } catch (error) {
    console.error('Error fetching cakes:', error);
    res.status(500).json({
      error: 'Failed to fetch cakes',
      details: error.message,
    });
  }
});


app.post('/api/reviews', async (req, res) => {
  const { name, review, rating } = req.body;
  console.log('Incoming review:', { name, review, rating });

  if (!name || !review || typeof rating !== 'number') {
    return res.status(400).json({ message: 'Name, review, and rating are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO co_dashboard.t_customer_review (name, review_text, rating) VALUES ($1, $2, $3)`,
      [name, review, rating]
    );
    console.log('DB insert result:', result);
    res.status(200).json({ message: 'Review submitted successfully' });
  } catch (err) {
    console.error('Review submission error:', err.stack || err.message || err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.get('/api/get_reviews', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, review_text, rating, created_at 
       FROM co_dashboard.t_customer_review 
       ORDER BY created_at DESC`
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching reviews:', err.stack || err.message || err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.get('/api/landingpage-images', async (req, res) => {
  try {
    const query = `
      SELECT url_1, url_2, url_3, url_4, url_5, url_6, url_7, url_8, url_9, url_10
      FROM co_adminportal.t_landingpage_images
    `;

    const result = await pool.query(query);

    const mediaItems = result.rows.flatMap(row => {
      return Object.values(row)
        .filter(url => url)
        .map(url => ({
          type: 'image', // or determine type based on URL
          src: url
        }));
    });

    res.json({ success: true, data: mediaItems });
  } catch (err) {
    console.error('Error fetching gallery images:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});



app.get('/api/addons', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM co_adminportal.t_addons');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching add-ons:', err);
    res.status(500).json({ message: 'Error fetching add-ons' });
  }
});

app.post('/api/save-addon', async (req, res) => {
  const { cust_id, addon_name, quantity, addons_price } = req.body;

  if (!cust_id || !addon_name || !quantity || !addons_price) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO co_dashboard.t_customer_addon (cust_id, addon_name, quantity, addons_price, create_date)
       VALUES ($1, $2, $3, $4, CURRENT_DATE)`,
      [cust_id, addon_name, quantity, addons_price]
    );

    res.status(201).json({ message: 'Add-on details saved successfully' });
  } catch (err) {
    console.error('Error saving add-on:', err);
    res.status(500).json({ message: 'Error saving add-on details' });
  }
});



app.post('/api/booked-slots', async (req, res) => {
  try {
    // Extract data from request body
    const { theater_id, loc_id, booked_date, booked_slot } = req.body;

    // Validate required fields
    if (!theater_id || !loc_id || !booked_date || !booked_slot) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields: theater_id, loc_id, booked_date, booked_slot' 
      });
    }

    // Validate data types
    if (typeof theater_id !== 'string' || theater_id.length > 100) {
      return res.status(400).json({ 
        success: false, 
        message: 'theater_id must be a string with maximum length of 100 characters' 
      });
    }

    if (typeof loc_id !== 'string' || loc_id.length > 100) {
      return res.status(400).json({ 
        success: false, 
        message: 'loc_id must be a string with maximum length of 100 characters' 
      });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(booked_date)) {
      return res.status(400).json({ 
        success: false, 
        message: 'booked_date must be in YYYY-MM-DD format' 
      });
    }

    if (typeof booked_slot !== 'string' || booked_slot.length > 100) {
      return res.status(400).json({ 
        success: false, 
        message: 'booked_slot must be a string with maximum length of 100 characters' 
      });
    }

    // Create database query
    const query = `
      INSERT INTO co_adminportal.booked_slots 
      (theater_id, loc_id, booked_date, booked_slot) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, theater_id, loc_id, booked_date, booked_slot
    `;

    // Execute the query with the provided data
    const values = [theater_id, loc_id, booked_date, booked_slot];
    const { rows } = await pool.query(query, values);

    // Return success response with the inserted booking data
    return res.status(201).json({
      success: true,
      message: 'Booking slot created successfully',
      data: rows[0]
    });

  } catch (error) {
    console.error('Error creating booking slot:', error);
    
    // Handle unique constraint violations or other database errors
    if (error.constraint) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked for the specified theater and location'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while creating booking slot'
    });
  }
});



app.get('/api/gallery/:locationName', async (req, res) => {
  try {
    const { locationName } = req.params;
    
    // Query to get gallery images based on location name
    const query = `
      SELECT 
        theater_id,
        location_name,
        theater_name,
        gallery_image_url,
        tag_line_1,
        tag_line_2,
        tag_line_3
      FROM co_adminportal.galleryimages 
      WHERE location_name = $1
      ORDER BY theater_name, theater_id
    `;
    
    const result = await pool.query(query, [locationName]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No gallery images found for this location'
      });
    }

    // Transform the data to match the frontend structure
    const galleryImages = result.rows.map((row, index) => ({
      id: index + 1,
      theater_id: row.theater_id,
      location_name: row.location_name,
      theater_name: row.theater_name,
      url: row.gallery_image_url,
      title: row.tag_line_1 || row.theater_name,
      subtitle: row.tag_line_2,
      description: row.tag_line_3,
      category: 'venue' // Default category, you can modify this based on your needs
    }));

    res.json({
      success: true,
      data: galleryImages,
      count: galleryImages.length
    });

  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Optional: Get all unique locations for dropdown/selection
app.get('/api/locations-images', async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT location_name 
      FROM co_adminportal.galleryimages 
      ORDER BY location_name
    `;
    
    const result = await pool.query(query);
    
    res.json({
      success: true,
      data: result.rows.map(row => row.location_name)
    });

  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});


app.get('/api/coupons', async (req, res) => {
  try {
    const { coupon_type } = req.query; // Get coupon_type from query params
    console.log('Attempting to fetch coupons with type:', coupon_type);

    let query = 'SELECT * FROM co_adminportal.t_coupons WHERE status = $1';
    const params = ['Y'];

    if (coupon_type) {
      query += ' AND coupon_type = $2';
      params.push(coupon_type);
    }

    const result = await pool.query(query, params);
    console.log('Found coupons:', result.rows.length);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});



app.get('/api/coupon-types', async (req, res) => {
  try {
    const query = 'SELECT DISTINCT coupon_type FROM co_adminportal.t_coupons WHERE status = $1';
    const params = ['Y'];
    const result = await pool.query(query, params);
    console.log('Found coupon types:', result.rows);
    res.status(200).json(result.rows.map(row => row.coupon_type));
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

app.get('/api/payment_details', async (req, res) => {
    const { phone_no1 } = req.query;
    if (!phone_no1) {
        return res.status(400).json({ error: 'Phone number is required' });
    }
    try {
        const query = `
            SELECT 
                cpd.cust_id,
                cpd.theater_id,
                cpd.loc_id,
                cpd.booking_name,
                cpd.payment_id,
                cpd.payment_amount,
                cpd.payment_date,
                cpd.payment_flag,
                cpd.coupon_discount,
                cd.phone_no1,
                cd.booking_name AS customer_name
            FROM co_dashboard.t_customer_details cd
            LEFT JOIN co_dashboard.t_customer_payment_details cpd ON cd.cust_id = cpd.cust_id
            WHERE cd.phone_no1 = $1
        `;
        const { rows } = await pool.query(query, [phone_no1]);
        // Return the rows (even if empty) to the frontend
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});



// Razor pay
const Razorpay = require('razorpay');
const razorpay = new Razorpay({
  key_id:'rzp_live_WONtbIG5GVVkfH',
  key_secret:'u5y2XRcDjHbZYaciJ3vFKp9F'
});

app.post('/api/create-order', async (req, res) => {
  const { amount, currency, receipt } = req.body;
  try {
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt,
    });
    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});





app.post('/api/verify-payment', async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    cust_id,
    theater_id,
    loc_id,
    booking_name,
    booking_dates,
    booking_slot,
  } = req.body;

  console.log('Verify Payment Request Body:', req.body); // Log incoming data

  // Validate required fields
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    console.error('Missing Razorpay payment details');
    return res.status(400).json({ status: 'failure', error: 'Missing payment details' });
  }

  const secret = 'u5y2XRcDjHbZYaciJ3vFKp9F'; // Ensure this matches Razorpay dashboard
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  console.log('Generated Signature:', generatedSignature);
  console.log('Received Signature:', razorpay_signature);

  if (generatedSignature !== razorpay_signature) {
    console.error('Signature verification failed');
    return res.status(400).json({ status: 'failure', error: 'Invalid signature' });
  }

  try {
    const booked_type = 'online';
    const query = `
      INSERT INTO co_dashboard.t_customer_slot_bookings
      (cust_id, theater_id, loc_id, booking_name, booking_dates, booking_slot, booked_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    const values = [
      cust_id,
      theater_id,
      loc_id,
      booking_name,
      booking_dates,
      booking_slot,
      booked_type
    ];

    console.log('Database Query Values:', values); // Log query values

    await pool.query(query, values);
    console.log('Booking saved successfully');
    res.json({ status: 'success', message: 'Payment verified and booking saved' });
  } catch (error) {
    console.error('Database Error:', error); // Log detailed database error
    res.status(500).json({ status: 'failure', error: `Failed to save booking: ${error.message}` });
  }
});



// Start the server
const PORT = process.env.PORT || 3000;  
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
