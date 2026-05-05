'use strict';
const Session = window.Session || (window.Session = {
    key: 'ls_user',
    save(u)      { localStorage.setItem(this.key, JSON.stringify(u)); },
    get()        { try { return JSON.parse(localStorage.getItem(this.key)); } catch { return null; } },
    clear()      { localStorage.removeItem(this.key); },
    isLoggedIn() { return !!this.get(); }
});


const UserDB = window.UserDB || (window.UserDB = {
    key: 'ls_users',

    getAll() {
        try { return JSON.parse(localStorage.getItem(this.key)) || []; }
        catch { return []; }
    },

    findByEmail(email) {
        return this.getAll()
            .find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase());
    },

    add(user) {
        const all = this.getAll();
        all.push(user);
        localStorage.setItem(this.key, JSON.stringify(all));
    }
});

(function guardAuthPages() {
    const restricted = ['login.html', 'register.html'];
    const page = location.pathname.split('/').pop() || '';
    if (restricted.includes(page) && Session.isLoggedIn()) {
        location.replace('beranda.html');
    }
})();

function val(id)    { return (document.getElementById(id)?.value ?? '').trim(); }
function el(id)     { return document.getElementById(id); }
function isEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s); }
function isPhone(s) { return /^(\+62|62|0)8[0-9]{7,11}$/.test(s.replace(/\s|-/g, '')); }
function delay(ms)  { return new Promise(r => setTimeout(r, ms)); }

function showErr(fieldId, errId, msg) {
    const errEl   = el(errId);
    const inputEl = el(fieldId);
    if (errEl)   { errEl.textContent = msg; errEl.classList.add('visible'); }
    if (inputEl) { inputEl.classList.add('invalid'); }
}

function clearErr(fieldId, errId) {
    const errEl   = el(errId);
    const inputEl = el(fieldId);
    if (errEl)   { errEl.textContent = ''; errEl.classList.remove('visible'); }
    if (inputEl) { inputEl.classList.remove('invalid'); }
}

function setLoading(btnId, loading) {
    const btn    = el(btnId);
    const txtEl  = btn?.querySelector('.btn-text');
    const spinEl = btn?.querySelector('.btn-spinner');
    if (!btn) return;
    btn.disabled    = loading;
    if (txtEl)  txtEl.hidden  = loading;
    if (spinEl) spinEl.hidden = !loading;
}

function successBtn(btnId, label) {
    const btn = el(btnId);
    if (!btn) return;
    btn.disabled = false;
    const txtEl = btn.querySelector('.btn-text');
    if (txtEl) { txtEl.hidden = false; txtEl.textContent = label; }
    btn.style.background = '#16a34a';
    btn.style.boxShadow  = '0 4px 20px rgba(22,163,74,.4)';
}

document.querySelectorAll('.toggle-pw').forEach(btn => {
    btn.addEventListener('click', () => {
        const input = btn.closest('.input-wrap')?.querySelector('input');
        if (!input) return;
        const show  = input.type === 'password';
        input.type  = show ? 'text' : 'password';
        btn.textContent = show ? '🙈' : '👁';
        btn.setAttribute('aria-label', show ? 'Sembunyikan password' : 'Tampilkan password');
    });
});

const loginForm = el('loginForm');
if (loginForm) {

    el('email')?.addEventListener('input',    () => clearErr('email',    'emailError'));
    el('password')?.addEventListener('input', () => clearErr('password', 'passwordError'));

    loginForm.addEventListener('submit', async evt => {
        evt.preventDefault();

        const email    = val('email');
        const password = el('password')?.value ?? '';
        let ok = true;

        if (!email)             { showErr('email',    'emailError',    'Email wajib diisi.');            ok = false; }
        else if (!isEmail(email)){ showErr('email',   'emailError',    'Format email tidak valid.');     ok = false; }
        else                    { clearErr('email',   'emailError'); }

        if (!password)          { showErr('password', 'passwordError', 'Password wajib diisi.');         ok = false; }
        else if (password.length < 6)
                                { showErr('password', 'passwordError', 'Password minimal 6 karakter.');  ok = false; }
        else                    { clearErr('password','passwordError'); }

        if (!ok) return;

        setLoading('loginBtn', true);
        await delay(1100);

        const user = UserDB.findByEmail(email);

        if (!user) {
            setLoading('loginBtn', false);
            showErr('email', 'emailError', 'Akun dengan email ini tidak ditemukan.');
            el('email')?.focus();
            return;
        }

        if (user.password !== password) {
            setLoading('loginBtn', false);
            el('password').value = '';
            showErr('password', 'passwordError', 'Password salah. Silakan coba lagi.');
            el('password')?.focus();
            return;
        }

        Session.save({
            id:        user.id,
            firstName: user.firstName,
            lastName:  user.lastName,
            name:      user.name,
            email:     user.email,
            phone:     user.phone  || '',
            remember:  el('remember')?.checked || false,
            loginAt:   new Date().toISOString()
        });

        successBtn('loginBtn', '✓ Masuk!');
        await delay(700);

        const redirect = new URLSearchParams(location.search).get('redirect') || 'beranda.html';
        location.href  = redirect;
    });
}

