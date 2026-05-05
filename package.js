'use strict';

(function initBillingToggle() {
    const toggle    = document.getElementById('billingToggle');
    const labelKg   = document.getElementById('labelKg');
    const labelBul  = document.getElementById('labelBulanan');
    if (!toggle) return;

    let isBulanan = false;
    const priceEls = document.querySelectorAll('.price-kg');

    function switchPricing(bulanan) {
        priceEls.forEach(el => {
            const amountEl = el.querySelector('.amount');
            const unitEl   = el.querySelector('.unit');
            if (!amountEl) return;

            const newVal  = bulanan ? el.dataset.monthly : el.dataset.kg;
            const newUnit = bulanan ? '/bln' : (el.dataset.unit || el.querySelector('.unit')?.textContent || '/kg');

            amountEl.classList.add('price-flip-out');
            unitEl?.classList.add('price-flip-out');

            setTimeout(() => {
                amountEl.textContent = newVal;
                if (unitEl) unitEl.textContent = bulanan ? '/bln' : el.dataset.unitOrig;
                amountEl.classList.remove('price-flip-out');
                amountEl.classList.add('price-flip-in');
                unitEl?.classList.remove('price-flip-out');
                unitEl?.classList.add('price-flip-in');
            }, 180);

            setTimeout(() => {
                amountEl.classList.remove('price-flip-in');
                unitEl?.classList.remove('price-flip-in');
            }, 380);
        });

        document.querySelectorAll('.savings-badge').forEach(b => {
            b.classList.toggle('visible', bulanan);
        });

        labelKg.classList.toggle('toggle-active',  !bulanan);
        labelBul.classList.toggle('toggle-active',  bulanan);
    }

    priceEls.forEach(el => {
        const unitEl = el.querySelector('.unit');
        el.dataset.unitOrig = unitEl ? unitEl.textContent : '/kg';
    });

    function injectSavingsBadges() {
        document.querySelectorAll('.pricing-card').forEach(card => {
            const priceEl   = card.querySelector('.price-kg');
            const kg        = parseInt((priceEl?.dataset.kg    || '0').replace(/\D/g, ''));
            const monthly   = parseInt((priceEl?.dataset.monthly || '0').replace(/\D/g, ''));
            if (!kg || !monthly) return;

            const estimasiKg   = kg * 15;
            const hemat        = estimasiKg - monthly;
            const persen       = Math.round((hemat / estimasiKg) * 100);
            if (persen <= 0) return;

            const badge = document.createElement('div');
            badge.className = 'savings-badge';
            badge.textContent = `Hemat ${persen}%`;
            card.querySelector('.card-price')?.appendChild(badge);
        });
    }
    injectSavingsBadges();

    labelKg.classList.add('toggle-active');

    toggle.addEventListener('click', () => {
        isBulanan = !isBulanan;
        toggle.setAttribute('aria-pressed', isBulanan);
        toggle.classList.toggle('is-on', isBulanan);
        switchPricing(isBulanan);
    });

    labelKg.addEventListener('click',  () => { if (isBulanan)  { isBulanan = false; toggle.classList.remove('is-on'); toggle.setAttribute('aria-pressed','false'); switchPricing(false); } });
    labelBul.addEventListener('click', () => { if (!isBulanan) { isBulanan = true;  toggle.classList.add('is-on');    toggle.setAttribute('aria-pressed','true');  switchPricing(true);  } });
})();



(function initFaq() {
    document.querySelectorAll('.faq-q').forEach(btn => {
        btn.addEventListener('click', () => {
            const item   = btn.closest('.faq-item');
            const answer = item.querySelector('.faq-a');
            const isOpen = item.classList.contains('open');

            document.querySelectorAll('.faq-item.open').forEach(openItem => {
                openItem.classList.remove('open');
                const a = openItem.querySelector('.faq-a');
                if (a) { a.style.maxHeight = '0'; a.style.opacity = '0'; }
            });

            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.opacity   = '1';
            }
        });
    });
})();

(function patchPlanButtons() {
    if (typeof Session === 'undefined' || !Session.isLoggedIn()) return;

    document.querySelectorAll('.card-btn').forEach(btn => {
        if (btn.getAttribute('href') === 'register.html') {
            btn.href = '#';
            btn.addEventListener('click', e => {
                e.preventDefault();
                const planName = btn.closest('.pricing-card')?.querySelector('.card-name')?.textContent || 'Paket';
                if (typeof showToast === 'function') {
                    showToast(`Paket ${planName} dipilih! Fitur pemesanan segera hadir 🚀`, 'info');
                }
            });
        }
    });
})();