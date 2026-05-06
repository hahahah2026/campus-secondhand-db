/**
 * Filename: js/app.js
 * Description: Core business logic for Campus Secondhand Trading Platform DB System
 * Data Source: Strictly follows the DOCX file (User/Item/Orders initial data)
 */

// ==================== In-Memory Database (mirrors SQLite structure) ====================
const DB = {
    // User table: user_id (PK), user_name (NOT NULL), phone
    User: [
        { user_id: 'u001', user_name: 'ZhangSan', phone: '13800000001' },
        { user_id: 'u002', user_name: 'LiSi',     phone: '13800000002' },
        { user_id: 'u003', user_name: 'WangWu',   phone: '13800000003' },
        { user_id: 'u004', user_name: 'ZhaoLiu',  phone: '13800000004' }
    ],
    // Item table: item_id (PK), item_name (NOT NULL), category, price, status, seller_id (FK)
    Item: [
        { item_id: 'i001', item_name: 'CalculusBook',     category: 'Book',        price: 20, status: 0, seller_id: 'u001' },
        { item_id: 'i002', item_name: 'DeskLamp',         category: 'DailyGoods',  price: 35, status: 1, seller_id: 'u002' },
        { item_id: 'i003', item_name: 'Microcontroller',  category: 'Electronics', price: 80, status: 0, seller_id: 'u001' },
        { item_id: 'i004', item_name: 'Chair',            category: 'Furniture',   price: 50, status: 1, seller_id: 'u003' },
        { item_id: 'i005', item_name: 'WaterBottle',      category: 'DailyGoods',  price: 15, status: 0, seller_id: 'u004' }
    ],
    // Orders table: order_id (PK), item_id (UNIQUE, FK), buyer_id (FK), order_date
    Orders: [
        { order_id: 'o001', item_id: 'i002', buyer_id: 'u001', order_date: '2024-05-01' },
        { order_id: 'o002', item_id: 'i004', buyer_id: 'u002', order_date: '2024-05-03' }
    ]
};

// ==================== Utility Functions ====================

function renderTable(containerId, columns, rows, formatters) {
    const container = document.getElementById(containerId);
    if (!rows || rows.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-500 p-4">No data</p>';
        return;
    }
    const displayCols = columns || Object.keys(rows[0]);
    let html = '<table class="data-table"><tr>';
    displayCols.forEach(c => { html += `<th>${c}</th>`; });
    html += '</tr>';
    rows.forEach(row => {
        html += '<tr>';
        displayCols.forEach(c => {
            let val = row[c];
            if (formatters && formatters[c]) val = formatters[c](val);
            else if (c === 'status') {
                val = val === 1
                    ? '<span class="badge badge-red">Sold</span>'
                    : '<span class="badge badge-green">Unsold</span>';
            }
            html += `<td>${val !== null && val !== undefined ? val : ''}</td>`;
        });
        html += '</tr>';
    });
    html += '</table>';
    container.innerHTML = html;
}

function navigateTo(page) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.page-section').forEach(el => el.classList.remove('active'));
    document.querySelector(`.nav-item[data-page="${page}"]`)?.classList.add('active');
    document.getElementById(`page-${page}`)?.classList.add('active');
    window.scrollTo(0, 0);
}

