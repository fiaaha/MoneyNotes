document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. SISTEM PROTEKSI HALAMAN (LOGIN AUTH)
    // ==========================================
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const path = window.location.pathname;
    
    if (!isLoggedIn && (path.includes('dashboard.html') || path.includes('features.html'))) {
        window.location.href = 'login.html';
        return; 
    }

    // ==========================================
    // 2. STATE MANAGEMENT (DATA KEUANGAN)
    // ==========================================
    let financialData = JSON.parse(localStorage.getItem('moneyMateData')) || {
        balance: 0, income: 0, expenses: 0, savings: 0, transactions: [], debts: []
    };
    let selectedDebtType = 'i_owe';

    const syncStorage = () => localStorage.setItem('moneyMateData', JSON.stringify(financialData));

    // ==========================================
    // 3. LOGIKA HALAMAN LOGIN & LOGOUT
    // ==========================================
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;
            
            if (pass === '123456') { 
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', user);
                window.location.href = 'dashboard.html';
            } else {
                alert("Password Salah! Gunakan 123456");
            }
        });
    }

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html'; 
        });
    }

    // ==========================================
    // 4. LOGIKA HALAMAN DASHBOARD (dashboard.html)
    // ==========================================
    const dashboard = document.getElementById('dashboard-section');
    if (dashboard) {
        const welcomeUser = document.getElementById('welcome-user');
        if (welcomeUser) welcomeUser.innerText = `Halo, ${localStorage.getItem('currentUser')}!`;
        
        // --- FITUR BARU: TOGGLE HIDE/SHOW HUTANG ---
        const toggleDebtBtn = document.getElementById('toggle-debt-btn');
        const debtListUl = document.getElementById('active-debts-list');
        const toggleDebtIcon = document.getElementById('toggle-debt-icon');
        const toggleDebtText = document.getElementById('toggle-debt-text');

        if (toggleDebtBtn && debtListUl) {
            toggleDebtBtn.addEventListener('click', () => {
                // Menambah atau menghapus class 'hidden'
                debtListUl.classList.toggle('hidden');
                
                // Ubah teks dan ikon sesuai status
                if (debtListUl.classList.contains('hidden')) {
                    toggleDebtIcon.innerText = '▼';
                    toggleDebtText.innerText = 'Tampilkan';
                } else {
                    toggleDebtIcon.innerText = '▲';
                    toggleDebtText.innerText = 'Tutup';
                }
            });
        }

        // --- A. FUNGSI PELUNASAN HUTANG ---
        const resolveDebt = (id) => {
            const debtIndex = financialData.debts.findIndex(d => d.id === id);
            if (debtIndex === -1) return; 

            const debt = financialData.debts[debtIndex];
            
            if (debt.type === 'i_owe') {
                if (financialData.balance < debt.amount) return alert("Saldo utama kamu tidak cukup untuk melunasi hutang ini!");
                
                financialData.balance -= debt.amount;
                financialData.expenses += debt.amount;
                financialData.transactions.push({ type: 'expense', amount: debt.amount, note: `Pelunasan Hutang ke ${debt.person}`, timestamp: new Date().toISOString() });
                alert(`Hutang sebesar Rp ${debt.amount.toLocaleString()} kepada ${debt.person} berhasil dibayar!`);
            } else {
                financialData.balance += debt.amount;
                financialData.income += debt.amount;
                financialData.transactions.push({ type: 'income', amount: debt.amount, note: `Terima Bayaran Piutang dari ${debt.person}`, timestamp: new Date().toISOString() });
                alert(`Piutang sebesar Rp ${debt.amount.toLocaleString()} dari ${debt.person} berhasil diterima!`);
            }

            financialData.debts.splice(debtIndex, 1);
            syncStorage();
            updateStats(); 
        };

        // --- B. EVENT DELEGATION UNTUK TOMBOL PELUNASAN ---
        const activeDebtsList = document.getElementById('active-debts-list');
        if (activeDebtsList) {
            activeDebtsList.addEventListener('click', (e) => {
                const btn = e.target.closest('.resolve-debt-btn');
                if (!btn) return; 
                
                const idToResolve = parseInt(btn.getAttribute('data-id'));
                resolveDebt(idToResolve);
            });
        }

        // --- C. FUNGSI RENDER HUTANG AKTIF ---
        const renderActiveDebts = () => {
            if (!activeDebtsList) return;
            activeDebtsList.innerHTML = '';

            if (financialData.debts.length === 0) {
                activeDebtsList.innerHTML = '<li class="text-sm text-slate-500 italic">Tidak ada catatan hutang/piutang aktif.</li>';
                return;
            }

            financialData.debts.forEach(debt => {
                const li = document.createElement('li');
                const isIOwe = debt.type === 'i_owe';
                li.className = "bg-slate-700/50 p-4 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4 border-l-4 " + (isIOwe ? 'border-red-400' : 'border-emerald-400');
                
                li.innerHTML = `
                    <div class="flex-1 w-full text-left">
                        <div class="font-bold text-sm text-slate-300">${isIOwe ? 'Hutang ke' : 'Piutang dari'}: ${debt.person}</div>
                        <div class="text-xl font-bold ${isIOwe ? 'text-red-400' : 'text-emerald-400'}">Rp ${debt.amount.toLocaleString()}</div>
                        ${isIOwe && debt.reminderDate ? `<div class="text-xs text-orange-300 mt-1">⏳ Jatuh Tempo: ${new Date(debt.reminderDate).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})}</div>` : ''}
                    </div>
                    <button class="resolve-debt-btn w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-sm font-bold px-5 py-2.5 rounded-lg text-white transition cursor-pointer shadow-lg shadow-blue-900/30" data-id="${debt.id}">
                        ${isIOwe ? 'Bayar Hutang' : 'Terima Bayaran'}
                    </button>
                `;
                activeDebtsList.appendChild(li);
            });
        };

        // --- D. FUNGSI RENDER HISTORY & UPDATE ANGKA ---
        const renderList = () => {
            const list = document.getElementById('transaction-list');
            if (!list) return;
            const fCat = document.getElementById('filter-category') ? document.getElementById('filter-category').value : 'all';
            const fMon = document.getElementById('filter-month') ? document.getElementById('filter-month').value : 'all';
            list.innerHTML = '';

            let filtered = financialData.transactions.filter(t => {
                const d = new Date(t.timestamp);
                return (fCat === 'all' || t.type === fCat) && (fMon === 'all' || d.getMonth().toString() === fMon);
            }).reverse();

            if (!filtered.length) {
                list.innerHTML = '<li class="text-center text-slate-500 text-sm py-4">Belum ada riwayat transaksi yang cocok.</li>';
                return;
            }

            filtered.forEach(t => {
                const li = document.createElement('li');
                li.className = "bg-slate-700/40 p-4 rounded-xl flex justify-between items-center border-l-4 " + 
                              (t.type === 'expense' ? 'border-red-500' : (t.type === 'income' || t.type === 'debt') ? 'border-emerald-500' : 'border-blue-500');
                li.innerHTML = `
                    <div>
                        <div class="font-bold text-sm text-slate-200">${t.note}</div>
                        <div class="text-[10px] text-slate-500 mt-1">${new Date(t.timestamp).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})}</div>
                    </div>
                    <div class="font-bold ${t.type === 'expense' ? 'text-red-400' : 'text-emerald-400'}">
                        ${t.type === 'expense' ? '-' : '+'} Rp ${t.amount.toLocaleString()}
                    </div>
                `;
                list.appendChild(li);
            });
        };

        const updateStats = () => {
            const elBal = document.getElementById('total-balance');
            const elInc = document.getElementById('total-income');
            const elExp = document.getElementById('total-expenses');
            const elSav = document.getElementById('total-savings');
            
            if (elBal) elBal.innerText = `Rp ${financialData.balance.toLocaleString()}`;
            if (elInc) elInc.innerText = `Rp ${financialData.income.toLocaleString()}`;
            if (elExp) elExp.innerText = `Rp ${financialData.expenses.toLocaleString()}`;
            if (elSav) elSav.innerText = `Rp ${financialData.savings.toLocaleString()}`;
            
            renderList();
            renderActiveDebts(); 
        };

        const filterCat = document.getElementById('filter-category');
        const filterMon = document.getElementById('filter-month');
        if (filterCat) filterCat.addEventListener('change', renderList);
        if (filterMon) filterMon.addEventListener('change', renderList);

        // --- Fetch API (Quote Motivasi) ---
        const quoteText = document.getElementById('quote-text');
        if (quoteText) {
            (async () => {
                try {
                    const res = await fetch('https://dummyjson.com/quotes/random');
                    const data = await res.json();
                    document.getElementById('quote-text').innerText = `"${data.quote}"`;
                    document.getElementById('quote-author').innerText = `- ${data.author}`;
                } catch (e) { 
                    document.getElementById('quote-text').innerText = `"Uang hanyalah alat, kitalah pengemudinya."`; 
                }
            })();
        }

        // --- Pengecekan Reminder Jatuh Tempo ---
        const checkDebtReminder = () => {
            const today = new Date().toISOString().split('T')[0];
            const dueDebts = financialData.debts.filter(d => d.type === 'i_owe' && d.reminderDate === today);
            if (dueDebts.length > 0) {
                let msg = "⚠️ PENGINGAT JATUH TEMPO HARI INI ⚠️\n\n";
                dueDebts.forEach(d => { msg += `- Hutangmu kepada ${d.person} (Rp ${d.amount.toLocaleString()})\n`; });
                setTimeout(() => alert(msg), 1500);
            }
        };

        updateStats(); 
        checkDebtReminder();
    }

    // ==========================================
    // 5. LOGIKA HALAMAN FITUR (features.html)
    // ==========================================
    const featuresPage = document.getElementById('form-income'); 
    if (featuresPage) {
        
        const tabs = document.querySelectorAll('.tab-btn');
        const contents = document.querySelectorAll('.tab-content');

        tabs.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-tab');
                contents.forEach(c => { c.classList.add('hidden'); c.classList.remove('block'); });
                const targetEl = document.getElementById(target);
                if (targetEl) { targetEl.classList.remove('hidden'); targetEl.classList.add('block'); }
                tabs.forEach(b => { b.classList.remove('active-tab', 'bg-blue-600', 'text-white'); b.classList.add('bg-slate-800', 'text-slate-400'); });
                btn.classList.remove('bg-slate-800', 'text-slate-400');
                btn.classList.add('bg-blue-600', 'text-white', 'active-tab');
            });
        });

        const incForm = document.getElementById('income-form');
        if (incForm) incForm.addEventListener('submit', (e) => { 
            e.preventDefault(); 
            const val = parseInt(document.getElementById('inc-amount').value); 
            financialData.balance += val; 
            financialData.income += val; 
            financialData.transactions.push({ type: 'income', amount: val, note: document.getElementById('inc-note').value, timestamp: new Date().toISOString() }); 
            syncStorage(); 
            window.location.href = 'dashboard.html'; 
        });

        const expForm = document.getElementById('expense-form');
        if (expForm) expForm.addEventListener('submit', (e) => { 
            e.preventDefault(); 
            const amount = parseInt(document.getElementById('exp-amount').value); 
            if(amount > financialData.balance) return alert("Saldo tidak cukup!"); 
            financialData.balance -= amount; 
            financialData.expenses += amount; 
            financialData.transactions.push({ type: 'expense', amount, note: document.getElementById('exp-note').value, timestamp: new Date().toISOString() }); 
            syncStorage(); 
            window.location.href = 'dashboard.html'; 
        });

        const savForm = document.getElementById('savings-form');
        if (savForm) savForm.addEventListener('submit', (e) => { 
            e.preventDefault(); 
            const amount = parseInt(document.getElementById('sav-amount').value); 
            const goal = document.getElementById('sav-goal').value; 
            if(amount > financialData.balance) return alert("Saldo tidak cukup untuk ditabung!"); 
            financialData.balance -= amount; 
            financialData.savings += amount; 
            financialData.transactions.push({ type: 'saving', amount, note: `Tabungan: ${goal}`, timestamp: new Date().toISOString() }); 
            syncStorage(); 
            window.location.href = 'dashboard.html'; 
        });

        const debtForm = document.getElementById('debt-form');
        if (debtForm) {
            const btnOwe = document.getElementById('type-owe');
            const btnOwed = document.getElementById('type-owed');
            const reminderContainer = document.getElementById('reminder-container');
            const reminderInput = document.getElementById('debt-reminder');
            
            btnOwe.addEventListener('click', () => {
                selectedDebtType = 'i_owe';
                btnOwe.className = "flex-1 bg-blue-600 py-2 rounded font-bold text-sm text-white";
                btnOwed.className = "flex-1 bg-slate-700 py-2 rounded font-bold text-sm text-white";
                reminderContainer.classList.remove('hidden'); 
                reminderInput.required = true;
            });
            
            btnOwed.addEventListener('click', () => {
                selectedDebtType = 'owed_to_me';
                btnOwed.className = "flex-1 bg-blue-600 py-2 rounded font-bold text-sm text-white";
                btnOwe.className = "flex-1 bg-slate-700 py-2 rounded font-bold text-sm text-white";
                reminderContainer.classList.add('hidden'); 
                reminderInput.required = false;
                reminderInput.value = '';
            });

            debtForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const amount = parseInt(document.getElementById('debt-amount').value);
                const person = document.getElementById('debt-person').value;
                const reminderDate = reminderInput.value;
                
                financialData.debts.push({ 
                    id: Date.now(), 
                    person, 
                    amount, 
                    type: selectedDebtType, 
                    reminderDate: selectedDebtType === 'i_owe' ? reminderDate : null 
                });
                
                syncStorage();
                alert("Catatan berhasil disimpan! Saldo akan terpotong/bertambah ketika statusnya dilunasi di Dashboard.");
                window.location.href = 'dashboard.html';
            });
        }
    }
});