const registerForm = el('registerForm');
if (registerForm) {

    const pwInput      = el('regPassword');
    const strengthWrap = el('pwStrength');
    const strengthFill = el('pwStrengthFill');
    const strengthLbl  = el('pwStrengthLabel');

    const strengthLevels = [
        { label: 'Sangat lemah', color: '#ef4444' },
        { label: 'Lemah',        color: '#f97316' },
        { label: 'Cukup',        color: '#eab308' },
        { label: 'Kuat',         color: '#22c55e' },
        { label: 'Sangat kuat',  color: '#15803d' }
    ];

    if (pwInput && strengthWrap) {
        pwInput.addEventListener('input', () => {
            const pw = pwInput.value;
            if (!pw) { strengthWrap.hidden = true; return; }
            strengthWrap.hidden = false;

            let score = 0;
            if (pw.length >= 8)           score++;
            if (pw.length >= 12)          score++;
            if (/[A-Z]/.test(pw))         score++;
            if (/[0-9]/.test(pw))         score++;
            if (/[^A-Za-z0-9]/.test(pw))  score++;
            score = Math.min(score, 4);

            const lv = strengthLevels[score];
            if (strengthFill) {
                strengthFill.style.width      = `${(score + 1) * 20}%`;
                strengthFill.style.background = lv.color;
                strengthFill.style.transition = 'width .3s ease, background .3s ease';
            }
            if (strengthLbl) {
                strengthLbl.textContent = lv.label;
                strengthLbl.style.color = lv.color;
            }
        });
    }

    el('firstName')?.addEventListener('input',       () => clearErr('firstName',       'firstNameError'));
    el('regEmail')?.addEventListener('input',        () => clearErr('regEmail',        'regEmailError'));
    el('phone')?.addEventListener('input',           () => clearErr('phone',           'phoneError'));
    el('regPassword')?.addEventListener('input',     () => clearErr('regPassword',     'regPasswordError'));
    el('confirmPassword')?.addEventListener('input', () => clearErr('confirmPassword', 'confirmPasswordError'));
    el('terms')?.addEventListener('change',          () => clearErr('terms',           'termsError'));

    registerForm.addEventListener('submit', async evt => {
        evt.preventDefault();

        const firstName = val('firstName');
        const lastName  = val('lastName');
        const email     = val('regEmail');
        const phone     = val('phone');
        const password  = el('regPassword')?.value     ?? '';
        const confirm   = el('confirmPassword')?.value  ?? '';
        const terms     = el('terms')?.checked ?? false;
        let ok = true;

        if (!firstName) {
            showErr('firstName', 'firstNameError', 'Nama depan wajib diisi.');
            ok = false;
        } else { clearErr('firstName', 'firstNameError'); }

        if (!email) {
            showErr('regEmail', 'regEmailError', 'Email wajib diisi.');
            ok = false;
        } else if (!isEmail(email)) {
            showErr('regEmail', 'regEmailError', 'Format email tidak valid.');
            ok = false;
        } else { clearErr('regEmail', 'regEmailError'); }

        if (!phone) {
            showErr('phone', 'phoneError', 'Nomor telepon wajib diisi.');
            ok = false;
        } else if (!isPhone(phone)) {
            showErr('phone', 'phoneError', 'Format nomor tidak valid (contoh: 081234567890).');
            ok = false;
        } else { clearErr('phone', 'phoneError'); }

        if (!password) {
            showErr('regPassword', 'regPasswordError', 'Password wajib diisi.');
            ok = false;
        } else if (password.length < 8) {
            showErr('regPassword', 'regPasswordError', 'Password minimal 8 karakter.');
            ok = false;
        } else { clearErr('regPassword', 'regPasswordError'); }

        if (!confirm) {
            showErr('confirmPassword', 'confirmPasswordError', 'Konfirmasi password wajib diisi.');
            ok = false;
        } else if (confirm !== password) {
            showErr('confirmPassword', 'confirmPasswordError', 'Password tidak cocok.');
            ok = false;
        } else { clearErr('confirmPassword', 'confirmPasswordError'); }

        if (!terms) {
            showErr('terms', 'termsError', 'Anda harus menyetujui Syarat & Ketentuan.');
            ok = false;
        } else { clearErr('terms', 'termsError'); }

        if (!ok) {
            const firstInvalid = registerForm.querySelector('.invalid');
            firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        setLoading('registerBtn', true);
        await delay(1000);

        if (UserDB.findByEmail(email)) {
            setLoading('registerBtn', false);
            showErr('regEmail', 'regEmailError', 'Email ini sudah terdaftar. Silakan masuk.');
            el('regEmail')?.focus();
            return;
        }

        const fullName = [firstName, lastName].filter(Boolean).join(' ');
        const newUser  = {
            id:        'u_' + Date.now(),
            firstName,
            lastName,
            name:      fullName,
            email,
            phone,
            password,                     
            createdAt: new Date().toISOString()
        };
        UserDB.add(newUser);

        Session.save({
            id:        newUser.id,
            firstName: newUser.firstName,
            lastName:  newUser.lastName,
            name:      newUser.name,
            email:     newUser.email,
            phone:     newUser.phone,
            loginAt:   new Date().toISOString()
        });

        successBtn('registerBtn', '✓ Akun Dibuat!');
        await delay(700);
        location.href = 'beranda.html';
    });
}