// ==================== Page Templates ====================
const pageTemplates = {

home: `
<div id="page-home" class="page-section active p-8">
    <div class="max-w-5xl mx-auto">
        <div class="card bg-gradient-to-r from-blue-600 to-indigo-700 text-white mb-8">
            <h2 class="text-2xl font-bold mb-2"><i class="fas fa-university mr-2"></i>Campus Secondhand Trading Platform DB System</h2>
            <p class="text-blue-100">Database Principles Course Project — Pure Frontend Implementation</p>
            <div class="mt-4 flex gap-3">
                <span class="badge badge-blue bg-white/20 text-white">SQLite</span>
                <span class="badge badge-green bg-white/20 text-white">In-Memory DB</span>
                <span class="badge badge-purple bg-white/20 text-white">Pure Frontend</span>
            </div>
        </div>
        <div class="grid grid-cols-3 gap-5 mb-8">
            <div class="card text-center cursor-pointer hover:shadow-lg transition" onclick="navigateTo('items')">
                <div class="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 text-2xl"><i class="fas fa-box"></i></div>
                <h3 class="font-semibold text-gray-800">Item List</h3>
                <p class="text-sm text-gray-500 mt-1">Browse all secondhand items</p>
                <div class="mt-3 text-2xl font-bold text-blue-600" id="homeItemCount">-</div>
            </div>
            <div class="card text-center cursor-pointer hover:shadow-lg transition" onclick="navigateTo('users')">
                <div class="w-14 h-14 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-3 text-2xl"><i class="fas fa-users"></i></div>
                <h3 class="font-semibold text-gray-800">User List</h3>
                <p class="text-sm text-gray-500 mt-1">View registered users</p>
                <div class="mt-3 text-2xl font-bold text-green-600" id="homeUserCount">-</div>
            </div>
            <div class="card text-center cursor-pointer hover:shadow-lg transition" onclick="navigateTo('orders')">
                <div class="w-14 h-14 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3 text-2xl"><i class="fas fa-receipt"></i></div>
                <h3 class="font-semibold text-gray-800">Order List</h3>
                <p class="text-sm text-gray-500 mt-1">View transaction records</p>
                <div class="mt-3 text-2xl font-bold text-purple-600" id="homeOrderCount">-</div>
            </div>
        </div>
        <div class="card">
            <h3 class="font-bold text-gray-800 mb-4 text-lg"><i class="fas fa-tasks mr-2 text-blue-600"></i>Required Task Navigation</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button class="btn btn-primary justify-center" onclick="navigateTo('dbdef')"><i class="fas fa-database"></i>DB Definition</button>
                <button class="btn btn-success justify-center" onclick="navigateTo('dataops')"><i class="fas fa-edit"></i>Data Operations</button>
                <button class="btn btn-warning justify-center" onclick="navigateTo('basic')"><i class="fas fa-search"></i>Basic Query</button>
                <button class="btn btn-primary justify-center" onclick="navigateTo('join')"><i class="fas fa-link"></i>Join Query</button>
                <button class="btn btn-success justify-center" onclick="navigateTo('agg')"><i class="fas fa-chart-bar"></i>Aggregation</button>
                <button class="btn btn-warning justify-center" onclick="navigateTo('views')"><i class="fas fa-eye"></i>Views</button>
                <button class="btn btn-danger justify-center" onclick="navigateTo('buy')"><i class="fas fa-shopping-cart"></i>Buy Item</button>
            </div>
        </div>
    </div>
</div>`,

dbdef: `
<div id="page-dbdef" class="page-section p-8">
    <div class="max-w-5xl mx-auto">
        <h2 class="text-xl font-bold text-gray-800 mb-5"><i class="fas fa-database mr-2 text-blue-600"></i>Database Definition</h2>
        <div class="card">
            <h3 class="font-semibold text-gray-800 mb-3">1. Create Database and Tables</h3>
            <div class="sql-code">CREATE TABLE User (
    user_id   VARCHAR(10) PRIMARY KEY,
    user_name VARCHAR(50)  NOT NULL,
    phone     VARCHAR(20)
);

CREATE TABLE Item (
    item_id    VARCHAR(10) PRIMARY KEY,
    item_name  VARCHAR(100) NOT NULL,
    category   VARCHAR(50),
    price      DECIMAL(10,2),
    status     INT DEFAULT 0 CHECK(status IN (0,1)),
    seller_id  VARCHAR(10),
    FOREIGN KEY (seller_id) REFERENCES User(user_id)
);

CREATE TABLE Orders (
    order_id    VARCHAR(10) PRIMARY KEY,
    item_id     VARCHAR(10) UNIQUE,
    buyer_id    VARCHAR(10),
    order_date  DATE,
    FOREIGN KEY (item_id) REFERENCES Item(item_id),
    FOREIGN KEY (buyer_id) REFERENCES User(user_id)
);</div>
            <p class="text-sm text-gray-600 mt-2">Result: <span class="text-green-600 font-medium">All 3 tables created successfully with PK, FK, NOT NULL, CHECK, and UNIQUE constraints.</span></p>
        </div>
        <div class="card">
            <h3 class="font-semibold text-gray-800 mb-3">2. Integrity Constraints</h3>
            <ul class="text-sm text-gray-700 space-y-2 list-disc pl-5">
                <li><strong>Primary Key:</strong> user_id, item_id, order_id are PKs of respective tables.</li>
                <li><strong>Foreign Key:</strong> Item.seller_id → User.user_id; Orders.item_id → Item.item_id; Orders.buyer_id → User.user_id.</li>
                <li><strong>NOT NULL:</strong> user_name and item_name cannot be NULL.</li>
                <li><strong>CHECK:</strong> Item.status must be 0 (unsold) or 1 (sold).</li>
                <li><strong>UNIQUE:</strong> Orders.item_id is UNIQUE, ensuring each item can be traded at most once.</li>
            </ul>
        </div>
        <div class="card">
            <h3 class="font-semibold text-gray-800 mb-3">3. Consistency Rules</h3>
            <ul class="text-sm text-gray-700 space-y-2 list-disc pl-5">
                <li>Each item can only be traded once (enforced by UNIQUE on Orders.item_id).</li>
                <li>If an item appears in Orders, its status must be 1 (sold).</li>
                <li>If an item's status = 0 (unsold), it cannot appear in Orders.</li>
            </ul>
        </div>
    </div>
</div>`,

dataops: `
<div id="page-dataops" class="page-section p-8">
    <div class="max-w-5xl mx-auto">
        <h2 class="text-xl font-bold text-gray-800 mb-5"><i class="fas fa-edit mr-2 text-green-600"></i>Data Operations</h2>
        <div class="card">
            <h3 class="font-semibold text-gray-800 mb-3">Initial Data Inserted (Given by Assignment)</h3>
            <div class="sql-code">-- User table (4 rows)
INSERT INTO User VALUES ('u001','ZhangSan','13800000001');
INSERT INTO User VALUES ('u002','LiSi','13800000002');
INSERT INTO User VALUES ('u003','WangWu','13800000003');
INSERT INTO User VALUES ('u004','ZhaoLiu','13800000004');

-- Item table (5 rows)
INSERT INTO Item VALUES ('i001','CalculusBook','Book',20,0,'u001');
INSERT INTO Item VALUES ('i002','DeskLamp','DailyGoods',35,1,'u002');
INSERT INTO Item VALUES ('i003','Microcontroller','Electronics',80,0,'u001');
INSERT INTO Item VALUES ('i004','Chair','Furniture',50,1,'u003');
INSERT INTO Item VALUES ('i005','WaterBottle','DailyGoods',15,0,'u004');

-- Orders table (2 rows)
INSERT INTO Orders VALUES ('o001','i002','u001','2024-05-01');
INSERT INTO Orders VALUES ('o002','i004','u002','2024-05-03');</div>
        </div>
        <div class="card">
            <h3 class="font-semibold text-gray-800 mb-3">Current Item Table</h3>
            <div id="opsTable" class="table-container"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div class="card">
                <h3 class="font-semibold text-gray-800 mb-3"><span class="badge badge-green mr-2">INSERT</span>Insert New Item</h3>
                <div class="form-group"><label class="form-label">Item ID</label><input type="text" class="form-input" id="newItemId" placeholder="e.g. i006"></div>
                <div class="form-group"><label class="form-label">Item Name</label><input type="text" class="form-input" id="newItemName" placeholder="e.g. Backpack"></div>
                <div class="form-group"><label class="form-label">Category</label><input type="text" class="form-input" id="newItemCategory" placeholder="e.g. DailyGoods"></div>
                <div class="form-group"><label class="form-label">Price</label><input type="number" class="form-input" id="newItemPrice" placeholder="e.g. 25"></div>
                <div class="form-group"><label class="form-label">Seller ID</label><input type="text" class="form-input" id="newItemSeller" placeholder="e.g. u002"></div>
                <button class="btn btn-success w-full justify-center" onclick="insertItem()"><i class="fas fa-plus"></i> Execute INSERT</button>
                <div class="mt-3 sql-code text-xs" id="insertSql"></div>
                <div class="mt-2 text-sm" id="insertResult"></div>
            </div>
            <div class="card">
                <h3 class="font-semibold text-gray-800 mb-3"><span class="badge badge-blue mr-2">UPDATE</span>Update Item Price</h3>
                <div class="form-group"><label class="form-label">Select Item</label><select class="form-input" id="updateItemSelect"></select></div>
                <div class="form-group"><label class="form-label">New Price</label><input type="number" class="form-input" id="updateItemPrice" placeholder="Enter new price"></div>
                <button class="btn btn-primary w-full justify-center" onclick="updateItemPrice()"><i class="fas fa-pen"></i> Execute UPDATE</button>
                <div class="mt-3 sql-code text-xs" id="updateSql"></div>
                <div class="mt-2 text-sm" id="updateResult"></div>
            </div>
            <div class="card">
                <h3 class="font-semibold text-gray-800 mb-3"><span class="badge badge-red mr-2">DELETE</span>Delete Unsold Item</h3>
                <div class="form-group"><label class="form-label">Select Unsold Item</label><select class="form-input" id="deleteItemSelect"></select></div>
                <button class="btn btn-danger w-full justify-center" onclick="deleteItem()"><i class="fas fa-trash"></i> Execute DELETE</button>
                <div class="mt-3 sql-code text-xs" id="deleteSql"></div>
                <div class="mt-2 text-sm" id="deleteResult"></div>
            </div>
        </div>
    </div>
</div>`,

items: `
<div id="page-items" class="page-section p-8">
    <div class="max-w-5xl mx-auto">
        <h2 class="text-xl font-bold text-gray-800 mb-5"><i class="fas fa-box mr-2 text-blue-600"></i>Item List</h2>
        <div class="card">
            <div class="flex gap-3 mb-4 flex-wrap">
                <button class="btn btn-primary" onclick="loadItems('all')"><i class="fas fa-list"></i>All</button>
                <button class="btn btn-success" onclick="loadItems('unsold')"><i class="fas fa-circle"></i>Unsold</button>
                <button class="btn btn-warning" onclick="loadItems('sold')"><i class="fas fa-check-circle"></i>Sold</button>
                <button class="btn btn-primary" onclick="loadItems('price30')"><i class="fas fa-filter"></i>Price > 30</button>
                <button class="btn btn-success" onclick="loadItems('daily')"><i class="fas fa-leaf"></i>DailyGoods</button>
                <button class="btn btn-warning" onclick="loadItems('u001')"><i class="fas fa-user"></i>Posted by u001</button>
            </div>
            <div id="itemsTable" class="table-container"></div>
        </div>
    </div>
</div>`,

users: `
<div id="page-users" class="page-section p-8">
    <div class="max-w-5xl mx-auto">
        <h2 class="text-xl font-bold text-gray-800 mb-5"><i class="fas fa-users mr-2 text-green-600"></i>User List</h2>
        <div class="card">
            <div id="usersTable" class="table-container"></div>
        </div>
    </div>
</div>`,

orders: `
<div id="page-orders" class="page-section p-8">
    <div class="max-w-5xl mx-auto">
        <h2 class="text-xl font-bold text-gray-800 mb-5"><i class="fas fa-receipt mr-2 text-purple-600"></i>Order List</h2>
        <div class="card">
            <div id="ordersTable" class="table-container"></div>
        </div>
    </div>
</div>`,

basic: `
<div id="page-basic" class="page-section p-8">
    <div class="max-w-5xl mx-auto">
        <h2 class="text-xl font-bold text-gray-800 mb-5"><i class="fas fa-search mr-2 text-blue-600"></i>Basic Query</h2>
        <div class="card">
            <h3 class="font-semibold text-gray-800 mb-2">1. Query all unsold items (status = 0)</h3>
            <div class="sql-code">SELECT * FROM Item WHERE status = 0;</div>
            <div class="mt-3" id="basic1Table"></div>
        </div>
        <div class="card">
            <h3 class="font-semibold text-gray-800 mb-2">2. Query items with price > 30</h3>
            <div class="sql-code">SELECT * FROM Item WHERE price > 30;</div>
            <div class="mt-3" id="basic2Table"></div>
        </div>
        <div class="card">
            <h3 class="font-semibold text-gray-800 mb-2">3. Query DailyGoods category items</h3>
            <div class="sql-code">SELECT * FROM Item WHERE category = 'DailyGoods';</div>
            <div class="mt-3" id="basic3Table"></div>
        </div>
        <div class="card">
            <h3 class="font-semibold text-gray-800 mb-2">4. Query all items posted by u001</h3>
            <div class="sql-code">SELECT * FROM Item WHERE seller_id = 'u001';</div>
            <div class="mt-3" id="basic4Table"></div>
        </div>
    </div>
</div>`,

join: `
<div id="page-join" class="page-section p-8">
    <div class="max-w-5xl mx-auto">
        <h2 class="text-xl font-bold text-gray-800 mb-5"><i class="fas fa-link mr-2 text-blue-600"></i>Join Query</h2>
        <div class="card">
            <h3 class="font-semibold text-gray-800 mb-2">1. Query all sold items and their buyer names</h3>
            <div class="sql-code">SELECT i.item_name, u.user_name AS buyer_name
FROM Item i
JOIN Orders o ON i.item_id = o.item_id
JOIN User u ON o.buyer_id = u.user_id;</div>
            <div class="mt-3" id="join1Table"></div>
        </div>
        <div class="card">
            <h3 class="font-semibold text-gray-800 mb-2">2. Query each order: item name + buyer name + date</h3>
            <div class="sql-code">SELECT i.item_name, u.user_name AS buyer_name, o.order_date
FROM Orders o
JOIN Item i ON o.item_id = i.item_id
JOIN User u ON o.buyer_id = u.user_id;</div>
            <div class="mt-3" id="join2Table"></div>
        </div>
        <div class="card">
            <h3 class="font-semibold text-gray-800 mb-2">3. Query whether items from seller u001 are purchased</h3>
            <div class="sql-code">SELECT i.item_name, i.status,
       CASE WHEN o.order_id IS NOT NULL THEN 'Purchased' ELSE 'Not Purchased' END AS purchase_status
FROM Item i
LEFT JOIN Orders o ON i.item_id = o.item_id
WHERE i.seller_id = 'u001';</div>
            <div class="mt-3" id="join3Table"></div>
        </div>
    </div>
</div>`,

agg: `
<div id="page-agg" class="page-section p-8">
    <div class="max-w-5xl mx-auto">
        <h2 class="text-xl font-bold text-gray-800 mb-5"><i class="fas fa-chart-bar mr-2 text-blue-600"></i>Aggregation & Grouping</h2>
        <div class="card">
            <h3 class="font-semibold text-gray-800 mb-2">1. Count total items</h3>
            <div class="sql-code">SELECT COUNT(*) AS total_items FROM Item;</div>
            <div class="mt-3" id="agg1Table"></div>
        </div>
        <div class="card">
            <h3 class="font-semibold text-gray-800 mb-2">2. Count items per category</h3>
            <div class="sql-code">SELECT category, COUNT(*) AS item_count FROM Item GROUP BY category;</div>
            <div class="mt-3" id="agg2Table"></div>
        </div>
        <div class="card">
            <h3 class="font-semibold text-gray-800 mb-2">3. Calculate average price of all items</h3>
            <div class="sql-code">SELECT ROUND(AVG(price), 2) AS avg_price FROM Item;</div>
            <div class="mt-3" id="agg3Table"></div>
        </div>
        <div class="card">
            <h3 class="font-semibold text-gray-800 mb-2">4. Find user who posted the most items</h3>
            <div class="sql-code">SELECT u.user_id, u.user_name, COUNT(*) AS item_count
FROM User u
JOIN Item i ON u.user_id = i.seller_id
GROUP BY u.user_id, u.user_name
ORDER BY item_count DESC
LIMIT 1;</div>
            <div class="mt-3" id="agg4Table"></div>
        </div>
    </div>
</div>`,

views: `
<div id="page-views" class="page-section p-8">
    <div class="max-w-5xl mx-auto">
        <h2 class="text-xl font-bold text-gray-800 mb-5"><i class="fas fa-eye mr-2 text-blue-600"></i>Views</h2>
        <div class="card">
            <h3 class="font-semibold text-gray-800 mb-2">1. SoldItems View (item_name + buyer_id)</h3>
            <div class="sql-code">CREATE VIEW SoldItems AS
SELECT i.item_name, o.buyer_id
FROM Item i
JOIN Orders o ON i.item_id = o.item_id;</div>
            <div class="mt-3" id="view1Table"></div>
        </div>
        <div class="card">
            <h3 class="font-semibold text-gray-800 mb-2">2. UnsoldItems View</h3>
            <div class="sql-code">CREATE VIEW UnsoldItems AS
SELECT item_id, item_name, category, price, seller_id
FROM Item WHERE status = 0;</div>
            <div class="mt-3" id="view2Table"></div>
        </div>
    </div>
</div>`,

buy: `
<div id="page-buy" class="page-section p-8">
    <div class="max-w-5xl mx-auto">
        <h2 class="text-xl font-bold text-gray-800 mb-5"><i class="fas fa-shopping-cart mr-2 text-red-600"></i>Buy Item</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="card">
                <h3 class="font-semibold text-gray-800 mb-3">Available Items (status = 0)</h3>
                <div id="buyItemsTable" class="table-container max-h-80 overflow-y-auto"></div>
            </div>
            <div class="card">
                <h3 class="font-semibold text-gray-800 mb-3">Place Order</h3>
                <div class="form-group"><label class="form-label">Select Item</label><select class="form-input" id="buyItemSelect"></select></div>
                <div class="form-group"><label class="form-label">Buyer (User)</label><select class="form-input" id="buyUserSelect"></select></div>
                <div class="form-group"><label class="form-label">Order Date</label><input type="date" class="form-input" id="buyDate"></div>
                <button class="btn btn-danger w-full justify-center" onclick="buyItem()"><i class="fas fa-shopping-cart"></i> Confirm Purchase</button>
                <div class="mt-3 sql-code text-xs" id="buySql"></div>
                <div class="mt-2 text-sm font-medium" id="buyResult"></div>
            </div>
        </div>
        <div class="card">
            <h3 class="font-semibold text-gray-800 mb-3">Business Logic</h3>
            <p class="text-sm text-gray-700 mb-2">When a user buys an item, two operations must be completed atomically:</p>
            <ol class="text-sm text-gray-700 space-y-1 list-decimal pl-5">
                <li>INSERT a new record into Orders table</li>
                <li>UPDATE the item's status to 1 (sold) in Item table</li>
            </ol>
            <p class="text-sm text-gray-700 mt-2"><strong>Constraint Protection:</strong> Since Orders.item_id has UNIQUE constraint, an already-sold item cannot be ordered again, ensuring each item is traded at most once.</p>
        </div>
    </div>
</div>`
};

