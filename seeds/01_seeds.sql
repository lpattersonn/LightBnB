INSERT INTO reservations (guest_id, property_id, start_date, end_date)
VALUES (1, 1, '2018-09-11', '2018-09-26'),
(2, 2, '2019-01-04', '2019-02-01'),
(3, 3, '2021-10-01', '2021-10-14');

INSERT INTO users (name, email)
VALUES ('Tom', 'tom@gmail.com'),
('Brad', 'Brad@gmail.com'),
('Tracy', 'tracy@gmail.com');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'Villa On The Water', 'description', 'thumbnail', 'cover', '500', '3', '3', '3', 'Canada', 'Parklawn', 'Toronto', 'Ontario', 'postalcode', 'yes' ),
(2, 'Villa', 'description', 'thumbnail', 'cover', '500', '3', '3', '3', 'Canada', 'Parklawn', 'Toronto', 'Ontario', 'postalcode', 'yes' ),
(3, 'Villa In Distillery', 'description', 'thumbnail', 'cover', '500', '3', '3', '3', 'Canada', 'Parklawn', 'Toronto', 'Ontario', 'postalcode', 'yes' );

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 2, 3, 5, 'This is a great property'),
(2, 3, 4, 6, 'This is a great property'),
(3, 4, 5, 7, 'Great property with a lake view');