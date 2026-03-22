document.addEventListener('DOMContentLoaded', () => {

    // --- State & Demo Data ---
    let currentLang = 'en';
    let farmerName = "Ramesh Kumar";
    
    const marketData = {
        crops: [
            { id: 1, title: 'Potato (Kufri Jyoti)', price: '₹15/kg', img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80', desc: 'Freshly harvested today. 20 Qtl available.', contact: 'Ramesh: 9876543210' }
        ],
        equip: [
            { id: 2, title: 'Tractor (Mahindra)', price: '₹4,50,000', img: 'https://images.unsplash.com/photo-1592982537447-6f296c05d420?auto=format&fit=crop&w=400&q=80', desc: 'Used for ploughing fields. 3 years old.', contact: 'Suresh: 9876543211' }
        ],
        land: [
            { id: 3, title: '5 Acre Farm', price: '₹15L / Acre', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80', desc: 'Fertile soil near the canal. Good for wheat.', contact: 'Hari: 9876543214' }
        ]
    };

    const contactsData = [
        { name: 'Ramlal Worker', role: 'Cold Storage Transit Guard', phone: '9876543220' }
    ];

    // Smart Crop Dataset Built-In (Using Local Images for Live Server)
    const smartCropsData = [
        { name: 'Soybean', minTemp: 25, maxTemp: 35, water: 'Medium', profit: 'High', img: './images/Soybean.jpg' },
        { name: 'Maize', minTemp: 20, maxTemp: 35, water: 'Medium', profit: 'Medium', img: './images/Maize.jpg' },
        { name: 'Chickpea', minTemp: 20, maxTemp: 30, water: 'Low', profit: 'High', img: './images/Chickpea.jpg' },
        { name: 'Pigeon Pea', minTemp: 25, maxTemp: 35, water: 'Low', profit: 'High', img: './images/Pigeon Pea.jpg' },
        { name: 'Groundnut', minTemp: 25, maxTemp: 35, water: 'Medium', profit: 'High', img: './images/Groundnut.jpg' },
        { name: 'Cotton', minTemp: 25, maxTemp: 40, water: 'Medium', profit: 'High', img: './images/Cotton.jpg' },
        { name: 'Sorghum (Jowar)', minTemp: 25, maxTemp: 40, water: 'Low', profit: 'Medium', img: './images/Sorghum (Jowar).jpg' },
        { name: 'Pearl Millet (Bajra)', minTemp: 25, maxTemp: 40, water: 'Low', profit: 'Medium', img: './images/Pearl Millet (Bajra).jpg' },
        { name: 'Moong', minTemp: 25, maxTemp: 35, water: 'Low', profit: 'Medium', img: './images/Moong.jpg' },
        { name: 'Urad', minTemp: 25, maxTemp: 35, water: 'Low', profit: 'Medium', img: './images/Urad.jpg' },
        { name: 'Wheat', minTemp: 15, maxTemp: 25, water: 'Medium', profit: 'High', img: './images/Wheat.jpg' },
        { name: 'Barley', minTemp: 15, maxTemp: 25, water: 'Low', profit: 'Medium', img: './images/Barley.jpg' },
        { name: 'Mustard', minTemp: 10, maxTemp: 25, water: 'Low', profit: 'High', img: './images/Mustard.jpg' },
        { name: 'Lentil (Masoor)', minTemp: 15, maxTemp: 25, water: 'Low', profit: 'High', img: './images/Lentil (Masoor).jpg' },
        { name: 'Sunflower', minTemp: 20, maxTemp: 30, water: 'Medium', profit: 'Medium', img: './images/Sunflower.jpg' },
        { name: 'Tomato', minTemp: 20, maxTemp: 30, water: 'Medium', profit: 'High', img: './images/Tomato.jpg' },
        { name: 'Potato', minTemp: 15, maxTemp: 25, water: 'Medium', profit: 'Medium', img: './images/Potato.jpg' },
        { name: 'Onion', minTemp: 20, maxTemp: 30, water: 'Medium', profit: 'High', img: './images/Onion.jpg' },
        { name: 'Garlic', minTemp: 15, maxTemp: 25, water: 'Low', profit: 'High', img: './images/Garlic.jpg' },
        { name: 'Green Peas', minTemp: 10, maxTemp: 25, water: 'Medium', profit: 'Medium', img: './images/Green Peas.jpg' }
    ];

    // --- Core UI Variables ---
    const loginOverlay = document.getElementById('login-overlay');
    const loginBtn = document.getElementById('login-btn');
    const loginLoader = document.getElementById('login-loader');
    const mainApp = document.getElementById('main-app');
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view');
    const toggleLangBtn = document.getElementById('lang-toggle');
    const datetimeDisplay = document.getElementById('datetime-display');
    const locationDisplay = document.getElementById('location-display');
    const greetingText = document.getElementById('dash-greeting');

    // --- Boot Method ---
    function initApp() {
        startClock();
        fetchLocation();
        
        // Render 3 distinct market grids instead of just 1 swapping one
        renderMarket('crops');
        renderMarket('equip');
        renderMarket('land');

        renderContacts();
        renderPrices();
        checkWaterWarning();
        renderCalendar(currentDate);
        updateGreeting();
    }

    // --- Login Mechanics ---
    loginBtn.addEventListener('click', () => {
        const idInput = document.getElementById('farmer-id').value;
        const errObj = document.getElementById('login-error');
        if (!/^\d+$/.test(idInput)) {
            errObj.classList.remove('hidden');
            return;
        }
        errObj.classList.add('hidden');
        loginLoader.classList.remove('hidden');
        loginBtn.style.display = 'none';
        setTimeout(() => {
            loginOverlay.classList.remove('active');
            loginOverlay.style.display = 'none';
            mainApp.classList.remove('hidden');
            document.getElementById('dash-fid').textContent = idInput;
        }, 1500);
    });

    // --- Nav Engine (Now handles 16 views!) ---
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-target');
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            views.forEach(v => {
                v.classList.add('hidden');
                v.classList.remove('active');
                if(v.id === targetId) {
                    v.classList.remove('hidden');
                    v.classList.add('active');
                }
            });
        });
    });

    // --- Peripheral Components ---
    function startClock() {
        setInterval(() => {
            datetimeDisplay.textContent = new Date().toLocaleString(currentLang === 'hi' ? 'hi-IN' : 'en-US', { 
                weekday: 'short', month: 'short', day: 'numeric', 
                hour: '2-digit', minute: '2-digit', second: '2-digit' 
            });
        }, 1000);
    }
    function updateGreeting() {
        const hour = new Date().getHours();
        let timeMsgEn = (hour < 12) ? 'Good Morning' : (hour < 18) ? 'Good Afternoon' : 'Good Evening';
        let timeMsgHi = (hour < 12) ? 'सुप्रभात' : (hour < 18) ? 'शुभ दोपहर' : 'शुभ संध्या';
        greetingText.textContent = `${currentLang === 'hi' ? timeMsgHi : timeMsgEn}, ${farmerName}`;
        document.getElementById('dash-fname').textContent = farmerName;
    }
    function fetchLocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(pos => {
                locationDisplay.textContent = `📍 Lat: ${pos.coords.latitude.toFixed(2)}, Lon: ${pos.coords.longitude.toFixed(2)}`;
            }, () => {
                locationDisplay.textContent = `📍 Location Error (Fallback: MP)`;
            });
        }
    }
    setTimeout(() => { document.getElementById('extreme-weather-alert').classList.remove('hidden'); }, 5000);
    function checkWaterWarning() {
        if (Math.random() < 0.2) {
            document.getElementById('global-alerts-container').innerHTML = `<div class="global-alert">⚠ Water storage level dropping uncharacteristically! Reserve tank integrity breached?</div>`;
        }
    }
    
    // --- Demo Mode Wiring ---
    document.querySelectorAll('a[href="#"]').forEach(link => {
        if(!link.classList.contains('nav-item')) {
            link.addEventListener('click', (e) => { e.preventDefault(); alert("DEMO MODE: Secure redirection bypassed. Simulated action complete."); });
        }
    });
    const emerBtn = document.getElementById('emergency-btn');
    if(emerBtn) emerBtn.addEventListener('click', () => alert("🚨 DEMO MODE: Emergency alert broadcasted globally to agricultural dispatch vectors! 🚨"));

    // --- Smart Crop Engine ---
    window.getSmartCropSuggestions = function() {
        const tempStr = document.getElementById('crop-temp').value;
        const humStr = document.getElementById('crop-hum').value;
        const errObj = document.getElementById('crop-error');
        
        if(!tempStr || !humStr) { errObj.classList.remove('hidden'); return; }
        errObj.classList.add('hidden');
        
        const temp = parseFloat(tempStr);
        const hum = parseFloat(humStr);
        
        let bestHtml = '';
        let avoidHtml = '';

        // Avoid Logic
        const avoidList = [];
        if(hum < 50) {
            avoidList.push({name: 'Rice', reason: 'High humidity & water required'}, {name: 'Sugarcane', reason: 'Drought sensitivity'}, {name: 'Banana', reason: 'High water requirements'});
        }
        avoidList.forEach(c => {
            avoidHtml += `
                <div class="market-card border-top-danger bg-danger-light">
                    <div class="market-header bg-danger text-white"><span>${c.name}</span></div>
                    <div class="market-body">
                        <p class="text-sm font-bold">❌ ${c.reason}</p>
                    </div>
                </div>
            `;
        });
        document.getElementById('avoid-crop-grid').innerHTML = avoidHtml || '<p class="text-sm">No specific crops to exclusively avoid.</p>';

        // Best Crops Logic
        const bestCrops = smartCropsData.filter(c => temp >= c.minTemp && temp <= c.maxTemp);
        bestCrops.forEach(c => {
            bestHtml += `
                <div class="market-card shadow">
                    <img src="${c.img}" class="market-img" style="height:120px;" alt="${c.name}">
                    <div class="market-header"><span>🌱 ${c.name}</span></div>
                    <div class="market-body p-2">
                        <p class="text-sm">💧 Water: <strong>${c.water}</strong></p>
                        <p class="text-sm">💰 Profit: <strong>${c.profit}</strong></p>
                    </div>
                </div>
            `;
        });
        document.getElementById('best-crop-grid').innerHTML = bestHtml || '<p class="text-sm">No optimal matches found for this specific microclimate.</p>';

        // Smart Messages
        const msgDiv = document.getElementById('smart-crop-message');
        if(temp >= 25 && temp <= 35 && hum < 50) {
            msgDiv.textContent = "Based on current weather, drought-resistant crops are primarily recommended to reduce severe irrigation overhead costs.";
            msgDiv.classList.remove('hidden');
        } else { msgDiv.classList.add('hidden'); }
    }

    document.getElementById('add-smart-crop-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const newCrop = {
            name: document.getElementById('csc-name').value,
            minTemp: parseFloat(document.getElementById('csc-min').value),
            maxTemp: parseFloat(document.getElementById('csc-max').value),
            water: document.getElementById('csc-water').value,
            profit: document.getElementById('csc-profit').value,
            img: 'https://images.unsplash.com/photo-1586771107445-d3af23b44b82?w=400' // Generic fallback real image
        };
        smartCropsData.push(newCrop);
        e.target.reset();
        alert(`Successfully mapped ${newCrop.name} into algorithmic logic core.`);
        window.getSmartCropSuggestions();
    });

    // --- Automatic Crop Visualizer ---
    window.visualizeCrop = async function() {
        const term = document.getElementById('vis-crop-name').value.trim();
        if(!term) return;
        
        const resDiv = document.getElementById('vis-result');
        const card = document.getElementById('vis-card');
        const img = document.getElementById('vis-img');
        const title = document.getElementById('vis-title');
        const desc = document.getElementById('vis-desc');

        resDiv.classList.remove('hidden');
        card.style.opacity = '0.4';
        title.textContent = `Searching: ${term}...`;
        desc.textContent = "Please wait, scanning...";
        
        // Exact Unsplash format requested by user
        const unsplashUrl = `https://source.unsplash.com/400x300/?${encodeURIComponent(term)},agriculture,plant`;
        // Preload to ensure smooth render
        const tempImg = new Image();
        tempImg.onload = () => { img.src = unsplashUrl; };
        tempImg.onerror = () => { img.src = "https://images.unsplash.com/photo-1586771107445-d3af23b44b82?w=400"; };
        tempImg.src = unsplashUrl;

        try {
            const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(term)}&prop=extracts&exintro=1&explaintext=1&format=json&origin=*`;
            const response = await fetch(url);
            const data = await response.json();
            const pages = data.query.pages;
            const pageId = Object.keys(pages)[0];
            
            title.textContent = pages[pageId].title || term;
            if (pageId === "-1") {
                desc.textContent = `Displaying dynamic Unsplash imagery for ${term}.`;
            } else {
                let text = pages[pageId].extract || `Displaying dynamic Unsplash imagery for ${term}.`;
                if(text.length > 150) text = text.substring(0, 150) + "...";
                desc.textContent = text;
            }
        } catch(err) {
            title.textContent = term;
            desc.textContent = `Displaying dynamically fetched crop imagery.`;
        }
        card.style.opacity = '1';
    }
    window.imgErrorFallback = function() {
        document.getElementById('vis-img').src = "https://images.unsplash.com/photo-1586771107445-d3af23b44b82?w=400";
    }

    // Real-time automatic visualizer trigger
    let visTimeout = null;
    const visInput = document.getElementById('vis-crop-name');
    if(visInput) {
        visInput.addEventListener('input', (e) => {
            if(visTimeout) clearTimeout(visTimeout);
            visTimeout = setTimeout(() => {
                if(e.target.value.trim().length >= 3) window.visualizeCrop();
            }, 800); // 800ms debounce
        });
        visInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') {
                if(visTimeout) clearTimeout(visTimeout);
                window.visualizeCrop();
            }
        });
    }

    // Run automatically on boot
    setTimeout(() => { if(document.getElementById('crop-temp').value) getSmartCropSuggestions(); }, 500);

    // --- Calc Grid Systems ---
    window.calculateLand = function() {
        const l = parseFloat(document.getElementById('cl-l').value);
        const w = parseFloat(document.getElementById('cl-w').value);
        if(!l || !w) return;
        const res = document.getElementById('cl-res');
        res.innerHTML = `<strong>${l * w} Sq. Ft.</strong> (Calculated metric: ${((l*w)/43560).toFixed(4)} Acres)`;
        res.classList.remove('hidden');
    }

    let mathStr = "";
    window.mathPress = function(char) {
        if (char === 'C') mathStr = ""; else mathStr += char;
        document.getElementById('math-display').value = mathStr;
    }
    window.mathCalc = function() {
        try { document.getElementById('math-display').value = eval(mathStr); mathStr = document.getElementById('math-display').value; }
        catch(e) { document.getElementById('math-display').value = "Syntax Err"; mathStr = ""; }
    }

    window.calculateFertilizer = function() {
        const area = parseFloat(document.getElementById('cf-area').value);
        if(!area) return;
        const crop = document.getElementById('cf-crop').value;
        let p1=0, p2=0;
        if(crop === 'wheat') { p1=50; p2=25; } else if (crop === 'maize') { p1=60; p2=30; } else { p1=30; p2=15; }
        const res = document.getElementById('cf-res');
        res.innerHTML = `Derived Base Urea Mass: <strong>${area * p1} kg</strong> | Secondary DAP Req: <strong>${area * p2} kg</strong>`;
        res.classList.remove('hidden');
    }

    // --- Prices CRUD ---
    function renderPrices() {
        const tbody = document.getElementById('profit-body');
        tbody.innerHTML = '';
        cropPricesData.forEach(p => {
            const profit = (p.yield * p.price) - p.cost;
            tbody.innerHTML += `
                <tr>
                    <td><strong>${p.crop}</strong></td><td>₹${p.cost}</td><td>${p.yield}</td><td>₹${p.price}</td>
                    <td class="${profit >= 0 ? 'text-success' : 'text-danger'} font-bold">₹${profit}</td>
                    <td><button class="btn-icon text-sm" onclick="editPrice(${p.id})">✏️</button> <button class="btn-icon text-danger" onclick="deletePrice(${p.id})">❌</button></td>
                </tr>`;
        });
    }
    window.addPriceRow = function() {
        const crop = prompt("Crop Base Identifier:"); if (!crop) return;
        cropPricesData.push({id: Date.now(), crop, cost:parseFloat(prompt("Cost (₹):")), yield:parseFloat(prompt("Yield:")), price:parseFloat(prompt("Sales Metric (₹):"))});
        renderPrices();
    }
    window.editPrice = function(id) {
        const p = cropPricesData.find(x => x.id === id);
        p.crop = prompt("Crop Base Identifier:", p.crop) || p.crop;
        p.cost = parseFloat(prompt("Cost:", p.cost)) || p.cost;
        p.yield = parseFloat(prompt("Yield:", p.yield)) || p.yield;
        p.price = parseFloat(prompt("Price:", p.price)) || p.price;
        renderPrices();
    }
    window.deletePrice = function(id) {
        cropPricesData.splice(cropPricesData.findIndex(p => p.id === id), 1);
        renderPrices();
    }

    // --- Split Target Market CRUD ---
    let editingMarketId = null;
    let editingMarketTab = null;

    function renderMarket(tab) {
        const gridId = `market-grid-${tab}`;
        const gridObj = document.getElementById(gridId);
        if(!gridObj) return; // fail safe
        gridObj.innerHTML = '';
        
        marketData[tab].forEach(item => {
            const div = document.createElement('div');
            div.className = 'market-card shadow';
            
            // Universal Dynamic Gen-AI Logic for all markets (Bypassing deprecated Unsplash)
            let finalImg = item.img;
            const cleanSearchTerm = encodeURIComponent(item.title.split(' ')[0].replace(/[^a-zA-Z0-9]/g, ''));
            
            if(tab === 'crops') {
               finalImg = `https://image.pollinations.ai/prompt/high%20quality%20photo%20of%20${cleanSearchTerm}%20crop%20agriculture?width=400&height=300&nologo=true`;
            } else if(tab === 'equip') {
               finalImg = `https://image.pollinations.ai/prompt/high%20quality%20photo%20of%20${cleanSearchTerm}%20farm%20equipment?width=400&height=300&nologo=true`;
            } else if(tab === 'land') {
               finalImg = `https://image.pollinations.ai/prompt/beautiful%20farm%20landscape%20field?width=400&height=300&nologo=true`;
            } else if (!finalImg || finalImg.includes('unsplash')) {
               finalImg = `https://image.pollinations.ai/prompt/indian%20agriculture%20farm?width=400&height=300&nologo=true`;
            }

            div.innerHTML = `
                <img src="${finalImg}" class="market-img" alt="${item.title}" style="animation: fadeIn 0.8s ease;" onerror="this.src='https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400';">
                <div class="market-header"><span>${item.title}</span>
                    <div><button class="btn-icon text-sm" onclick="openMarketModal(${item.id}, '${tab}')">✏️</button><button class="btn-icon text-sm text-danger" onclick="deleteListing('${tab}', ${item.id})">❌</button></div>
                </div>
                <div class="market-body">
                    <p class="text-primary font-bold mb-2 text-xl">${item.price}</p>
                    <p class="text-sm text-muted mb-3">${item.desc}</p>
                    <p class="text-sm font-bold border-top pt-2">📡 Sub-Ping: ${item.contact}</p>
                </div>
            `;
            gridObj.appendChild(div);
        });
    }

    window.openMarketModal = function(id = null, tab = null) {
        const form = document.getElementById('market-form');
        editingMarketId = id;
        editingMarketTab = tab;
        
        const imgBlock = document.getElementById('m-img-block');
        if(imgBlock) imgBlock.style.display = 'none'; // Auto-fetch engaged for all directories
        if(id !== null) {
            const item = marketData[tab].find(i => i.id === id);
            document.getElementById('m-cat').value = tab;
            document.getElementById('m-title').value = item.title;
            document.getElementById('m-price').value = item.price;
            document.getElementById('m-img').value = item.img || '';
            document.getElementById('m-desc').value = item.desc;
            document.getElementById('m-contact').value = item.contact;
            form.querySelector('button[type="submit"]').textContent = 'Update Existing Structure';
        } else {
            form.reset();
            document.getElementById('m-cat').value = tab; 
            form.querySelector('button[type="submit"]').textContent = 'Inject New Listing';
        }
        document.getElementById('market-modal').classList.remove('hidden'); 
    }
    window.deleteListing = function(tab, id) {
        marketData[tab] = marketData[tab].filter(i => i.id !== id);
        renderMarket(tab);
    }
    window.closeMarketModal = function() { document.getElementById('market-modal').classList.add('hidden'); }

    document.getElementById('market-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const cat = document.getElementById('m-cat').value; 
        const imgUrl = document.getElementById('m-img').value || 'https://images.unsplash.com/photo-1586771107445-d3af23b44b82?auto=format&fit=crop&w=400&q=80';
        if (editingMarketId !== null) {
            const item = marketData[editingMarketTab].find(i => i.id === editingMarketId);
            item.title = document.getElementById('m-title').value;
            item.price = document.getElementById('m-price').value;
            item.img = imgUrl; item.desc = document.getElementById('m-desc').value; item.contact = document.getElementById('m-contact').value;
            renderMarket(editingMarketTab);
        } else {
            marketData[cat].unshift({
                id: Date.now(), title: document.getElementById('m-title').value, price: document.getElementById('m-price').value,
                img: imgUrl, desc: document.getElementById('m-desc').value, contact: document.getElementById('m-contact').value
            });
            renderMarket(cat);
        }
        closeMarketModal();
    });

    // --- Resources / Contacts CRUD ---
    function renderContacts() {
        const clist = document.getElementById('r-contact-list');
        clist.innerHTML = '';
        contactsData.forEach((c, idx) => {
            clist.innerHTML += `
                <li class="flex-between border-bottom pb-2 mb-2">
                    <div><span class="font-bold text-lg">${c.name}</span><br><span class="text-sm text-primary">${c.role}</span></div>
                    <div>
                        <a href="tel:${c.phone}" class="btn-primary text-sm px-2 mr-2">📞 Net-Call</a>
                        <button class="btn-icon text-sm" onclick="editContact(${idx})">✏️</button>
                        <button class="btn-icon text-danger text-sm" onclick="deleteContact(${idx})">❌</button>
                    </div>
                </li>`;
        });
    }
    window.addContact = function() {
        const name = prompt("Contact Label:"); if(!name) return;
        contactsData.push({name, role: prompt("Position Designate:"), phone: prompt("Tele-link:")});
        renderContacts();
    }
    window.editContact = function(idx) {
        const c = contactsData[idx];
        c.name = prompt("Contact Label:", c.name) || c.name;
        c.role = prompt("Position Designate:", c.role) || c.role;
        c.phone = prompt("Tele-link:", c.phone) || c.phone;
        renderContacts();
    }
    window.deleteContact = function(idx) { contactsData.splice(idx, 1); renderContacts(); }
    window.editProfile = function() { const n = prompt("Identity Update:"); if(n) { farmerName = n; updateGreeting(); } }
    
    // File reading for pollution component
    document.getElementById('photo-upload').addEventListener('change', function(e) {
        if(e.target.files && e.target.files[0]) {
            const rd = new FileReader();
            rd.onload = function(evt) { document.getElementById('uploaded-img').src = evt.target.result; document.getElementById('photo-preview-box').classList.remove('hidden'); };
            rd.readAsDataURL(e.target.files[0]);
        }
    });

    // --- Dynamic Calendar Core ---
    let currentDate = new Date();
    window.changeMonth = function(dir) {
        currentDate.setMonth(currentDate.getMonth() + dir);
        renderCalendar(currentDate);
    }
    function renderCalendar(date) {
        const grid = document.getElementById('real-calendar-grid');
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        document.getElementById('cal-title').textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        grid.innerHTML = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `<div class="cal-cell header">${d}</div>`).join('');
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        for (let i = 0; i < firstDay; i++) grid.innerHTML += `<div class="cal-cell empty border-bottom border-right"></div>`;
        for (let i = 1; i <= daysInMonth; i++) {
            grid.innerHTML += `<div class="cal-cell ${(i===10 || i===18) ? 'highlight' : ''}">${i}</div>`;
        }
    }

    // --- Advanced AI NLP Deep Module ---
    let chatMemory = [];
    const micBtn = document.getElementById('ai-mic');
    const chatInput = document.getElementById('ai-input');
    const SrAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    let rec;
    if (SrAPI) {
        rec = new SrAPI(); rec.lang = 'hi-IN'; rec.interimResults = false; rec.maxAlternatives = 1;
        rec.onstart = () => document.getElementById('ai-status').classList.remove('hidden');
        rec.onspeechend = () => { rec.stop(); document.getElementById('ai-status').classList.add('hidden'); };
        rec.onresult = (e) => { const txt = e.results[0][0].transcript; chatInput.value = txt; handleUserChat(txt); };
        rec.onerror = () => document.getElementById('ai-status').classList.add('hidden');
    } else micBtn.style.display = 'none';

    micBtn.addEventListener('click', () => { if(rec) { rec.lang = currentLang === 'en' ? 'en-IN' : 'hi-IN'; rec.start(); }});
    document.getElementById('ai-send').addEventListener('click', () => { if(chatInput.value.trim() !== '') handleUserChat(chatInput.value.trim()); });
    chatInput.addEventListener('keypress', (e) => { if(e.key === 'Enter' && chatInput.value.trim() !== '') handleUserChat(chatInput.value.trim()); });

    function renderAIResponse(wrapper, htmlString) {
        const bubble = document.createElement('div');
        bubble.className = "bubble border w-100";
        bubble.innerHTML = htmlString + `
            <div class="mt-3 pt-2 border-top flex gap-2">
                <button class="btn-secondary text-xs" onclick="alert('Regenerating new unique response...')">🔄 Regenerate</button>
                <button class="btn-secondary text-xs" onclick="alert('Refining response...')">✨ Improve</button>
                <button class="btn-primary text-xs" onclick="alert('Switching to Expert AI Mode...')">🧠 Advanced Version</button>
            </div>
        `;
        wrapper.innerHTML = "";
        wrapper.appendChild(bubble);
    }

    function handleUserChat(txt) {
        const hs = document.getElementById('chat-history');
        hs.innerHTML += `<div class="msg user-msg"><div class="bubble shadow">${txt}</div></div>`;
        hs.scrollTop = hs.scrollHeight;
        chatInput.value = '';
        
        chatMemory.push(txt);

        // Add loading placeholder
        const loaderId = 'ai-loader-' + Date.now();
        hs.innerHTML += `<div class="msg ai-msg" id="${loaderId}"><div class="bubble border"><span class="blink">Thinking deeply...</span></div></div>`;
        hs.scrollTop = hs.scrollHeight;

        setTimeout(() => {
            const aiWrap = document.getElementById(loaderId);
            const t = txt.toLowerCase();

            // 1. Translation / Keyword Extraction
            const hindiToEngMap = {
                'chawal': 'rice', 'gehun': 'wheat', 'kulhadi': 'axe', 'hal': 'plough', 
                'fasal': 'crop', 'pani': 'water', 'kisan': 'farmer', 'gai': 'cow', 'mitti': 'soil',
                'prakritik': 'organic', 'beej': 'seed', 'khad': 'fertilizer', 'tamatar': 'tomato', 
                'aam': 'mango', 'aloo': 'potato', 'pyaz': 'onion', 'tractor': 'tractor', 'bemari': 'disease'
            };
            
            let searchKeyword = "agriculture";
            for (let [hi, en] of Object.entries(hindiToEngMap)) {
                if (t.includes(hi) || t.includes(en)) {
                    searchKeyword = en;
                    break;
                }
            }

            // 2. Fetch 2-3 Gen-AI images based on translated/detected keyword
            let imgUrls = [
                `https://image.pollinations.ai/prompt/wide%20${searchKeyword}%20farm%20field?width=400&height=300&nologo=true&seed=101`,
                `https://image.pollinations.ai/prompt/close%20up%20${searchKeyword}%20agriculture?width=400&height=300&nologo=true&seed=102`,
                `https://image.pollinations.ai/prompt/farmer%20with%20${searchKeyword}?width=400&height=300&nologo=true&seed=103`
            ];
            
            // 3. Output Logic Mapping
            let enTitle = "General Farming Guidance", hiTitle = "सामान्य कृषि मार्गदर्शन";
            let enExp = `Analyzing agricultural data regarding ${searchKeyword}.`, hiExp = `${searchKeyword} से संबंधित कृषि डेटा का विश्लेषण।`;
            let enOpt = "A) Standard Approach<br>B) Advanced Organic<br>C) Mechanized", hiOpt = "A) मानक दृष्टिकोण<br>B) उन्नत जैविक<br>C) यंत्रीकृत";
            let enStep = "1. Test soil parity.<br>2. Allocate resources.<br>3. Monitor active weather grids.", hiStep = "1. मिट्टी परीक्षण।<br>2. संसाधन आवंटन।<br>3. मौसम की निगरानी।";
            let enSugg = `Consider integrating smart AI sensors for ${searchKeyword} management.`, hiSugg = `बेहतर परिणामों के लिए ${searchKeyword} प्रबंधन में स्मार्ट सेंसर का उपयोग करें।`;

            if(t.includes('weather') || t.includes('mausam')) {
                enTitle = "Advanced Weather Logic"; hiTitle = "उन्नत मौसम तर्क";
                enExp = "Severe precipitation anomaly detected traversing your sector in 48 hours."; hiExp = "48 घंटों में आपके क्षेत्र में भारी बारिश की आशंका है।";
                enOpt = "A) Accelerated Early Harvest<br>B) Perimeter Tarp Protection"; hiOpt = "A) जल्दी कटाई<br>B) परिधि तिरपाल सुरक्षा";
                enStep = "1. Lock unhoused machinery.<br>2. Deploy protective covers.<br>3. Abort localized irrigation."; hiStep = "1. मशीनरी को सुरक्षित करें।<br>2. सुरक्षा आवरण बिछाएं।<br>3. सिंचाई रोकें।";
                enSugg = "Focus entirely on infrastructural tarping to drastically reduce crop root rot potentials."; hiSugg = "मिट्टी के क्षरण को रोकने के लिए तुरंत तिरपाल लगाने पर ध्यान दें।";
            }

            // Final bilingual block construction bridging structured prompt variables
            let finalHtml = `
                <div class="${currentLang === 'hi' ? 'hidden' : 'block'} text-left">
                    <h4 class="text-primary-dark font-bold text-lg mb-2">1. ${enTitle}</h4>
                    <p class="text-xs mb-2">2. Visual Context:</p>
                    <div class="flex gap-2 mb-3 overflow-x-auto pb-1">
                        ${imgUrls.map(u => `<img src="${u}" class="rounded h-24 object-cover" onerror="this.src='https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200'">`).join('')}
                    </div>
                    <p class="text-sm"><strong>3. Explanation:</strong> ${enExp}</p>
                    <p class="text-sm mt-1"><strong>4. Features & Options:</strong><br>${enOpt}</p>
                    <p class="text-sm mt-1"><strong>5. Step-by-step Solution:</strong><br>${enStep}</p>
                    <p class="text-sm mt-1 text-success"><strong>6. Intelligent Suggestions:</strong> ${enSugg}</p>
                </div>
                
                <div class="${currentLang === 'en' ? 'hidden' : 'block'} text-left">
                    <h4 class="text-primary-dark font-bold text-lg mb-2">1. ${hiTitle}</h4>
                    <p class="text-xs mb-2">2. दृश्य (Images):</p>
                    <div class="flex gap-2 mb-3 overflow-x-auto pb-1">
                        ${imgUrls.map(u => `<img src="${u}" class="rounded h-24 object-cover" onerror="this.src='https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200'">`).join('')}
                    </div>
                    <p class="text-sm"><strong>3. व्याख्या (Explanation):</strong> ${hiExp}</p>
                    <p class="text-sm mt-1"><strong>4. विकल्प (Options):</strong><br>${hiOpt}</p>
                    <p class="text-sm mt-1"><strong>5. समाधान (Step-by-step):</strong><br>${hiStep}</p>
                    <p class="text-sm mt-1 text-success"><strong>6. सुझाव (Suggestions):</strong> ${hiSugg}</p>
                </div>
            `;

            renderAIResponse(aiWrap, finalHtml);
            hs.scrollTop = hs.scrollHeight;
        }, 800 + Math.random() * 800); // Dynamic variable AI thought delay simulating fresh responses
    }
    


    // --- L10N Toggle ---
    // --- L10N Toggle ---
    const i18nDict = {
        "Dashboard Overview": "डैशबोर्ड अवलोकन", "Real-Time Weather": "वास्तविक समय का मौसम",
        "Smart Crop Suggestion System": "स्मार्ट फसल सुझाव", "🌤️ Weather Parameters": "🌤️ मौसम मापन",
        "➕ Add Custom Crop": "➕ कस्टम फसल जोड़ें", "🔍 Automatic Crop Visualizer": "🔍 स्वचालित फसल दृश्य",
        "✅ Best Crops to Grow": "✅ उगाने के लिए बेहतरीन फसलें", "❌ Crops to Avoid": "❌ इन फसलों से बचें",
        "Smart Irrigation Analysis": "स्मार्ट सिंचाई विश्लेषण", "💧 Irrigation Logic Status": "💧 सिंचाई तर्क स्थिति",
        "Land Measurement & Custom Setup Tools": "भूमि माप व उपकरण", "Land Area Calculator": "भूमि क्षेत्र कैलकुलेटर",
        "Basic Mathematics Utility": "बुनियादी गणित उपयोगिता", "Fertilizer Calculator": "उर्वरक कैलकुलेटर",
        "Market Price & Profit": "बाजार मूल्य और लाभ", "Fruits & Vegetables Market": "फल और सब्जी बाज़ार",
        "Farming Equipment Exchange": "कृषि उपकरण बाज़ार", "Land Leasing & Purchase": "भूमि खरीद-बिक्री",
        "Farm Labor & Warehouse Contacts": "श्रम और गोदाम संपर्क", "Medicine & Pesticide Guides": "दवा और कीटनाशक",
        "Government Loans & Subsidies": "सरकारी ऋण और सब्सिडी", "Drone Monitoring & Pollution Upload": "ड्रोन निगरानी और प्रदूषण",
        "Heuristic Voice AI Analyst": "आवाज़ एआई विश्लेषक", "Pro Voice Editing Module": "प्रो वॉयस एडिटिंग मॉड्यूल",
        "Dynamic Sowing Phase Calendar": "बुवाई का कैलेंडर", "Farmer Profile": "किसान प्रोफ़ाइल",
        "Farm Health": "खेत का स्वास्थ्य", "5-Day Forecast": "5-दिन का मौसम",
        "Get Suggestion": "सुझाव प्राप्त करें", "Calculate Area": "विस्तार की गणना करें", "Calculate Usage Map": "मात्रा की गणना करें",
        "+ Add Estimation": "+ अनुमान जोड़ें", "+ List Vegetable / Crop": "+ सब्जी/फसल सूचीबद्ध करें",
        "+ List Machinery": "+ मशीनरी सूचीबद्ध करें", "+ List Real Estate / Acreage": "+ अचल संपत्ति सूचीबद्ध करें",
        "+ New Entity": "+ नई प्रविष्टि", "File Plant Disease & Pollution Report": "रिपोर्ट दर्ज करें",
        "Upload Audio File": "ऑडियो अपलोड करें", "⏺ Record": "⏺ रिकॉर्ड करें",
        "Audio Controls": "ऑडियो नियंत्रण", "Smart Presets": "स्मार्ट प्रीसेट", "Conditions are optimal. Soil moisture maintained.": "स्थितियां इष्टतम हैं। मिट्टी की नमी बनी हुई है।",
        "Total Fields:": "कुल खेत:", "Total Area:": "कुल क्षेत्रफल:", "Acres": "एकड़", "Clear Sky": "साफ आसमान",
        "Tomorrow": "कल", "Day 3": "दिन 3", "Day 4": "दिन 4", "Day 5": "दिन 5", "Day 6": "दिन 6",
        "Temperature (°C)": "तापमान (°C)", "Humidity (%)": "नमी (%)", "Crop Name": "फसल का नाम", "Min Temp": "न्यूनतम तापमान",
        "Max Temp": "अधिकतम तापमान", "Water Req.": "पानी", "Profit Level": "लाभ स्तर", "Low": "कम", "Medium": "मध्यम", "High": "उच्च",
        "Loading...": "लोड हो रहा है...", "Length (ft)": "लंबाई (फीट)", "Width (ft)": "चौड़ाई (फीट)",
        "Field Size (Acres)": "खेत का आकार (एकड़)", "Target Crop": "लक्षित फसल", "Wheat": "गेहूँ", "Maize": "मक्का", "Soybean": "सोयाबीन",
        "Cost (₹)": "लागत (₹)", "Yield (Qtl)": "उपज (क्विंटल)", "Sales Price (₹)": "बिक्री मूल्य (₹)", "Est. Profit": "अनुमानित लाभ", 
        "Actions": "कार्रवाई", "Usage:": "उपयोग:", "Dosage:": "खुराक:", "Short-term crop loans.": "अल्पकालिक फसल ऋण।",
        "Apply via Portal": "पोर्टल से आवेदन करें", "Review Scheme Verification": "योजना सत्यापन की समीक्षा करें",
        "Launch Portal": "पोर्टल लॉन्च करें", "Active Perimeter Field Monitoring": "सक्रिय क्षेत्र निगरानी",
        "LIVE STREAM": "लाइव स्ट्रीम", "Secure Drone Array Feed Connected": "सुरक्षित ड्रोन फीड कनेक्टेड",
        "Uploading Neural Vectors...": "अपलोड हो रहा है...", "SCANNING": "स्कैनिंग", "CORE ONLINE": "कोर ऑनलाइन",
        "Terminal booted.": "टर्मिनल बूट हो गया।", "Examples:": "उदाहरण:", "or record directly": "या सीधे रिकॉर्ड करें",
        "Background Noise Reduction": "पार्श्व ध्वनि न्यूनीकरण", "Pitch Shift": "पिच शिफ्ट", "Playback Speed": "प्लेबैक गति",
        "Podcast Mode": "पॉडकास्ट मोड", "Studio Mode": "स्टूडियो मोड", "Clear Voice": "स्पष्ट आवाज़", "Reset All": "सभी रीसेट करें",
        "Sun": "रवि", "Mon": "सोम", "Tue": "मंगल", "Wed": "बुध", "Thu": "गुरु", "Fri": "शुक्र", "Sat": "शनि",
        "Inject Marketplace Object": "मार्केटप्लेस ऑब्जेक्ट जोड़ें", "Unit Classification / Title": "इकाई वर्गीकरण / शीर्षक",
        "Numerical Worth String": "संख्यात्मक मूल्य", "Visual Reference Node (URL)": "दृश्य संदर्भ (URL)",
        "Tele-routing Number": "संपर्क नंबर", "Finalize Operation": "अंतिम रूप दें", "Add Crop": "फसल जोड़ें",
        "Enter crop name (e.g., Mango, Rice, Tractor)": "फसल का नाम दर्ज करें (मक्का, गेहूं, ट्रैक्टर)",
        "Provide condition specifications...": "स्थिति विवरण प्रदान करें...",
        "E.G: Soybean Output, John Deere Engine": "उदाहरण: सोयाबीन, ट्रैक्टर",
        "User contact info.": "उपयोगकर्ता संपर्क",
        "E.G: ₹15/kg, ₹400000": "उदाहरण: ₹15/kg, ₹400000"
    };

    toggleLangBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'hi' : 'en';
        
        // Tagged Native Data
        document.querySelectorAll('[data-en]').forEach(el => {
            if(!el.querySelector('.icon')) el.textContent = el.getAttribute(`data-${currentLang}`);
            else el.innerHTML = `<span class="icon">${el.querySelector('.icon').innerHTML}</span> ${el.getAttribute(`data-${currentLang}`)}`;
        });
        
        // Deep Structural Translation mapping using Text Nodes
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while(node = walker.nextNode()) {
            let txt = node.nodeValue.trim();
            if(!txt) continue;
            
            if(currentLang === 'hi') {
                for (let en_key in i18nDict) {
                    if (txt.includes(en_key)) {
                        node.parentElement.dataset.origEn = txt;
                        node.nodeValue = node.nodeValue.replace(en_key, i18nDict[en_key]);
                    }
                }
            } else if (currentLang === 'en' && node.parentElement.dataset.origEn) {
                node.nodeValue = node.parentElement.dataset.origEn;
            }
        }
        
        // Translate Placeholders
        document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
            let p_txt = el.getAttribute('placeholder').trim();
            if(currentLang === 'hi') {
                for (let en_key in i18nDict) {
                    if(p_txt === en_key) {
                        el.dataset.origEnPh = en_key;
                        el.setAttribute('placeholder', i18nDict[en_key]);
                        break;
                    }
                }
            } else if(currentLang === 'en' && el.dataset.origEnPh) {
                el.setAttribute('placeholder', el.dataset.origEnPh);
            }
        });
        
        updateGreeting();
    });

    initApp();
});