// ==================== Render All Pages ====================
function renderAllPages() {
    const main = document.getElementById('main-content');
    let html = '';
    for (const key in pageTemplates) html += pageTemplates[key];
    main.innerHTML = html;
    document.querySelectorAll('.nav-item').forEach(el => {
        el.addEventListener('click', () => navigateTo(el.dataset.page));
    });
    refreshAll();
}

// ==================== Data Loaders ====================

function refreshHome() {
    document.getElementById('homeItemCount').textContent = DB.Item.length;
    document.getElementById('homeUserCount').textContent = DB.User.length;
    document.getElementById('homeOrderCount').textContent = DB.Orders.length;
}

function loadItems(filter) {
    let data = [...DB.Item];
    if (filter === 'unsold') data = data.filter(i => i.status === 0);
    else if (filter === 'sold') data = data.filter(i => i.status === 1);
    else if (filter === 'price30') data = data.filter(i => i.price > 30);
    else if (filter === 'daily') data = data.filter(i => i.category === 'DailyGoods');
    else if (filter === 'u001') data = data.filter(i => i.seller_id === 'u001');
    renderTable('itemsTable', null, data);
}

function loadUsers() {
    renderTable('usersTable', null, DB.User);
}

function loadOrders() {
    const data = DB.Orders.map(o => {
        const item = DB.Item.find(i => i.item_id === o.item_id);
        const buyer = DB.User.find(u => u.user_id === o.buyer_id);
        return { order_id: o.order_id, item_name: item ? item.item_name : '', buyer_name: buyer ? buyer.user_name : '', order_date: o.order_date };
    }).sort((a, b) => a.order_date.localeCompare(b.order_date));
    renderTable('ordersTable', null, data);
}

