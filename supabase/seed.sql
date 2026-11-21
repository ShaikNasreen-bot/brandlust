-- BRAND LUST Database Seed SQL
-- Inserts categories, brands, sample products, product images, and product variants

-- 1. Categories
INSERT INTO public.categories (id, name, slug, description, image_url, display_order)
VALUES
('c1000000-0000-0000-0000-000000000001', 'T-Shirts', 't-shirts', 'Essential premium heavyweight & organic cotton tees.', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80', 1),
('c1000000-0000-0000-0000-000000000002', 'Shirts', 'shirts', 'Sharp formal, relaxed linen, and tailored casual shirts.', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', 2),
('c1000000-0000-0000-0000-000000000003', 'Jeans', 'jeans', 'Selvedge denim, slim-tapered, and relaxed fits.', 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80', 3),
('c1000000-0000-0000-0000-000000000004', 'Trousers', 'trousers', 'Tailored pleats, relaxed chinos, and smart wool trousers.', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80', 4),
('c1000000-0000-0000-0000-000000000005', 'Jackets', 'jackets', 'Leather overshirts, wool overcoats, and utility jackets.', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80', 5),
('c1000000-0000-0000-0000-000000000006', 'Hoodies', 'hoodies', 'Heavyweight french terry hoodies and drop-shoulder sweats.', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80', 6),
('c1000000-0000-0000-0000-000000000007', 'Shorts', 'shorts', 'Tailored linen shorts and relaxed drawstring summer shorts.', 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80', 7),
('c1000000-0000-0000-0000-000000000008', 'Ethnic Wear', 'ethnic-wear', 'Artisanal modern kurtas, nehru jackets, and ceremonial silhouettes.', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', 8)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url;

-- 2. Brands
INSERT INTO public.brands (id, name, slug, description)
VALUES
('b1000000-0000-0000-0000-000000000001', 'BRAND LUST Black Label', 'BRAND LUST-black-label', 'Contemporary luxury essentials.'),
('b1000000-0000-0000-0000-000000000002', 'Atelier Nord', 'atelier-nord', 'Scandinavian minimalist tailoring.'),
('b1000000-0000-0000-0000-000000000003', 'Aurelius Studio', 'aurelius-studio', 'Modern bespoke silhouettes.'),
('b1000000-0000-0000-0000-000000000004', 'Raw & Co.', 'raw-and-co', 'Authentic selvedge denim and utility wear.'),
('b1000000-0000-0000-0000-000000000005', 'Heritage Tailors', 'heritage-tailors', 'Refined craftsmanship and fine wool.'),
('b1000000-0000-0000-0000-000000000006', 'Urban Minimalist', 'urban-minimalist', 'Streetwear elevated through clean design.')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 3. Products
INSERT INTO public.products (id, name, slug, description, category_id, brand_id, original_price, selling_price, discount_percent, rating, rating_count, is_featured, is_trending, is_new_arrival, is_best_seller)
VALUES
-- T-Shirts
('p1000000-0000-0000-0000-000000000001', 'Heavyweight Boxy Fit Tee', 'heavyweight-boxy-fit-tee', 'Cut from 280 GSM combed organic cotton with dropped shoulders and a dense rib-knit collar. A timeless streetwear essential.', 'c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 2499, 1799, 28, 4.8, 142, true, true, false, true),
('p1000000-0000-0000-0000-000000000002', 'Mercerized Supima Cotton Crewneck', 'mercerized-supima-cotton-crewneck', 'Silky smooth mercerized finish with natural lustre. Breathable, durable, and sophisticated enough to wear under a sport jacket.', 'c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 3299, 2499, 24, 4.9, 98, false, true, true, false),
('p1000000-0000-0000-0000-000000000003', 'Waffle Knit Thermal T-Shirt', 'waffle-knit-thermal-t-shirt', 'Textured micro-waffle weave for superior thermal regulation and depth of texture. Features split hems and flatlock seams.', 'c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000006', 2199, 1599, 27, 4.6, 67, false, false, true, false),
('p1000000-0000-0000-0000-000000000004', 'Relaxed Vintage Washed Tee', 'relaxed-vintage-washed-tee', 'Enzyme stone-washed for that authentic lived-in patina and ultra-soft drape. Faded charcoal colorway.', 'c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000004', 1999, 1499, 25, 4.7, 114, false, true, false, true),
('p1000000-0000-0000-0000-000000000005', 'Minimalist Mockneck Short Sleeve', 'minimalist-mockneck-short-sleeve', 'A contemporary architectural staple. Clean structured collar with 4-way stretch interlock knit.', 'c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 2799, 2199, 21, 4.8, 53, true, false, true, false),

-- Shirts
('p1000000-0000-0000-0000-000000000006', 'Tailored French Linen Camp Collar Shirt', 'tailored-french-linen-camp-collar-shirt', 'Crafted from 100% Normandy flax linen. Features mother-of-pearl buttons and a breezy resort-ready cuban collar.', 'c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', 4999, 3699, 26, 4.9, 88, true, true, true, true),
('p1000000-0000-0000-0000-000000000007', 'Oxford Cotton Button-Down Shirt', 'oxford-cotton-button-down-shirt', 'Substantial royal oxford cloth with an unlined collar roll for effortless Ivy-league sophistication in pale blue.', 'c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000005', 3999, 2999, 25, 4.8, 176, false, false, false, true),
('p1000000-0000-0000-0000-000000000008', 'Sateen Silk-Touch Minimalist Shirt', 'sateen-silk-touch-minimalist-shirt', 'Lustrous black cotton-sateen featuring a hidden placket and sharp point collar. Built for evening occasions.', 'c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 4499, 3499, 22, 4.7, 64, false, true, true, false),
('p1000000-0000-0000-0000-000000000009', 'Textured Seersucker Casual Shirt', 'textured-seersucker-casual-shirt', 'Pucker-woven cotton seersucker that naturally lifts away from the skin for optimal airflow in humid climates.', 'c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000003', 3699, 2799, 24, 4.6, 49, false, false, false, false),
('p1000000-0000-0000-0000-000000000010', 'Heavy Twill Utility Overshirt', 'heavy-twill-utility-overshirt', 'Double chest pockets, reinforced elbow stitching, and durable brushed cotton twill in olive green.', 'c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000004', 4599, 3499, 24, 4.8, 92, true, true, true, false),

-- Jeans
('p1000000-0000-0000-0000-000000000011', '14oz Japanese Selvedge Straight Jeans', 'japanese-selvedge-straight-jeans', 'Woven on vintage shuttle looms in Okayama. Raw indigo denim with classic red-line selvedge ID, brass hardware, and clean mid-rise straight leg.', 'c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000004', 7999, 5999, 25, 4.9, 210, true, true, false, true),
('p1000000-0000-0000-0000-000000000012', 'Stay-Black Tapered Denim', 'stay-black-tapered-denim', 'Specially sulphur-dyed to retain pure pitch-black tone through 40+ washes. Featuring 2% comfort stretch.', 'c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001', 5499, 4199, 24, 4.8, 148, false, true, false, true),
('p1000000-0000-0000-0000-000000000013', 'Vintage Wash Relaxed 90s Denim', 'vintage-wash-relaxed-90s-denim', 'Medium vintage stonewash with whiskering and subtle distressing at pockets. Roomy thigh tapering slightly towards hem.', 'c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000006', 4999, 3699, 26, 4.7, 83, false, false, true, false),
('p1000000-0000-0000-0000-000000000014', 'Ecru Off-White Carpenter Jeans', 'ecru-off-white-carpenter-jeans', 'Natural undyed ecru cotton with visible cotton seeds. Utilitarian tool loop, hammer loop, and reinforced rear pockets.', 'c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000004', 5299, 3999, 25, 4.8, 61, true, true, true, false),
('p1000000-0000-0000-0000-000000000015', 'Faded Grey Slim Fit Jeans', 'faded-grey-slim-fit-jeans', 'Hand-sanded ash grey stretch denim with clean tonal stitching and matte silver hardware.', 'c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000002', 4799, 3599, 25, 4.6, 73, false, false, false, false),

-- Trousers
('p1000000-0000-0000-0000-000000000016', 'Single Pleat Wide-Leg Wool Trousers', 'single-pleat-wide-leg-wool-trousers', 'Italian virgin wool blend with a generous forward pleat, extended waist tab, and fluid drape in charcoal.', 'c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000003', 6499, 4999, 23, 4.9, 104, true, true, true, true),
('p1000000-0000-0000-0000-000000000017', 'Modern Tapered Stretch Chinos', 'modern-tapered-stretch-chinos', 'Precision cut from high-density cotton gabardine in rich khaki beige. Comfortable waistband with interior shirt gripper.', 'c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000005', 4299, 3299, 23, 4.8, 165, false, false, false, true),
('p1000000-0000-0000-0000-000000000018', 'Tailored Drawstring Linen Trousers', 'tailored-drawstring-linen-trousers', 'The sweet spot between relaxed ease and sartorial structure. Cotton-linen blend with concealed elastic drawcord.', 'c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000002', 4999, 3799, 24, 4.7, 89, false, true, true, false),
('p1000000-0000-0000-0000-000000000019', 'Minimalist Cargo Trousers', 'minimalist-cargo-trousers', 'Streamlined low-profile flap pockets, darted knees, and adjustable ankle cinch tabs. Matte dark navy finish.', 'c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000006', 5499, 4299, 22, 4.6, 57, false, false, false, false),
('p1000000-0000-0000-0000-000000000020', 'Double Pleat Houndstooth Trousers', 'double-pleat-houndstooth-trousers', 'Micro houndstooth check woven in Yorkshire. Unfinished hem for customized sartorial tailoring.', 'c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000005', 6999, 5299, 24, 4.9, 43, false, false, true, false),

-- Jackets
('p1000000-0000-0000-0000-000000000021', 'Supple Lambskin Leather Overshirt Jacket', 'supple-lambskin-leather-overshirt-jacket', 'Ultra-soft full-grain lamb nappa leather. Features matte black snap buttons, viscose lining, and clean drop shoulders.', 'c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000001', 18999, 14999, 21, 5.0, 78, true, true, true, true),
('p1000000-0000-0000-0000-000000000022', 'Double-Faced Wool Cashmere Overcoat', 'double-faced-wool-cashmere-overcoat', 'Hand-stitched seams with 90% Australian merino wool and 10% Mongolian cashmere. Luxurious drape in warm camel beige.', 'c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000003', 22999, 17999, 22, 4.9, 51, true, false, true, false),
('p1000000-0000-0000-0000-000000000023', 'Minimalist Water-Resistant Harrington', 'minimalist-water-resistant-harrington', 'Japanese technical matte twill with stand collar, raglan sleeves, two-way Excella front zipper, and umbrella back vent.', 'c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000002', 8999, 6999, 22, 4.8, 94, false, true, false, true),

-- Hoodies
('p1000000-0000-0000-0000-000000000024', '500 GSM Heavyweight French Terry Hoodie', '500-gsm-heavyweight-french-terry-hoodie', 'Constructed from pre-shrunk combed organic cotton. Double-layered hood without drawstrings for an ultra-clean architectural aesthetic.', 'c1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000001', 4999, 3799, 24, 4.9, 188, true, true, false, true),
('p1000000-0000-0000-0000-000000000025', 'Washed Charcoal Drop-Shoulder Sweatshirt', 'washed-charcoal-drop-shoulder-sweatshirt', 'Vintage mineral wash finish giving each piece unique shading. Dense ribbed cuffs and side rib gussets for unrestricted movement.', 'c1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000006', 4299, 3199, 25, 4.7, 95, false, true, true, false),
('p1000000-0000-0000-0000-000000000026', 'Half-Zip Brushed Fleece Pullover', 'half-zip-brushed-fleece-pullover', 'Polished silver zipper hardware with a tall cozy collar. Soft brushed interior for supreme comfort on cool evenings.', 'c1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000002', 4799, 3699, 23, 4.8, 62, false, false, true, false),

-- Shorts
('p1000000-0000-0000-0000-000000000027', 'Tailored 7-Inch Linen Drawstring Shorts', 'tailored-7-inch-linen-drawstring-shorts', 'Breezy organic linen with side slant pockets, welt back pockets, and metal-tipped cotton drawstrings.', 'c1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000002', 3499, 2599, 25, 4.8, 76, true, false, true, false),
('p1000000-0000-0000-0000-000000000028', 'Everyday French Terry Lounge Shorts', 'everyday-french-terry-lounge-shorts', 'Medium-weight loopback cotton terry featuring raw edge hems and deep jersey-lined pockets in deep black.', 'c1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000006', 2799, 2099, 25, 4.7, 110, false, true, false, true),

-- Ethnic Wear
('p1000000-0000-0000-0000-000000000029', 'Artisanal Handwoven Tussar Silk Kurta', 'artisanal-handwoven-tussar-silk-kurta', 'Woven with organic raw tussar silk featuring subtle textured slubs, tailored mandarin bandhgala collar, and concealed mother-of-pearl buttons.', 'c1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000003', 6999, 5299, 24, 4.9, 87, true, true, true, true),
('p1000000-0000-0000-0000-000000000030', 'Tailored Linen-Silk Nehru Bandi Jacket', 'tailored-linen-silk-nehru-bandi-jacket', 'Structured silhouette with mandarin collar, signature welt chest pocket with pocket square loop, and regal dark emerald green sheen.', 'c1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000003', 7499, 5699, 24, 4.8, 64, true, false, true, false)
ON CONFLICT (slug) DO NOTHING;

-- 4. Product Images
INSERT INTO public.product_images (product_id, image_url, alt_text, is_primary, display_order)
VALUES
('p1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80', 'Heavyweight Boxy Fit Tee White', true, 1),
('p1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80', 'Heavyweight Tee Fabric Detail', false, 2),
('p1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80', 'Black Mercerized Crewneck', true, 1),
('p1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80', 'Beige Waffle Knit Tee', true, 1),
('p1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80', 'Grey Washed Tee', true, 1),
('p1000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1000&q=80', 'Mockneck White Tee', true, 1),
('p1000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80', 'Beige Linen Shirt Front', true, 1),
('p1000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=1000&q=80', 'Blue Oxford Shirt', true, 1),
('p1000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1620012253295-c15c429f66bf?auto=format&fit=crop&w=1000&q=80', 'Black Sateen Shirt', true, 1),
('p1000000-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=1000&q=80', 'White Seersucker Shirt', true, 1),
('p1000000-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80', 'Olive Utility Overshirt', true, 1),
('p1000000-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1000&q=80', 'Dark Blue Selvedge Jeans', true, 1),
('p1000000-0000-0000-0000-000000000012', 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=1000&q=80', 'Stay Black Jeans', true, 1),
('p1000000-0000-0000-0000-000000000013', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80', 'Vintage 90s Relaxed Jeans', true, 1),
('p1000000-0000-0000-0000-000000000014', 'https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=1000&q=80', 'Ecru Off-White Jeans', true, 1),
('p1000000-0000-0000-0000-000000000015', 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1000&q=80', 'Grey Slim Jeans', true, 1),
('p1000000-0000-0000-0000-000000000016', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80', 'Grey Wool Trousers', true, 1),
('p1000000-0000-0000-0000-000000000017', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1000&q=80', 'Khaki Beige Chinos', true, 1),
('p1000000-0000-0000-0000-000000000018', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=80', 'Black Linen Trousers', true, 1),
('p1000000-0000-0000-0000-000000000019', 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=80', 'Navy Minimalist Cargo Trousers', true, 1),
('p1000000-0000-0000-0000-000000000020', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80', 'Houndstooth Trousers', true, 1),
('p1000000-0000-0000-0000-000000000021', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80', 'Black Leather Jacket', true, 1),
('p1000000-0000-0000-0000-000000000022', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80', 'Camel Wool Overcoat', true, 1),
('p1000000-0000-0000-0000-000000000023', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80', 'Black Harrington Jacket', true, 1),
('p1000000-0000-0000-0000-000000000024', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80', 'Grey Heavyweight Hoodie', true, 1),
('p1000000-0000-0000-0000-000000000025', 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80', 'Charcoal Sweatshirt', true, 1),
('p1000000-0000-0000-0000-000000000026', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80', 'Half Zip Pullover', true, 1),
('p1000000-0000-0000-0000-000000000027', 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=1000&q=80', 'Beige Linen Shorts', true, 1),
('p1000000-0000-0000-0000-000000000028', 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1000&q=80', 'Black Lounge Shorts', true, 1),
('p1000000-0000-0000-0000-000000000029', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80', 'Tussar Silk Kurta Ivory', true, 1),
('p1000000-0000-0000-0000-000000000030', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80', 'Green Nehru Jacket', true, 1);

-- 5. Product Variants (XS, S, M, L, XL, XXL)
INSERT INTO public.product_variants (product_id, size, color, sku, stock_quantity)
VALUES
('p1000000-0000-0000-0000-000000000001', 'S', 'White', 'SH-TS1-WHT-S', 24),
('p1000000-0000-0000-0000-000000000001', 'M', 'White', 'SH-TS1-WHT-M', 35),
('p1000000-0000-0000-0000-000000000001', 'L', 'White', 'SH-TS1-WHT-L', 40),
('p1000000-0000-0000-0000-000000000001', 'XL', 'White', 'SH-TS1-WHT-XL', 18),
('p1000000-0000-0000-0000-000000000002', 'S', 'Black', 'SH-TS2-BLK-S', 15),
('p1000000-0000-0000-0000-000000000002', 'M', 'Black', 'SH-TS2-BLK-M', 28),
('p1000000-0000-0000-0000-000000000002', 'L', 'Black', 'SH-TS2-BLK-L', 32),
('p1000000-0000-0000-0000-000000000006', 'S', 'Beige', 'SH-SH1-BGE-S', 12),
('p1000000-0000-0000-0000-000000000006', 'M', 'Beige', 'SH-SH1-BGE-M', 25),
('p1000000-0000-0000-0000-000000000006', 'L', 'Beige', 'SH-SH1-BGE-L', 30),
('p1000000-0000-0000-0000-000000000011', 'M', 'Blue', 'SH-JN1-BLU-M', 32),
('p1000000-0000-0000-0000-000000000011', 'L', 'Blue', 'SH-JN1-BLU-L', 28),
('p1000000-0000-0000-0000-000000000016', 'M', 'Grey', 'SH-TR1-GRY-M', 26),
('p1000000-0000-0000-0000-000000000016', 'L', 'Grey', 'SH-TR1-GRY-L', 24),
('p1000000-0000-0000-0000-000000000021', 'M', 'Black', 'SH-JK1-BLK-M', 14),
('p1000000-0000-0000-0000-000000000021', 'L', 'Black', 'SH-JK1-BLK-L', 18),
('p1000000-0000-0000-0000-000000000024', 'M', 'Grey', 'SH-HD1-GRY-M', 38),
('p1000000-0000-0000-0000-000000000024', 'L', 'Grey', 'SH-HD1-GRY-L', 34),
('p1000000-0000-0000-0000-000000000027', 'M', 'Beige', 'SH-ST1-BGE-M', 30),
('p1000000-0000-0000-0000-000000000029', 'M', 'Beige', 'SH-ETH1-BGE-M', 20),
('p1000000-0000-0000-0000-000000000030', 'L', 'Green', 'SH-ETH2-GRN-L', 18);