function loadBasicQueries() {
    renderTable('basic1Table', null, DB.Item.filter(i => i.status === 0));
    renderTable('basic2Table', null, DB.Item.filter(i => i.price > 30));
    renderTable('basic3Table', null, DB.Item.filter(i => i.category === 'DailyGoods'));
    renderTable('basic4Table', null, DB.Item.filter(i => i.seller_id === 'u001'));
}

function loadJoinQueries() {
    const join1 = DB.Orders.map(o => {
        const item = DB.Item.find(i => i.item_id === o.item_id);
        const buyer = DB.User.find(u => u.user_id === o.buyer_id);
        return { item_name: item ? item.item_name : '', buyer_name: buyer ? buyer.user_name : '' };
    });
    renderTable('join1Table', null, join1);

    const join2 = DB.Orders.map(o => {
        const item = DB.Item.find(i => i.item_id === o.item_id);
        const buyer = DB.User.find(u => u.user_id === o.buyer_id);
        return { item_name: item ? item.item_name : '', buyer_name: buyer ? buyer.user_name : '', order_date: o.order_date };
    });
    renderTable('join2Table', null, join2);

    const join3 = DB.Item.filter(i => i.seller_id === 'u001').map(i => {
        const order = DB.Orders.find(o => o.item_id === i.item_id);
        return { item_name: i.item_name, status: i.status, purchase_status: order ? 'Purchased' : 'Not Purchased' };
    });
    renderTable('join3Table', null, join3);
}

function loadAggQueries() {
    renderTable('agg1Table', null, [{ total_items: DB.Item.length }]);

    const agg2 = {};
    DB.Item.forEach(i => { agg2[i.category] = (agg2[i.category] || 0) + 1; });
    renderTable('agg2Table', null, Object.entries(agg2).map(([category, item_count]) => ({ category, item_count })));

    const avg = DB.Item.reduce((sum, i) => sum + i.price, 0) / DB.Item.length;
    renderTable('agg3Table', null, [{ avg_price: avg.toFixed(2) }]);

    const agg4 = {};
    DB.Item.forEach(i => { agg4[i.seller_id] = (agg4[i.seller_id] || 0) + 1; });
    const maxSeller = Object.entries(agg4).sort((a, b) => b[1] - a[1])[0];
    const user = DB.User.find(u => u.user_id === maxSeller[0]);
    renderTable('agg4Table', null, [{ user_id: maxSeller[0], user_name: user ? user.user_name : '', item_count: maxSeller[1] }]);
}

function loadViews() {
    const sold = DB.Orders.map(o => {
        const item = DB.Item.find(i => i.item_id === o.item_id);
        return { item_name: item ? item.item_name : '', buyer_id: o.buyer_id };
    });
    renderTable('view1Table', null, sold);

    const unsold = DB.Item.filter(i => i.status === 0).map(i => ({
        item_id: i.item_id, item_name: i.item_name, category: i.category, price: i.price, seller_id: i.seller_id
    }));
    renderTable('view2Table', null, unsold);
}

// ==================== Data Operations Page ====================

function refreshOpsPage() {
    renderTable('opsTable', null, DB.Item);

    let opts = DB.Item.map(r => `<option value="${r.item_id}">${r.item_id} - ${r.item_name}</option>`).join('');
    document.getElementById('updateItemSelect').innerHTML = opts;

    let delOpts = DB.Item.filter(r => r.status === 0).map(r => `<option value="${r.item_id}">${r.item_id} - ${r.item_name}</option>`).join('');
    if (!delOpts) delOpts = '<option disabled>No unsold items available</option>';
    document.getElementById('deleteItemSelect').innerHTML = delOpts;
}

function insertItem() {
    const id = document.getElementById('newItemId').value.trim();
    const name = document.getElementById('newItemName').value.trim();
    const cat = document.getElementById('newItemCategory').value.trim();
    const price = parseFloat(document.getElementById('newItemPrice').value);
    const seller = document.getElementById('newItemSeller').value.trim();

    if (!id || !name || isNaN(price) || !seller) {
        document.getElementById('insertResult').innerHTML = '<span class="text-red-600">Please fill in all fields</span>';
        return;
    }
    if (DB.Item.find(i => i.item_id === id)) {
        document.getElementById('insertResult').innerHTML = '<span class="text-red-600">Item ID already exists</span>';
        return;
    }

    const sql = `INSERT INTO Item (item_id, item_name, category, price, status, seller_id) VALUES ('${id}', '${name}', '${cat}', ${price}, 0, '${seller}');`;
    document.getElementById('insertSql').textContent = sql;
    DB.Item.push({ item_id: id, item_name: name, category: cat, price: price, status: 0, seller_id: seller });
    document.getElementById('insertResult').innerHTML = '<span class="text-green-600 font-medium"><i class="fas fa-check mr-1"></i>Insert successful!</span>';
    refreshOpsPage();
    refreshHome();
}

function updateItemPrice() {
    const id = document.getElementById('updateItemSelect').value;
    const price = parseFloat(document.getElementById('updateItemPrice').value);
    if (isNaN(price)) {
        document.getElementById('updateResult').innerHTML = '<span class="text-red-600">Please enter a valid price</span>';
        return;
    }
    const sql = `UPDATE Item SET price = ${price} WHERE item_id = '${id}';`;
    document.getElementById('updateSql').textContent = sql;
    const item = DB.Item.find(i => i.item_id === id);
    if (item) item.price = price;
    document.getElementById('updateResult').innerHTML = '<span class="text-green-600 font-medium"><i class="fas fa-check mr-1"></i>Update successful!</span>';
    refreshOpsPage();
}

function deleteItem() {
    const id = document.getElementById('deleteItemSelect').value;
    if (!id) {
        document.getElementById('deleteResult').innerHTML = '<span class="text-red-600">No unsold item selected</span>';
        return;
    }
    const sql = `DELETE FROM Item WHERE item_id = '${id}';`;
    document.getElementById('deleteSql').textContent = sql;
    DB.Item = DB.Item.filter(i => i.item_id !== id);
    document.getElementById('deleteResult').innerHTML = '<span class="text-green-600 font-medium"><i class="fas fa-check mr-1"></i>Delete successful!</span>';
    refreshOpsPage();
    refreshHome();
}

// ==================== Buy Item (Business Logic) ====================

function refreshBuyPage() {
    renderTable('buyItemsTable', null, DB.Item.filter(i => i.status === 0).map(i => ({
        item_id: i.item_id, item_name: i.item_name, category: i.category, price: i.price, seller_id: i.seller_id
    })));

    let itemOpts = DB.Item.filter(i => i.status === 0).map(r => `<option value="${r.item_id}">${r.item_id} - ${r.item_name}</option>`).join('');
    if (!itemOpts) itemOpts = '<option disabled>No items available</option>';
    document.getElementById('buyItemSelect').innerHTML = itemOpts;

    let userOpts = DB.User.map(r => `<option value="${r.user_id}">${r.user_id} - ${r.user_name}</option>`).join('');
    document.getElementById('buyUserSelect').innerHTML = userOpts;

    document.getElementById('buyDate').value = new Date().toISOString().split('T')[0];
}

function buyItem() {
    const itemId = document.getElementById('buyItemSelect').value;
    const buyerId = document.getElementById('buyUserSelect').value;
    const date = document.getElementById('buyDate').value;

    if (!itemId || !buyerId || !date) {
        document.getElementById('buyResult').innerHTML = '<span class="text-red-600">Please fill in all fields</span>';
        return;
    }

    const item = DB.Item.find(i => i.item_id === itemId);
    if (!item || item.status === 1) {
        document.getElementById('buyResult').innerHTML = '<span class="text-red-600">This item is already sold</span>';
        return;
    }

    // Check if already in orders (UNIQUE constraint simulation)
    if (DB.Orders.find(o => o.item_id === itemId)) {
        document.getElementById('buyResult').innerHTML = '<span class="text-red-600">UNIQUE constraint violation: item already ordered</span>';
        return;
    }

    // Generate order ID
    const maxNum = Math.max(...DB.Orders.map(o => parseInt(o.order_id.substring(1))));
    const orderId = 'o' + String(maxNum + 1).padStart(3, '0');

    const sql1 = `INSERT INTO Orders (order_id, item_id, buyer_id, order_date) VALUES ('${orderId}', '${itemId}', '${buyerId}', '${date}');`;
    const sql2 = `UPDATE Item SET status = 1 WHERE item_id = '${itemId}';`;
    document.getElementById('buySql').textContent = sql1 + '\n' + sql2;

    // Step 1: Insert order
    DB.Orders.push({ order_id: orderId, item_id: itemId, buyer_id: buyerId, order_date: date });
    // Step 2: Update item status
    item.status = 1;

    document.getElementById('buyResult').innerHTML = `<span class="text-green-600 font-medium"><i class="fas fa-check mr-1"></i>Purchase successful! Order: ${orderId}</span>`;
    refreshBuyPage();
    refreshHome();
}

// ==================== Global Refresh ====================
function refreshAll() {
    refreshHome();
    loadItems('all');
    loadUsers();
    loadOrders();
    loadBasicQueries();
    loadJoinQueries();
    loadAggQueries();
    loadViews();
    refreshOpsPage();
    refreshBuyPage();
}

// ==================== Launch ====================
window.addEventListener('DOMContentLoaded', renderAllPages);
